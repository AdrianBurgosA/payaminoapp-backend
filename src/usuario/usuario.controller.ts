import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/usuarios.dto';
import { JwtAuthGuard } from 'src/common/token/jwt-auth.guard';

@Controller('usuarios')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CreateUsuarioDto) {
    return this.usuarioService.create(body);
  }
 
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.usuarioService.findAll();
  }
}
