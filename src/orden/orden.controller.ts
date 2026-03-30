import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdenService } from './orden.service';
import { JwtAuthGuard } from 'src/common/token/jwt-auth.guard';
import { CrearOrdenDto } from './dto/orden.dto';

@Controller('ordenes')
export class OrdenController {
  constructor(private service: OrdenService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CrearOrdenDto) {
    return this.service.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.service.findAll();
  }
}
