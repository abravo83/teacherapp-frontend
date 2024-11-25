import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { USUARIOS } from '../../../db/usuarios';
import { Iusuario } from '../../../interfaces/iusuario';
import { INSCRIPCIONES_CLASE } from '../../../db/inscripciones_clase';
import { CommonModule } from '@angular/common';
import { MATERIAS } from '../../../db/materias';

interface AlumnoConInscripcion extends Iusuario {
  fechaInscripcion?: Date | null;
  clase?: string;
}

@Component({
  selector: 'app-my-students',
  templateUrl: './my-students.component.html',
  styleUrl: './my-students.component.css',
  standalone: true,
  imports: [DatePipe, CommonModule, ReactiveFormsModule, FormsModule],
})
export class MyStudentsComponent implements OnInit {
  alumnos: AlumnoConInscripcion[] = []; // Aquí se almacenará la lista de alumnos filtrados
  filterForm: FormGroup; // Formulario para filtros de estado y fecha

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      estado: [''], // Filtro por estado
      fecha: [''], // Filtro por fecha de inscripción
    });
  }

  ngOnInit(): void {
    // 1. Filtramos solo los usuarios que tienen el rol "alumno" y están activos
    const alumnosUsuarios = USUARIOS.filter(
      (user) => user.rol === 'alumno' && user.activo
    );

    // 2. Asignamos a cada alumno su fecha de inscripción desde `INSCRIPCIONES_CLASE`
    this.alumnos = alumnosUsuarios.map((alumno) => {
      const inscripcion = INSCRIPCIONES_CLASE.find(
        (ins) => ins.alumno_id === alumno.id
      );
      // Encuentra la materia para obtener el nombre de la clase
      const materia = inscripcion
        ? MATERIAS.find((mat) => mat.id === inscripcion.materia_id)
        : null;

      return {
        ...alumno,
        fechaInscripcion: inscripcion ? inscripcion.fecha_registro : undefined,
        clase: materia ? materia.nombre : 'Clase desconocida', // Añadimos la clase o mostramos un valor por defecto
      };
    });

    // Si necesitas aplicar algún filtro inicial, hazlo aquí
    this.applyFilters();
  }

  applyFilters() {
    const { estado, fecha } = this.filterForm.value;
    // Lógica para aplicar filtros en la tabla de alumnos
  }

  toggleEstado(alumno: Iusuario) {
    alumno.activo = !alumno.activo;
  }

  // Método para validar el alumno (simulación)
  validarAlumno(alumno: any) {
    console.log(`Alumno ${alumno.nombre} validado.`);
    // Aquí puedes implementar la lógica de validación
  }
}
