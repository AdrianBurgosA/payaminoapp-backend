import { Module } from '@nestjs/common';
import { ServicioitemService } from './servicioitem.service';
import { ServicioitemController } from './servicioitem.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ServicioitemService],
  controllers: [ServicioitemController],
})
export class ServicioitemModule {}
