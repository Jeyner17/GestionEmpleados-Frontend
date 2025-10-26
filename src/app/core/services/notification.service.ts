import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

 
  success(title: string, message?: string): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#28a745',
      timer: 3000,
      timerProgressBar: true
    });
  }


  error(title: string, message?: string): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#dc3545'
    });
  }


  warning(title: string, message?: string): Promise<any> {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#ffc107'
    });
  }


  info(title: string, message?: string): Promise<any> {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: message,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#17a2b8'
    });
  }


  confirm(title: string, message?: string): Promise<any> {
    return Swal.fire({
      icon: 'question',
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Sí, confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d'
    });
  }


  confirmDelete(message: string = '¿Está seguro de eliminar este registro?'): Promise<any> {
    return Swal.fire({
      icon: 'warning',
      title: '¿Está seguro?',
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      reverseButtons: true
    });
  }
}