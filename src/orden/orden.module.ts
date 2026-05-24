import { Module } from '@nestjs/common';
import { OrdenService } from './orden.service';
import { OrdenController } from './orden.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LogService } from 'src/log/log.service';

@Module({
  imports: [PrismaModule],
  providers: [OrdenService, LogService],
  controllers: [OrdenController]
})
export class OrdenModule {}
