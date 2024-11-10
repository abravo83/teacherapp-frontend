import { inject, Injectable } from '@angular/core';
import { Iusuario } from '../interfaces/iusuario';
import { UsuariosService } from './usuarios.service';
import { USUARIOS } from '../db/usuarios';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  // Inyectables
  usuariosService = inject(UsuariosService);
  httpClient = inject(HttpClient);

  // Variables
  BASE_URL = `${environment.API_URL}/api/alumnos`;
  arrAlumnos!: Iusuario[];
  constructor() {
    this.arrAlumnos = this.usuariosService.arrUsuarios.filter(
      (usuario) => usuario.rol === 'alumno'
    );
  }

  // Arturo

  getAlumnoById(id: number): Promise<Iusuario | undefined> {
    return firstValueFrom(
      this.httpClient.get<Iusuario>(`${this.BASE_URL}/${id}`)
    );
    // return new Promise((resolve) => {
    //   const alumno = USUARIOS.find(
    //     (user) => user.id === id && user.rol === 'alumno'
    //   );
    //   resolve(alumno);
    // });
  }

  registroAlumno(alumnoDataForm: any): Promise<Iusuario> {
    return firstValueFrom(
      this.httpClient.post<Iusuario>(
        `${this.BASE_URL}/registro`,
        alumnoDataForm
      )
    );

    // return new Promise((resolve) => {
    //   alumno.id = USUARIOS.length + 1;
    //   USUARIOS.push(alumno);
    //   resolve(alumno);
    // });
  }

  actualizarAlumno(alumnoDataForm: any, alumnoId: number): Promise<Iusuario> {
    return firstValueFrom(
      this.httpClient.put<Iusuario>(
        `${this.BASE_URL}/${alumnoId}`,
        alumnoDataForm
      )
    );
    // return new Promise((resolve, reject) => {
    //   const index = USUARIOS.findIndex(
    //     (user) => user.id === alumno.id && user.rol === 'alumno'
    //   );
    //   if (index !== -1) {
    //     USUARIOS[index] = { ...USUARIOS[index], ...alumno };
    //     resolve(USUARIOS[index]);
    //   } else {
    //     reject(new Error('Alumno no encontrado o no tiene rol de alumno'));
    //   }
    // });
  }
}
