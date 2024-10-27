import { Component, inject, Input, signal } from '@angular/core';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import { ProfesoresService } from '../../../services/profesores.service';

@Component({
  selector: 'app-mapa-home',
  standalone: true,
  imports: [GoogleMap, MapMarker],
  templateUrl: './mapa-home.component.html',
  styleUrl: './mapa-home.component.css',
})
export class MapaHomeComponent {
  @Input() myProfesor!: any;
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
  }

  getposition(coords: any) {
    let resultado: string = coords;

    let array: any[] = resultado.split(',');

    return new google.maps.LatLng(array[0], array[1]);
  }

  filttrarmapa(materia: number = 1) {
    this.profesoresList = this.profesoresService.filterByMaterias(materia);
  }
}
