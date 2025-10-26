import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmpleadoService } from '../../core/services/empleado.service';
import { ProvinciaService } from '../../core/services/provincia.service';
import { Empleado } from '../../core/models/empleado';
import { Provincia } from '../../core/models/provincia';

@Component({
  selector: 'app-editar-empleado',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './editar-empleado.component.html',
  styleUrls: ['./editar-empleado.component.css']
})
export class EditarEmpleadoComponent implements OnInit {

  activeTab: 'personal' | 'laboral' = 'personal';

  empleadoId: number = 0;

  empleado: Empleado = {
    nombres: '',
    apellidos: '',
    cedula: '',
    provincia_id: undefined,
    fecha_nacimiento: '',
    email: '',
    observaciones_personales: '',
    fecha_ingreso: '',
    cargo: '',
    departamento: '',
    provincia_laboral_id: undefined,
    sueldo: 0,
    jornada_parcial: false,
    observaciones_laborales: '',
    estado: 'VIGENTE'
  };

  fotoFile: File | null = null;
  fotoPreview: string | null = null;
  fotoActual: string = '';
  provincias: Provincia[] = [];
  loading: boolean = false;
  loadingEmpleado: boolean = false;
  loadingProvincias: boolean = false;
  error: string = '';
  errores: any = {};

  constructor(
    private empleadoService: EmpleadoService,
    private provinciaService: ProvinciaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.empleadoId = +params['id'];
      if (this.empleadoId) {
        this.cargarEmpleado();
      }
    });

    this.cargarProvincias();
  }

  cargarEmpleado(): void {
    this.loadingEmpleado = true;
    this.empleadoService.getEmpleado(this.empleadoId).subscribe({
      next: (response) => {
        if (response.success) {
          const data = Array.isArray(response.data) ? response.data[0] : response.data;
          this.empleado = data;

          if (this.empleado.fecha_nacimiento) {
            this.empleado.fecha_nacimiento = this.formatDate(this.empleado.fecha_nacimiento);
          }
          if (this.empleado.fecha_ingreso) {
            this.empleado.fecha_ingreso = this.formatDate(this.empleado.fecha_ingreso);
          }

          if (this.empleado.fotografia && typeof this.empleado.fotografia === 'string') {
            this.fotoActual = this.empleado.fotografia;
            this.fotoPreview = `http://127.0.0.1:8000/storage/${this.empleado.fotografia}`;
          }
        }
        this.loadingEmpleado = false;
      },
      error: (err) => {
        console.error('Error al cargar empleado:', err);
        this.error = 'Error al cargar los datos del empleado';
        this.loadingEmpleado = false;
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  cargarProvincias(): void {
    this.loadingProvincias = true;
    this.provinciaService.getProvincias().subscribe({
      next: (response) => {
        if (response.success) {
          this.provincias = response.data;
        }
        this.loadingProvincias = false;
      },
      error: (err) => {
        console.error('Error al cargar provincias:', err);
        this.loadingProvincias = false;
      }
    });
  }


  cambiarTab(tab: 'personal' | 'laboral'): void {
    if (tab === 'laboral') {
      if (!this.validarDatosPersonales()) {
        return;
      }
    }
    this.activeTab = tab;
  }

  validarDatosPersonales(): boolean {
    this.errores = {};
    let valido = true;

    if (!this.empleado.nombres.trim()) {
      this.errores.nombres = 'El nombre es requerido';
      valido = false;
    }

    if (!this.empleado.apellidos.trim()) {
      this.errores.apellidos = 'Los apellidos son requeridos';
      valido = false;
    }

    if (!this.empleado.cedula.trim()) {
      this.errores.cedula = 'La cédula es requerida';
      valido = false;
    } else if (!/^\d{10}$/.test(this.empleado.cedula)) {
      this.errores.cedula = 'La cédula debe tener exactamente 10 dígitos numéricos';
      valido = false;
    }

    if (!this.empleado.fecha_nacimiento) {
      this.errores.fecha_nacimiento = 'La fecha de nacimiento es requerida';
      valido = false;
    }

    if (!this.empleado.email.trim()) {
      this.errores.email = 'El email es requerido';
      valido = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.empleado.email)) {
      this.errores.email = 'El email no es válido';
      valido = false;
    }

    if (!valido) {
      this.error = 'Por favor, complete todos los campos requeridos correctamente';
    } else {
      this.error = '';
    }

    return valido;
  }

  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  validarDatosLaborales(): boolean {
    this.errores = {};
    let valido = true;

    if (!this.empleado.fecha_ingreso) {
      this.errores.fecha_ingreso = 'La fecha de ingreso es requerida';
      valido = false;
    }

    if (!this.empleado.cargo.trim()) {
      this.errores.cargo = 'El cargo es requerido';
      valido = false;
    }

    if (!this.empleado.departamento.trim()) {
      this.errores.departamento = 'El departamento es requerido';
      valido = false;
    }

    if (!this.empleado.sueldo || this.empleado.sueldo <= 0) {
      this.errores.sueldo = 'El sueldo debe ser mayor a 0';
      valido = false;
    }

    if (!valido) {
      this.error = 'Por favor, complete todos los campos requeridos correctamente';
    } else {
      this.error = '';
    }

    return valido;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccione una imagen válida');
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen no debe superar los 2MB');
        return;
      }

      this.fotoFile = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.fotoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  guardar(): void {
    if (!this.validarDatosPersonales() || !this.validarDatosLaborales()) {
      return;
    }

    this.loading = true;
    this.error = '';

    this.empleadoService.updateEmpleado(this.empleadoId, this.empleado, this.fotoFile || undefined).subscribe({
      next: (response) => {
        if (response.success) {
          alert('Empleado actualizado exitosamente');
          this.router.navigate(['/empleados']);
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al actualizar empleado:', err);

        if (err.error && err.error.errors) {
          this.errores = err.error.errors;
          this.error = 'Error de validación. Por favor, revise los campos marcados.';
        } else {
          this.error = err.error?.message || 'Error al actualizar el empleado. Por favor, intente nuevamente.';
        }

        this.loading = false;
      }
    });
  }

  cancelar(): void {
    if (confirm('¿Está seguro de cancelar? Se perderán los cambios no guardados.')) {
      this.router.navigate(['/empleados']);
    }
  }

  getError(campo: string): string {
    if (this.errores[campo]) {
      if (Array.isArray(this.errores[campo])) {
        return this.errores[campo][0];
      }
      return this.errores[campo];
    }
    return '';
  }

  hasError(campo: string): boolean {
    return !!this.errores[campo];
  }
}