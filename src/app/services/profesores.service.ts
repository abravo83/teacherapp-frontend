import { inject, Injectable } from '@angular/core';

import { Iprofesor } from '../interfaces/iprofesor';
import { DATOS_PROFESORES } from '../db/profesores';
import { UsuariosService } from './usuarios.service';

@Injectable({
  providedIn: 'root',
})
export class ProfesoresService {
  // Inyectables
  usuariosService = inject(UsuariosService);
  // Variables
  arrDatosProfesores: Iprofesor[] = DATOS_PROFESORES;
  arrTempProfesores!: any[];
  arrProfesores!: Iprofesor[];

  constructor() {
    this.arrTempProfesores = this.usuariosService.arrUsuarios.filter(
      (usuario) => usuario.rol === 'profesor'
    );

    // Agregando los datos del array de datos profesores.
    this.arrProfesores = this.arrTempProfesores
      .map((profesor) => {
        const datosDeEsteProfesor = this.arrDatosProfesores.find(
          (dato) => dato.usuarios_id === profesor.id
        );

        if (datosDeEsteProfesor) {
          return {
            ...profesor,
            precio_hora: datosDeEsteProfesor.precio_hora || 0,
            localizacion: datosDeEsteProfesor.localizacion || '',
            telefono: datosDeEsteProfesor.telefono || '',
            meses_experiencia: datosDeEsteProfesor.meses_experiencia || 0,
            validado: datosDeEsteProfesor.validado || false,
          };
        }

        return null;
      })
      .filter(Boolean);
  }
}
