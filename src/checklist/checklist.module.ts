import { Module } from '@nestjs/common';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LogService } from 'src/log/log.service';

@Module({
  imports: [PrismaModule],
  controllers: [ChecklistController],
  providers: [ChecklistService, LogService]
})
export class ChecklistModule {}
