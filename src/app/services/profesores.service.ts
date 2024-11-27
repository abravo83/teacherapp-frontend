import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, lastValueFrom } from 'rxjs';

import { environment } from '../../environments/environments';
import { Iprofesor } from '../interfaces/iprofesor';
import { DATOS_PROFESORES } from '../db/profesores';
import { UsuariosService } from './usuarios.service';
import { Iusuario } from '../interfaces/iusuario';
import { MATERIAS } from '../db/materias';
import { USUARIOS } from '../db/usuarios';
import { MATERIAS_PROFESORES } from '../db/materias_profesores';

import { IRespuestaTeachersForm } from '../interfaces/iRespuestaTeachersForm.interface';
import { Imateria } from '../interfaces/imateria';

@Injectable({
  providedIn: 'root',
})
export class ProfesoresService {
  // Inyectables
  usuariosService = inject(UsuariosService);
  httpClient = inject(HttpClient);

  // Variables
  BASE_URL = `${environment.API_URL}/api/profesores`;
  BASE_URL_MAT = `${environment.API_URL}/api/materias`;
  private arrProfesores: Iprofesor[] = DATOS_PROFESORES;
  private arrUsuarios: Iusuario[] = USUARIOS;
  private arrMateriasProfesores: any[] = MATERIAS_PROFESORES;
  private arrMaterias: any[] = [];
  private arrinfoProf2: any[] = [];

  //HOME

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

  getAllMaterias() {
    return lastValueFrom(this.httpClient.get<Imateria[]>(this.BASE_URL_MAT));
  }

  filterByMaterias(
    materiaId: number,
    experiencia: [number, number] = [0, 1000000],
    precio: [number, number] = [0, 1000000]
  ) {
    // Filtrar los usuarios_id que tienen la materiaId deseada
    const usuariosFiltrados = MATERIAS_PROFESORES.filter(
      (mp) => mp.Materias_id === materiaId
    ).map((mp) => mp.usuarios_id);

    // Obtener el array de usuarios con sus datos completos
    return USUARIOS.filter((usuario) => usuariosFiltrados.includes(usuario.id))
      .map((usuario) => {
        // Obtener datos adicionales del profesor
        const profesorDatos = DATOS_PROFESORES.find(
          (dp) =>
            dp.usuarios_id === usuario.id &&
            dp.meses_experiencia >= experiencia[0] &&
            dp.meses_experiencia <= experiencia[1] &&
            dp.precio_hora >= precio[0] &&
            dp.precio_hora <= precio[1]
        );

        // Si el profesor no cumple con el rango de experiencia o precio, se omite
        if (!profesorDatos) return null;

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
      })
      .filter(Boolean); // Eliminar los elementos nulos
  }

  getFiltro(filtro: {
    idmateria: number;
    experiencia: number[];
    precio: number;
  }) {
    // Filtrar por los profesores que imparten la materia indicada
    const profesoresConMateria = MATERIAS_PROFESORES.filter(
      (item) => item.Materias_id === filtro.idmateria
    );
    console.log(profesoresConMateria);
    // Filtrar profesores según la experiencia y el precio
    const profesoresFiltrados = profesoresConMateria
      .map((item) => {
        const profesor = DATOS_PROFESORES.find(
          (prof) =>
            prof.usuarios_id === item.usuarios_id &&
            prof.meses_experiencia >= filtro.experiencia[0] &&
            prof.meses_experiencia <= filtro.experiencia[1] &&
            prof.precio_hora <= filtro.precio &&
            prof.validado // Omitir si no deseas considerar si está validado o no
        );

        if (profesor) {
          const usuario = USUARIOS.find(
            (user) => user.id === profesor.usuarios_id
          );
          const materia = MATERIAS.find((mat) => mat.id === item.Materias_id);
          return {
            profesor: usuario ? `${usuario.nombre} ${usuario.apellidos}` : '',
            materia: materia ? materia.nombre : '',
            experiencia: profesor.meses_experiencia,
            precio_hora: profesor.precio_hora,
            localizacion: profesor.localizacion,
            telefono: profesor.telefono,
          };
        }
        return null;
      })
      .filter((item) => item !== null);
    console.log(profesoresFiltrados);
    return profesoresFiltrados;
  }

  getAllProfesores() {
    return lastValueFrom(this.httpClient.get<Iprofesor[]>(this.BASE_URL));
  }

  //FORMULARIO REGISTRO Y PROFESOR
  getProfesorById(id: number): Promise<IRespuestaTeachersForm | undefined> {
    return firstValueFrom(
      this.httpClient.get<IRespuestaTeachersForm>(`${this.BASE_URL}/${id}`)
    );
  }

  async registroProfesor(formData: FormData): Promise<any> {
    return firstValueFrom(
      this.httpClient.post<Iusuario>(`${this.BASE_URL}/registro`, formData)
    );
  }

  async actualizarProfesor(formData: FormData, id: number): Promise<any> {
    return firstValueFrom(
      this.httpClient.put<Iusuario>(`${this.BASE_URL}/${id}`, formData)
    );
  }

  //Panel administrador
  async listarProfesores(): Promise<Iprofesor[]> {
    return firstValueFrom(this.httpClient.get<Iprofesor[]>(this.BASE_URL));
  }

  async validarProfesor(
    id: number,
    validado: boolean
  ): Promise<{ message: string }> {
    const url = `${this.BASE_URL}/validar/${id}`;
    return firstValueFrom(
      this.httpClient.put<{ message: string }>(url, { validado })
    );
  }
}
