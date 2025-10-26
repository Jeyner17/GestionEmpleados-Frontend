import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../../core/services/empleado.service';
import { Empleado } from '../../core/models/empleado';

@Component({
  selector: 'app-listado-empleados',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listado-empleados.component.html',
  styleUrl: './listado-empleados.component.css'
})
export class ListadoEmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  loading: boolean = false;
  error: string = '';
  searchNombre: string = '';
  searchCodigo: string = '';
  estadoFiltro: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  totalEmpleados: number = 0;
  perPage: number = 20;
  Math = Math;

  constructor(private empleadoService: EmpleadoService) { }

  ngOnInit(): void {
    this.cargarEmpleados();
  }


  cargarEmpleados(): void {
    this.loading = true;
    this.error = '';

    const params: any = {
      page: this.currentPage,
      per_page: this.perPage
    };

    const searchTerm = this.searchNombre || this.searchCodigo;
    if (searchTerm) {
      params.search = searchTerm;
    }

    if (this.estadoFiltro) {
      params.estado = this.estadoFiltro;
    }

    this.empleadoService.getEmpleados(params).subscribe({
      next: (response) => {
        if (response.success) {
          this.empleados = response.data.data;
          this.currentPage = response.data.current_page;
          this.totalPages = response.data.last_page;
          this.totalEmpleados = response.data.total;
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar empleados:', err);
        this.error = 'Error al cargar los empleados. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  buscar(): void {
    this.currentPage = 1;
    this.cargarEmpleados();
  }

  limpiarFiltros(): void {
    this.searchNombre = '';
    this.searchCodigo = '';
    this.estadoFiltro = '';
    this.currentPage = 1;
    this.cargarEmpleados();
  }


  cambiarPagina(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cargarEmpleados();
    }
  }

  eliminarEmpleado(id: number): void {
    if (confirm('¿Está seguro de eliminar este empleado?')) {
      this.empleadoService.deleteEmpleado(id).subscribe({
        next: (response) => {
          if (response.success) {
            alert('Empleado eliminado exitosamente');
            this.cargarEmpleados();
          }
        },
        error: (err) => {
          console.error('Error al eliminar empleado:', err);
          alert('Error al eliminar el empleado');
        }
      });
    }
  }


  getEstadoBadgeClass(estado: string): string {
    return estado === 'VIGENTE' ? 'badge bg-success' : 'badge bg-secondary';
  }


  getPagesArray(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}