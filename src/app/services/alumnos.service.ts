import { inject, Injectable } from '@angular/core';
import { Iusuario } from '../interfaces/iusuario';
import { UsuariosService } from './usuarios.service';

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
}
