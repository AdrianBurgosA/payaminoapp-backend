import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { JwtAuthGuard } from 'src/common/token/jwt-auth.guard';
import { CrearConsultarChecklistDto, ModificarChecklistDto } from './dto/checklist.dto';

@Controller('checklist')
export class ChecklistController {
  constructor(private service: ChecklistService) {}

  @Post('mantener')
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CrearConsultarChecklistDto) {
    return this.service.create(body);
  }

  @Post('mantener/:id')
  @UseGuards(JwtAuthGuard)
  modify(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ModificarChecklistDto,
  ) {
    return this.service.modify(id, body);
  }

  @Post('consultar')
  @UseGuards(JwtAuthGuard)
  findOne(@Body() body: CrearConsultarChecklistDto) {
    return this.service.findCheckList(body);
  }
}
