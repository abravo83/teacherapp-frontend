import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Iprofesor } from '../../interfaces/iprofesor';
import { ProfesoresService } from '../../services/profesores.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MATERIAS } from '../../db/materias';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MATERIAS_PROFESORES } from '../../db/profesoresForm.db';

@Component({
  selector: 'app-form-teacher',
  standalone: true,
  templateUrl: './form-teacher.component.html',
  styleUrls: ['./form-teacher.component.css'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class FormTeacherComponent implements OnInit {
  profesoresService = inject(ProfesoresService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  errorForm: any[] = [];
  tipo: string = 'Registra';
  teacherForm: FormGroup;
  materiasList = MATERIAS;
  limiteMateriasExcedido = false;
  desplegableAbierto = false;

  constructor() {
    this.teacherForm = new FormGroup({
      id: new FormControl(null), // Añadido para gestionar el id
      nombre: new FormControl(null, [Validators.required, Validators.maxLength(45)]),
      apellidos: new FormControl(null, [Validators.required, Validators.maxLength(150)]),
      email: new FormControl(null, [Validators.required, Validators.email, Validators.maxLength(60)]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(255),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]),
      repitepassword: new FormControl(null, [Validators.required]),
      foto: new FormControl(null, [Validators.maxLength(255), Validators.pattern(/^https?:\/\/.*\.(?:png|jpg|jpeg|webp)$/)]),
      telefono: new FormControl(null, [Validators.required, Validators.pattern(/^\d{9}$/)]),
      precio_hora: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(99.99)]),
      localizacion: new FormControl(null, [Validators.maxLength(254)]),
      meses_experiencia: new FormControl(null, [Validators.required, Validators.min(0)]),
      materias: new FormControl([], [Validators.required])
    }, { validators: this.validadorCoincidenciaContraseñas });
  }

  validadorCoincidenciaContraseñas: ValidatorFn = (group: AbstractControl): { [key: string]: any } | null => {
    const password = group.get('password')?.value;
    const repitepassword = group.get('repitepassword')?.value;
    return password === repitepassword ? null : { checkpassword: true };
  };

  checkControl(formControlName: string, validador: string) {
    return (
      this.teacherForm.get(formControlName)?.hasError(validador) &&
      this.teacherForm.get(formControlName)?.touched
    );
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.id) {
        this.tipo = 'Actualizar';
        const profesor: Iprofesor | undefined = await this.profesoresService.getProfesorById(Number(params.id));
        if (profesor) {
          this.teacherForm.patchValue({
            id: profesor.id, 
            nombre: profesor.nombre,
            apellidos: profesor.apellidos,
            email: profesor.email,
            foto: profesor.foto,
            telefono: profesor.telefono,
            precio_hora: profesor.precio_hora,
            localizacion: profesor.localizacion,
            meses_experiencia: profesor.meses_experiencia,
            materias: this.obtenerMateriasProfesor(profesor.usuarios_id),
          });
        }
      }
    });
  }

  obtenerMateriasProfesor(profesorId: number): number[] {
    return MATERIAS_PROFESORES
      .filter(relacion => relacion.usuarios_id === profesorId)
      .map(relacion => relacion.Materias_id);
  }

  alternarDesplegable() {
    this.desplegableAbierto = !this.desplegableAbierto;
  }

  cambiarMateria(event: any) {
    const selectedMaterias = this.teacherForm.value.materias || [];
    const materiaId = event.target.value;
    if (event.target.checked) {
      if (selectedMaterias.length < 3) {
        selectedMaterias.push(materiaId);
        this.limiteMateriasExcedido = false;
      } else {
        this.limiteMateriasExcedido = true;
        event.target.checked = false;
      }
    } else {
      const index = selectedMaterias.indexOf(materiaId);
      if (index !== -1) {
        selectedMaterias.splice(index, 1);
      }
      this.limiteMateriasExcedido = false;
    }
    this.teacherForm.get('materias')?.setValue(selectedMaterias);
  }

  async obtenerDatosFormulario() {
    const formData = {
      profesor: {
        ...this.teacherForm.value,
        rol: 'profesor',
        activo: true,
        validado: false,
      },
      materias: this.teacherForm.value.materias,
    };
    console.log("Datos enviados:", formData);

    delete formData.profesor.repitepassword;

    if (formData.profesor.id) {
      try {
        const response = await this.profesoresService.actualizarProfesor(formData.profesor, formData.materias);
        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Profesor actualizado exitosamente.',
            confirmButtonColor: '#28a745'
          });
          this.router.navigate(['/home']);
        }
      } catch (error: any) {
        this.errorForm = error;
      }
    } else {
      try {
        const response = await this.profesoresService.registroProfesor(formData.profesor, formData.materias);
        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Profesor registrado exitosamente.',
            confirmButtonColor: '#28a745'
          });
          this.router.navigate(['/home']);
        }
      } catch (error: any) {
        this.errorForm = error;
      }
    }
  }
}
