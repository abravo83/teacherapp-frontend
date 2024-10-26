import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profesor-card-home',
  standalone: true,
  imports: [],
  templateUrl: './profesor-card-home.component.html',
  styleUrl: './profesor-card-home.component.css',
})
export class ProfesorCardHomeComponent {
  @Input() myProfesor!: any;
}
