import { Inject, Injectable, Logger } from '@nestjs/common';
import { vehiculo } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ApiResponse } from 'src/models/response.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VehiculoService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(data: vehiculo): Promise<ApiResponse<vehiculo>> {
    try {
      const vehiculoCreado = await this.prisma.vehiculo.create({ data });
      return {
        success: true,
        message: 'Empresa creada exitosamente.',
        data : vehiculoCreado
      };
    } catch (error) {
      this.logger.error(
        `CREAR VEHICULO ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        { context: 'Vehiculo' },
      );

      return {
        success: false,
        message: 'Ocurrio un error al crear el vehículo.',
      };
    }
  }

   async findAll(): Promise<ApiResponse<vehiculo[]>> {
      try {
        const vehiculos = await this.prisma.vehiculo.findMany();
        return {
          success: true,
          data: vehiculos,
        };
      } catch (error) {
        this.logger.error(
          `CONSULTAR VEHICULOS ==>  RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
          { context: 'Vehiculo' },
        );
        return {
          success: false,
          message: 'Ocurrió un error al consultar los vehiculos.',
        };
      }
    }
}
