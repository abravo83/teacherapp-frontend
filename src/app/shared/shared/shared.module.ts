import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeMessageComponent } from '../../components/welcome-message/welcome-message.component';

@NgModule({
  declarations: [WelcomeMessageComponent],
  imports: [CommonModule],
  exports: [WelcomeMessageComponent],
})
export class SharedModule {}
