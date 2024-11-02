import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { INSCRIPCIONES_CLASE } from '../db/inscripciones_clase';
import { PROFESORES } from '../db/profesoresForm.db';
import { USUARIOS } from '../db/usuarios';
import { MATERIAS } from '../db/materias';

@Injectable({
  providedIn: 'root',
})
export class TeacherDataService {
  private currentUserId = 1;

  getScheduledClasses(): Observable<any[]> {
    const classes = INSCRIPCIONES_CLASE.filter(
      (inscription) => inscription.profesor_id === this.currentUserId
    ).map((inscription) => {
      const profesor = PROFESORES.find(
        (prof) => prof.usuario.id === this.currentUserId
      );
      const precioClase = profesor?.profesor.precio_hora || 0;

      const alumno = USUARIOS.find((user) => user.id === inscription.alumno_id);

      const materia = MATERIAS.find((m) => m.id === inscription.materia_id);

      return {
        ...inscription,
        precio_clase: precioClase,
        alumnoNombre: alumno
          ? `${alumno.nombre} ${alumno.apellidos}`
          : 'Desconocido',
        claseNombre: materia?.nombre || 'Asignatura no especificada',
        numClases: 1, // Este es un valor ejemplo; cámbialo según tus datos
        totalPagado: precioClase * 1, // Reemplaza `1` con `numClases` si es dinámico
      };
    });

    return of(classes);
  }
}
