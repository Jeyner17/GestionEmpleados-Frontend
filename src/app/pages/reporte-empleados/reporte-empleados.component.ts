import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EmpleadoService } from '../../core/services/empleado.service';
import { NotificationService } from '../../core/services/notification.service';
import { Empleado } from '../../core/models/empleado';

@Component({
  selector: 'app-reporte-empleados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './reporte-empleados.component.html',
  styleUrls: ['./reporte-empleados.component.css']
})
export class ReporteEmpleadosComponent implements OnInit {
  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  loading: boolean = false;
  error: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  Date = Date;

  fechaActual: Date = new Date();

  constructor(
    private empleadoService: EmpleadoService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this.cargarReporte();
  }

  cargarReporte(): void {
    this.loading = true;
    this.error = '';

    this.empleadoService.getReporte().subscribe({
      next: (response) => {
        if (response.success) {
          this.empleados = Array.isArray(response.data) ? response.data : [response.data];
          this.empleadosFiltrados = [...this.empleados];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar reporte:', err);
        this.error = 'Error al cargar el reporte. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.empleadosFiltrados.sort((a: any, b: any) => {
      let valueA = this.getNestedValue(a, column);
      let valueB = this.getNestedValue(b, column);

      valueA = valueA?.toString().toLowerCase() || '';
      valueB = valueB?.toString().toLowerCase() || '';

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  getNestedValue(obj: any, path: string): any {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      value = value?.[key];
    }
    return value;
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'bi-arrow-down-up';
    }
    return this.sortDirection === 'asc' ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up';
  }

  getEstadoBadgeClass(estado: string): string {
    return estado === 'VIGENTE' ? 'badge bg-success' : 'badge bg-secondary';
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC');
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  imprimirReporte(): void {
    window.print();
  }

  exportarCSV(): void {
    const headers = [
      'Código',
      'Nombres',
      'Apellidos',
      'Cédula',
      'Provincia Residencia',
      'Fecha Nacimiento',
      'Email',
      'Fecha Ingreso',
      'Cargo',
      'Departamento',
      'Provincia Laboral',
      'Sueldo',
      'Jornada Parcial',
      'Estado'
    ];

    const rows = this.empleadosFiltrados.map(emp => {
      return [
        emp.codigo_empleado || '',
        emp.nombres,
        emp.apellidos,
        emp.cedula,
        emp.provincia_residencia?.nombre_provincia || 'N/A',
        this.formatDate(emp.fecha_nacimiento),
        emp.email,
        this.formatDate(emp.fecha_ingreso),
        emp.cargo,
        emp.departamento,
        emp.provincia_laboral?.nombre_provincia || 'N/A',
        Number(emp.sueldo).toFixed(2),
        emp.jornada_parcial ? 'Sí' : 'No',
        emp.estado || 'VIGENTE'
      ];
    });

    const BOM = '\uFEFF';
    const separator = ';';
    let csvContent = BOM + headers.join(separator) + '\r\n';
    
    rows.forEach(row => {
      const cleanRow = row.map(cell => {
        const cleanCell = String(cell).replace(/[\r\n]+/g, ' ').trim();
        return cleanCell;
      });
      csvContent += cleanRow.join(separator) + '\r\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const fecha = new Date().toISOString().split('T')[0];
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_empleados_${fecha}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.notificationService.success(
      'Exportación exitosa',
      'El archivo CSV se ha descargado correctamente'
    );
  }

  exportarExcel(): void {
    let tableHTML = '<table border="1" style="border-collapse: collapse;">';
    
    tableHTML += '<thead><tr style="background-color: #0d6efd; color: white; font-weight: bold;">';
    const headers = [
      'Código', 'Nombres', 'Apellidos', 'Cédula', 'Provincia Residencia',
      'Fecha Nacimiento', 'Email', 'Fecha Ingreso', 'Cargo', 'Departamento',
      'Provincia Laboral', 'Sueldo', 'Jornada Parcial', 'Estado'
    ];
    headers.forEach(header => {
      tableHTML += `<th style="padding: 8px; text-align: left;">${header}</th>`;
    });
    tableHTML += '</tr></thead>';
    
    tableHTML += '<tbody>';
    this.empleadosFiltrados.forEach((emp, index) => {
      const bgColor = index % 2 === 0 ? '#f8f9fa' : 'white';
      tableHTML += `<tr style="background-color: ${bgColor};">`;
      tableHTML += `<td style="padding: 5px;">${emp.codigo_empleado || ''}</td>`;
      tableHTML += `<td style="padding: 5px;">${emp.nombres}</td>`;
      tableHTML += `<td style="padding: 5px;">${emp.apellidos}</td>`;
      tableHTML += `<td style="padding: 5px;">${emp.cedula}</td>`;
      tableHTML += `<td style="padding: 5px;">${emp.provincia_residencia?.nombre_provincia || 'N/A'}</td>`;
      tableHTML += `<td style="padding: 5px;">${this.formatDate(emp.fecha_nacimiento)}</td>`;
      tableHTML += `<td style="padding: 5px;">${emp.email}</td>`;
      tableHTML += `<td style="padding: 5px;">${this.formatDate(emp.fecha_ingreso)}</td>`;
      tableHTML += `<td style="padding: 5px;">${emp.cargo}</td>`;
      tableHTML += `<td style="padding: 5px;">${emp.departamento}</td>`;
      tableHTML += `<td style="padding: 5px;">${emp.provincia_laboral?.nombre_provincia || 'N/A'}</td>`;
      tableHTML += `<td style="padding: 5px; text-align: right;">${this.formatCurrency(Number(emp.sueldo))}</td>`;
      tableHTML += `<td style="padding: 5px; text-align: center;">${emp.jornada_parcial ? 'Sí' : 'No'}</td>`;
      tableHTML += `<td style="padding: 5px; text-align: center;">${emp.estado || 'VIGENTE'}</td>`;
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';
    
    const htmlContent = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Reporte Empleados</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
      </head>
      <body>
        <h2>Reporte de Empleados - ${this.formatDate(this.fechaActual.toISOString())}</h2>
        ${tableHTML}
      </body>
      </html>
    `;
    
    const blob = new Blob(['\ufeff', htmlContent], {
      type: 'application/vnd.ms-excel;charset=utf-8;'
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const fecha = new Date().toISOString().split('T')[0];
    
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_empleados_${fecha}.xls`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    this.notificationService.success(
      'Exportación exitosa',
      'El archivo Excel se ha descargado correctamente'
    );
  }


  getEmpleadosVigentes(): number {
    return this.empleadosFiltrados.filter(emp => emp.estado === 'VIGENTE').length;
  }


  getEmpleadosJornadaParcial(): number {
    return this.empleadosFiltrados.filter(emp => emp.jornada_parcial).length;
  }
}