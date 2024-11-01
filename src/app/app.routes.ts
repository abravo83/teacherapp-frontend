import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { TeachersFormComponent } from './pages/teachers-form/teachers-form.component';
import { StudentsFormComponent } from './pages/students-form/students-form.component';
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.module').then((m) => m.ProfileModule),
  },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },

  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'registrar', component: RegisterComponent },
      { path: 'nuevo-profesor', component: TeachersFormComponent },
      { path: 'nuevo-alumno', component: StudentsFormComponent },
      { path: 'editar-profesor/:id', component: TeachersFormComponent },
      { path: 'editar-alumno/:id', component: StudentsFormComponent },
    ],
  },

  { path: '**', redirectTo: 'home' },
];
