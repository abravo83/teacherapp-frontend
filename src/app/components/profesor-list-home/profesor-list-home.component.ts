import { Component, inject, signal } from '@angular/core';
import { ProfesoresService } from '../../services/profesores.service';
import { Iprofesor } from '../../interfaces/iprofesor';
import { FilterHomeComponent } from './filter-home/filter-home.component';
import { ProfesorCardHomeComponent } from './profesor-card-home/profesor-card-home.component';
import { MapaHomeComponent } from './mapa-home/mapa-home.component';
import { GoogleMap, MapAdvancedMarker, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-profesor-list-home',
  standalone: true,
  imports: [
    FilterHomeComponent,
    ProfesorCardHomeComponent,
    MapaHomeComponent,
    GoogleMap,
    MapMarker,
    MapAdvancedMarker,
  ],
  templateUrl: './profesor-list-home.component.html',
  styleUrl: './profesor-list-home.component.css',
})
export class ProfesorListHomeComponent {
  //inyectable
  profesorService = inject(ProfesoresService);
  //variables
  usuariosList: any[] = [];
  myposition = signal<any>('');

  ngOnInit() {
    this.usuariosList = this.profesorService.getAll();
    //api de geolocalizacion de js nativa
    navigator.geolocation.getCurrentPosition((position) => {
      let center = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      this.myposition.set(center);
    });
  }

  getposition(coords: any) {
    let resultado: string = coords;
    let array: any[] = resultado.split(',');
    return new google.maps.LatLng(array[0], array[1]);
  }

  filterProfesorByMaterias(event: number) {
    if (event !== 0) {
      this.usuariosList = this.profesorService.filterByMaterias(event);
    } else {
      this.usuariosList = this.profesorService.getAll();
    }
  }
}
