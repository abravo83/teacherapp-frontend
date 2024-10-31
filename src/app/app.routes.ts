import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { FormTeacherComponent } from './pages/form-teacher/form-teacher.component';
import { FormStudentComponent } from './pages/form-student/form-student.component';

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
  

  {path: "registro", component: RegisterComponent},
  {path: "nuevo-profesor", component: FormTeacherComponent},
  {path: "nuevo-alumno", component: FormStudentComponent},
  {path: "editar-profesor/:id", component: FormTeacherComponent},
  {path: "editar-alumno/:id", component: FormStudentComponent},




  { path: 'dashboard', component: DashboardComponent },
  { path: '**', redirectTo: 'home' },
];
