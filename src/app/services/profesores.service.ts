import { inject, Injectable } from '@angular/core';

import { Iprofesor } from '../interfaces/iprofesor';
import { DATOS_PROFESORES } from '../db/profesores';
import { UsuariosService } from './usuarios.service';
import { Iusuario } from '../interfaces/iusuario';
import { MATERIAS } from '../db/materias';
import { USUARIOS } from '../db/usuarios';
import { MATERIAS_PROFESORES } from '../db/materias_profesores';
import {PROFESORES} from '../db/profesoresForm.db'


@Injectable({
  providedIn: 'root',
})
export class ProfesoresService {
  // Inyectables
  usuariosService = inject(UsuariosService);
  // Variables
  private arrProfesores: Iprofesor[] = DATOS_PROFESORES;
  private arrUsuarios: Iusuario[] = USUARIOS;
  private arrMateriasProfesores: any[] = MATERIAS_PROFESORES;
  private arrMaterias: any[] = MATERIAS;
  private arrinfoProf2: any[] = [];

  //GetAll obtener todos los profesores

  getAll(rol: string = 'profesor') {
    // Filtrar los usuarios por rol de profesor
    let arrinfoProf1 = this.arrUsuarios.filter(
      (usuario) => usuario.rol === rol
    );

    // Obtener los ids de los usuarios que son profesores
    let ids = arrinfoProf1.map((profe) => profe.id);

    // Filtrar la información de los profesores usando los usuarios_id
    this.arrinfoProf2 = this.arrProfesores.filter((profesor) =>
      ids.includes(profesor.usuarios_id)
    );

    // Mapeo final para combinar usuario, detalles de profesor y las materias que imparte
    let resultado = arrinfoProf1.map((persona) => {
      // Encontrar detalles del profesor
      let detalles = this.arrinfoProf2.find(
        (detalle) => detalle.usuarios_id === persona.id
      );

      // Obtener las materias que imparte el profesor
      let materias_ids = this.arrMateriasProfesores
        .filter((materiaProfe) => materiaProfe.usuarios_id === persona.id)
        .map((materiaProfe) => materiaProfe.Materias_id);

      // Convertir los ids de las materias a sus nombres
      let materias = materias_ids
        .map((idMateria) => {
          let materia = this.arrMaterias.find((m) => m.id === idMateria);
          return materia ? materia.nombre : null;
        })
        .filter(Boolean); // Filtrar nulls en caso de que alguna materia no exista

      // Combinar toda la información en el formato solicitado
      return {
        ...persona,
        ...detalles,
        materias,
      };
    });

    return resultado;
  }
  //getter para obtener todas las  materias
  getAllMaterias() {
    return this.arrMaterias;
  }

  filterByMaterias(materiaId: number) {
    // Filtrar los usuarios_id que tienen la materiaId deseada
    const usuariosFiltrados = MATERIAS_PROFESORES.filter(
      (mp) => mp.Materias_id === materiaId
    ).map((mp) => mp.usuarios_id);

    // Obtener el array de usuarios con sus datos completos
    return USUARIOS.filter((usuario) =>
      usuariosFiltrados.includes(usuario.id)
    ).map((usuario) => {
      // Obtener datos adicionales del profesor
      const profesorDatos = DATOS_PROFESORES.find(
        (dp) => dp.usuarios_id === usuario.id
      );
      // Obtener las materias que enseña el profesor
      const materias = MATERIAS_PROFESORES.filter(
        (mp) => mp.usuarios_id === usuario.id
      )
        .map((mp) => MATERIAS.find((m) => m.id === mp.Materias_id)?.nombre)
        .filter(Boolean) as string[];

      return {
        ...usuario,
        ...profesorDatos,
        materias,
      };
    });
  }




  //ARTURO

  getProfesorById(id: number): Promise<Iprofesor | undefined> {
    return new Promise((resolve) => {
      const profesor = PROFESORES.find((prof) => prof.id === id);
      resolve(profesor);
    });
  }

  async registroProfesor(profesor: Iprofesor, materias: number[]) {
    profesor.id = PROFESORES.length + 1;
    profesor.usuarios_id = profesor.id;
    PROFESORES.push(profesor);
    await this.actualizarMateriasProfesor(profesor.usuarios_id, materias);
    return profesor;
  }

  async actualizarProfesor(profesor: Iprofesor, materias: number[]) {
    const index = PROFESORES.findIndex((prof) => prof.id === profesor.id);
    if (index !== -1) {
      PROFESORES[index] = { ...PROFESORES[index], ...profesor };
      await this.actualizarMateriasProfesor(profesor.usuarios_id, materias);
      return profesor;
    }
    throw new Error("Profesor no encontrado");
  }

  private actualizarMateriasProfesor(profesorId: number, materias: number[]) {
    MATERIAS_PROFESORES.splice(0, MATERIAS_PROFESORES.length, ...MATERIAS_PROFESORES.filter(
      (item) => item.usuarios_id !== profesorId
    ));
    materias.forEach((materiaId) => {
      MATERIAS_PROFESORES.push({ id: MATERIAS_PROFESORES.length + 1, usuarios_id: profesorId, Materias_id: materiaId });
    });
  }
}
