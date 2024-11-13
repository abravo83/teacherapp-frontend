import { inject, Injectable } from '@angular/core';
import { Iusuario } from '../interfaces/iusuario';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { USUARIOS } from '../db/usuarios';
import { environment } from '../../environments/environments';
import { jwtDecode, JwtPayload } from "jwt-decode";

type Body = { email: string; password: string };
type Response = { message: string; token: string };
interface CustomPayload extends JwtPayload {
  usuario_id: number;
  usuario_rol: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private baseUrl: string = `${environment.API_URL}/api`;
  private http = inject(HttpClient);
  arrUsers: Iusuario[] = USUARIOS;

  login(user: Body): Promise<Response> {
    //login contra la BD local JSON de usuarios.
    //comentar cuando la api esté disponible
    // const userLogin = this.arrUsers.find(userDb => userDb.email === user.email);
    // return new Promise<response>((resolve, reject) => {
    //   let result: response = { success: "false", token: "" };
    //   if (userLogin) {
    //     if (userLogin.password === user.password) {
    //       const token = "Token" + userLogin.id;
    //       result = { success: "true", token: token }
    //       resolve(result);
    //     }
    //   };
    //   reject({ message: 'email y/o contraseña incorrectos' });
    // });

    //llamada a la api descomentar cuando esté disponible
    console.log(`${this.baseUrl}/login`);
    console.log(user);

    return firstValueFrom(
      this.http.post<Response>(`${this.baseUrl}/login`, user)
    );
  }

  isLogged(): boolean {
    const token = localStorage.getItem('token');
    return token ? true : false;
  }

  getLoggedUserId(): number {
    const token = localStorage.getItem('token');
    const data = jwtDecode<CustomPayload>(token!);
    return data.usuario_id;
  }

  getLoggedUserRole(): string {
    const token = localStorage.getItem('token');
    const data = jwtDecode<CustomPayload>(token!);
    return data.usuario_rol;
  }
}
