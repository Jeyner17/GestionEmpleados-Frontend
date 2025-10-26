export interface Provincia {
  id: number;
  nombre_provincia: string;
  capital_provincia: string;
  descripcion_provincia?: string;
  poblacion_provincia?: number;
  superficie_provincia?: number;
  latitud_provincia?: string;
  longitud_provincia?: string;
  id_region?: number;
  created_at?: string;
  updated_at?: string;
}