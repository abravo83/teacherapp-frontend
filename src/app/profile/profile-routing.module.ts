import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyClassesComponent } from './my-classes/my-classes.component';
import { MyStudentsComponent } from './my-students/my-students.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MessagesComponent } from './messages/messages.component';
import { ReviewsComponent } from './reviews/reviews.component';

const routes: Routes = [
  { path: 'my-account', component: MyAccountComponent },
  { path: 'my-classes', component: MyClassesComponent },
  { path: 'my-students', component: MyStudentsComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: '', redirectTo: 'my-account', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
