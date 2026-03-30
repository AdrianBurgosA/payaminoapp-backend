import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { JwtAuthGuard } from 'src/common/token/jwt-auth.guard';
import { vehiculo } from '@prisma/client';

@Controller('vehiculos')
export class VehiculoController {
  constructor(private vehiculoItem: VehiculoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: vehiculo) {
    return this.vehiculoItem.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.vehiculoItem.findAll();
  }
}
