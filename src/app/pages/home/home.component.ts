import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MapHomeComponent } from '../../components/map-home/map-home.component';
import { ProfesorCardHomeComponent } from '../../components/profesor-list-home/profesor-card-home/profesor-card-home.component';
import { ProfesorListHomeComponent } from '../../components/profesor-list-home/profesor-list-home.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    ProfesorCardHomeComponent,
    MapHomeComponent,
    ProfesorListHomeComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
