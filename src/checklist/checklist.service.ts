import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ConsultarCheckListDto,
  ConsultarChecklistGrupoDto,
  ConsultarChecklistItemDto,
  CrearConsultarChecklistDto,
  ModificarChecklistDto,
} from './dto/checklist.dto';
import { ApiResponse } from 'src/models/response.dto';
import { LogService } from 'src/log/log.service';

@Injectable()
export class ChecklistService {
  constructor(
    private prisma: PrismaService,
    private log: LogService,
  ) {}

  async create(data: CrearConsultarChecklistDto): Promise<ApiResponse> {
    try {
      const checkListTemplate = await this.prisma.checklisttemplate.findFirst({
        where: {
          idempresa: data.empresa,
        },
      });

      if (checkListTemplate === null) {
        return {
          success: false,
          message: 'Ocurrio un error al crear el checklist.',
        };
      }

      const checkList = await this.prisma.checklist.create({
        data: {
          idorden: data.idorden,
          idtemplate: checkListTemplate.idtemplate,
        },
      });

      this.log.info(
        data.usuario,
        `CREAR CHECKLIST ==> REQUEST: ${JSON.stringify(data)} | RESPONSE: ${JSON.stringify(checkList)}`,
        'Checklist',
      );

      const itemsTemplate = await this.prisma.checklisttemplateitem.findMany({
        where: {
          idtemplate: checkListTemplate.idtemplate,
        },
      });

      for (const item of itemsTemplate) {
        await this.prisma.checklistitem.create({
          data: {
            idchecklist: checkList.idchecklist,
            idtemplateitem: item.idtemplateitem,
            completado: false,
          },
        });
      }

      this.log.info(
        data.usuario,
        `CREAR CHECKLISTITEMS ==> REQUEST: ${JSON.stringify(data)} | RESPONSE: ${JSON.stringify(checkList)}`,
        'CheckListItems',
      );

      return {
        success: true,
        message: 'Checklist creado exitosamente.',
      };
    } catch (error: any) {
      this.log.error(
        data.usuario,
        `CREAR CHECKLIST ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        'Checklist',
        error.message,
      );

      return {
        success: false,
        message: 'Ocurrio un error al crear el checklist.',
      };
    }
  }

  async modify(id: number, data: ModificarChecklistDto): Promise<ApiResponse> {
    try {
      await this.prisma.checklistitem.update({
        where: {
          idchecklistitem: id,
        },
        data: {
          completado: data.valor,
        },
      });

      this.log.info(
        data.usuario,
        `MODIFICAR CHECKLISTITEMS ==> REQUEST: ${id} | ${JSON.stringify(data)}}`,
        'CheckListItems',
      );

      return {
        success: true,
        message: 'Checklist modificado exitosamente.',
      };
    } catch (error: any) {
      this.log.error(
        data.usuario,
        `MODIFICAR CHECKLIST ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        'Checklist',
        error.message,
      );

      return {
        success: false,
        message: 'Ocurrio un error al modificar el checklist.',
      };
    }
  }

  async findCheckList(
    data: CrearConsultarChecklistDto,
  ): Promise<ApiResponse<ConsultarCheckListDto>> {
    try {
      let responseConsulta: ConsultarCheckListDto = new ConsultarCheckListDto();

      const found = await this.prisma.checklist.findFirst({
        where: { idorden: data.idorden },
        select: { idchecklist: true, fechainicio: true },
      });

      if (!found) {
        return {
          success: false,
          message: 'Ocurrio un error al crear el checklist.',
        };
      }

      if (found.fechainicio === null) {
        await this.prisma.checklist.update({
          where: { idchecklist: found.idchecklist },
          data: { fechainicio: new Date() },
        });
      }

      const checklist = await this.prisma.checklist.findUnique({
        where: { idchecklist: found.idchecklist },
        include: {
          checklisttemplate: {
            include: {
              checklisttemplategroup: {
                orderBy: { orden: 'asc' },
                include: {
                  checklisttemplateitem: {
                    orderBy: { orden: 'asc' },
                    include: {
                      checklistitem: {
                        where: { idchecklist: found.idchecklist },
                        take: 1,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      responseConsulta = this.mapResponse(checklist);

      this.log.info(
        data.usuario,
        'Chekclist consultados correctamente',
        'Checklist',
      );

      return {
        success: true,
        message: 'Checklist encontrado exitosamente.',
        data: responseConsulta,
      };
    } catch (error: any) {
      this.log.error(
        data.usuario,
        `CONSULTAR CHECKLIST ==> REQUEST: ${JSON.stringify(data)} | RESPONSE ERROR: ${error.meta?.target ?? error.message}`,
        'Checklist',
        error.message,
      );

      return {
        success: false,
        message: 'Ocurrio un error al consultar el checklist.',
      };
    }
  }

  private mapResponse(checklist: any): ConsultarCheckListDto {
    const dto = new ConsultarCheckListDto();
    dto.idCheckList = checklist.idchecklist;
    dto.idOrden = checklist.idorden;
    dto.nombre = checklist.checklisttemplate?.nombre ?? '';
    dto.descripcion = checklist.checklisttemplate?.descripcion ?? '';
    dto.grupos = (
      checklist.checklisttemplate?.checklisttemplategroup ?? []
    ).map((group: any) => {
      const grupoDto = new ConsultarChecklistGrupoDto();
      grupoDto.idGrupo = group.idtemplategroup;
      grupoDto.nombre = group.nombre;
      grupoDto.orden = group.orden ?? 0;
      grupoDto.items = (group.checklisttemplateitem ?? []).map((ti: any) => {
        const ci = ti.checklistitem?.[0] ?? null;
        const itemDto = new ConsultarChecklistItemDto();
        itemDto.idItem = ci?.idchecklistitem ?? 0;
        itemDto.idItemTemplate = ti.idtemplateitem;
        itemDto.nombre = ti.nombre ?? '';
        itemDto.orden = ti.orden ?? 0;
        itemDto.foto = ti.foto ?? false;
        itemDto.permiteComentario = ti.comentario ?? false;
        itemDto.completado = ci?.completado ?? false;
        itemDto.comentario = ci?.comentario ?? '';
        return itemDto;
      });
      return grupoDto;
    });
    return dto;
  }
}
