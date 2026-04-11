import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { LoginDto, LoginresponseDto } from 'src/models/login.dto';
import { ApiResponse } from 'src/models/response.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Logger } from 'winston';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async login(data: LoginDto): Promise<ApiResponse<LoginresponseDto>> {
    try {
      const usuarioClave = await this.prisma.usuarioclave.findUnique({
        where: { idusuario: data.idusuario },
        include: {
          usuario: {
            include: { empresa: true, usuariorol: true },
          },
        },
      });

      if (!usuarioClave) {
        this.logger.error(
          `LOGIN ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: Usuario ${data.idusuario} no existe`,
          { context: 'Login' },
        );
        return {
          success: false,
          message: 'Credenciales incorrectas',
        };
      }

      if (usuarioClave.clave !== data.clave) {
        this.logger.error(
          `LOGIN ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: Claves de usuario ${data.idusuario} no coinciden`,
          { context: 'Login' },
        );
        return {
          success: false,
          message: 'Credenciales incorrectas',
        };
      }

      if (!usuarioClave.usuario.activo) {
        this.logger.error(
          `LOGIN ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: Usuario ${data.idusuario} se encuentra inactivo`,
          { context: 'Login' },
        );
        return {
          success: false,
          message: 'El usuario actualmente se encuentra inactivo',
        };
      }

      const token = this.jwtService.sign({
        sub: usuarioClave.idusuario,
        idEmpresa: usuarioClave.usuario.idempresa,
        idRol: usuarioClave.usuario.usuariorol[0].idrol,
      });

      const loginResponse: LoginresponseDto = {
        idusuario: usuarioClave.idusuario,
        nombreUsuario: usuarioClave.usuario.nombre,
        idEmpresa: usuarioClave.usuario.idempresa,
        nombreEmpresa: usuarioClave.usuario.empresa.nombre,
        idRol: usuarioClave.usuario.usuariorol[0].idrol,
        token,
      };

      return {
        success: true,
        data: loginResponse,
      };
    } catch (error:any) {
      this.logger.error(
        `LOGIN ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        { context: 'Login' },
      );

      return {
        success: false,
        message: 'Hubo un error al iniciar sesión',
      };
    }
  }
}
