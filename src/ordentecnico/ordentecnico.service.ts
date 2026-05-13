import { Inject, Injectable, Logger } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ApiResponse } from 'src/models/response.dto';
import { AsignarOrdenDto } from 'src/orden/dto/orden.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdentecnicoService {
  constructor(
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(data: AsignarOrdenDto): Promise<ApiResponse> {
    try {
      const orden = await this.prisma.ordentecnico.create({
        data: {
          idusuario: data.idusuario,
          idorden: data.idorden,
        },
      });

      return {
        success: true,
        message: 'Orden asignada exitosamente.',
      };
    } catch (error: any) {
      this.logger.error(
        `ASIGNAR ORDEN ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        { context: 'Orden' },
      );

      return {
        success: false,
        message: 'Ocurrio un error al asignar la orden.',
      };
    }
  }
}
