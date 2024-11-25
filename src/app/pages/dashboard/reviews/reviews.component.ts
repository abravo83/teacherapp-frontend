import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { USUARIOS } from '../../../db/usuarios';
import { OPINIONES } from '../../../db/opiniones';
import { MATERIAS } from '../../../db/materias';
import { MATERIAS_PROFESORES } from '../../../db/materias_profesores.db';
import { Iopinion } from '../../../interfaces/iopinion';
import { IMateriaProfesor } from '../../../interfaces/imateria-profesor.interfaces';
import { DatePipe } from '@angular/common';
import { UsuariosService } from '../../../services/usuarios.service';
import { Iusuario } from '../../../interfaces/iusuario';
import { OpinionesService } from '../../../services/opiniones.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, ReactiveFormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css'],
})
export class ReviewsComponent implements OnInit {
  router = inject(Router);
  usuariosService = inject(UsuariosService);
  opinionesService = inject(OpinionesService);

  usuario!: Iusuario;
  opiniones: Iopinion[] = [];
  opinionesFiltradas: Iopinion[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  filtroTiempo: string = '12m';

  async ngOnInit(): Promise<void> {
    try {
      this.usuario = await this.usuariosService.getUsuarioActual();
      this.opiniones = await this.opinionesService.getOpinionesByUser(
        this.usuario
      );
      this.filtrarOpiniones();
    } catch (error) {
      console.error('Error iniciar el componente:', error);
      this.router.navigate(['/dashboard']);
    }

    // const profesor = USUARIOS.find(
    //   (user) => user.rol === 'profesor' && user.activo
    // );
    // if (profesor) {
    //   const profesorId = profesor.id;

    //   const materiasIds = MATERIAS_PROFESORES.filter(
    //     (mp: IMateriaProfesor) => mp.usuarios_id === profesorId
    //   ).map((mp) => mp.materias_id);

    //   this.opiniones = OPINIONES.filter((opinion: Iopinion) =>
    //     materiasIds.includes(opinion.materia_id)
    //   ).map((opinion) => ({
    //     ...opinion,
    //     fecha: new Date(opinion.fecha),
    //   }));

    //   this.filtrarOpiniones();
    // } else {
    //   console.log('Profesor no encontrado. Verifica tus datos');
    // }
  }

  getNombreAlumno(estudianteId: number): string {
    const alumno = USUARIOS.find((usuario) => usuario.id === estudianteId);
    return alumno
      ? `${alumno.nombre} ${alumno.apellidos}`
      : 'Alumno desconocido';
  }

  getNombreMateria(materiaId: number): string {
    const materia = MATERIAS.find((materia) => materia.id === materiaId);
    return materia ? materia.nombre : 'Materia desconocida';
  }

  filtrarOpiniones(): void {
    this.opinionesFiltradas = this.opiniones.slice(0, this.itemsPerPage);
    this.totalItems = this.opiniones.length;
  }

  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
    const startIndex = (pagina - 1) * this.itemsPerPage;
    this.opinionesFiltradas = this.opiniones.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }
}
