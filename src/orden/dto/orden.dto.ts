import {
  servicioitem,
  servicioorden,
  servicioordenitem,
  vehiculo,
} from '@prisma/client';
import { CatalogoDto } from 'src/models/catalogoDto';

export class CrearOrdenDto {
  idempresa: number = 0;
  idcliente: string = '';
  idvehiculo: number = 0;
  estado: boolean = true;
  fechaentrada: string = '';
  items: servicioordenitem[] = [];
  total: number = 0;
  team: number = 0;
}

export class ConsultaOrdenesHistorialHomeDto {
  ordenesActivas: OrdenDto[] = [];
  ordenesHistorial: OrdenDto[] = []; 
  ordenesEnProceso?: OrdenDto[] = []; 
  tecnicos?: CatalogoDto[] = []; 
  items: servicioitem[] = [];
  vehiculos: vehiculo[] = [];
  combos: any[] = [];
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
  ordentecnico: any[] = [];
}

export class AsignarOrdenDto{
  idorden: number = 0;
  idtecnico: string = '';
}
