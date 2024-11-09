import { Injectable } from '@angular/core';

import { Iusuario } from '../interfaces/iusuario';
import { USUARIOS } from '../db/usuarios';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  arrUsuarios: Iusuario[] = USUARIOS;
  private usuarioActualId = 1;

  constructor() {}

  getUsuarioActual(): Iusuario | undefined {
    return this.arrUsuarios.find((user) => user.id === this.usuarioActualId);
  }
}
