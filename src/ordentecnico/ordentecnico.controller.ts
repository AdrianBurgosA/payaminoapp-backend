import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrdentecnicoService } from './ordentecnico.service';
import { JwtAuthGuard } from 'src/common/token/jwt-auth.guard';
import { AsignarOrdenDto } from 'src/orden/dto/orden.dto';

@Controller('ordentecnico')
export class OrdentecnicoController {
  constructor(private service: OrdentecnicoService) {}

  @Post('mantener')
  @UseGuards(JwtAuthGuard)
  create(@Body() body: AsignarOrdenDto) {
    return this.service.create(body);
  }
}
