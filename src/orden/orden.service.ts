import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AsignarOrdenDto,
  ConsultaOrdenesHistorialHomeDto,
  CrearOrdenDto,
  OrdenDto,
} from './dto/orden.dto';
import { ApiResponse } from 'src/models/response.dto';
import { servicioorden } from '@prisma/client';
import { ESTADOS_ORDEN_ENUM, ROLES_ENUM } from 'src/common/utils/EnumConstants';
import { LogService } from 'src/log/log.service';
import { CatalogoDto } from 'src/models/catalogoDto';

@Injectable()
export class OrdenService {
  constructor(
    private prisma: PrismaService,
    private log: LogService,
  ) {}

  async create(data: CrearOrdenDto): Promise<ApiResponse> {
    try {
      const orden = await this.prisma.servicioorden.create({
        data: {
          idempresa: data.idempresa,
          idcliente: data.idcliente,
          idvehiculo: data.idvehiculo,
          estado: 'CREADO',
          fechaentrada: new Date(data.fechaentrada),
          total: data.total,
          idempresateam: data.team,
        },
      });
      for (const item of data.items) {
        item.idorden = orden.idorden;
        await this.prisma.servicioordenitem.create({ data: item });
      }

      return {
        success: true,
        message: 'Orden creada exitosamente.',
      };
    } catch (error: any) {
      this.log.error(
        'user',
        `CREAR ORDEN ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        'Orden',
      );

      return {
        success: false,
        message: 'Ocurrio un error al crear la orden.',
      };
    }
  }

  async findAll(): Promise<ApiResponse<servicioorden[]>> {
    try {
      const ordenes = await this.prisma.servicioorden.findMany();
      return {
        success: true,
        data: ordenes,
      };
    } catch (error: any) {
      this.log.error(
        'user',
        `CONSULTAR ORDEN ==>  RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        'Orden',
        error.message,
      );
      return {
        success: false,
        message: 'Ocurrió un error al consultar las órdenes.',
      };
    }
  }

  async findAllOrdenesUsuario(
    usuario: string,
    empresa: number,
    team: number,
    rol: number,
  ): Promise<ApiResponse<ConsultaOrdenesHistorialHomeDto>> {
    try {
      let ordenes: any = [];
      let ordenesActivas: OrdenDto[] = [];
      let ordenesEnProceso: OrdenDto[] = [];
      let tecnicos: CatalogoDto[] = [];

      if (rol === ROLES_ENUM.CLIENTE) {
        ordenes = await this.prisma.servicioorden.findMany({
          where: {
            idcliente: usuario,
            idempresa: empresa,
            idempresateam: team,
          },
          include: {
            vehiculo: true,
          },
        });
      } else {
        ordenes = await this.prisma.servicioorden.findMany({
          where: {
            idempresa: empresa,
            idempresateam: team,
          },
          include: {
            vehiculo: true,
            ordentecnico: true,
          },
        });
      }

      const ordenesMap: OrdenDto[] = ordenes
        .map((item) => ({
          idorden: item.idorden,
          idempresa: item.idempresa,
          idcliente: item.idcliente ?? '',
          idvehiculo: item.idvehiculo ?? 0,
          estado: item.estado ?? '',
          fechaentrada: item.fechaentrada ?? new Date(),
          fechallegadacliente: item.fechallegadacliente ?? new Date(),
          total: item.total,
          fechafin: item.fechafin ?? new Date(),
          fechacreacion: item.fechacreacion ?? new Date(),
          vehiculo:
            (item.vehiculo?.marca ?? '') + ' ' + (item.vehiculo?.modelo ?? ''),
          placa: item.vehiculo?.placa ?? '',
          ordentecnico: item.ordentecnico ?? [],
        }))
        .sort((a, b) => b.idorden - a.idorden);

      const ordenesNoActivas = ordenesMap.filter((orden) =>
        this.esOrdenCompletada(orden.estado),
      );

      ordenesActivas =
        rol === ROLES_ENUM.EMPLEADO
          ? ordenesMap.filter((orden) => this.esOrdeEnBandeja(orden.estado))
          : this.encontrarOrdenActiva(ordenesMap);

      let usuariosTecnicos = await this.prisma.usuariorol.findMany({
        where: {
          idrol: ROLES_ENUM.TECNICO,
        },
        include: {
          usuario: true,
        },
      });

      tecnicos = usuariosTecnicos.map((item) => ({
        label: item.usuario.nombre,
        value: item.usuario.idusuario,
      }));

      console.log(JSON.stringify(usuariosTecnicos));

      if (rol === ROLES_ENUM.EMPLEADO) {
        ordenesEnProceso = ordenesMap.filter((orden) =>
          this.esOrdenActiva(orden.estado),
        );
      }

      const servicioItems = await this.prisma.servicioitem.findMany({
        where: {
          idempresa: team,
        },
      });

      const vehiculos =
        rol === ROLES_ENUM.EMPLEADO
          ? await this.prisma.vehiculo.findMany({
              where: {
                idempresa: team,
              },
            })
          : await this.prisma.vehiculo.findMany();

      const empresaTeam = await this.prisma.empresa.findFirst({
        where: { team: true, idempresa: team },
      });

      const combos = empresaTeam?.tienecombos
        ? await this.prisma.combo.findMany({
            where: {
              idempresa: team,
            },
          })
        : [];

      const combosResponse = this.armarCombos(combos);

      return {
        success: true,
        data: {
          ordenesActivas,
          ordenesEnProceso,
          tecnicos,
          ordenesHistorial: ordenesNoActivas,
          items: servicioItems,
          vehiculos,
          combos: combosResponse,
        },
      };
    } catch (error: any) {
      this.log.error(
        'user',
        `CONSULTAR ORDEN ==>  RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        'Orden',
        error.message,
      );
      return {
        success: false,
        message: 'Ocurrió un error al consultar las órdenes.',
      };
    }
  }

  async findOneOrden(idOrden: number): Promise<ApiResponse<OrdenDto>> {
    let orden: any = [];
    try {
      orden = await this.prisma.servicioorden.findUnique({
        where: {
          idorden: idOrden,
        },
        include: {
          vehiculo: true,
        },
      });

      let ordenNueva: OrdenDto = orden as OrdenDto;
      const vehiculo = orden.vehiculo;
      ordenNueva.vehiculo =
        (vehiculo?.marca ?? '') + ' ' + (vehiculo?.modelo ?? '');
      ordenNueva.placa = vehiculo?.placa ?? '';
      return {
        success: true,
        data: ordenNueva,
      };
    } catch (error: any) {
      this.log.error(
        'user',
        `CONSULTAR ORDEN ==>  RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        'Orden',
        error.message,
      );
      return {
        success: false,
        message: 'Ocurrió un error al consultar las órdenes.',
      };
    }
  }

  encontrarOrdenActiva(ordenes: OrdenDto[]): OrdenDto[] | [] {
    const arregloOrden: OrdenDto[] = [];
    const ordenActiva = ordenes.find(
      (orden) =>
        orden.estado === ESTADOS_ORDEN_ENUM.ASIGNADO ||
        orden.estado === ESTADOS_ORDEN_ENUM.CREADO,
    );

    if (ordenActiva) {
      arregloOrden.push(ordenActiva);
    }

    return arregloOrden;
  }

  armarCombos(combos: any[]): any {
    let combosArmados: any[] = [];
    combos.forEach((element) => {
      let comboItems = this.prisma.comboitems.findMany({
        where: {
          idcombo: element.idcombo,
        },
      });
      combosArmados.push({
        combo: element,
        items: comboItems,
      });
    });
    return combosArmados;
  }

  esOrdenActiva = (estado: string) => estado === ESTADOS_ORDEN_ENUM.ASIGNADO;

  esOrdenCompletada = (estado: string) =>
    estado === ESTADOS_ORDEN_ENUM.COMPLETADO;

  esOrdeEnBandeja = (estado: string) => estado === ESTADOS_ORDEN_ENUM.CREADO;
}
