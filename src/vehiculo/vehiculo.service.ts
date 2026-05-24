import { Inject, Injectable, Logger } from '@nestjs/common';
import { vehiculo } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LogService } from 'src/log/log.service';
import { ApiResponse } from 'src/models/response.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VehiculoService {
  constructor(
    private prisma: PrismaService,
    private log: LogService,
  ) {}

  async create(data: vehiculo): Promise<ApiResponse<vehiculo>> {
    try {
      const vehiculoCreado = await this.prisma.vehiculo.create({ data });
      return {
        success: true,
        message: 'Empresa creada exitosamente.',
        data : vehiculoCreado
      };
    } catch (error : any) {
      this.log.error("user",  
        `CREAR VEHICULO ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        'Vehiculo',
        error.message
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
      } catch (error : any) {
        this.log.error("user",  
          `CONSULTAR VEHICULOS ==>  RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
          'Vehiculo',
          error.message
        );
        return {
          success: false,
          message: 'Ocurrió un error al consultar los vehiculos.',
        };
      }
    }
}
