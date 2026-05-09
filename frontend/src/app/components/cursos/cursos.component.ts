import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in">
      <header class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h2 class="display-6 fw-bold mb-0">Gestión de Cursos</h2>
        <button class="btn btn-primary" (click)="mostrarForm = !mostrarForm">
          <i class="bi bi-plus-circle me-2"></i>{{ mostrarForm ? 'Cerrar' : 'Nuevo Curso' }}
        </button>
      </header>

      <!-- Formulario Nuevo Curso -->
      <div *ngIf="mostrarForm" class="card mb-4 animate-slide-up bg-light">
        <div class="card-body p-4">
          <form (ngSubmit)="guardarCurso()" class="row g-3">
            <div class="col-md-4">
              <label class="form-label fw-bold text-uppercase smaller text-muted">Nombre del Curso</label>
              <input type="text" class="form-control" [(ngModel)]="nuevoCurso.nombre" name="nombre" placeholder="Ej: 4to Medio A" required>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold text-uppercase smaller text-muted">Nivel</label>
              <select class="form-select" [(ngModel)]="nuevoCurso.nivel" name="nivel" required>
                <option value="" disabled selected>-- Elija nivel --</option>
                <option value="Básico">Básico</option>
                <option value="Medio">Medio</option>
                <option value="Superior">Superior</option>
              </select>
            </div>
            <div class="col-md-4 d-flex align-items-end">
              <button type="submit" class="btn btn-success w-100 py-2">Guardar Curso</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lista de Cursos -->
      <div class="row g-4">
        <div *ngFor="let curso of cursos()" class="col-md-4 animate-slide-up">
          <div class="card curso-card h-100 overflow-hidden">
            <div class="card-body p-4 d-flex flex-column">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div class="badge bg-primary text-white py-2 px-3 fw-bold text-uppercase tracking-widest rounded-0">
                  <i class="bi bi-mortarboard-fill me-1"></i> Nivel {{ curso.nivel || 'N/A' }}
                </div>
                <button class="btn btn-sm btn-outline-danger border-0" (click)="eliminarCurso(curso.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
              <h3 class="h4 fw-bold text-slate-800 mb-2">{{ curso.nombre }}</h3>
              <div class="d-flex align-items-center gap-2 text-muted small mb-4 flex-grow-1">
                <i class="bi bi-people-fill"></i>
                <span>Estudiantes registrados</span>
              </div>
              
              <div class="d-flex flex-column gap-2 mt-auto border-top pt-3">
                <button class="btn btn-outline-primary w-100 py-2 d-flex justify-content-between align-items-center px-3 rounded-0" (click)="irAAsistencia(curso.id)">
                  <span><i class="bi bi-calendar-check me-2"></i>Asistencia</span>
                  <i class="bi bi-arrow-right"></i>
                </button>
                <button class="btn btn-outline-danger w-100 py-2 d-flex justify-content-between align-items-center px-3 rounded-0" (click)="irAAnotaciones(curso.id)">
                  <span><i class="bi bi-journal-text me-2"></i>Anotaciones</span>
                  <i class="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .curso-card {
      transition: all 0.2s ease;
      cursor: default;
      border-top: 3px solid var(--primary);
    }
    .curso-card:hover {
      border-color: var(--primary);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
    }
    .smaller { font-size: 0.75rem; }
    .tracking-widest { letter-spacing: 0.1em; }
    .text-slate-800 { color: var(--text-primary); }
  `]
})
export class CursosComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:8080/api/v1/cursos';

  cursos = signal<any[]>([]);
  mostrarForm = false;
  nuevoCurso = { nombre: '', nivel: '' };

  ngOnInit() {
    this.cargarCursos();
  }

  cargarCursos() {
    this.http.get<any[]>(`${this.apiUrl}/`).subscribe(data => this.cursos.set(data));
  }

  guardarCurso() {
    if (!this.nuevoCurso.nombre) return;
    this.http.post(`${this.apiUrl}/`, this.nuevoCurso).subscribe({
      next: () => {
        this.cargarCursos();
        this.nuevoCurso = { nombre: '', nivel: '' };
        this.mostrarForm = false;
        
        import('sweetalert2').then(({ default: Swal }) => {
          Swal.fire({
            title: '¡Curso Creado!',
            text: 'El curso ha sido guardado exitosamente.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
          });
        });
      },
      error: (err) => {
        import('sweetalert2').then(({ default: Swal }) => {
          Swal.fire('Error', 'No se pudo crear el curso.', 'error');
        });
      }
    });
  }

  eliminarCurso(id: number) {
    import('sweetalert2').then(({ default: Swal }) => {
      Swal.fire({
        title: '¿Eliminar este curso?',
        text: 'Se eliminarán también todos los alumnos y sus anotaciones asociadas.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        backdrop: `rgba(0,0,0,0.6)`
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.delete(`${this.apiUrl}/${id}`).subscribe({
            next: () => {
              this.cargarCursos();
              Swal.fire('¡Eliminado!', 'El curso y sus registros asociados han sido eliminados.', 'success');
            },
            error: (err) => {
              Swal.fire('Error', 'Hubo un problema al eliminar el curso.', 'error');
            }
          });
        }
      });
    });
  }

  irAAsistencia(idCurso: number) {
    this.router.navigate(['/profesor/asistencia'], { queryParams: { idCurso } });
  }

  irAAnotaciones(idCurso: number) {
    this.router.navigate(['/profesor/anotaciones'], { queryParams: { idCurso } });
  }
}
