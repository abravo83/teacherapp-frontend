import { Component, inject, signal } from '@angular/core';
import { ProfesoresService } from '../../services/profesores.service';
import { Iprofesor } from '../../interfaces/iprofesor';
import { FilterHomeComponent } from './filter-home/filter-home.component';
import { ProfesorCardHomeComponent } from './profesor-card-home/profesor-card-home.component';
import { MapaHomeComponent } from './mapa-home/mapa-home.component';
import { GoogleMap, MapAdvancedMarker, MapMarker } from '@angular/google-maps';
//import { environment } from '../../../environments/environments';

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
  profesorService = inject(ProfesoresService);
  usuariosList: any[] = [];
  myposition = signal<any>('');
  isGoogleMapsLoaded = false;

  ngOnInit() {
    // Cargar el script de Google Maps dinámicamente
    const script = document.createElement('script');
    //script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.token}`;
    script.defer = true;
    script.async = true;
    document.head.appendChild(script);

    // Esperar a que el script se cargue
    script.onload = () => {
      this.isGoogleMapsLoaded = true;
      this.initializeMap();
    };

    script.onerror = () => {
      console.error('Error al cargar Google Maps');
    };

    this.usuariosList = this.profesorService.getAll();
  }

  private initializeMap() {
    if (this.isGoogleMapsLoaded) {
      navigator.geolocation.getCurrentPosition((position) => {
        let center = new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        );
        this.myposition.set(center);
      });
    }
  }

  filterProfesor(event: any) {
    if (event[0] !== 0) {
      this.usuariosList = this.profesorService.filterByMaterias(
        event[0],
        event[1],
        event[2]
      );
    } else {
      this.usuariosList = this.profesorService.getAll();
    }
  }
}
