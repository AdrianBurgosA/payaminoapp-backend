import { servicioorden, servicioordenitem } from '@prisma/client';

export class CrearOrdenDto {
  idempresa: number;
  idcliente: string;
  idvehiculo: number;
  estado: boolean = true;
  fechaentrada: string;
  items: servicioordenitem[];
  total: number;
}

export class ConsultaOrdenesHistorialHomeDto {
  ordenActiva: servicioorden | null;
  ordenes: servicioorden[];
}
