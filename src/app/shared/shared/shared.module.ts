import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeMessageComponent } from '../../components/welcome-message/welcome-message.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [WelcomeMessageComponent],
  imports: [CommonModule],
  exports: [WelcomeMessageComponent, ReactiveFormsModule],
})
export class SharedModule {}
