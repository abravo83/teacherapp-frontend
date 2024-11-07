import { Injectable } from '@angular/core';
import { IMateriaProfesor } from '../interfaces/imateria-profesor.interfaces';
import { MATERIAS_PROFESORES } from '../db/materias_profesores.db';
import { MATERIAS } from '../db/materias.db';
@Injectable({
  providedIn: 'root',
})
export class MateriasService {
  async getMaterias(): Promise<any[]> {
    return MATERIAS;
  }

  async obtenerMateriasProfesor(profesorId: number): Promise<number[]> {
    return MATERIAS_PROFESORES.filter(
      (relacion: IMateriaProfesor) => relacion.usuarios_id === profesorId
    ).map((relacion: IMateriaProfesor) => relacion.materias_id);
  }
}
