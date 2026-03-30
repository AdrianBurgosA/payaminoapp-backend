import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateEmpresaDto } from 'src/empresa/dto/empresa.dto';
import { EmpresaService } from 'src/empresa/empresa.service';
import { UsuarioRolService } from './usuario_rol.service';
import { CreateUsuarioRolDto } from './dto/usuario_rol.dto';

@Controller('usuario_rol')
export class Usuario_RolController {
  constructor(private usuarioService: UsuarioRolService) {}

  @Post()
  create(@Body() body: CreateUsuarioRolDto) {
    return this.usuarioService.create(body);
  }

  @Get()
  findAll() {
    return this.usuarioService.findAll();
  }
}
