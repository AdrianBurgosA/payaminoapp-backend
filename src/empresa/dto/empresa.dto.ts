import { RequestBase } from "src/models/request.dto";

export class CreateEmpresaDto {
  nombre: string;
  direccion?: string;
  telefono?: string;
}

export class ConsultaEmpresaDto extends RequestBase{
  team?: boolean;
}