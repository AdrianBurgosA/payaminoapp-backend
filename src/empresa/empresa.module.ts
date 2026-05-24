import { Module } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LogService } from 'src/log/log.service';

@Module({
  imports: [PrismaModule],
  providers: [EmpresaService, LogService],
  controllers: [EmpresaController]
})
export class EmpresaModule { }
