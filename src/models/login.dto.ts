export class LoginDto {
  idusuario: string;
  clave: string;
}

export class LoginresponseDto{
  idusuario: string;
  idRol: number;
  idEmpresa: number;
  nombreEmpresa: string;
  nombreUsuario: string;
  token: string;
}