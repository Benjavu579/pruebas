import { Component, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profesor-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-shell">
      <!-- Mobile Header -->
      <header class="mobile-header d-md-none d-flex align-items-center gap-3 px-4 py-3 bg-dark text-white border-bottom border-secondary">
        <button class="btn btn-outline-light rounded py-1 px-2 border-0" (click)="toggleSidebar()">
          <i class="bi bi-list fs-2"></i>
        </button>
        <div class="d-flex align-items-center gap-2">
          <div class="logo-box-mobile rounded"><i class="bi bi-shield-check"></i></div>
          <span class="fw-bold fs-6">PANEL PROFESOR</span>
        </div>
      </header>

      <!-- Sidebar Overlay -->
      <div class="sidebar-overlay d-md-none" *ngIf="sidebarOpen" (click)="toggleSidebar()"></div>

      <aside class="sidebar" [class.open]="sidebarOpen">
        <div class="sidebar-header d-none d-md-flex">
          <div class="logo-box"><i class="bi bi-shield-check"></i></div>
          <span class="brand-name fw-bold">PANEL PROFESOR</span>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="cursos" routerLinkActive="active" class="nav-item" (click)="closeSidebar()">
            <i class="bi bi-grid-1x2"></i><span>Cursos</span>
          </a>
          <a routerLink="estudiantes" routerLinkActive="active" class="nav-item" (click)="closeSidebar()">
            <i class="bi bi-people"></i><span>Alumnos</span>
          </a>
          <a routerLink="asistencia" routerLinkActive="active" class="nav-item" (click)="closeSidebar()">
            <i class="bi bi-calendar-check"></i><span>Asistencia</span>
          </a>
          <a routerLink="anotaciones" routerLinkActive="active" class="nav-item" (click)="closeSidebar()">
            <i class="bi bi-shield-exclamation"></i><span>Anotaciones</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <div class="d-flex align-items-center gap-3 px-4 mb-3">
            <div class="avatar bg-primary text-white d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; font-size: 0.8rem;">
              <i class="bi bi-person-fill"></i>
            </div>
            <div class="overflow-hidden">
              <p class="mb-0 fw-bold small text-white text-truncate">{{ nombreUsuario }}</p>
              <p class="mb-0 text-white-50" style="font-size: 0.7rem;">Administrador</p>
            </div>
          </div>
          <button class="btn btn-link text-white-50 text-decoration-none rounded-0 w-100 text-start ps-4" routerLink="/" (click)="logout()">
            <i class="bi bi-box-arrow-left me-2"></i>Cerrar Sesión
          </button>
        </div>
      </aside>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-shell { display: flex; flex-direction: column; min-height: 100vh; background: var(--light); }
    .logo-box-mobile { width: 32px; height: 32px; background: var(--primary); display: flex; align-items: center; justify-content: center; }
    
    .sidebar { width: 280px; background: var(--dark); color: white; display: flex; flex-direction: column; position: fixed; height: 100vh; z-index: 1050; border-right: 1px solid rgba(255,255,255,0.05); top: 0; left: 0; transition: transform 0.3s ease; }
    .sidebar-header { padding: 2rem; display: flex; align-items: center; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .logo-box { width: 40px; height: 40px; background: var(--primary); display: flex; align-items: center; justify-content: center; }
    .sidebar-nav { flex: 1; padding: 1rem 0; display: flex; flex-direction: column; gap: 0.25rem; overflow-y: auto; }
    .nav-item { display: flex; align-items: center; gap: 1rem; padding: 1rem 2rem; color: #94a3b8; text-decoration: none; transition: all 0.2s; border-left: 3px solid transparent; }
    .nav-item:hover { color: white; background: rgba(255,255,255,0.05); }
    .nav-item.active { background: rgba(255,255,255,0.05); color: white; border-left-color: var(--accent); font-weight: 600; }
    
    .sidebar-footer { border-top: 1px solid rgba(255,255,255,0.05); padding: 1rem 0; margin-top: auto; }
    .sidebar-footer .btn-link { font-weight: 500; font-size: 0.9rem; text-transform: none; letter-spacing: normal; }
    .sidebar-footer .btn-link:hover { color: white !important; background: rgba(255,255,255,0.05); }
    
    .sidebar-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1040; }
    .main-content { flex: 1; padding: 1.5rem; transition: margin-left 0.3s ease; }

    @media (max-width: 767.98px) {
      .sidebar { transform: translateX(-100%); }
      .sidebar.open { transform: translateX(0); }
      .main-content { margin-left: 0; padding: 1rem; }
    }
    @media (min-width: 768px) {
      .app-shell { flex-direction: row; }
      .main-content { margin-left: 280px; padding: 2.5rem; }
      .sidebar { transform: translateX(0) !important; }
    }
  `]
})
export class ProfesorLayoutComponent {
  sidebarOpen = false;
  nombreUsuario = localStorage.getItem('nombreUsuario') || 'Profesor';

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout() {
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('rutUsuario');
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
