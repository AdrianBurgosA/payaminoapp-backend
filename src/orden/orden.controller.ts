import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrdenService } from './orden.service';
import { JwtAuthGuard } from 'src/common/token/jwt-auth.guard';
import { CrearOrdenDto } from './dto/orden.dto';
import { OrdenConsultaDto } from 'src/models/orden.dto';

@Controller('ordenes')
export class OrdenController {
  constructor(private service: OrdenService) {}

  @Post("mantener")
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CrearOrdenDto) {
    return this.service.create(body);
  }

  // @Get()
  // @UseGuards(JwtAuthGuard)
  // findAll() {
  //   return this.service.findAll();
  // }
  
  @Post("consultar")
  @UseGuards(JwtAuthGuard)
  findAll(@Body() body: OrdenConsultaDto) {
    return this.service.findAllOrdenesUsuario(body.usuario, body.empresa, body.team);
  }
}
