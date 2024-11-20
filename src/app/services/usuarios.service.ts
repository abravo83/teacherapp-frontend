import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';
import { firstValueFrom } from 'rxjs';
import { Iusuario } from '../interfaces/iusuario';
import { USUARIOS } from '../db/usuarios';



@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  arrUsuarios: Iusuario[] = USUARIOS;
  private usuarioActualId = 1;

  httpClient = inject(HttpClient);
  BASE_URL = `${environment.API_URL}/api/usuarios`;

  constructor() {}

  getUsuarioActual(): Iusuario | undefined {
    return this.arrUsuarios.find((user) => user.id === this.usuarioActualId);
  }

  // Método para activar o desactivar un usuario
  async activarUsuario(
    id: number,
    activo: boolean
  ): Promise<{ message: string }> {
    const url = `${this.BASE_URL}/activar/${id}`;
    return firstValueFrom(
      this.httpClient.put<{ message: string }>(url, { activo })
    );
  }
}
