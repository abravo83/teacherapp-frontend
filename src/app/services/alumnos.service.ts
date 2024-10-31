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
  console.log('Obteniendo alumno por ID:', id);
  return new Promise((resolve) => {
    const alumno = USUARIOS.find((usr) => usr.id === id && usr.rol === 'alumno');
    console.log('Resultado de búsqueda de alumno:', alumno);
    resolve(alumno);
  });
}

async registroAlumno(alumno: Iusuario) {
  console.log('Registrando alumno:', alumno);
  alumno.id = USUARIOS.length + 1;
  USUARIOS.push(alumno);
  console.log('Alumno añadido:', alumno);
  console.log('Array de usuarios actualizado:', USUARIOS);
  return alumno;
}

async actualizarAlumno(alumno: Iusuario) {
  console.log('Actualizando alumno:', alumno);
  const index = USUARIOS.findIndex((usr) => usr.id === alumno.id && usr.rol === 'alumno');
  if (index !== -1) {
    USUARIOS[index] = alumno;
    console.log('Alumno actualizado en la posición', index);
    console.log('Array de usuarios después de actualizar:', USUARIOS);
    return alumno;
  }
  console.log("Error: Alumno no encontrado");
  throw new Error("Alumno no encontrado");
}





}
