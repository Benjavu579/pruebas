import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { ProfesorLayoutComponent } from './components/layouts/profesor-layout.component';
import { EstudianteLayoutComponent } from './components/layouts/estudiante-layout.component';
import { CursosComponent } from './components/cursos/cursos.component';
import { AsistenciaComponent } from './components/asistencia/asistencia.component';
import { EstudiantesComponent } from './components/estudiantes/estudiantes.component';
import { EstudianteDashboardComponent } from './components/estudiante/estudiante-dashboard.component';
import { AnotacionesComponent } from './components/anotaciones/anotaciones.component';
import { AlumnoAsignaturasComponent } from './components/estudiante/alumno-asignaturas.component';
import { AlumnoAnotacionesComponent } from './components/estudiante/alumno-anotaciones.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'profesor',
    component: ProfesorLayoutComponent,
    children: [
      { path: '', redirectTo: 'cursos', pathMatch: 'full' },
      { path: 'cursos', component: CursosComponent },
      { path: 'estudiantes', component: EstudiantesComponent },
      { path: 'asistencia', component: AsistenciaComponent },
      { path: 'anotaciones', component: AnotacionesComponent },
    ]
  },
  {
    path: 'alumno',
    component: EstudianteLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: EstudianteDashboardComponent },
      { path: 'asignaturas', component: AlumnoAsignaturasComponent },
      { path: 'anotaciones', component: AlumnoAnotacionesComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];

