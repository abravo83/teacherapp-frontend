import { Injectable } from '@angular/core';

import { Iopinion } from '../interfaces/iopinion';
import { OPINIONES } from '../db/opiniones';

@Injectable({
  providedIn: 'root',
})
export class OpinionesService {
  arrOpiniones: Iopinion[] = OPINIONES;

  constructor() {}
}
