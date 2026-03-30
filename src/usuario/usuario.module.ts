import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PasswordHelper } from 'src/common/helpers/Password.helper';

@Module({
  imports: [PrismaModule],
  providers: [UsuarioService, PasswordHelper],
  controllers: [UsuarioController]
})
export class UsuarioModule {}
