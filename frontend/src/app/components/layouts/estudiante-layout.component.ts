import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-estudiante-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <!-- Mobile Header -->
      <header class="mobile-header d-md-none d-flex align-items-center gap-3 px-4 py-3 bg-white border-bottom border-secondary">
        <button class="btn btn-outline-secondary rounded py-1 px-2 border-0" (click)="toggleSidebar()">
          <i class="bi bi-list fs-2"></i>
        </button>
        <div class="d-flex align-items-center gap-2">
          <div class="logo-box-mobile text-white bg-primary p-1 rounded"><i class="bi bi-mortarboard-fill fs-5"></i></div>
          <span class="fw-bold fs-6 tracking-tight text-slate-800">PORTAL ALUMNO</span>
        </div>
      </header>

      <!-- Sidebar Overlay -->
      <div class="sidebar-overlay d-md-none" *ngIf="sidebarOpen" (click)="toggleSidebar()"></div>

      <!-- Sidebar -->
      <aside class="sidebar bg-white border-end d-flex flex-column" [class.open]="sidebarOpen">
        <div class="p-4 d-none d-md-block">
          <div class="d-flex align-items-center gap-2 mb-4">
            <div class="bg-primary p-2 text-white" style="border-radius: 0px;">
              <i class="bi bi-mortarboard-fill fs-4"></i>
            </div>
            <span class="fw-bold fs-5 tracking-tight text-slate-800">PORTAL ALUMNO</span>
          </div>
        </div>
        
        <nav class="nav flex-column gap-2 px-3 pt-3 pt-md-0">
          <a routerLink="/alumno/dashboard" routerLinkActive="active" class="nav-link px-3 py-3 d-flex align-items-center gap-3" (click)="closeSidebar()">
            <i class="bi bi-grid-1x2-fill"></i> Mi Resumen
          </a>
          <a routerLink="/alumno/asignaturas" routerLinkActive="active" class="nav-link px-3 py-3 d-flex align-items-center gap-3" (click)="closeSidebar()">
            <i class="bi bi-book-half"></i> Mis Inscripciones
          </a>
          <a routerLink="/alumno/anotaciones" routerLinkActive="active" class="nav-link px-3 py-3 d-flex align-items-center gap-3" (click)="closeSidebar()">
            <i class="bi bi-shield-exclamation"></i> Mis Anotaciones
          </a>
        </nav>

        <div class="mt-auto p-4 border-top">
          <div class="d-flex align-items-center gap-3 mb-3">
            <div class="avatar bg-light text-primary d-flex align-items-center justify-content-center border" style="width: 40px; height: 40px;">
              <i class="bi bi-person-fill"></i>
            </div>
            <div>
              <p class="mb-0 fw-bold small text-slate-800">{{ nombreUsuario }}</p>
              <p class="mb-0 text-muted smaller">Alumno</p>
            </div>
          </div>
          <button class="btn btn-outline-danger w-100 py-2 small fw-bold text-uppercase rounded-0 border" (click)="logout()">
            <i class="bi bi-box-arrow-left me-2"></i>Cerrar Sesión
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-shell { display: flex; flex-direction: column; min-height: 100vh; background: var(--light); }
    .logo-box-mobile { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; }
    
    .sidebar { width: 280px; position: fixed; height: 100vh; z-index: 1050; top: 0; left: 0; transition: transform 0.3s ease; }
    
    .nav-link {
      color: var(--text-muted);
      border-radius: 0px;
      transition: all 0.2s;
      border-left: 3px solid transparent;
      font-weight: 500;
    }
    .nav-link:hover {
      background: var(--light);
      color: var(--text-primary);
    }
    .nav-link.active {
      background: rgba(15, 52, 96, 0.05); /* Slight primary tint */
      color: var(--primary);
      border-left-color: var(--primary);
      font-weight: 600;
    }
    
    .sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1040; }
    .main-content { flex: 1; padding: 1.5rem; transition: margin-left 0.3s ease; overflow-y: auto; height: 100vh;}
    
    .smaller { font-size: 0.75rem; }
    .tracking-tight { letter-spacing: -0.02em; }
    .text-slate-800 { color: #1e293b; }
    .avatar { border-radius: 0px; }

    @media (max-width: 767.98px) {
      .sidebar { transform: translateX(-100%); }
      .sidebar.open { transform: translateX(0); }
      .main-content { margin-left: 0; padding: 1rem; height: auto; }
    }
    @media (min-width: 768px) {
      .app-shell { flex-direction: row; }
      .main-content { margin-left: 280px; padding: 2.5rem; }
      .sidebar { transform: translateX(0) !important; }
    }
  `]
})
export class EstudianteLayoutComponent {
  private router = inject(Router);
  sidebarOpen = false;
  nombreUsuario = localStorage.getItem('nombreUsuario') || 'Estudiante';

  logout() {
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('rutUsuario');
    this.router.navigate(['/']);
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar() {
    if (window.innerWidth < 768) {
      this.sidebarOpen = false;
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth >= 768) {
      this.sidebarOpen = false;
    }
  }
}
