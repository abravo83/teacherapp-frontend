import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environments';
import { Imateria } from '../interfaces/imateria';
import { ImateriaProfesor } from '../interfaces/imateriaprofesor';
import { Iprofesor } from '../interfaces/iprofesor';

@Injectable({
  providedIn: 'root',
})
export class MateriasService {
  httpClient = inject(HttpClient);
  BASE_URL = `${environment.API_URL}/api/materias`;

  async getMaterias(): Promise<Imateria[]> {
    return firstValueFrom(this.httpClient.get<Imateria[]>(this.BASE_URL));
  }

  async obtenerMateriasProfesor(profesorId: number): Promise<Imateria[]> {
    return firstValueFrom(
      this.httpClient.get<Imateria[]>(
        `${this.BASE_URL}/profesor-materias/${profesorId}`
      )
    );
  }
}
