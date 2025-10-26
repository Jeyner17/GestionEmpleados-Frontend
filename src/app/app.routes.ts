import { Routes } from '@angular/router';
import { ListadoEmpleadosComponent } from './pages/listado-empleados/listado-empleados.component';
import { CrearEmpleadoComponent } from './pages/crear-empleado/crear-empleado.component';
import { EditarEmpleadoComponent } from './pages/editar-empleado/editar-empleado.component';
import { ReporteEmpleadosComponent } from './pages/reporte-empleados/reporte-empleados.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/empleados',
    pathMatch: 'full'
  },
  {
    path: 'empleados',
    component: ListadoEmpleadosComponent,
    title: 'Listado de Empleados'
  },
  {
    path: 'crear-empleado',
    component: CrearEmpleadoComponent,
    title: 'Crear Empleado'
  },
  {
    path: 'editar-empleado/:id',
    component: EditarEmpleadoComponent,
    title: 'Editar Empleado'
  },
  {
    path: 'reporte',
    component: ReporteEmpleadosComponent,
    title: 'Reporte de Empleados'
  },
  {
    path: '**',
    redirectTo: '/empleados'
  }
];