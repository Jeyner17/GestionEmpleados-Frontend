import { Provincia } from './provincia';

export interface Empleado {
  id?: number;
  codigo_empleado?: string;
  
  // Datos Personales
  nombres: string;
  apellidos: string;
  cedula: string;
  provincia_id?: number;
  fecha_nacimiento: string;
  email: string;
  observaciones_personales?: string;
  fotografia?: string | File;
  
  // Datos Laborales
  fecha_ingreso: string;
  cargo: string;
  departamento: string;
  provincia_laboral_id?: number;
  sueldo: number;
  jornada_parcial: boolean;
  observaciones_laborales?: string;
  
  // Estado
  estado?: 'VIGENTE' | 'RETIRADO';
  
  // Relaciones
  provincia_residencia?: Provincia;
  provincia_laboral?: Provincia;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface EmpleadoResponse {
  success: boolean;
  data: Empleado | Empleado[];
  message: string;
  total?: number;
}

export interface EmpleadoPaginado {
  success: boolean;
  data: {
    current_page: number;
    data: Empleado[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  message: string;
}