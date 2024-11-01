import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { MyAccountComponent } from './profesor/my-account/my-account.component';
import { MyClassesComponent } from './profesor/my-classes/my-classes.component';
import { MyStudentsComponent } from './profesor/my-students/my-students.component';
import { CalendarComponent } from './profesor/calendar/calendar.component';
import { MessagesComponent } from './profesor/messages/messages.component';
import { ReviewsComponent } from './profesor/reviews/reviews.component';
import { ProfesorDashboardComponent } from './profesor/profesor-dashboard/profesor-dashboard.component';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { FooterComponent } from '../components/footer/footer.component';

@NgModule({
  declarations: [
    MyAccountComponent,
    MyClassesComponent,
    MyStudentsComponent,
    CalendarComponent,
    MessagesComponent,
    ReviewsComponent,
    ProfesorDashboardComponent,
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    NavbarComponent,
    FooterComponent,
  ],
})
export class ProfileModule {}
