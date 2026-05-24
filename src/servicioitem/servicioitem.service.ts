import { Inject, Injectable, Logger } from '@nestjs/common';
import { servicioitem } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LogService } from 'src/log/log.service';
import { ApiResponse } from 'src/models/response.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ServicioitemService {
  constructor(
    private prisma: PrismaService,
    private log: LogService,
  ) {}

  async findAll(idempresa: number, usuario: string): Promise<ApiResponse<servicioitem[]>> {
    try {
      const servicioItems = await this.prisma.servicioitem.findMany({
        where: {
          idempresa,
        },
      });
      return {
        success: true,
        data: servicioItems,
      };
    } catch (error:any) {
      this.log.error("user",  
        `CONSULTAR SERVICIOS ==>  RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        'ServicioItem',
        error.message
      );
      return {
        success: false,
        message: 'Ocurrió un error al consultar los servicios.',
      };
    }
  }

  async findOne(iditem: number, usuario: string): Promise<ApiResponse<servicioitem>> {
    try {
      const servicioItem = await this.prisma.servicioitem.findUnique({
        where: { iditem },
      });

      if (!servicioItem) {
        return {
          success: false,
          message: `No se encontró el servicio con id ${iditem}`,
        };
      }

      return {
        success: true,
        data: servicioItem,
      };
    } catch (error:any) {
      this.log.error("user",  
        `CONSULTAR SERVICIO ${iditem} ==> RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        'ServicioItem',
        error.message
      );
      return {
        success: false,
        message: 'Ocurrió un error al consultar el servicio.',
      };
    }
  }
}
