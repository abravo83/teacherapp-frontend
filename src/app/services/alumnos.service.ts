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
      const alumno = USUARIOS.find((user) => user.id === id && user.rol === 'alumno');
      resolve(alumno);
    });
  }

  async registroAlumno(formData: FormData): Promise<Iusuario> {
    const alumnoData = JSON.parse(formData.get('datos') as string) as Iusuario;
    
    const nuevoAlumno: Iusuario = {
      id: USUARIOS.length + 1,
      ...alumnoData,
    };

    // Agregar el nuevo alumno a la lista
    USUARIOS.push(nuevoAlumno);
    return nuevoAlumno;
  }

  async actualizarAlumno(formData: FormData): Promise<Iusuario> {
    const alumnoData = JSON.parse(formData.get('datos') as string) as Iusuario;

    const index = USUARIOS.findIndex(
      (user) => user.id === alumnoData.id && user.rol === 'alumno'
    );

    if (index !== -1) {
      USUARIOS[index] = { ...USUARIOS[index], ...alumnoData };
      return USUARIOS[index];
    }

    throw new Error('Alumno no encontrado o no tiene rol de alumno');
  }
}
