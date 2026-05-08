import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alumno-anotaciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-fade-in">
      <header class="mb-4 pb-3 border-bottom">
        <h1 class="display-6 fw-bold mb-1">Mis Anotaciones</h1>
        <p class="text-muted mb-0">Registro de observaciones disciplinarias en tu hoja de vida.</p>
      </header>

      <!-- Loading state -->
      <div *ngIf="cargando()" class="text-center py-5 text-muted animate-fade-in">
        <div class="spinner-border spinner-border-sm me-2" role="status"></div>
        Cargando anotaciones...
      </div>

      <!-- Tabla de anotaciones -->
      <div *ngIf="!cargando()" class="card bg-white border animate-slide-up">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light">
              <tr>
                <th class="px-4 py-3 smaller text-uppercase text-muted border-0 border-bottom">Fecha</th>
                <th class="py-3 smaller text-uppercase text-muted border-0 border-bottom">Asignatura</th>
                <th class="py-3 smaller text-uppercase text-muted border-0 border-bottom">Gravedad</th>
                <th class="py-3 smaller text-uppercase text-muted border-0 border-bottom">Subtipo</th>
                <th class="py-3 smaller text-uppercase text-muted border-0 border-bottom">Descripción</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let a of anotaciones()">
                <td class="px-4 py-3 text-nowrap fw-medium">{{ a.fecha }}</td>
                <td class="py-3 fw-bold text-slate-700">{{ a.alumno?.curso?.nombre || 'General' }}</td>
                <td class="py-3">
                  <span class="badge rounded-0 px-3 py-2 border" [ngClass]="{
                    'border-danger text-danger bg-white': a.tipo === 'GRAVISIMA',
                    'border-warning text-warning bg-white': a.tipo === 'GRAVE',
                    'border-primary text-primary bg-white': a.tipo === 'LEVE'
                  }">{{ a.tipo }}</span>
                </td>
                <td class="py-3 fw-semibold">{{ a.subtipo }}</td>
                <td class="py-3 text-muted small">{{ a.descripcion }}</td>
              </tr>
              <tr *ngIf="anotaciones().length === 0">
                <td colspan="5" class="text-center py-5">
                  <i class="bi bi-check-circle fs-1 text-success d-block mb-2"></i>
                  <p class="fw-bold mb-1">¡Sin anotaciones!</p>
                  <p class="text-muted small mb-0">No tienes observaciones registradas en tu hoja de vida.</p>
                </td>
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
export class AlumnoAnotacionesComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  anotaciones = signal<any[]>([]);
  cargando = signal(true);

  ngOnInit() {
    const rut = localStorage.getItem('rutUsuario');
    if (!rut) { this.router.navigate(['/login']); return; }

    this.http.get<any[]>(`http://localhost:8080/api/v1/anotaciones/rut/${rut}`)
      .subscribe({
        next: data => {
          data.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
          this.anotaciones.set(data);
          this.cargando.set(false);
        },
        error: () => { this.cargando.set(false); }
      });
  }
}
