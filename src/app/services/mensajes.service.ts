import { Injectable } from '@angular/core';

import { Imensaje } from '../interfaces/imensaje';
import { MENSAJES } from '../db/mensajes';

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
  arrMensajes: Imensaje[] = MENSAJES;

  constructor() {}
}
