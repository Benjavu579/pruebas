import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-estudiante-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="animate-fade-in">
      <header class="mb-4 pb-3 border-bottom">
        <h1 class="display-6 fw-bold text-slate-900 mb-1">Bienvenido, {{ nombreUsuario }}</h1>
        <p class="text-muted mb-0">Este es tu resumen académico y disciplinario actualizado.</p>
      </header>

      <!-- Loading state -->
      <div *ngIf="cargando()" class="text-center py-5 text-muted animate-fade-in">
        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
        Cargando resumen...
      </div>

      <div *ngIf="!cargando()">
        <!-- Stats Grid -->
        <div class="row g-3 g-md-4 mb-4">
          <div class="col-sm-6 col-lg-4">
            <div class="stat-card bg-white p-4 border h-100">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="icon-box border">
                  <i class="bi bi-calendar-check text-success"></i>
                </div>
                <h5 class="mb-0 fw-bold text-uppercase smaller text-muted tracking-widest">Asistencia</h5>
              </div>
              <h2 class="display-6 fw-bold mb-0">{{ porcentajeAsistencia }}%</h2>
              <div class="progress mt-3" style="height: 6px; border-radius: 3px;">
                <div class="progress-bar bg-success" role="progressbar" [style.width]="porcentajeAsistencia + '%'"></div>
              </div>
              <p class="text-muted small mt-2 mb-0">Inasistencias: {{ totalInasistencias }}</p>
            </div>
          </div>
          <div class="col-sm-6 col-lg-4">
            <div class="stat-card bg-white p-4 border h-100">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="icon-box border">
                  <i class="bi bi-book text-primary"></i>
                </div>
                <h5 class="mb-0 fw-bold text-uppercase smaller text-muted tracking-widest">Cursos</h5>
              </div>
              <h2 class="display-6 fw-bold mb-0">{{ totalCursos }}</h2>
              <p class="text-muted small mt-2 mb-0">Asignaturas inscritas</p>
            </div>
          </div>
          <div class="col-sm-6 col-lg-4">
            <div class="stat-card bg-white p-4 border h-100">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div class="icon-box border">
                  <i class="bi bi-shield-exclamation text-danger"></i>
                </div>
                <h5 class="mb-0 fw-bold text-uppercase smaller text-muted tracking-widest">Anotaciones</h5>
              </div>
              <h2 class="display-6 fw-bold mb-0">{{ totalAnotaciones }}</h2>
              <p class="text-muted small mt-2 mb-0">Vigentes en tu hoja de vida</p>
            </div>
          </div>
        </div>

        <!-- Quick Access Links -->
        <div class="row g-3">
          <div class="col-sm-6">
            <a routerLink="/alumno/asignaturas" class="quick-link bg-white border p-4 d-flex align-items-center justify-content-between text-decoration-none">
              <div class="d-flex align-items-center gap-3">
                <div class="icon-box border">
                  <i class="bi bi-book text-primary"></i>
                </div>
                <div>
                  <p class="fw-bold mb-0 text-slate-800">Mis Inscripciones</p>
                  <p class="text-muted smaller mb-0">Ver detalle de cursos</p>
                </div>
              </div>
              <i class="bi bi-arrow-right text-muted"></i>
            </a>
          </div>
          <div class="col-sm-6">
            <a routerLink="/alumno/anotaciones" class="quick-link bg-white border p-4 d-flex align-items-center justify-content-between text-decoration-none">
              <div class="d-flex align-items-center gap-3">
                <div class="icon-box border">
                  <i class="bi bi-journal-text text-danger"></i>
                </div>
                <div>
                  <p class="fw-bold mb-0 text-slate-800">Mis Anotaciones</p>
                  <p class="text-muted smaller mb-0">Hoja de vida disciplinaria</p>
                </div>
              </div>
              <i class="bi bi-arrow-right text-muted"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .icon-box {
      width: 44px; height: 44px;
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.3rem;
      background-color: var(--light);
      flex-shrink: 0;
    }
    .stat-card { transition: border-color 0.2s; }
    .stat-card:hover { border-color: var(--primary) !important; }
    .quick-link { transition: border-color 0.2s, box-shadow 0.2s; }
    .quick-link:hover { border-color: var(--primary) !important; box-shadow: 0 4px 12px rgba(15,52,96,0.08); }
    .text-slate-900, .text-slate-800 { color: var(--text-primary); }
    .smaller { font-size: 0.75rem; }
    .tracking-widest { letter-spacing: 0.08em; }
  `]
})
export class EstudianteDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  nombreUsuario: string = '';
  rutUsuario: string | null = null;

  totalCursos: number = 0;
  totalInasistencias: number = 0;
  totalAnotaciones: number = 0;
  porcentajeAsistencia: number = 100;
  cargando = signal(true);

  ngOnInit() {
    this.rutUsuario = localStorage.getItem('rutUsuario');
    this.nombreUsuario = localStorage.getItem('nombreUsuario') || 'Estudiante';

    if (!this.rutUsuario) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarResumen();
  }

  cargarResumen() {
    this.http.get<any[]>(`http://localhost:8080/api/v1/alumnos/rut/${this.rutUsuario}`)
      .subscribe({
        next: data => {
          try {
            const list = Array.isArray(data) ? data : [];
            this.totalCursos = list.length;
            this.totalInasistencias = list.reduce((acc, curr) => acc + (curr.cantidadInasistencias || 0), 0);
            
            const clasesTotales = this.totalCursos * 6; // 6 días por ramo
            if (clasesTotales > 0) {
              const presentes = Math.max(0, clasesTotales - this.totalInasistencias);
              this.porcentajeAsistencia = Math.round((presentes / clasesTotales) * 100);
            } else {
              this.porcentajeAsistencia = 100;
            }
          } catch(e) {
            console.error('Error procesando resumen', e);
          }

          this.http.get<any[]>(`http://localhost:8080/api/v1/anotaciones/rut/${this.rutUsuario}`)
            .subscribe({
              next: anotaciones => { 
                this.totalAnotaciones = Array.isArray(anotaciones) ? anotaciones.length : 0; 
                this.cargando.set(false);
              },
              error: () => { this.cargando.set(false); }
            });
        },
        error: () => { this.cargando.set(false); }
      });
  }
}
