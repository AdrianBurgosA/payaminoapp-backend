import { Module } from '@nestjs/common';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { LogService } from 'src/log/log.service';
import { SupabaseModule } from 'src/supabase/supabase.module';

@Module({
  imports: [PrismaModule, SupabaseModule],
  controllers: [ChecklistController],
  providers: [ChecklistService, LogService]
})
export class ChecklistModule {}
