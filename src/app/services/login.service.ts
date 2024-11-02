import { inject, Injectable } from '@angular/core';
import { Iusuario } from '../interfaces/iusuario';
import { firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { USUARIOS } from '../db/usuarios';

type response = {
  success: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private baseUrl: string = "METER URL CUANDO ESTÉ LA API"
  private http = inject(HttpClient);
  arrUsers: Iusuario[] = USUARIOS;

  login(user: Iusuario): Promise<response> {
    //login contra la BD local JSON de usuarios.
    //descomentar cuando la api esté disponible
    const userLogin = this.arrUsers.find(userDb => userDb.email === user.email);
    return new Promise<response>((resolve, reject) => {
      let result: response = { success: "false", token: "" };
      if (userLogin) {
        if (userLogin.password === user.password) {
          const token = "Token" + userLogin.id;
          result = { success: "true", token: token }
          resolve(result);
        }
      };
      reject({ message: 'email y/o contraseña incorrectos' });
    });


    //llamada a la api descomentar cuando esté disponible
   // return firstValueFrom(this.http.post<response>(`${this.baseUrl}login`, user))
  }
}
