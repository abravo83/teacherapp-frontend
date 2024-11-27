import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { UsuariosService } from './usuarios.service';
import { Iusuario } from '../interfaces/iusuario';
import { LoginService } from './login.service';
import { firstValueFrom, Observable } from 'rxjs';
import { Iregistros } from '../interfaces/iregistros';

@Injectable({
  providedIn: 'root',
})
export class RegistrosService {
  httpClient = inject(HttpClient);
  usuariosService = inject(UsuariosService);
  loginService = inject(LoginService);

  BASE_URL = `${environment.API_URL}/api/registros`;
  usuarioLogueado!: Iusuario;
  registrosUsuario: any[] = [];

  constructor() {
    if (this.usuariosService.loginService.isLogged()) {
      this.recuperarUsuarioLogueado().then(async () => {
        this.registrosUsuario = await this.getRegistrosDeUsuario();
      });
    }
  }

  async recuperarUsuarioLogueado() {
    try {
      this.usuarioLogueado = await this.usuariosService.getUsuarioActual();
    } catch (error) {
      console.error('Error al obtener el usuario actual:', error);
    }
  }

  async getRegistrosDeUsuario(): Promise<Iregistros[]> {
    try {
      const id = this.usuarioLogueado.id || this.loginService.getLoggedUserId();
      return firstValueFrom(
        this.httpClient.get<Iregistros[]>(
          `${this.BASE_URL}/${this.usuarioLogueado.id}`
        )
      );
    } catch (error) {
      console.error('Error al obtener los registros del usuario:', error);
      return [];
    }
  }
}
