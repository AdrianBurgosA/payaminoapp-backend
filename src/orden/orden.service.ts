import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearOrdenDto } from './dto/orden.dto';
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
    } catch (error) {
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
    } catch (error) {
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
}
