import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { ConsultaEmpresaDto, CreateEmpresaDto } from './dto/empresa.dto';
import { JwtAuthGuard } from 'src/common/token/jwt-auth.guard';

@Controller('empresas')
export class EmpresaController {
  constructor(private empresaService: EmpresaService) {}

  @Post('mantener')
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CreateEmpresaDto) {
    return this.empresaService.create(body);
  }

  @Post('consultar')
  @UseGuards(JwtAuthGuard)
  findAll(@Body() body: ConsultaEmpresaDto) {
    return this.empresaService.findAll(body.team ? body.team : false);
  }
}
