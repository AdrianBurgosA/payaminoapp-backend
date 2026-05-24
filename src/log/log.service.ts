import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async info(
    usuario: string,
    mensaje: string,
    contexto?: string,
    detalle?: string,
  ) {
    await this.log(usuario, 'INFO', mensaje, contexto, detalle);
  }

  async error(
    usuario: string,
    mensaje: string,
    contexto?: string,
    detalle?: string,
  ) {
    await this.log(usuario, 'ERROR', mensaje, contexto, detalle);
  }

  async warn(
    usuario: string,
    mensaje: string,
    contexto?: string,
    excepcion?: string,
  ) {
    await this.log(usuario, 'WARN', mensaje, contexto, excepcion);
  }

  private async log(
    usuario: string,
    nivel: string,
    mensaje: string,
    contexto?: string,
    excepcion?: string,
  ) {
    try {
      await this.prisma.log.create({
        data: {
          usuario,
          nivel,
          mensaje,
          contexto: contexto ?? null,
          excepcion: excepcion ?? null,
        },
      });
    } catch {
      // nunca romper el flujo principal por un error de log
      console.error('Error al guardar log:', mensaje);
    }
  }
}
