import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alumno-asignaturas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in">
      <header class="mb-4 pb-3 border-bottom">
        <h1 class="display-6 fw-bold mb-1">Mis Asignaturas</h1>
        <p class="text-muted mb-0">Cursos en los que estás matriculado actualmente.</p>
      </header>

      <!-- Loading state -->
      <div *ngIf="cargando()" class="text-center py-5 text-muted animate-fade-in">
        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
        Cargando asignaturas...
      </div>

      <!-- Empty state -->
      <div *ngIf="!cargando() && matriculas().length === 0" class="text-center py-5 border bg-white animate-slide-up">
        <i class="bi bi-book fs-1 text-muted d-block mb-3"></i>
        <h5 class="fw-bold">Sin asignaturas</h5>
        <p class="text-muted">Aún no estás inscrito en ningún curso.</p>
      </div>

      <!-- Asignaturas Grid -->
      <div *ngIf="!cargando() && matriculas().length > 0" class="row g-4">
        <div class="col-sm-6 col-lg-4" *ngFor="let m of matriculas()">
          <div class="asignatura-card bg-white border h-100 animate-slide-up">
            <div class="card-accent"></div>
            <div class="p-4">
              <h5 class="fw-bold mb-1 text-slate-800">{{ m.curso?.nombre }}</h5>
              <p class="smaller text-muted text-uppercase mb-3 tracking-widest">
                Nivel {{ m.curso?.nivel }}° &bull; Año {{ m.curso?.anio_academico || '2026' }}
              </p>
              <div class="d-flex gap-3 pt-3 border-top">
                <div class="stat-chip">
                  <i class="bi bi-calendar-check text-success me-1"></i>
                  <span class="fw-bold">{{ calcularPorcentaje(m) }}%</span>
                  <span class="text-muted ms-1 smaller">Asistencia</span>
                </div>
                <div class="stat-chip">
                  <i class="bi bi-calendar-x text-danger me-1"></i>
                  <span class="fw-bold">{{ m.cantidadInasistencias || 0 }}</span>
                  <span class="text-muted ms-1 smaller">Inasistencias</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .asignatura-card { position: relative; overflow: hidden; transition: box-shadow 0.2s, border-color 0.2s; }
    .asignatura-card:hover { border-color: var(--primary) !important; box-shadow: 0 4px 12px rgba(15,52,96,0.08); }
    .card-accent { height: 4px; background: var(--primary); }
    .stat-chip { display: flex; align-items: center; }
    .smaller { font-size: 0.75rem; }
    .tracking-widest { letter-spacing: 0.08em; }
    .text-slate-800 { color: var(--text-primary); }
  `]
})
export class AlumnoAsignaturasComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  matriculas = signal<any[]>([]);
  cargando = signal(true);

  ngOnInit() {
    const rut = localStorage.getItem('rutUsuario');
    if (!rut) { this.router.navigate(['/login']); return; }

    this.http.get<any[]>(`http://localhost:8080/api/v1/alumnos/rut/${rut}`)
      .subscribe({
        next: data => {
          try {
            const list = Array.isArray(data) ? data : [];
            this.matriculas.set(list);
          } catch(e) {
            console.error('Error procesando asignaturas', e);
          }
          this.cargando.set(false); 
        },
        error: () => { this.cargando.set(false); }
      });
  }

  calcularPorcentaje(matricula: any): number {
    const faltas = matricula.cantidadInasistencias || 0;
    const presentes = Math.max(0, 6 - faltas);
    return Math.round((presentes / 6) * 100);
  }
}
