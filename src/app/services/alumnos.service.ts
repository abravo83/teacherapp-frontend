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

  // Métodos

  getAlumnoById(id: number): Promise<Iusuario | undefined> {
    return new Promise((resolve) => {
      const alumno = USUARIOS.find((usr) => usr.id === id && usr.rol === 'alumno');
      resolve(alumno);
    });
  }

  async registroAlumno(alumno: Iusuario) {
    alumno.id = USUARIOS.length + 1;
    USUARIOS.push(alumno);
    return alumno;
  }

  async actualizarAlumno(alumno: Iusuario) {
    const index = USUARIOS.findIndex((usr) => usr.id === alumno.id && usr.rol === 'alumno');
    if (index !== -1) {
      USUARIOS[index] = alumno;
      return alumno;
    }
    throw new Error("Alumno no encontrado");
  }




}
