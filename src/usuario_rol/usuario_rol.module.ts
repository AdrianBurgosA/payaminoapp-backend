import { Module } from '@nestjs/common';
import { UsuarioRolService } from './usuario_rol.service';
import { Usuario_RolController } from './usuario_rol.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UsuarioRolService],
  controllers: [Usuario_RolController]
})
export class UsuarioRolModule { }
