import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteEmpleadosComponent } from './reporte-empleados.component';

describe('ReporteEmpleadosComponent', () => {
  let component: ReporteEmpleadosComponent;
  let fixture: ComponentFixture<ReporteEmpleadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteEmpleadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteEmpleadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
