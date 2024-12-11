import { inject, Injectable } from '@angular/core';
import { Iusuario } from '../interfaces/iusuario';
import { firstValueFrom, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { USUARIOS } from '../db/usuarios';
import { environment } from '../../environments/environments';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { LoginService } from './login.service';

type Body = { id_alumno:number, id_profesor:number };
type Response = { message: string; token: string };
interface CustomPayload extends JwtPayload {
  usuario_id: number;
  usuario_rol: string;
}

@Injectable({
  providedIn: 'root',
})

export class InscripcionesService {
    private baseUrl: string = `${environment.API_URL}/api`;
    private http = inject(HttpClient);

    postInscription(id_alumno: number, id_profesor: number) {
        const Body = {id_alumno, id_profesor}

       const url = `${this.baseUrl}/inscripciones/${id_profesor}`;
       return this.http.post<Response>(url,Body);
    }
    
}
// 


