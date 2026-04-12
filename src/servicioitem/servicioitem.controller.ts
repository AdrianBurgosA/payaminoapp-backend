import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/token/jwt-auth.guard';
import { ServicioitemService } from './servicioitem.service';

@Controller('servicios')
export class ServicioitemController {
  constructor(private servicioItem: ServicioitemService) {}

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // findAll() {
  //   return this.servicioItem.findAll();
  // }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.servicioItem.findOne(+id);
  }
}
