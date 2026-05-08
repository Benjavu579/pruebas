import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-container d-flex align-items-center justify-content-center p-3">
      <div class="login-card shadow-sm animate-slide-up">
        <div class="text-center mb-3">
          <div class="logo-box mx-auto mb-2">
            <i class="bi bi-shield-lock-fill"></i>
          </div>
          <h4 class="fw-bold tracking-tight mb-1 text-slate-800">Acceso al Sistema</h4>
          <p class="text-muted smaller mb-0">Selecciona tu perfil e ingresa</p>
        </div>

        <!-- Role Selector -->
        <div class="d-flex gap-2 mb-3 p-1 bg-light border small">
          <button 
            type="button" 
            class="btn flex-grow-1 py-1 fw-bold transition-all border-0"
            [class.btn-primary]="role === 'profesor'"
            [class.btn-light]="role !== 'profesor'"
            (click)="setRole('profesor')"
          >
            <i class="bi bi-person-workspace me-1"></i>Profesor
          </button>
          <button 
            type="button" 
            class="btn flex-grow-1 py-1 fw-bold transition-all border-0"
            [class.btn-success]="role === 'alumno'"
            [class.btn-light]="role !== 'alumno'"
            (click)="setRole('alumno')"
          >
            <i class="bi bi-mortarboard me-1"></i>Alumno
          </button>
        </div>

        <!-- Demo Selection -->
        <div class="demo-selector mb-3 animate-fade-in text-center p-2 bg-light border d-flex gap-2 justify-content-center flex-wrap">
          <ng-container *ngIf="role === 'alumno'">
            <button type="button" class="btn btn-xs flex-grow-1"
              [class.btn-outline-success]="demoUser !== 'Joshua'"
              [class.btn-success]="demoUser === 'Joshua'"
              (click)="setDemoUser('Joshua')">
              Demo Joshua
            </button>
            <button type="button" class="btn btn-xs flex-grow-1"
              [class.btn-outline-success]="demoUser !== 'Benjamín'"
              [class.btn-success]="demoUser === 'Benjamín'"
              (click)="setDemoUser('Benjamín')">
              Demo Benjamín
            </button>
          </ng-container>
          
          <ng-container *ngIf="role === 'profesor'">
            <button type="button" class="btn btn-xs flex-grow-1"
              [class.btn-outline-primary]="demoUser !== 'Leo'"
              [class.btn-primary]="demoUser === 'Leo'"
              (click)="setDemoUser('Leo')">
              Demo Profesor
            </button>
          </ng-container>
        </div>

        <form (ngSubmit)="login()">
          <div class="mb-2">
            <label class="form-label smaller fw-bold text-uppercase text-muted mb-1">Usuario / RUT</label>
            <div class="input-group">
              <span class="input-group-text border-end-0 bg-white px-3"><i class="bi bi-person text-muted"></i></span>
              <input type="text" class="form-control border-start-0 py-2" [(ngModel)]="username" name="user" placeholder="Ingresa usuario" required>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label smaller fw-bold text-uppercase text-muted mb-1">Clave</label>
            <div class="input-group">
              <span class="input-group-text border-end-0 bg-white px-3"><i class="bi bi-key text-muted"></i></span>
              <input type="password" class="form-control border-start-0 py-2" [(ngModel)]="password" name="pass" placeholder="**********" required>
            </div>
          </div>

          <div *ngIf="error" class="alert alert-danger border-0 rounded-0 smaller py-2 mb-3 animate-fade-in d-flex align-items-center">
            <i class="bi bi-exclamation-circle me-2"></i> {{ error }}
          </div>

          <button type="submit" class="btn w-100 py-2 fw-bold shadow-sm" [class.btn-primary]="role === 'profesor'" [class.btn-success]="role === 'alumno'">
            Entrar al Sistema <i class="bi bi-arrow-right ms-1"></i>
          </button>
        </form>

        <div class="mt-3 text-center border-top pt-2">
          <a routerLink="/" class="text-decoration-none smaller text-muted btn-link">
            <i class="bi bi-arrow-left me-1"></i> Volver al inicio
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container { 
      min-height: 100vh; 
      background-color: var(--dark); 
      overflow: hidden;
    }
    .login-card {
      width: 100%;
      max-width: 360px;
      padding: 2rem 1.5rem;
      background: white;
      border: 1px solid var(--border-color);
      border-top: 4px solid var(--primary);
    }
    .logo-box {
      width: 48px; height: 48px;
      background: var(--primary);
      display: flex; align-items: center; justify-content: center;
      color: white; font-size: 1.5rem;
      border-radius: 8px;
    }
    .transition-all { transition: all 0.2s ease; }
    .btn-link { text-decoration: none; color: var(--text-muted); font-weight: 500; }
    .btn-link:hover { color: var(--primary); }
    .smaller { font-size: 0.8rem; }
    .text-slate-800 { color: var(--text-primary); }
    .btn-xs { padding: 0.4rem 0.5rem; font-size: 0.75rem; border-radius: 6px !important; }
  `]
})
export class LoginComponent implements OnInit {
  private router = inject(Router);

  role: 'profesor' | 'alumno' = 'profesor';
  demoUser: 'Joshua' | 'Benjamín' | 'Leo' | null = null;
  username = '';
  password = '';
  error = '';

  ngOnInit() {}

  setRole(newRole: 'profesor' | 'alumno') {
    this.role = newRole;
    this.demoUser = null;
    this.username = '';
    this.password = '';
    this.error = '';
  }

  setDemoUser(user: 'Joshua' | 'Benjamín' | 'Leo') {
    this.demoUser = user;
    if (user === 'Joshua') {
      this.username = 'Joshua';
      this.password = '1234';
    } else if (user === 'Benjamín') {
      this.username = 'Benjamín';
      this.password = '1234';
    } else if (user === 'Leo') {
      this.username = 'Leo';
      this.password = '1234';
    }
    this.error = '';
  }

  login() {
    this.error = '';

    if (this.role === 'profesor') {
      if (this.username === 'Leo' && this.password === '1234') {
        localStorage.setItem('rutUsuario', '00000000');
        localStorage.setItem('nombreUsuario', 'Profesor Leo');
        this.router.navigate(['/profesor']);
      } else {
        this.error = 'Credenciales de profesor incorrectas';
      }
    } else {
      if ((this.username === 'Joshua' || this.username === 'Benjamín') && this.password === '1234') {
        const rut = this.username === 'Joshua' ? '11111111' : '22222222';
        localStorage.setItem('rutUsuario', rut);
        localStorage.setItem('nombreUsuario', this.username);
        this.router.navigate(['/alumno']);
      } else {
        this.error = 'Credenciales de alumno incorrectas';
      }
    }
  }
}


