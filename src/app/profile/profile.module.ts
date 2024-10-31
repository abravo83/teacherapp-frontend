import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { MyAccountComponent } from './my-account/my-account.component';
import { MyClassesComponent } from './my-classes/my-classes.component';
import { MyStudentsComponent } from './my-students/my-students.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MessagesComponent } from './messages/messages.component';
import { ReviewsComponent } from './reviews/reviews.component';

@NgModule({
  declarations: [
    MyAccountComponent,
    MyClassesComponent,
    MyStudentsComponent,
    CalendarComponent,
    MessagesComponent,
    ReviewsComponent,
  ],

  imports: [CommonModule, ProfileRoutingModule],
})
export class ProfileModule {}
