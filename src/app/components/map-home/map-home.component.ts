import { Component, inject, signal } from '@angular/core';
import { ProfesoresService } from '../../services/profesores.service';
import { GoogleMap, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-map-home',
  standalone: true,
  imports: [GoogleMap, MapMarker],
  templateUrl: './map-home.component.html',
  styleUrl: './map-home.component.css',
})
export class MapHomeComponent {
  myposition = signal<any>('');
  private profesoresService = inject(ProfesoresService);
  profesoresList: any = [];

  ngOnInit() {
    //api de geolocalizacion de js nativa
    navigator.geolocation.getCurrentPosition((position) => {
      let center = new google.maps.LatLng(
        position.coords.latitude,
        position.coords.longitude
      );
      this.myposition.set(center);
    });
    this.profesoresList = this.profesoresService.getAll();
  }
  getposition(coords: any) {
    let resultado: string = coords;

    let array: any[] = resultado.split(',');

    return new google.maps.LatLng(array[0], array[1]);
  }
}
