import { RequestBase } from "src/models/request.dto";

export class CrearConsultarChecklistDto extends RequestBase {
    idorden: number = 0;
}

export class ModificarChecklistDto extends RequestBase {
    valor: boolean = false;
    comentario: string | null = null;
}

export class ConsultarCheckListDto {
    idCheckList: number = 0;
    idOrden: number = 0;
    nombre: string = '';
    descripcion: string = '';
    grupos: ConsultarChecklistGrupoDto[] = [];
}

export class ConsultarChecklistGrupoDto{
    idGrupo: number = 0;
    nombre: string = '';
    orden: number = 0;
    items: ConsultarChecklistItemDto[] = [];
}

export class ConsultarChecklistItemDto{
    idItem: number = 0;
    idItemTemplate: number = 0;
    nombre: string = '';
    orden: number = 0;
    foto: boolean = false;
    permiteComentario: boolean = false;
    completado: boolean = false;
    comentario: string = '';
}

export class SubirFotoDto extends RequestBase{
  idChecklistItem: number = 0;
  foto: string = ''; 
}