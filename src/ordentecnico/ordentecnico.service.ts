import { Injectable } from '@nestjs/common';
import { LogService } from 'src/log/log.service';
import { ApiResponse } from 'src/models/response.dto';
import { AsignarOrdenDto } from 'src/orden/dto/orden.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdentecnicoService {
  constructor(
    private prisma: PrismaService,
    private log: LogService,
  ) {}

  async create(data: AsignarOrdenDto): Promise<ApiResponse> {
    try {
      const tecnico = await this.prisma.usuariorol.findFirst({
        where: { idusuario: data.idtecnico },
      });

      await this.prisma.ordentecnico.create({
        data: {
          idusuario: data.idtecnico,
          idorden: data.idorden,
          rol: String(tecnico?.idrol) ?? '',
        },
      });

      const orden = await this.prisma.servicioorden.update({
        where: { idorden: data.idorden },
        data: {
          estado: 'ASIGNADO',
        },
      });

      return {
        success: true,
        message: 'Orden asignada exitosamente.',
      };
    } catch (error: any) {
      this.log.error("user",  
        `ASIGNAR ORDEN ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        'Orden',
        error.message
      );

      return {
        success: false,
        message: 'Ocurrio un error al asignar la orden.',
      };
    }
  }
}
