import { Module } from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { VehiculoController } from './vehiculo.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LogService } from 'src/log/log.service';

@Module({
  imports: [PrismaModule],
  providers: [VehiculoService, LogService],
  controllers: [VehiculoController]
})
export class VehiculoModule {}
