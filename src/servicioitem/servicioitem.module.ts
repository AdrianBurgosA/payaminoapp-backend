import { Module } from '@nestjs/common';
import { ServicioitemService } from './servicioitem.service';
import { ServicioitemController } from './servicioitem.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LogService } from 'src/log/log.service';

@Module({
  imports: [PrismaModule],
  providers: [ServicioitemService, LogService],
  controllers: [ServicioitemController],
})
export class ServicioitemModule {}
