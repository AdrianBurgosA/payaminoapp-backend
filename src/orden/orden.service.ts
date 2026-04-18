import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ConsultaOrdenesHistorialHomeDto,
  CrearOrdenDto,
  OrdenDto,
} from './dto/orden.dto';
import { ApiResponse } from 'src/models/response.dto';
import { servicioorden } from '@prisma/client';

@Injectable()
export class OrdenService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
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
      this.logger.error(
        `CREAR ORDEN ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        { context: 'Orden' },
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
      this.logger.error(
        `CONSULTAR ORDEN ==>  RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        { context: 'Orden' },
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
  ): Promise<ApiResponse<ConsultaOrdenesHistorialHomeDto>> {
    try {
      const ordenes = await this.prisma.servicioorden.findMany({
        where: {
          idcliente: usuario,
          idempresa: empresa,
          idempresateam: team,
        },
        include: {
          vehiculo: true,
        },
      });

      const ordenesMap: OrdenDto[] = ordenes.map((item) => ({
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
      }));

      const ordenActiva =
        ordenesMap.find((orden) => orden.estado === 'EN PROCESO') ?? null;

      const ordenesNoActivas = ordenesMap.filter(
        (orden) => orden.estado !== 'EN PROCESO',
      );

      const servicioItems = await this.prisma.servicioitem.findMany({
        where: {
          idempresa: team,
        },
      });

      const vehiculos = await this.prisma.vehiculo.findMany({
        where: {
          idempresa: team,
          idusuario: usuario,
        },
      });

      const empresaTeam = await this.prisma.empresa.findUnique({
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
          ordenActiva,
          ordenes: ordenesNoActivas,
          items: servicioItems,
          vehiculos,
          combos: combosResponse,
        },
      };
    } catch (error: any) {
      this.logger.error(
        `CONSULTAR ORDEN ==>  RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        { context: 'Orden' },
      );
      return {
        success: false,
        message: 'Ocurrió un error al consultar las órdenes.',
      };
    }
  }

  armarCombos(combos: any[]) : any{
    let combosArmados: any[] = [];
    combos.forEach(element => {
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
}
