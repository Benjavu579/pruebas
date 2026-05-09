import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alumno-asignaturas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in">
      <header class="mb-4 d-flex justify-content-between align-items-center border-bottom pb-3">
        <div>
          <h1 class="display-6 fw-bold mb-1">Mis Inscripciones</h1>
          <p class="text-muted mb-0">Gestiona tus asignaturas actuales.</p>
        </div>
        <button class="btn btn-primary px-4 shadow-sm" (click)="abrirModalInscripcion()">
          <i class="bi bi-plus-circle me-2"></i>Inscribir Ramo
        </button>
      </header>

      <!-- Loading state -->
      <div *ngIf="cargando()" class="text-center py-5 text-muted animate-fade-in">
        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
        Cargando inscripciones...
      </div>

      <!-- Empty state -->
      <div *ngIf="!cargando() && matriculas().length === 0" class="text-center py-5 border bg-white animate-slide-up shadow-sm">
        <i class="bi bi-book fs-1 text-muted d-block mb-3"></i>
        <h5 class="fw-bold">Sin asignaturas</h5>
        <p class="text-muted">Aún no estás inscrito en ningún curso.</p>
        <button class="btn btn-outline-primary mt-3" (click)="abrirModalInscripcion()">
          <i class="bi bi-journal-plus me-2"></i>Inscribir mi primer ramo
        </button>
      </div>

      <!-- Asignaturas Grid -->
      <div *ngIf="!cargando() && matriculas().length > 0" class="row g-4">
        <div class="col-sm-6 col-lg-4" *ngFor="let m of matriculas()">
          <div class="asignatura-card bg-white border h-100 animate-slide-up d-flex flex-column">
            <div class="card-accent"></div>
            <div class="p-4 flex-grow-1">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h5 class="fw-bold mb-0 text-slate-800">{{ m.curso?.nombre }}</h5>
                <span class="badge bg-light text-secondary border">ID: {{ m.curso?.id }}</span>
              </div>
              <p class="smaller text-muted text-uppercase mb-3 tracking-widest">
                Nivel {{ m.curso?.nivel }}°
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
            <div class="p-3 bg-light border-top d-flex gap-2">
              <button class="btn btn-sm btn-outline-secondary flex-grow-1 border fw-bold" (click)="abrirModalCambioRamo(m)">
                <i class="bi bi-shuffle me-1"></i> Cambiar Ramo
              </button>
              <button class="btn btn-sm btn-outline-danger flex-grow-1 border fw-bold" (click)="retirarRamo(m)">
                <i class="bi bi-trash me-1"></i> Retirar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Inscripción Ramo -->
      <div class="modal fade show d-block" *ngIf="mostrarModalInscripcion" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">
            <div class="modal-header bg-light border-bottom-0">
              <h5 class="modal-title fw-bold text-slate-800"><i class="bi bi-journal-plus me-2 text-primary"></i>Inscribir Nuevo Ramo</h5>
              <button type="button" class="btn-close" (click)="cerrarModalInscripcion()"></button>
            </div>
            <div class="modal-body p-4">
              <div *ngIf="cursosDisponiblesParaInscribir().length === 0" class="alert alert-info border-0 text-center">
                <i class="bi bi-info-circle me-2"></i>Ya estás inscrito en todos los ramos disponibles.
              </div>
              <div *ngIf="cursosDisponiblesParaInscribir().length > 0">
                <label class="form-label fw-bold text-uppercase smaller text-muted mb-2">Selecciona un ramo</label>
                <select class="form-select form-select-lg shadow-sm" [(ngModel)]="cursoAInscribir">
                  <option [ngValue]="null" disabled selected>-- Elige un curso --</option>
                  <option *ngFor="let c of cursosDisponiblesParaInscribir()" [value]="c.id">
                    {{ c.nombre }} ({{ c.nivel }}° Nivel)
                  </option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-top-0 bg-light">
              <button type="button" class="btn btn-light border" (click)="cerrarModalInscripcion()">Cancelar</button>
              <button type="button" class="btn btn-primary px-4 fw-bold shadow-sm" [disabled]="!cursoAInscribir || guardando()" (click)="inscribirRamo()">
                <span *ngIf="guardando()" class="spinner-border spinner-border-sm me-2"></span>
                Inscribir
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Cambio Ramo -->
      <div class="modal fade show d-block" *ngIf="mostrarModalRamo" tabindex="-1" style="background: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow">
            <div class="modal-header bg-light border-bottom-0">
              <h5 class="modal-title fw-bold text-slate-800"><i class="bi bi-shuffle me-2 text-primary"></i>Cambiar de Ramo</h5>
              <button type="button" class="btn-close" (click)="cerrarModalRamo()"></button>
            </div>
            <div class="modal-body p-4">
              <p class="mb-3 text-muted">Estás cambiando el ramo <strong class="text-dark">{{ matriculaRamoActual?.curso?.nombre }}</strong> por otro diferente.</p>
              
              <div *ngIf="ramosDisponiblesParaCambio().length === 0" class="alert alert-warning border-0">
                <i class="bi bi-exclamation-triangle me-2"></i>No hay otros ramos disponibles para cambiar.
              </div>

              <div *ngIf="ramosDisponiblesParaCambio().length > 0">
                <label class="form-label fw-bold text-uppercase smaller text-muted mb-2">Selecciona nuevo ramo</label>
                <select class="form-select form-select-lg shadow-sm" [(ngModel)]="nuevoRamoId">
                  <option [ngValue]="null" disabled selected>-- Elige un ramo --</option>
                  <option *ngFor="let c of ramosDisponiblesParaCambio()" [value]="c.id">
                    {{ c.nombre }} ({{ c.nivel }}° Nivel)
                  </option>
                </select>
              </div>
            </div>
            <div class="modal-footer border-top-0 bg-light">
              <button type="button" class="btn btn-light border" (click)="cerrarModalRamo()">Cancelar</button>
              <button type="button" class="btn btn-primary px-4 fw-bold shadow-sm" [disabled]="!nuevoRamoId || guardando()" (click)="cambiarRamo()">
                <span *ngIf="guardando()" class="spinner-border spinner-border-sm me-2"></span>
                Confirmar Cambio
              </button>
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
  todosLosCursos = signal<any[]>([]);
  cargando = signal(true);
  guardando = signal(false);

  mostrarModalInscripcion = false;
  cursoAInscribir: number | null = null;

  mostrarModalRamo = false;
  matriculaRamoActual: any = null;
  nuevoRamoId: number | null = null;

  rutUsuario = '';
  nombreUsuario = '';

  ngOnInit() {
    this.rutUsuario = localStorage.getItem('rutUsuario') || '';
    this.nombreUsuario = localStorage.getItem('nombreUsuario') || 'Estudiante';

    if (!this.rutUsuario) { this.router.navigate(['/login']); return; }

    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando.set(true);
    
    // Fetch user enrollments
    this.http.get<any[]>(`http://localhost:8080/api/v1/alumnos/rut/${this.rutUsuario}`).subscribe({
      next: data => {
        this.matriculas.set(Array.isArray(data) ? data : []);
        // Fetch all available courses
        this.http.get<any[]>('http://localhost:8080/api/v1/cursos/').subscribe({
          next: cursosData => {
            this.todosLosCursos.set(Array.isArray(cursosData) ? cursosData : []);
            this.cargando.set(false);
          },
          error: () => this.cargando.set(false)
        });
      },
      error: () => this.cargando.set(false)
    });
  }

  calcularPorcentaje(matricula: any): number {
    const faltas = matricula.cantidadInasistencias || 0;
    const presentes = Math.max(0, 6 - faltas);
    return Math.round((presentes / 6) * 100);
  }

  // --- INSCRIPCIÓN ---
  abrirModalInscripcion() {
    this.cursoAInscribir = null;
    this.mostrarModalInscripcion = true;
  }

  cerrarModalInscripcion() {
    this.mostrarModalInscripcion = false;
  }

  cursosDisponiblesParaInscribir(): any[] {
    const inscritosIds = this.matriculas().map(m => m.curso?.id).filter(id => id);
    // Para simplificar, no dejamos inscribir un curso si ya está inscrito
    return this.todosLosCursos().filter(c => !inscritosIds.includes(c.id));
  }

  inscribirRamo() {
    if (!this.cursoAInscribir) return;
    this.guardando.set(true);

    const payload = {
      rut: parseInt(this.rutUsuario, 10),
      nombre: this.nombreUsuario,
      apellidoPaterno: '',
      cantidadInasistencias: 0,
      cantidadAtrasos: 0,
      curso: { id: this.cursoAInscribir }
    };

    this.http.post('http://localhost:8080/api/v1/alumnos/', payload).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarModalInscripcion();
        this.cargarDatos();
        import('sweetalert2').then(({ default: Swal }) => {
          Swal.fire({ title: '¡Inscrito!', text: 'Te has inscrito exitosamente en el ramo.', icon: 'success', timer: 2500, showConfirmButton: false, toast: true, position: 'top-end' });
        });
      },
      error: () => this.guardando.set(false)
    });
  }

  // --- RETIRAR ---
  retirarRamo(matricula: any) {
    import('sweetalert2').then(({ default: Swal }) => {
      Swal.fire({
        title: '¿Retirar Asignatura?',
        text: `Estás a punto de retirar "${matricula.curso?.nombre}". Perderás tu registro de asistencia.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, retirar',
        cancelButtonText: 'Cancelar',
        backdrop: 'rgba(0,0,0,0.6)'
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.delete(`http://localhost:8080/api/v1/alumnos/${matricula.id}`).subscribe({
            next: () => {
              this.cargarDatos();
              Swal.fire({ title: 'Retirado', text: 'El ramo ha sido retirado.', icon: 'success', timer: 2000, showConfirmButton: false, toast: true, position: 'top-end' });
            }
          });
        }
      });
    });
  }

  // --- CAMBIO RAMO ---
  abrirModalCambioRamo(matricula: any) {
    this.matriculaRamoActual = matricula;
    this.nuevoRamoId = null;
    this.mostrarModalRamo = true;
  }

  cerrarModalRamo() {
    this.mostrarModalRamo = false;
    this.matriculaRamoActual = null;
  }

  ramosDisponiblesParaCambio(): any[] {
    if (!this.matriculaRamoActual || !this.matriculaRamoActual.curso) return [];
    
    // Obtenemos todos los cursos en los que NO está inscrito, y que tengan DIFERENTE NOMBRE
    const inscritosIds = this.matriculas().map(m => m.curso?.id).filter(id => id);
    return this.todosLosCursos().filter(c => 
      !inscritosIds.includes(c.id) && c.nombre !== this.matriculaRamoActual.curso.nombre
    );
  }

  cambiarRamo() {
    if (!this.nuevoRamoId || !this.matriculaRamoActual) return;
    this.ejecutarCambio(this.matriculaRamoActual, this.nuevoRamoId, 'Ramo Cambiado');
    this.cerrarModalRamo();
  }

  // Común para ejecutar el PUT
  ejecutarCambio(matricula: any, nuevoCursoId: number, tituloExito: string) {
    this.guardando.set(true);
    const payload = { ...matricula, curso: { id: nuevoCursoId } };

    this.http.put(`http://localhost:8080/api/v1/alumnos/${matricula.id}`, payload).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cargarDatos();
        import('sweetalert2').then(({ default: Swal }) => {
          Swal.fire({ title: tituloExito, text: 'El cambio ha sido registrado exitosamente.', icon: 'success', timer: 2500, showConfirmButton: false, toast: true, position: 'top-end' });
        });
      },
      error: () => this.guardando.set(false)
    });
  }
}
