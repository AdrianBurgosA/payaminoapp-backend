import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmpresaDto } from './dto/empresa.dto';
import { ApiResponse } from 'src/models/response.dto';
import { empresa } from '@prisma/client';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class EmpresaService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(data: CreateEmpresaDto): Promise<ApiResponse> {
    try {
      await this.prisma.empresa.create({
        data: {
          nombre: data.nombre,
          direccion: data.direccion,
          telefono: data.telefono,
          activo: true,
        },
      });
      return {
        success: true,
        message: 'Empresa creada exitosamente.',
      };
    } catch (error) {
      this.logger.error(
        `CREAR EMPRESA ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        { context: 'Empresa' },
      );

      return {
        success: false,
        message: 'Ocurrio un error al crear empresa.',
      };
    }
  }

  async findAll(): Promise<ApiResponse<empresa[]>> {
    try {
      const empresas = await this.prisma.empresa.findMany();
      return {
        success: true,
        data: empresas,
      };
    } catch (error) {
      this.logger.error(
        `CONSULTAR EMPRESAS ==>  RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        { context: 'Empresa' },
      );
      return {
        success: false,
        message: 'Ocurrió un error al consultar las empresas.',
      };
    }
  }
}
