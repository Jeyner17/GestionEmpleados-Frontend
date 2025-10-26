import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { API_CONFIG } from '../config/api.config';
import { Empleado, EmpleadoResponse, EmpleadoPaginado } from '../models/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  constructor(private apiService: ApiService) { }


  getEmpleados(params?: any): Observable<EmpleadoPaginado> {
    return this.apiService.get<EmpleadoPaginado>(API_CONFIG.endpoints.empleados, params);
  }


  getEmpleado(id: number): Observable<EmpleadoResponse> {
    return this.apiService.get<EmpleadoResponse>(`${API_CONFIG.endpoints.empleados}/${id}`);
  }

  createEmpleado(empleado: Empleado, foto?: File): Observable<EmpleadoResponse> {
    const formData = this.buildFormData(empleado, foto);
    return this.apiService.postFormData<EmpleadoResponse>(API_CONFIG.endpoints.empleados, formData);
  }


  updateEmpleado(id: number, empleado: Empleado, foto?: File): Observable<EmpleadoResponse> {
    const formData = this.buildFormData(empleado, foto);
    return this.apiService.postFormData<EmpleadoResponse>(`${API_CONFIG.endpoints.empleados}/${id}`, formData);
  }

  deleteEmpleado(id: number): Observable<any> {
    return this.apiService.delete<any>(`${API_CONFIG.endpoints.empleados}/${id}`);
  }

  getReporte(): Observable<EmpleadoResponse> {
    return this.apiService.get<EmpleadoResponse>(API_CONFIG.endpoints.empleadosReporte);
  }

  private buildFormData(empleado: Empleado, foto?: File): FormData {
    const formData = new FormData();

    // Datos Personales
    formData.append('nombres', empleado.nombres);
    formData.append('apellidos', empleado.apellidos);
    formData.append('cedula', empleado.cedula);
    
    if (empleado.provincia_id) {
      formData.append('provincia_id', empleado.provincia_id.toString());
    }
    
    formData.append('fecha_nacimiento', empleado.fecha_nacimiento);
    formData.append('email', empleado.email);
    
    if (empleado.observaciones_personales) {
      formData.append('observaciones_personales', empleado.observaciones_personales);
    }

    // Fotografía
    if (foto) {
      formData.append('fotografia', foto);
    }

    // Datos Laborales
    formData.append('fecha_ingreso', empleado.fecha_ingreso);
    formData.append('cargo', empleado.cargo);
    formData.append('departamento', empleado.departamento);
    
    if (empleado.provincia_laboral_id) {
      formData.append('provincia_laboral_id', empleado.provincia_laboral_id.toString());
    }
    
    formData.append('sueldo', empleado.sueldo.toString());
    formData.append('jornada_parcial', empleado.jornada_parcial ? '1' : '0');
    
    if (empleado.observaciones_laborales) {
      formData.append('observaciones_laborales', empleado.observaciones_laborales);
    }

    // Estado (solo para actualización)
    if (empleado.estado) {
      formData.append('estado', empleado.estado);
    }

    return formData;
  }
}