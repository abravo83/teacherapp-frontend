import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountComponent } from './profesor/my-account/my-account.component';
import { MyClassesComponent } from './profesor/my-classes/my-classes.component';
import { MyStudentsComponent } from './profesor/my-students/my-students.component';
import { CalendarComponent } from './profesor/calendar/calendar.component';
import { MessagesComponent } from './profesor/messages/messages.component';
import { ReviewsComponent } from './profesor/reviews/reviews.component';
import { ProfesorDashboardComponent } from './profesor/profesor-dashboard/profesor-dashboard.component';

const routes: Routes = [
  {
    path: 'profesor',
    component: ProfesorDashboardComponent,
    children: [
      { path: 'my-account', component: MyAccountComponent },
      { path: 'my-classes', component: MyClassesComponent },
      { path: 'my-students', component: MyStudentsComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'reviews', component: ReviewsComponent },
      { path: '', redirectTo: 'my-account', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: 'profesor', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
