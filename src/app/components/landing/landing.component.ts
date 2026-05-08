import { Component, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="landing-page">
      <!-- Navbar -->
      <nav class="navbar navbar-expand-lg navbar-dark fixed-top py-2" [class.scrolled]="isScrolled">
        <div class="container">
          <a class="navbar-brand fw-bold fs-4 d-flex align-items-center" href="#">
            <div class="logo-icon me-2">
              <i class="bi bi-shield-check"></i>
            </div>
            <span class="tracking-tight">CONTROL</span>
          </a>
          
          <!-- Mobile Menu Trigger (3 dots) -->
          <button class="navbar-toggler border-0 d-lg-none" type="button" (click)="toggleMobileMenu()">
            <i class="bi bi-three-dots-vertical fs-2 text-white"></i>
          </button>

          <!-- Desktop Menu -->
          <div class="collapse navbar-collapse d-none d-lg-block">
            <ul class="navbar-nav ms-auto align-items-center gap-3">
              <li class="nav-item">
                <a class="nav-link text-white opacity-75 hover-opacity-100 fw-bold" href="#features">Capacidades</a>
              </li>
              <li class="nav-item">
                <button class="btn btn-primary px-4 fw-bold" (click)="irALogin()">
                  <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <!-- Mobile Offcanvas Menu (Right side, 50% width) -->
      <div class="mobile-overlay d-lg-none" *ngIf="mobileMenuOpen" (click)="toggleMobileMenu()"></div>
      <div class="mobile-menu d-lg-none" [class.open]="mobileMenuOpen">
        <div class="d-flex justify-content-end p-3">
          <button class="btn btn-link text-white p-0 border-0 fs-3" (click)="toggleMobileMenu()">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="d-flex flex-column p-4 gap-4">
          <a class="text-white text-decoration-none fw-bold fs-5" href="#features" (click)="toggleMobileMenu()">Capacidades</a>
          <button class="btn btn-primary fw-bold py-2 w-100" (click)="irALogin()">
            Iniciar Sesión
          </button>
        </div>
      </div>

      <!-- Hero Section -->
      <section class="hero-section d-flex align-items-center">
        <div class="hero-overlay"></div>
        <div class="container position-relative z-1 text-center text-lg-start">
          <div class="row align-items-center">
            <div class="col-lg-8 text-white mt-5 mt-lg-0">
              <h1 class="display-huge fw-bold mb-3 mb-md-4 animate-slide-up">
                Gestión Escolar <br>
                <span class="text-accent">Inteligente</span>
              </h1>
              <p class="lead fs-5 fs-md-4 mb-4 mb-md-5 opacity-75 animate-slide-up max-w-700" style="animation-delay: 0.1s">
                Optimiza el control de asistencias, atrasos y observaciones. <br class="d-none d-md-block">
                Plataforma diseñada para la gestión escolar eficiente y formal.
              </p>
              <div class="animate-slide-up" style="animation-delay: 0.2s">
                <button class="btn btn-primary btn-xl px-4 px-md-5 py-2 py-md-3 shadow-sm w-100 w-md-auto" (click)="irALogin()">
                  <i class="bi bi-box-arrow-in-right me-2"></i>Ingresa al portal
                </button>
              </div>
            </div>
            <div class="col-lg-4 d-none d-lg-block animate-fade-in" style="animation-delay: 0.4s">
              <div class="hero-card shadow-sm">
                <i class="bi bi-graph-up-arrow text-primary fs-1 mb-3 d-block"></i>
                <h5 class="fw-bold">Control Total</h5>
                <p class="small text-muted mb-0">Gestión centralizada en tiempo real.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Device Section -->
      <section class="device-section bg-white py-4 py-md-5 border-bottom">
        <div class="container">
          <div class="d-flex justify-content-center gap-4 gap-md-5 align-items-center flex-wrap">
            <div class="device-item text-center">
              <i class="bi bi-phone fs-2 text-primary"></i>
              <div class="small fw-bold mt-1 text-uppercase tracking-widest">Celular</div>
            </div>
            <div class="device-item text-center">
              <i class="bi bi-tablet fs-2 text-primary"></i>
              <div class="small fw-bold mt-1 text-uppercase tracking-widest">Tablet</div>
            </div>
            <div class="device-item text-center d-none d-sm-block">
              <i class="bi bi-laptop fs-2 text-primary"></i>
              <div class="small fw-bold mt-1 text-uppercase tracking-widest">Computadora</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section id="features" class="features-section py-5 bg-light">
        <div class="container py-4 py-md-5">
          <div class="text-center mb-5 pb-2 pb-md-4">
            <h6 class="text-primary fw-bold text-uppercase tracking-widest small">Capacidades</h6>
            <h2 class="fw-bold h2 h1-md">Todo en un solo lugar</h2>
          </div>
          <div class="row g-4 justify-content-center">
            <div class="col-md-4">
              <div class="feature-card-premium p-4 p-md-5 text-center h-100 shadow-sm stretched-card">
                <div class="icon-box mb-4 mx-auto">
                  <i class="bi bi-clipboard2-check"></i>
                </div>
                <h3 class="fw-bold h5 mb-3 text-uppercase">Asistencia Digital</h3>
                <p class="text-muted smaller mb-0">Registro rápido y sencillo de la presencia de tus estudiantes con reportes automáticos.</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="feature-card-premium p-4 p-md-5 text-center h-100 featured shadow-sm stretched-card">
                <div class="icon-box mb-4 mx-auto bg-white text-primary">
                  <i class="bi bi-shield-exclamation"></i>
                </div>
                <h3 class="fw-bold h5 mb-3 text-uppercase">Hoja de Vida</h3>
                <p class="text-white opacity-90 smaller mb-0">Control detallado de observaciones categorizadas por gravedad para un seguimiento efectivo.</p>
              </div>
            </div>
            <div class="col-md-4">
              <div class="feature-card-premium p-4 p-md-5 text-center h-100 shadow-sm stretched-card">
                <div class="icon-box mb-4 mx-auto">
                  <i class="bi bi-person-badge"></i>
                </div>
                <h3 class="fw-bold h5 mb-3 text-uppercase">Portal del Alumno</h3>
                <p class="text-muted smaller mb-0">Acceso directo para que cada estudiante consulte su asistencia y anotaciones en tiempo real.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="extra-padding-bottom"></div>
      </section>

      <!-- Footer -->
      <footer class="footer py-4 bg-dark text-white">
        <div class="container">
          <div class="row align-items-center g-3 text-center text-md-start">
            <div class="col-md-6">
              <h5 class="fw-bold mb-1">CONTROL</h5>
              <p class="opacity-75 small mb-0">Gestiona la educación de forma digital de manera eficiente.</p>
            </div>
            <div class="col-md-6 text-md-end">
              <div class="d-flex flex-wrap justify-content-center justify-content-md-end gap-3 small text-uppercase tracking-widest">
                <a href="#" class="text-white text-decoration-none opacity-75 hover-opacity-100">Inicio</a>
                <a href="#features" class="text-white text-decoration-none opacity-75 hover-opacity-100">Capacidades</a>
                <a (click)="irALogin()" class="text-white text-decoration-none opacity-75 hover-opacity-100 cursor-pointer">Iniciar Sesión</a>
              </div>
            </div>
          </div>
          <hr class="my-3 opacity-25">
          <div class="text-center opacity-75 smaller">
            <p class="mb-0 text-white-50">Joshua Chiguay y Benjamín Villouta</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    :host {
      --primary: #0f3460;
      --primary-dark: #0a2540;
      --accent: #e63946;
      --dark: #111827;
      --light: #f3f4f6;
      --border-color: #e5e7eb;
    }

    .landing-page { 
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
      scroll-behavior: smooth;
    }

    .fw-black { font-weight: 700; }
    .tracking-tight { letter-spacing: -0.02em; }
    .tracking-widest { letter-spacing: 0.1em; }

    .text-accent { color: var(--accent); }

    .display-huge {
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      line-height: 1.1;
      letter-spacing: -0.03em;
    }

    .max-w-700 { max-width: 700px; }
    @media (text-align: center) { .max-w-700 { margin-left: auto; margin-right: auto; } }

    .logo-icon {
      width: 32px; height: 32px;
      background: var(--primary);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 1.2rem;
    }

    .navbar { 
      transition: all 0.3s ease; 
      z-index: 1000;
      background: rgba(17, 24, 39, 0.95);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .navbar.scrolled {
      background: var(--dark) !important;
      padding: 0.5rem 0 !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
    }

    /* Mobile Menu Styles */
    .mobile-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 1040; }
    .mobile-menu { position: fixed; top: 0; right: 0; width: 50%; max-width: 300px; height: 100vh; background: var(--dark); z-index: 1050; transform: translateX(100%); transition: transform 0.3s ease; border-left: 1px solid rgba(255,255,255,0.1); }
    .mobile-menu.open { transform: translateX(0); }
    
    @media (max-width: 576px) {
      .mobile-menu { width: 65%; } /* slightly wider on very small screens so text fits */
    }

    .hero-section {
      min-height: 100vh;
      background: var(--dark);
      position: relative;
      padding-top: 100px;
    }

    .hero-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(to bottom, rgba(17, 24, 39, 0.4), var(--dark));
    }

    .hero-card {
      width: 100%;
      max-width: 300px;
      padding: 2.5rem;
      background: white;
      border-radius: 8px;
      margin-left: auto;
      border: 1px solid var(--border-color);
    }

    .feature-card-premium {
      background: white;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      transition: border-color 0.3s ease;
    }

    .feature-card-premium:hover {
      border-color: var(--primary);
    }

    .stretched-card {
      padding-bottom: 4rem !important;
    }

    .feature-card-premium.featured {
      background: var(--primary);
      color: white;
      border-color: var(--primary-dark);
    }

    .icon-box {
      width: 60px; height: 60px;
      background: var(--light);
      border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 1.8rem;
      color: var(--primary);
      border: 1px solid var(--border-color);
    }

    .feature-card-premium.featured .icon-box {
      background: rgba(255,255,255,0.1);
      color: white;
      border-color: rgba(255,255,255,0.2);
    }

    .extra-padding-bottom { height: 40px; }

    .btn {
      border-radius: 8px !important;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .btn-primary { background-color: var(--primary); border-color: var(--primary); color: white; }
    .btn-primary:hover { background-color: var(--primary-dark); border-color: var(--primary-dark); }
    .btn-xl { font-size: 1rem; padding: 1.2rem 2.5rem; }
    
    .cursor-pointer { cursor: pointer; }
    .smaller { font-size: 0.8rem; }
    .hover-opacity-100:hover { opacity: 1 !important; }

    .animate-slide-up { animation: slideUp 0.6s ease-out forwards; opacity: 0; }
    .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; opacity: 0; }

    @keyframes slideUp { 
      from { transform: translateY(20px); opacity: 0; } 
      to { transform: translateY(0); opacity: 1; } 
    }
    @keyframes fadeIn { 
      from { opacity: 0; } 
      to { opacity: 1; } 
    }
  `]
})
export class LandingComponent {
  private router = inject(Router);
  isScrolled = false;
  mobileMenuOpen = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }
  
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  irALogin() {
    this.mobileMenuOpen = false;
    this.router.navigate(['/login']);
  }
}
