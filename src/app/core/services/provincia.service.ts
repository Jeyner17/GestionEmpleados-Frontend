import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { API_CONFIG } from '../config/api.config';
import { Provincia } from '../models/provincia';

interface ProvinciaResponse {
  success: boolean;
  data: Provincia[];
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {

  constructor(private apiService: ApiService) { }

  getProvincias(): Observable<ProvinciaResponse> {
    return this.apiService.get<ProvinciaResponse>(API_CONFIG.endpoints.provincias);
  }

  getProvincia(id: number): Observable<any> {
    return this.apiService.get<any>(`${API_CONFIG.endpoints.provincias}/${id}`);
  }
}