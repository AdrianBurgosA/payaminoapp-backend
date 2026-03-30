import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsuarioDto } from './dto/usuarios.dto';
import { PasswordHelper } from 'src/common/helpers/Password.helper';
import { ApiResponse } from 'src/models/response.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { usuario } from '@prisma/client';

@Injectable()
export class UsuarioService {
  constructor(
    private prisma: PrismaService,
    private passwordHelper: PasswordHelper,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async create(data: CreateUsuarioDto): Promise<ApiResponse> {
    try {
      await this.prisma.usuario.create({
        data: {
          idusuario: data.idusuario,
          idempresa: data.idempresa,
          email: data.email,
          nombre: data.nombre,
          telefono: data.telefono,
        },
      });
      await this.prisma.usuariorol.create({
        data: {
          idusuario: data.idusuario,
          idrol: data.idempresa,
        },
      });
      await this.prisma.usuarioclave.create({
        data: {
          idusuario: data.idusuario,
          clave: this.passwordHelper.createRawPassword(),
        },
      });

      return {
        success: true,
        message: 'El usuario ha sido creado exitosamente',
      };
    } catch (error) {
      this.logger.error(
        `CREAR USUARIO ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        { context: 'Usuario' },
      );

      return {
        success: false,
        message: 'Ocurrió un problema al crear un usuario.',
      };
    }
  }

  async findAll(): Promise<ApiResponse<usuario[]>> {
    try {
      const usuarios = await this.prisma.usuario.findMany();
      return {
        success: true,
        data: usuarios,
      };
    } catch (error) {
      this.logger.error(
        `CONSULTAR USUARIOS ==> RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        { context: 'Usuario' },
      );
      return {
        success: false,
        message: 'Ocurrió un problema al consultar los usuarios.',
      };
    }
  }
}
