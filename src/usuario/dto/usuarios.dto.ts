
export class CreateUsuarioDto {
  idusuario: string = '';
  idempresa: number = 0;
  idrol: number = 0;
  nombre: string = '';
  email: string = '';
  telefono?: string;
}