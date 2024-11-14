import { inject, Injectable } from '@angular/core';

import { Imensaje } from '../interfaces/imensaje';
import { MENSAJES } from '../db/mensajes';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
  arrMensajes: Imensaje[] = MENSAJES;

  private baseUrl: string = `${environment.API_URL}/api/mensajes`;
  private httpClient = inject(HttpClient);

  constructor() {}

  getAll(){
    console.log(`base url: ${this.baseUrl}`);
    return lastValueFrom(this.httpClient.get<Imensaje[]>(this.baseUrl));
  }


}
