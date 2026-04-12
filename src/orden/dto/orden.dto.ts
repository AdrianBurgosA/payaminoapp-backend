import { servicioitem, servicioorden, servicioordenitem, vehiculo } from '@prisma/client';

export class CrearOrdenDto {
  idempresa: number = 0;
  idcliente: string = '';
  idvehiculo: number = 0;
  estado: boolean = true;
  fechaentrada: string = '';
  items: servicioordenitem[] = [];
  total: number = 0;
}

export class ConsultaOrdenesHistorialHomeDto {
  ordenActiva: OrdenDto | null = null;
  ordenes: OrdenDto[] = [];
  items: servicioitem[] = [];
  vehiculos: vehiculo[] = [];
}

export class OrdenDto {
  idorden: number = 0;
  idempresa: number = 0;
  idcliente: string = '';
  idvehiculo: number = 0;
  estado: string = '';
  fechaentrada: Date = new Date();
  fechallegadacliente: Date = new Date();
  total: any = 0;
  fechafin: Date = new Date();
  fechacreacion: Date = new Date();
  vehiculo?: string = '';
  placa?: string = '';
}
