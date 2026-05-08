import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-anotaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="animate-fade-in">
      <header class="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
        <h2 class="display-6 fw-bold mb-0">Gestión de Anotaciones</h2>
        <button class="btn btn-primary px-4" (click)="mostrarForm = !mostrarForm">
          <i class="bi bi-plus-circle me-2"></i>{{ mostrarForm ? 'Cerrar' : 'Nueva Anotación' }}
        </button>
      </header>

      <!-- Selector de Curso General -->
      <div class="card mb-4 border animate-slide-up">
        <div class="card-body p-4 bg-light border-0">
          <div class="row align-items-center">
            <div class="col-md-6">
              <label class="form-label fw-bold text-uppercase smaller text-muted">Curso Activo (Filtro)</label>
              <select class="form-select form-select-lg rounded-0 border-0 shadow-sm" [(ngModel)]="idCursoActivo" (change)="onCursoChange()">
                <option [ngValue]="null" selected>Todos los cursos</option>
                <option *ngFor="let c of cursos()" [value]="c.id">{{ c.nombre }} ({{ c.nivel }}° Nivel)</option>
              </select>
            </div>
            <div class="col-md-6 text-md-end mt-3 mt-md-0" *ngIf="idCursoActivo">
              <span class="badge bg-primary px-3 py-2 rounded-0 tracking-widest text-uppercase">
                <i class="bi bi-people-fill me-1"></i> {{ getAlumnosParaCursoActivo().length }} Estudiantes disponibles
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Formulario Nueva Anotación -->
      <div *ngIf="mostrarForm" class="card mb-4 border animate-slide-up bg-light">
        <div class="card-body p-4">
          <div *ngIf="!idCursoActivo" class="alert alert-warning mb-0 border rounded-0 d-flex align-items-center">
            <i class="bi bi-exclamation-triangle-fill me-2 fs-5"></i>Seleccione un curso específico en el panel superior para registrar una nueva anotación.
          </div>
          
          <form *ngIf="idCursoActivo" (ngSubmit)="guardarAnotacion()" class="row g-3">
            <div class="col-md-4">
              <label class="form-label fw-bold text-uppercase smaller text-muted">Alumno</label>
              <select class="form-select rounded-0" [(ngModel)]="nuevaAnotacion.id_alumno" name="alumno" required>
                <option [ngValue]="null" disabled selected>-- Seleccione estudiante --</option>
                <!-- Solo mostramos alumnos que tengan ID para este curso -->
                <option *ngFor="let a of getAlumnosParaCursoActivo()" [value]="getIdParaCursoActivo(a)">{{ a.rut }} - {{ a.nombre }} {{ a.apellidoPaterno }}</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold text-uppercase smaller text-muted">Gravedad</label>
              <select class="form-select rounded-0" [(ngModel)]="nuevaAnotacion.tipo" name="tipo" required>
                <option value="LEVE">LEVE</option>
                <option value="GRAVE">GRAVE</option>
                <option value="GRAVISIMA">GRAVISIMA</option>
              </select>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold text-uppercase smaller text-muted">Subtipo</label>
              <input type="text" class="form-control rounded-0" [(ngModel)]="nuevaAnotacion.subtipo" name="subtipo" placeholder="Ej: Uso de celular" required>
            </div>
            <div class="col-12">
              <label class="form-label fw-bold text-uppercase smaller text-muted">Descripción Detallada</label>
              <textarea class="form-control rounded-0" [(ngModel)]="nuevaAnotacion.descripcion" name="descripcion" rows="3" placeholder="Detalles de la falta..."></textarea>
            </div>
            <div class="col-md-4">
              <label class="form-label fw-bold text-uppercase smaller text-muted">Fecha</label>
              <input type="date" class="form-control rounded-0" [(ngModel)]="nuevaAnotacion.fecha" name="fecha" required>
            </div>
            <div class="col-md-8 d-flex align-items-end">
              <button type="submit" class="btn btn-success w-100 py-2 fw-bold" [disabled]="!nuevaAnotacion.id_alumno">Registrar en Hoja de Vida</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Lista de Estudiantes con Anotaciones -->
      <div class="card border rounded-0 overflow-hidden shadow-sm">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 table-bordered border-0">
            <thead class="bg-light">
              <tr>
                <th class="px-4 py-3 border-0 border-bottom text-muted smaller text-uppercase">RUT</th>
                <th class="py-3 border-0 border-bottom text-muted smaller text-uppercase">Nombre Completo</th>
                <th class="py-3 border-0 border-bottom text-muted smaller text-uppercase">Cursos</th>
                <th class="py-3 border-0 border-bottom text-center text-muted smaller text-uppercase">Anotaciones</th>
                <th class="py-3 border-0 border-bottom text-muted smaller text-uppercase text-end pe-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of alumnosAgrupados()">
                <td class="px-4 py-3 fw-bold text-slate-700 border-bottom-0">{{ a.rut }}</td>
                <td class="py-3 border-bottom-0">{{ a.nombre }} {{ a.apellidoPaterno }}</td>
                <td class="py-3 border-bottom-0">
                  <span *ngFor="let m of a.matriculas" class="badge bg-light text-secondary border me-1">{{ m.curso?.nombre }}</span>
                </td>
                <td class="py-3 border-bottom-0 text-center">
                  <span *ngIf="a.anotaciones.length > 0" class="badge bg-danger px-3 py-2">
                    {{ a.anotaciones.length }} Anotaciones
                  </span>
                  <span *ngIf="a.anotaciones.length === 0" class="badge bg-success px-3 py-2 text-white">
                    Sin Anotaciones
                  </span>
                </td>
                <td class="py-3 text-end pe-4 border-bottom-0">
                  <button class="btn btn-sm btn-outline-primary rounded-0 border" (click)="verDetalleAnotaciones(a)" title="Ver Detalle">
                    <i class="bi bi-info-circle me-1"></i> Información
                  </button>
                </td>
              </tr>
              <tr *ngIf="alumnosAgrupados().length === 0">
                <td colspan="5" class="text-center py-4 text-muted border-bottom-0">No hay estudiantes para mostrar.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .smaller { font-size: 0.75rem; }
    .tracking-widest { letter-spacing: 0.1em; }
    .text-slate-700 { color: var(--text-primary); }
  `]
})
export class AnotacionesComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  anotaciones = signal<any[]>([]);
  cursos = signal<any[]>([]);
  alumnosAgrupados = signal<any[]>([]); // Para la tabla (filtrados con anotaciones)
  alumnosCompletos = signal<any[]>([]); // Para el menú desplegable (todos)
  mostrarForm = false;
  idCursoActivo: number | null = null;
  
  nuevaAnotacion = {
    id_alumno: null as number | null,
    tipo: 'LEVE',
    subtipo: '',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0]
  };

  ngOnInit() {
    this.cargarCursos();
    this.cargarDatosGlobales();
    this.route.queryParams.subscribe(params => {
      if (params['idCurso']) {
        this.idCursoActivo = Number(params['idCurso']);
      }
    });
  }

  cargarCursos() {
    this.http.get<any[]>('http://localhost:8080/api/v1/cursos/').subscribe(data => this.cursos.set(data));
  }

  cargarDatosGlobales() {
    this.http.get<any[]>('http://localhost:8080/api/v1/alumnos/').subscribe(alumnosData => {
      this.http.get<any[]>('http://localhost:8080/api/v1/anotaciones/').subscribe(anotacionesData => {
         this.procesarDatos(alumnosData, anotacionesData);
      });
    });
  }

  procesarDatos(alumnos: any[], anotaciones: any[]) {
      const groupedMap = new Map<number, any>();
      alumnos.forEach(a => {
        if (!groupedMap.has(a.rut)) {
          groupedMap.set(a.rut, {
            ...a,
            matriculas: a.curso ? [{ id: a.id, curso: a.curso }] : [],
            anotaciones: []
          });
        } else {
          const existing = groupedMap.get(a.rut);
          if (a.curso) {
             existing.matriculas.push({ id: a.id, curso: a.curso });
          }
        }
      });

      // Asociar anotaciones
      anotaciones.forEach(anot => {
        if (anot.alumno && anot.alumno.rut) {
          const student = groupedMap.get(anot.alumno.rut);
          if (student) {
             student.anotaciones.push(anot);
          }
        }
      });

      const todosLosAlumnos = Array.from(groupedMap.values());
      this.alumnosCompletos.set(todosLosAlumnos); // Para el selector de nueva anotación
      
      let resultado = [...todosLosAlumnos];
      
      // Filtrar alumnos que tengan al menos una anotación globalmente
      resultado = resultado.filter(s => s.anotaciones.length > 0);

      // Si hay un curso activo, filtramos la vista
      if (this.idCursoActivo) {
         const idActivo = Number(this.idCursoActivo);
         
         // Filtramos estudiantes que pertenezcan al curso activo
         resultado = resultado.filter(s => s.matriculas.some((m:any) => m.curso && m.curso.id === idActivo));
         
         // Filtramos las anotaciones internas para que solo salgan las de la asignatura activa
         resultado.forEach(s => {
            s.anotaciones = s.anotaciones.filter((anot: any) => anot.alumno?.curso?.id === idActivo);
         });

         // Tras limpiar las anotaciones de otras materias, removemos a los estudiantes que quedaron con 0 anotaciones
         resultado = resultado.filter(s => s.anotaciones.length > 0);
      }
      
      this.alumnosAgrupados.set(resultado); // Para la tabla visual
  }

  onCursoChange() {
    this.cargarDatosGlobales();
    this.nuevaAnotacion.id_alumno = null;
  }

  getAlumnosParaCursoActivo(): any[] {
    if (!this.idCursoActivo) return [];
    return this.alumnosCompletos().filter(a => this.getIdParaCursoActivo(a) !== null);
  }

  getIdParaCursoActivo(alumnoAgrupado: any): number | null {
    if (!this.idCursoActivo) return null;
    const idActivo = Number(this.idCursoActivo);
    const mat = alumnoAgrupado.matriculas.find((m: any) => m.curso && m.curso.id === idActivo);
    return mat ? mat.id : null;
  }

  guardarAnotacion() {
    if (!this.nuevaAnotacion.id_alumno) return;
    
    const payload = {
      ...this.nuevaAnotacion,
      alumno: { id: this.nuevaAnotacion.id_alumno }
    };
    
    this.http.post('http://localhost:8080/api/v1/anotaciones/', payload).subscribe(() => {
      this.cargarDatosGlobales();
      this.mostrarForm = false;
      this.nuevaAnotacion = {
        id_alumno: null,
        tipo: 'LEVE',
        subtipo: '',
        descripcion: '',
        fecha: new Date().toISOString().split('T')[0]
      };
      import('sweetalert2').then(({ default: Swal }) => {
        Swal.fire({
          title: '¡Guardada!',
          text: 'La anotación se ha guardado con éxito.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      });
    });
  }

  verDetalleAnotaciones(alumno: any) {
    import('sweetalert2').then(({ default: Swal }) => {
      let htmlContent = `<div class="text-start mt-3">`;

      if (alumno.anotaciones.length === 0) {
        htmlContent += `
          <div class="text-center py-4">
            <i class="bi bi-check-circle text-success" style="font-size: 3rem;"></i>
            <h5 class="mt-3 fw-bold">Sin Anotaciones</h5>
            <p class="text-muted mb-0">Este estudiante no registra faltas conductuales actualmente.</p>
          </div>
        `;
      } else {
        // Group annotations by course name
        const anotacionesPorCurso = new Map<string, any[]>();
        alumno.anotaciones.forEach((anot: any) => {
          const courseName = anot.alumno?.curso?.nombre || 'General';
          if (!anotacionesPorCurso.has(courseName)) {
            anotacionesPorCurso.set(courseName, []);
          }
          anotacionesPorCurso.get(courseName)?.push(anot);
        });

        anotacionesPorCurso.forEach((anotacionesList, courseName) => {
          htmlContent += `<h6 class="fw-bold mt-4 mb-3 text-primary border-bottom pb-2"><i class="bi bi-journal-bookmark me-2"></i>Asignatura: ${courseName}</h6>`;
          
          anotacionesList.forEach((a: any) => {
            let badgeColor = 'bg-primary';
            if (a.tipo === 'GRAVE') badgeColor = 'bg-warning text-dark';
            if (a.tipo === 'GRAVISIMA') badgeColor = 'bg-danger';

            htmlContent += `
              <div class="card mb-3 border-0 shadow-sm bg-light">
                <div class="card-body p-3">
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge ${badgeColor}">${a.tipo}</span>
                    <span class="small text-muted fw-bold"><i class="bi bi-calendar-event me-1"></i>${a.fecha}</span>
                  </div>
                  <h6 class="fw-bold mb-1">${a.subtipo}</h6>
                  <p class="small text-muted mb-3" style="line-height: 1.4;">${a.descripcion || 'Sin descripción detallada.'}</p>
                  <div class="text-end">
                    <button class="btn btn-sm btn-outline-danger py-0 px-2" onclick="window.eliminarAnotacion(${a.id})" title="Eliminar Anotación">
                      <i class="bi bi-trash"></i> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            `;
          });
        });
      }

      htmlContent += `</div>`;

      // Assign the delete function to the global window object so the HTML button can trigger it
      (window as any).eliminarAnotacion = (id: number) => {
        Swal.close();
        this.eliminar(id);
      };

      Swal.fire({
        title: `Hoja de Vida: ${alumno.nombre} ${alumno.apellidoPaterno}`,
        html: htmlContent,
        width: '550px',
        showCloseButton: true,
        showConfirmButton: false,
        backdrop: 'rgba(0,0,0,0.6)'
      });
    });
  }

  eliminar(id: number) {
    import('sweetalert2').then(({ default: Swal }) => {
      Swal.fire({
        title: '¿Eliminar anotación?',
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        backdrop: 'rgba(0,0,0,0.6)'
      }).then((result) => {
        if (result.isConfirmed) {
          this.http.delete(`http://localhost:8080/api/v1/anotaciones/${id}`).subscribe(() => {
            this.cargarDatosGlobales();
            Swal.fire({
              title: '¡Eliminada!',
              text: 'La anotación ha sido borrada.',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
              toast: true,
              position: 'top-end'
            });
          });
        }
      });
    });
  }
}



