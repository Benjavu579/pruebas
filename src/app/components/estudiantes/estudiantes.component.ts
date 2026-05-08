import { Component, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in">
      <header class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h2 class="display-6 fw-bold mb-0">Base de Estudiantes</h2>
        <button class="btn btn-primary px-4" (click)="abrirFormularioCrear()">
          <i class="bi bi-person-plus me-2"></i>{{ mostrarForm ? 'Cerrar' : 'Inscribir Estudiante' }}
        </button>
      </header>

      <!-- Formulario para agregar/editar Alumno -->
      <div *ngIf="mostrarForm" class="card mb-4 border animate-slide-up bg-light">
        <div class="card-body p-4">
          <form (ngSubmit)="guardarAlumno()" class="row g-3">
            <div class="col-md-3">
              <label class="form-label fw-bold text-uppercase smaller text-muted">RUT</label>
              <input type="number" class="form-control" [(ngModel)]="alumnoForm.rut" name="rut" placeholder="Ej: 11111111" required [disabled]="modoEdicion">
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold text-uppercase smaller text-muted">Nombre</label>
              <input type="text" class="form-control" [(ngModel)]="alumnoForm.nombre" name="nombre" placeholder="Nombre" required [disabled]="modoEdicion">
            </div>
            <div class="col-md-5">
              <label class="form-label fw-bold text-uppercase smaller text-muted">Apellido Paterno</label>
              <input type="text" class="form-control" [(ngModel)]="alumnoForm.apellidoPaterno" name="apellidoPaterno" placeholder="Apellido" [disabled]="modoEdicion">
            </div>
            
            <!-- Inscribir Estudiante Nuevo -->
            <div class="col-md-6 mt-4" *ngIf="!modoEdicion">
              <label class="form-label fw-bold text-uppercase smaller text-muted">Curso Inicial a Asignar</label>
              <select class="form-select" [(ngModel)]="alumnoForm.cursoId" name="cursoId" required>
                <option [ngValue]="null" disabled selected>-- Elija un curso --</option>
                <option *ngFor="let c of cursos()" [value]="c.id">{{ c.nombre }}</option>
              </select>
            </div>
            <div class="col-6 text-end mt-4 d-flex align-items-end justify-content-end" *ngIf="!modoEdicion">
              <button type="submit" class="btn btn-success px-5 py-2 fw-bold" [disabled]="submitting() || !alumnoForm.rut || !alumnoForm.cursoId">
                <i class="bi bi-check-circle me-1"></i> {{ submitting() ? 'Guardando...' : 'Inscribir Estudiante' }}
              </button>
            </div>

            <!-- Inscribir a Otro Curso (Edición) -->
            <div class="col-12 mt-4 pt-3 border-top" *ngIf="modoEdicion">
              <h6 class="fw-bold mb-3 text-primary"><i class="bi bi-plus-circle me-2"></i>Inscribir a otro ramo</h6>
              <div class="d-flex gap-3 align-items-center">
                <div class="flex-grow-1">
                  <select class="form-select" [(ngModel)]="alumnoForm.cursoId" name="cursoNuevoId">
                    <option [ngValue]="null" disabled selected>-- Seleccione el ramo a inscribir --</option>
                    <option *ngFor="let c of cursos()" [value]="c.id" [disabled]="yaInscrito(c.id)">
                      {{ c.nombre }} ({{ c.nivel }}° Nivel) {{ yaInscrito(c.id) ? '— Ya inscrito' : '' }}
                    </option>
                  </select>
                </div>
                <button type="button" class="btn btn-success px-4 py-2 fw-bold" (click)="inscribirEnNuevoCurso()" [disabled]="submitting() || !alumnoForm.cursoId">
                  <i class="bi bi-journal-plus me-1"></i> Inscribir a Ramo
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- Tabla de Estudiantes General -->
      <div class="card border rounded-0 overflow-hidden animate-slide-up">
        <div class="table-responsive">
          <table class="table table-hover mb-0 align-middle table-bordered border-0">
            <thead class="bg-light">
              <tr>
                <th class="ps-4 py-3 border-0 border-bottom text-muted smaller text-uppercase">RUT</th>
                <th class="py-3 border-0 border-bottom text-muted smaller text-uppercase">Nombre Completo</th>
                <th class="py-3 border-0 border-bottom text-muted smaller text-uppercase">Curso Asignado</th>
                <th class="py-3 border-0 border-bottom text-center text-muted smaller text-uppercase">Inasistencias</th>
                <th class="py-3 border-0 border-bottom text-end pe-4 text-muted smaller text-uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <!-- Mostramos todos los estudiantes inscritos en cualquier curso -->
              <tr *ngFor="let a of alumnos()">
                <td class="ps-4 fw-bold text-slate-700 border-bottom-0">{{ a.rut }}</td>
                <td class="fw-semibold border-bottom-0">{{ a.nombre }} {{ a.apellidoPaterno }}</td>
                <td class="border-bottom-0">
                  <span *ngFor="let c of a.cursosRelacionados" class="badge border border-primary text-primary bg-white px-2 py-1 rounded-0 me-1 mb-1">
                    {{ c.nombre }}
                  </span>
                  <span *ngIf="a.cursosRelacionados?.length === 0" class="text-muted">N/A</span>
                </td>
                <td class="text-center border-bottom-0">
                  <div class="d-flex flex-column align-items-center">
                    <div class="mb-1">
                      <span class="text-danger fw-bold" title="Inasistencias"><i class="bi bi-calendar-x"></i> {{ a.cantidadInasistencias || 0 }}</span>
                    </div>
                    <button class="btn btn-sm btn-link text-decoration-none smaller p-0 m-0" (click)="verDetalleAsistencia(a)">
                      <i class="bi bi-info-circle me-1"></i>Información
                    </button>
                  </div>
                </td>
                <td class="text-end pe-4 border-bottom-0">
                  <button class="btn btn-sm btn-light border rounded-0 me-2 text-primary" title="Editar" (click)="editar(a)"><i class="bi bi-pencil"></i></button>
                  <button class="btn btn-sm btn-light border rounded-0 text-danger" title="Eliminar" (click)="eliminar(a)"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
              <tr *ngIf="alumnos().length === 0">
                <td colspan="5" class="text-center py-5 text-muted border-bottom-0">No hay estudiantes registrados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .smaller { font-size: 0.75rem; }
    .text-slate-700 { color: var(--text-primary); }
  `]
})
export class EstudiantesComponent implements OnInit {
  private http = inject(HttpClient);
  
  alumnos = signal<any[]>([]);
  cursos = signal<any[]>([]);
  mostrarForm = false;
  modoEdicion = false;
  idEdicion: number | null = null;
  submitting = signal(false);

  // Modelo temporal para inscribir o editar a un estudiante
  alumnoForm = { rut: null as number | null, nombre: '', apellidoPaterno: '', cursoId: null as number | null };

  alumnoEditando: any = null;

  ngOnInit() {
    this.cargarAlumnos();
    this.cargarCursos();
  }

  cargarAlumnos() {
    this.http.get<any[]>('http://localhost:8080/api/v1/alumnos/').subscribe(data => {
      const groupedMap = new Map<number, any>();
      data.forEach(a => {
        if (groupedMap.has(a.rut)) {
          const existing = groupedMap.get(a.rut);
          if (a.curso) {
            // Verificar si el curso ya está agregado para evitar duplicados visuales en la misma fila
            const cursoYaExiste = existing.cursosRelacionados.some((c: any) => c.id === a.curso.id);
            if (!cursoYaExiste) {
              existing.cursosRelacionados.push({
                ...a.curso,
                inasistencias: a.cantidadInasistencias || 0
              });
            }
          }
          existing.cantidadInasistencias += (a.cantidadInasistencias || 0);
          existing.ids.push(a.id);
        } else {
          groupedMap.set(a.rut, {
            ...a,
            cursosRelacionados: a.curso ? [{
              ...a.curso,
              inasistencias: a.cantidadInasistencias || 0
            }] : [],
            ids: [a.id]
          });
        }
      });
      this.alumnos.set(Array.from(groupedMap.values()));
    });
  }

  cargarCursos() {
    this.http.get<any[]>('http://localhost:8080/api/v1/cursos/').subscribe(data => this.cursos.set(data));
  }

  abrirFormularioCrear() {
    if (this.mostrarForm && !this.modoEdicion) {
      this.mostrarForm = false;
    } else {
      this.mostrarForm = true;
      this.modoEdicion = false;
      this.idEdicion = null;
      this.alumnoEditando = null;
      this.alumnoForm = { rut: null, nombre: '', apellidoPaterno: '', cursoId: null };
    }
  }

  editar(alumno: any) {
    this.mostrarForm = true;
    this.modoEdicion = true;
    this.idEdicion = alumno.id;
    this.alumnoEditando = alumno; // Guardamos el estudiante completo
    this.alumnoForm = {
      rut: alumno.rut,
      nombre: alumno.nombre,
      apellidoPaterno: alumno.apellidoPaterno,
      cursoId: null // Se deja en null para que escoja un nuevo ramo
    };
  }

  yaInscrito(cursoId: number): boolean {
    if (!this.alumnoEditando || !this.alumnoEditando.cursosRelacionados) return false;
    return this.alumnoEditando.cursosRelacionados.some((c: any) => c.id === cursoId);
  }

  inscribirEnNuevoCurso() {
    if (!this.alumnoForm.cursoId || !this.alumnoForm.rut) return;
    this.submitting.set(true);

    const payload = {
      rut: this.alumnoForm.rut,
      nombre: this.alumnoForm.nombre,
      apellidoPaterno: this.alumnoForm.apellidoPaterno,
      cantidadInasistencias: 0,
      curso: { id: this.alumnoForm.cursoId }
    };

    this.http.post('http://localhost:8080/api/v1/alumnos/', payload).subscribe(() => {
      this.submitting.set(false);
      this.mostrarForm = false;
      this.alumnoForm.cursoId = null;
      this.cargarAlumnos();
      
      import('sweetalert2').then(({ default: Swal }) => {
        Swal.fire({
          title: '¡Nueva Asignatura Añadida!',
          text: 'El alumno ha sido matriculado en el ramo seleccionado.',
          icon: 'success',
          timer: 2500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      });
    });
  }

  verDetalleAsistencia(alumno: any) {
    import('sweetalert2').then(({ default: Swal }) => {
      let htmlContent = `<div class="text-start mt-3">`;
      
      if (!alumno.cursosRelacionados || alumno.cursosRelacionados.length === 0) {
        htmlContent += `<p class="text-muted text-center py-3">El alumno no está inscrito en ningún curso.</p>`;
      } else {
        alumno.cursosRelacionados.forEach((curso: any) => {
          const porcentaje = Math.max(0, 100 - (curso.inasistencias * 2));
          let colorClass = 'bg-success';
          if (porcentaje < 85) colorClass = 'bg-warning';
          if (porcentaje < 70) colorClass = 'bg-danger';

          htmlContent += `
            <div class="mb-3 p-3 border rounded bg-light">
              <h6 class="fw-bold mb-2 text-primary">${curso.nombre} <span class="text-muted fw-normal small">(${curso.nivel}° Nivel)</span></h6>
              <div class="d-flex justify-content-between small mb-2 pb-2 border-bottom">
                <span class="text-muted"><i class="bi bi-calendar-x text-danger me-1"></i> Faltas: ${curso.inasistencias}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-1">
                <span class="small fw-semibold text-muted text-uppercase" style="font-size: 0.7rem; letter-spacing: 0.05em;">Asistencia Calculada</span>
                <span class="small fw-bold">${porcentaje}%</span>
              </div>
              <div class="progress" style="height: 6px; border-radius: 3px;">
                <div class="progress-bar ${colorClass}" role="progressbar" style="width: ${porcentaje}%"></div>
              </div>
            </div>
          `;
        });
      }
      
      htmlContent += `</div>`;

      Swal.fire({
        title: `Detalle de Asistencia`,
        html: htmlContent,
        width: '450px',
        showCloseButton: true,
        showConfirmButton: false,
        backdrop: 'rgba(0,0,0,0.6)'
      });
    });
  }

  guardarAlumno() {
    // Si estamos en modo creación normal
    if (!this.alumnoForm.rut || !this.alumnoForm.nombre || !this.alumnoForm.cursoId) return;
    this.submitting.set(true);

    const payload: any = {
      rut: this.alumnoForm.rut,
      nombre: this.alumnoForm.nombre,
      apellidoPaterno: this.alumnoForm.apellidoPaterno,
      curso: { id: this.alumnoForm.cursoId },
      cantidadInasistencias: 0
    };

    this.http.post('http://localhost:8080/api/v1/alumnos/', payload).subscribe(() => {
      this.submitting.set(false);
      this.alumnoForm = { rut: null, nombre: '', apellidoPaterno: '', cursoId: null };
      this.mostrarForm = false;
      this.modoEdicion = false;
      this.idEdicion = null;
      this.cargarAlumnos();
      import('sweetalert2').then(({ default: Swal }) => {
        Swal.fire({
          title: '¡Guardado!',
          text: 'El estudiante ha sido guardado con éxito.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      });
    });
  }

  eliminar(alumnoAgrupado: any) {
    import('sweetalert2').then(({ default: Swal }) => {
      Swal.fire({
        title: '¿Eliminar estudiante?',
        text: 'Se eliminará de la base de datos y de todos sus cursos inscritos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        backdrop: 'rgba(0,0,0,0.6)'
      }).then((result) => {
        if (result.isConfirmed) {
          let completados = 0;
          const total = alumnoAgrupado.ids.length;
          
          if (total === 0) return;

          alumnoAgrupado.ids.forEach((id: number) => {
            this.http.delete(`http://localhost:8080/api/v1/alumnos/${id}`).subscribe({
              next: () => {
                completados++;
                if (completados === total) {
                  this.cargarAlumnos();
                  Swal.fire('¡Eliminado!', 'El estudiante ha sido borrado de todos los cursos.', 'success');
                }
              },
              error: () => {
                completados++;
                if (completados === total) {
                  this.cargarAlumnos();
                  Swal.fire('Atención', 'Proceso completado, pero algunos registros fallaron.', 'warning');
                }
              }
            });
          });
        }
      });
    });
  }
}
