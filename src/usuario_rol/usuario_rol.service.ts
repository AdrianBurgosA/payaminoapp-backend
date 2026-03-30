import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsuarioRolDto } from './dto/usuario_rol.dto';

@Injectable()
export class UsuarioRolService {
    constructor(private prisma: PrismaService) { }

    async create(data: CreateUsuarioRolDto) {
            return this.prisma.usuariorol.create({
                data: {
                    idusuario: data.idusuario,
                    idrol: data.idrol                
                }
            });
        }
    
        async findAll() {
            return this.prisma.usuariorol.findMany();
        }
}
