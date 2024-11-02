import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-welcome-message',
  template: `<h1>Bienvenido, {{ role }}</h1>`,
  styleUrls: ['./welcome-message.component.css'],
})
export class WelcomeMessageComponent {
  @Input() role: string = '';
}
