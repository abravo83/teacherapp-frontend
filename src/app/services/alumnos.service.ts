import { inject, Injectable } from '@angular/core';
import { Iusuario } from '../interfaces/iusuario';
import { UsuariosService } from './usuarios.service';
import { USUARIOS } from '../db/usuarios';

@Injectable({
  providedIn: 'root',
})
export class AlumnosService {
  // Inyectables
  usuariosService = inject(UsuariosService);
  // Variables
  arrAlumnos!: Iusuario[];

  constructor() {
    this.arrAlumnos = this.usuariosService.arrUsuarios.filter(
      (usuario) => usuario.rol === 'alumno'
    );
  }

  // Arturo


  getAlumnoById(id: number): Promise<Iusuario | undefined> {
    return new Promise((resolve) => {
      const alumno = USUARIOS.find(user => user.id === id && user.rol === 'alumno');
      resolve(alumno);
    });
  }

  registroAlumno(alumno: Iusuario): Promise<Iusuario> {
    return new Promise((resolve) => {
      alumno.id = USUARIOS.length + 1;
      USUARIOS.push(alumno);
      resolve(alumno);
    });
  }

  actualizarAlumno(alumno: Iusuario): Promise<Iusuario> {
    return new Promise((resolve, reject) => {
      const index = USUARIOS.findIndex(user => user.id === alumno.id && user.rol === 'alumno');
      if (index !== -1) {
        USUARIOS[index] = { ...USUARIOS[index], ...alumno };
        resolve(USUARIOS[index]);
      } else {
        reject(new Error("Alumno no encontrado o no tiene rol de alumno"));
      }
    });
  }






}
