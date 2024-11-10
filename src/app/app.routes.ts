import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { TeachersFormComponent } from './pages/teachers-form/teachers-form.component';
import { StudentsFormComponent } from './pages/students-form/students-form.component';
import { ProfesorDashboardComponent } from './profile/profesor/profesor-dashboard/profesor-dashboard.component';
import { MyAccountComponent } from './profile/profesor/my-account/my-account.component';
import { MyStudentsComponent } from './profile/profesor/my-students/my-students.component';
import { ReviewsComponent } from './profile/profesor/reviews/reviews.component';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },

  {
    path: 'profile',
    component: ProfesorDashboardComponent,
    children: [
      { path: 'my-account', component: MyAccountComponent },
      { path: 'my-students', component: MyStudentsComponent },
      {
        path: 'messages',
        loadComponent: () =>
          import('./profile/profesor/messages/messages.component').then(
            (m) => m.MessagesComponent
          ),
      },
      { path: 'reviews', component: ReviewsComponent },
      { path: '', redirectTo: 'my-account', pathMatch: 'full' },
    ],
  },

  {
    path: 'signup',
    component: RegisterComponent,
    children: [
      { path: 'nuevo-profesor', component: TeachersFormComponent },
      { path: 'nuevo-alumno', component: StudentsFormComponent },
    ],
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'registrar', component: RegisterComponent },
      { path: 'nuevo-profesor', component: TeachersFormComponent },
      { path: 'nuevo-alumno', component: StudentsFormComponent },
      {
        path: 'editar-profesor/:id',
        canActivate: [authGuard],
        component: TeachersFormComponent,
      },
      {
        path: 'editar-alumno/:id',
        canActivate: [authGuard],
        component: StudentsFormComponent,
      },
    ],
  },

  { path: '**', redirectTo: 'home' },
];
