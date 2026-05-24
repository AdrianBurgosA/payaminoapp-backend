import { Module } from '@nestjs/common';
import { OrdentecnicoController } from './ordentecnico.controller';
import { OrdentecnicoService } from './ordentecnico.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LogService } from 'src/log/log.service';

@Module({
  imports: [PrismaModule],
  controllers: [OrdentecnicoController],
  providers: [OrdentecnicoService, LogService]
})
export class OrdentecnicoModule {}
