import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/empresa.dto';
import { JwtAuthGuard } from 'src/common/token/jwt-auth.guard';

@Controller('empresas')
export class EmpresaController {
  constructor(private empresaService: EmpresaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() body: CreateEmpresaDto) {
    return this.empresaService.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.empresaService.findAll();
  }
}
