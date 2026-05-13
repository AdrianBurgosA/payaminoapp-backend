import { Module } from '@nestjs/common';
import { OrdentecnicoController } from './ordentecnico.controller';
import { OrdentecnicoService } from './ordentecnico.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [OrdentecnicoController],
  providers: [OrdentecnicoService]
})
export class OrdentecnicoModule {}
