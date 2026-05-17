import { RequestBase } from './request.dto';

export class OrdenConsultaDto extends RequestBase {
    team: number = 0;
    idOrden: number = 0;
}