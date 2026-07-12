export class LoginDto {
  idusuario: string = '';
  clave: string = '';
}

export class LoginresponseDto{
  idusuario: string = '';
  idRol: number = 0;
  idEmpresa: number = 0;
  nombreEmpresa: string = '';
  nombreUsuario: string = '';
  token: string = '';
}