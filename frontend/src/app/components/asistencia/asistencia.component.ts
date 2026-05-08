import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

/** Tracks attendance state for each student over a 6-day week */
interface AttendanceState {
  [alumnoId: number]: string[]; // Array of 6 elements: 'P' or 'A'
}

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in">
      <header class="mb-4 d-flex justify-content-between align-items-center border-bottom pb-3">
        <div>
          <h2 class="display-6 fw-bold mb-0">Pase de Lista</h2>
          <p class="text-muted mt-1 mb-0">Registra la asistencia del curso seleccionado</p>
        </div>
        <button class="btn btn-outline-secondary d-none d-md-inline-flex align-items-center gap-2" (click)="volver()">
          <i class="bi bi-arrow-left"></i> Volver a Cursos
        </button>
      </header>

      <!-- Selector de Curso -->
      <div class="card mb-4 border animate-slide-up">
        <div class="card-body p-4 bg-light border-0">
          <div class="row align-items-center g-3">
            <div class="col-md-6">
              <label class="form-label fw-bold text-uppercase smaller text-muted">Seleccionar Curso</label>
              <select class="form-select form-select-lg" [(ngModel)]="idCurso" (change)="onCursoChange()">
                <option [ngValue]="null" disabled selected>-- Elija un curso --</option>
                <option *ngFor="let c of cursos()" [value]="c.id">{{ c.nombre }} ({{ c.nivel }}° Nivel)</option>
              </select>
            </div>
            <div class="col-md-6 text-md-end" *ngIf="idCurso">
              <span class="badge bg-primary px-3 py-2 tracking-widest text-uppercase">
                <i class="bi bi-people-fill me-1"></i> {{ alumnos().length }} Estudiantes
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de Asistencia -->
      <div class="animate-slide-up" *ngIf="idCurso && alumnos().length > 0">
        <div class="card border overflow-hidden">
          <div class="table-responsive">
            <table class="table-custom mb-0">
              <thead>
                <tr>
                  <th class="ps-4">RUT</th>
                  <th>NOMBRE COMPLETO</th>
                  <th class="text-center" *ngFor="let dia of diasSemana">{{ dia }}</th>
                  <th class="text-center bg-light border-start">% ASIST.</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let a of alumnos()" class="table-row-hover">
                  <td class="ps-4 fw-bold text-slate-700">{{ a.rut }}</td>
                  <td>{{ a.nombre }} {{ a.apellidoPaterno }}</td>
                  
                  <!-- 6 Days Grid -->
                  <td class="text-center px-1" *ngFor="let dia of diasSemana; let i = index">
                    <div class="attendance-toggle mx-auto">
                      <input type="checkbox" [id]="'dia_' + i + '_' + a.id" class="btn-check"
                        [checked]="asistenciaMap[a.id][i] === 'P'"
                        (change)="toggleEstado(a.id, i)">
                      <label [for]="'dia_' + i + '_' + a.id" class="toggle-btn" 
                             [ngClass]="asistenciaMap[a.id][i] === 'P' ? 'btn-present' : 'btn-absent'" 
                             [title]="asistenciaMap[a.id][i] === 'P' ? 'Presente' : 'Ausente'">
                        {{ asistenciaMap[a.id][i] }}
                      </label>
                    </div>
                  </td>

                  <td class="text-center fw-bold bg-light border-start">
                    <span [ngClass]="getPorcentajeColor(a.id)">{{ calcularPorcentaje(a.id) }}%</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Footer with stats and save button -->
          <div class="p-4 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 bg-light border-top">
            <div class="d-flex gap-4 small text-muted">
              <span><span class="fw-bold text-success">{{ contarGlobal('P') }}</span> Días Presentes (Total)</span>
              <span><span class="fw-bold text-danger">{{ contarGlobal('A') }}</span> Días Ausentes (Total)</span>
            </div>
            <button class="btn btn-primary px-5 py-2" (click)="guardarAsistencia()" [disabled]="guardando">
              <span *ngIf="guardando" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i *ngIf="!guardando" class="bi bi-cloud-upload me-2"></i>
              {{ guardando ? 'Guardando...' : 'Guardar Asistencia' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div *ngIf="idCurso && alumnos().length === 0" class="text-center py-5 border bg-white mt-4 animate-slide-up">
        <i class="bi bi-inbox fs-1 text-muted mb-3 d-block"></i>
        <h5 class="fw-bold">Sin estudiantes</h5>
        <p class="text-muted mb-0">Este curso no tiene estudiantes registrados aún.</p>
      </div>
    </div>
  `,
  styles: [`
    .table-custom { width: 100%; border-collapse: separate; border-spacing: 0; }
    .table-custom thead th { background: var(--light); padding: 1rem; color: var(--text-muted); font-weight: 600; font-size: 0.75rem; text-transform: uppercase; border-bottom: 2px solid var(--border-color); }
    .table-custom tbody td { padding: 0.65rem 0.5rem; vertical-align: middle; border-bottom: 1px solid var(--border-color); }
    .table-row-hover:hover { background-color: rgba(15,52,96,0.02); }
    .attendance-toggle { background: var(--border-color); padding: 2px; width: fit-content; display: flex; border-radius: 6px; }
    .toggle-btn { min-width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: 700; font-size: 0.8rem; transition: all 0.15s; background: white; border-radius: 4px; border: none; }
    .btn-present { background: #10b981; color: white; }
    .btn-absent { background: #ef4444; color: white; }
    .smaller { font-size: 0.75rem; }
    .tracking-widest { letter-spacing: 0.1em; }
    .text-slate-700 { color: var(--text-primary); }
  `]
})
export class AsistenciaComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  cursos = signal<any[]>([]);
  alumnos = signal<any[]>([]);
  idCurso: number | null = null;
  asistenciaMap: AttendanceState = {};
  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  guardando = false;

  ngOnInit() {
    this.cargarCursos();
    this.route.queryParams.subscribe(params => {
      if (params['idCurso']) {
        this.idCurso = Number(params['idCurso']);
        this.cargarAlumnos();
      }
    });
  }

  cargarCursos() {
    this.http.get<any[]>('http://localhost:8080/api/v1/cursos/').subscribe(data => this.cursos.set(data));
  }

  onCursoChange() {
    this.asistenciaMap = {}; // reset on course change
    if (this.idCurso) this.cargarAlumnos();
  }

  cargarAlumnos() {
    if (!this.idCurso) return;
    this.http.get<any[]>(`http://localhost:8080/api/v1/alumnos/curso/${this.idCurso}`).subscribe(data => {
      this.alumnos.set(data);
      
      const map: AttendanceState = {};
      data.forEach(a => {
        // Distribuimos las inasistencias en la semana (de derecha a izquierda o izquierda a derecha)
        // Para que coincida con el backend, si tiene 2 inasistencias, marcamos los últimos 2 días como 'A'
        const inasistenciasPrevias = Math.min(a.cantidadInasistencias || 0, 6);
        const grid = Array(6).fill('P');
        for (let i = 0; i < inasistenciasPrevias; i++) {
          grid[5 - i] = 'A'; // Empezamos poniendo ausente desde el sábado hacia atrás
        }
        map[a.id] = grid;
      });
      this.asistenciaMap = map;
    });
  }

  toggleEstado(alumnoId: number, diaIndex: number) {
    const currentState = this.asistenciaMap[alumnoId][diaIndex];
    this.asistenciaMap[alumnoId][diaIndex] = currentState === 'P' ? 'A' : 'P';
  }

  calcularPorcentaje(alumnoId: number): number {
    const array = this.asistenciaMap[alumnoId];
    if (!array) return 100;
    const presentes = array.filter((v: string) => v === 'P').length;
    return Math.round((presentes / 6) * 100);
  }

  getPorcentajeColor(alumnoId: number): string {
    const pct = this.calcularPorcentaje(alumnoId);
    if (pct >= 85) return 'text-success';
    if (pct >= 70) return 'text-warning';
    return 'text-danger';
  }

  contarGlobal(estado: 'P' | 'A'): number {
    let count = 0;
    Object.values(this.asistenciaMap).forEach(arr => {
      count += arr.filter((v: string) => v === estado).length;
    });
    return count;
  }

  volver() {
    this.router.navigate(['/profesor/cursos']);
  }

  guardarAsistencia() {
    this.guardando = true;

    // Build payload: count absences in the 6-day grid for each student
    const updates = this.alumnos().map(alumno => {
      const faltasEnSemana = this.asistenciaMap[alumno.id].filter(v => v === 'A').length;
      return {
        id: alumno.id,
        cantidadInasistencias: faltasEnSemana, // Sobrescribimos con lo exacto de la grilla
        cantidadAtrasos: alumno.cantidadAtrasos,
      };
    });

    // Fire all updates in parallel
    let completed = 0;
    const total = updates.length;

    if (total === 0) { this.guardando = false; return; }

    updates.forEach(update => {
      const alumno = this.alumnos().find(a => a.id === update.id);
      const payload = {
        ...alumno,
        cantidadInasistencias: update.cantidadInasistencias,
        cantidadAtrasos: update.cantidadAtrasos,
      };
      this.http.post('http://localhost:8080/api/v1/alumnos/', payload)
        .subscribe({
          next: () => {
            completed++;
            if (completed === total) this.onSaveComplete();
          },
          error: () => {
            completed++;
            if (completed === total) this.onSaveComplete();
          }
        });
    });
  }

  private onSaveComplete() {
    this.guardando = false;
    this.cargarAlumnos(); // Refresh data
    import('sweetalert2').then(({ default: Swal }) => {
      Swal.fire({
        title: '¡Asistencia Guardada!',
        text: `Se han registrado las inasistencias correctamente.`,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
    });
  }
}
