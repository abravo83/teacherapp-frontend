import { Injectable } from '@angular/core';

import { Iusuario } from '../interfaces/iusuario';
import { USUARIOS } from '../db/usuarios';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  arrUsuarios: Iusuario[] = USUARIOS;

  constructor() {}
}
