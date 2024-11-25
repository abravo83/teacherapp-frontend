import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { Iusuario } from '../../interfaces/iusuario';
import { AlumnosService } from '../../services/alumnos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-student',
  standalone: true,
  templateUrl: './form-student.component.html',
  styleUrls: ['./form-student.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class FormStudentComponent implements OnInit {
  alumnosService = inject(AlumnosService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  errorForm: any[] = [];
  tipo: string = 'Registra';
  studentForm: FormGroup;

  constructor() {
    this.studentForm = new FormGroup(
      {
        id: new FormControl(null),
        nombre: new FormControl(null, [
          Validators.required,
          Validators.maxLength(45),
        ]),
        apellidos: new FormControl(null, [
          Validators.required,
          Validators.maxLength(150),
        ]),
        email: new FormControl(null, [
          Validators.required,
          Validators.email,
          Validators.maxLength(60),
        ]),
        password: new FormControl(null, [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(255),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/),
        ]),
        repitepassword: new FormControl(null, [Validators.required]),
        foto: new FormControl(null, [
          Validators.maxLength(255),
          Validators.pattern(/^https?:\/\/.*\.(?:png|jpg|jpeg|webp)$/),
        ]),
      },
      { validators: this.validadorCoincidenciaContraseñas }
    );
  }

  validadorCoincidenciaContraseñas: ValidatorFn = (
    group: AbstractControl
  ): { [key: string]: any } | null => {
    const password = group.get('password')?.value;
    const repitepassword = group.get('repitepassword')?.value;
    return password === repitepassword ? null : { checkpassword: true };
  };

  checkControl(formControlName: string, validador: string) {
    return (
      this.studentForm.get(formControlName)?.hasError(validador) &&
      this.studentForm.get(formControlName)?.touched
    );
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.id) {
        this.tipo = 'Actualizar';
        const alumno: Iusuario | undefined =
          await this.alumnosService.getAlumnoById(Number(params.id));
        if (alumno) {
          this.studentForm.patchValue(alumno);
        }
      }
    });
  }

  async obtenerDatosFormulario() {
    const formData = {
      alumno: {
        ...this.studentForm.value,
        rol: 'alumno',
        activo: true,
      },
    };

    delete formData.alumno.repitepassword;

    console.log(formData);
    if (formData.alumno.id) {
      try {
        const response = await this.alumnosService.actualizarAlumno(
          formData.alumno,
          formData.alumno.id
        );
        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Alumno actualizado exitosamente.',
            confirmButtonColor: '#28a745',
          });
          this.router.navigate(['/home']);
        }
      } catch (error: any) {
        this.errorForm = error;
      }
    } else {
      try {
        const response = await this.alumnosService.registroAlumno(
          formData.alumno
        );
        if (response) {
          Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Alumno registrado exitosamente.',
            confirmButtonColor: '#28a745',
          });
          this.router.navigate(['/home']);
        }
      } catch (error: any) {
        this.errorForm = error;
      }
    }
  }
}
