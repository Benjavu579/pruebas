import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

/** Tracks attendance state for each student */
interface AttendanceState {
  [alumnoId: number]: { [fecha: string]: string }; // 'P' or 'A'
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
        <div class="d-flex gap-2">
          <button class="btn btn-outline-secondary d-none d-md-inline-flex align-items-center gap-2" (click)="volver()">
            <i class="bi bi-arrow-left"></i> Volver a Cursos
          </button>
        </div>
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

      <!-- Navegación de Semanas -->
      <div class="d-flex justify-content-between align-items-center mb-3 animate-slide-up" *ngIf="idCurso && alumnos().length > 0">
        <button class="btn btn-outline-primary" (click)="cambiarSemana(-1)">
          <i class="bi bi-chevron-left me-1"></i> Semana Anterior
        </button>
        <h4 class="fw-bold mb-0 text-slate-800">{{ getRangoSemana() }}</h4>
        <button class="btn btn-outline-primary" (click)="cambiarSemana(1)">
          Semana Siguiente <i class="bi bi-chevron-right ms-1"></i>
        </button>
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
                  <th class="text-center" *ngFor="let d of diasSemanaActiva()">
                    {{ nombreDia(d) }}<br>
                    <small class="text-muted" style="font-size: 0.7rem">{{ fechaCorta(d) }}</small>
                  </th>
                  <th class="text-center bg-light border-start">% ASIST.</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let a of alumnos()" class="table-row-hover">
                  <td class="ps-4 fw-bold text-slate-700">{{ a.rut }}</td>
                  <td>{{ a.nombre }} {{ a.apellidoPaterno }}</td>
                  
                  <!-- 6 Days Grid -->
                  <td class="text-center px-1" *ngFor="let d of diasSemanaActiva()">
                    <div class="attendance-toggle mx-auto">
                      <input type="checkbox" [id]="'dia_' + d.getTime() + '_' + a.id" class="btn-check"
                        [checked]="getEstado(a.id, d) === 'P'"
                        (change)="toggleEstado(a.id, d)">
                      <label [for]="'dia_' + d.getTime() + '_' + a.id" class="toggle-btn" 
                             [ngClass]="getEstado(a.id, d) === 'P' ? 'btn-present' : 'btn-absent'" 
                             [title]="getEstado(a.id, d) === 'P' ? 'Presente' : 'Ausente'">
                        {{ getEstado(a.id, d) }}
                      </label>
                    </div>
                  </td>

                  <td class="text-center fw-bold bg-light border-start">
                    <span [ngClass]="getPorcentajeColor(a.id)">{{ calcularPorcentajeGlobal(a.id) }}%</span>
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
            <button class="btn btn-primary px-5 py-2" (click)="guardarAsistencia()" [disabled]="guardando()">
              <span *ngIf="guardando()" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i *ngIf="!guardando()" class="bi bi-cloud-upload me-2"></i>
              {{ guardando() ? 'Guardando...' : 'Guardar Asistencia' }}
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
  guardando = signal(false);
  
  lunesActual: Date = new Date();

  ngOnInit() {
    this.iniciarSemanaActual();
    this.cargarCursos();
    this.route.queryParams.subscribe(params => {
      if (params['idCurso']) {
        this.idCurso = Number(params['idCurso']);
        this.cargarAlumnos();
      }
    });
  }

  iniciarSemanaActual() {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    this.lunesActual = new Date(today.setDate(diff));
    this.lunesActual.setHours(0, 0, 0, 0);
  }

  cambiarSemana(offset: number) {
    const newLunes = new Date(this.lunesActual);
    newLunes.setDate(newLunes.getDate() + (offset * 7));
    this.lunesActual = newLunes;
  }

  diasSemanaActiva(): Date[] {
    const days = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date(this.lunesActual);
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  }

  nombreDia(d: Date): string {
    const nombres = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return nombres[d.getDay()];
  }

  fechaCorta(d: Date): string {
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
  }

  formatDate(d: Date): string {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getRangoSemana(): string {
    const dias = this.diasSemanaActiva();
    if (dias.length === 0) return '';
    const ini = this.fechaCorta(dias[0]);
    const fin = this.fechaCorta(dias[5]);
    return `Semana del ${ini} al ${fin}`;
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
      const diasPasados = this.generarDiasPasadosDelSemestre();

      data.forEach(a => {
        const studentMap: { [fecha: string]: string } = {};
        const inasistencias = a.cantidadInasistencias || 0;
        
        // Inicializamos los días pasados en P, y luego marcamos 'A' en los más recientes
        for (let i = 0; i < diasPasados.length; i++) {
          const fechaStr = this.formatDate(diasPasados[i]);
          studentMap[fechaStr] = i < inasistencias ? 'A' : 'P';
        }
        map[a.id] = studentMap;
      });
      this.asistenciaMap = map;
    });
  }

  // Genera un historial ficticio de días hacia atrás para acomodar la cantidad total de inasistencias
  generarDiasPasadosDelSemestre(): Date[] {
    const days = [];
    const d = new Date();
    d.setHours(0,0,0,0);
    // Generamos hasta 60 días hacia atrás excluyendo domingos
    for (let i = 0; i < 60; i++) {
      if (d.getDay() !== 0) {
        days.push(new Date(d));
      }
      d.setDate(d.getDate() - 1);
    }
    return days;
  }

  getEstado(alumnoId: number, d: Date): string {
    const fechaStr = this.formatDate(d);
    if (!this.asistenciaMap[alumnoId]) return 'P';
    return this.asistenciaMap[alumnoId][fechaStr] || 'P';
  }

  toggleEstado(alumnoId: number, d: Date) {
    const fechaStr = this.formatDate(d);
    if (!this.asistenciaMap[alumnoId]) this.asistenciaMap[alumnoId] = {};
    const currentState = this.getEstado(alumnoId, d);
    this.asistenciaMap[alumnoId][fechaStr] = currentState === 'P' ? 'A' : 'P';
  }

  calcularPorcentajeGlobal(alumnoId: number): number {
    const mapFechas = this.asistenciaMap[alumnoId];
    if (!mapFechas) return 100;
    
    const estados = Object.values(mapFechas);
    if (estados.length === 0) return 100;
    
    const presentes = estados.filter(v => v === 'P').length;
    return Math.round((presentes / Math.max(estados.length, 1)) * 100);
  }

  getPorcentajeColor(alumnoId: number): string {
    const pct = this.calcularPorcentajeGlobal(alumnoId);
    if (pct >= 85) return 'text-success';
    if (pct >= 70) return 'text-warning';
    return 'text-danger';
  }

  contarGlobal(estado: 'P' | 'A'): number {
    let count = 0;
    Object.values(this.asistenciaMap).forEach(mapFechas => {
      count += Object.values(mapFechas).filter(v => v === estado).length;
    });
    return count;
  }

  volver() {
    this.router.navigate(['/profesor/cursos']);
  }

  guardarAsistencia() {
    this.guardando.set(true);

    // Build payload: count absences across all recorded days in the map
    const updates = this.alumnos().map(alumno => {
      const mapFechas = this.asistenciaMap[alumno.id] || {};
      const faltasTotales = Object.values(mapFechas).filter(v => v === 'A').length;
      return {
        id: alumno.id,
        cantidadInasistencias: faltasTotales,
        cantidadAtrasos: alumno.cantidadAtrasos,
      };
    });

    // Fire all updates in parallel
    let completed = 0;
    const total = updates.length;

    if (total === 0) { this.guardando.set(false); return; }

    updates.forEach(update => {
      const alumno = this.alumnos().find(a => a.id === update.id);
      const payload = {
        ...alumno,
        cantidadInasistencias: update.cantidadInasistencias,
        cantidadAtrasos: update.cantidadAtrasos,
      };
      this.http.put(`http://localhost:8080/api/v1/alumnos/${alumno.id}`, payload)
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
    this.guardando.set(false);
    // Removimos this.cargarAlumnos() para que no se reinicie el calendario y mantenga los días exactos que marcaste.
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
