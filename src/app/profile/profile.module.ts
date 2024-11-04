import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfesorDashboardComponent } from './profesor/profesor-dashboard/profesor-dashboard.component';
import { MyAccountComponent } from './profesor/my-account/my-account.component';
import { MyClassesComponent } from './profesor/my-classes/my-classes.component';
import { MyStudentsComponent } from './profesor/my-students/my-students.component';
import { CalendarComponent } from './profesor/calendar/calendar.component';
import { MessagesComponent } from './profesor/messages/messages.component';
import { ReviewsComponent } from './profesor/reviews/reviews.component';
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
  declarations: [
    MyAccountComponent,
    MyClassesComponent,
    MyStudentsComponent,
    CalendarComponent,
    MessagesComponent,
    ReviewsComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    ProfesorDashboardComponent,
  ],
})
export class ProfileModule {}
