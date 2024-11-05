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
  selector: 'app-students-form',
  standalone: true,
  templateUrl: './students-form.component.html',
  styleUrls: ['./students-form.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class StudentsFormComponent implements OnInit {
  alumnosService = inject(AlumnosService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  errorForm: any[] = [];
  tipo: string = 'Registra';
  studentForm: FormGroup;
  profileImgUrl: string = '/img/no_profile_freepick.webp';

  constructor() {
    this.studentForm = new FormGroup(
      {
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
        if (alumno && alumno.rol === 'alumno') {
          this.studentForm.patchValue(alumno);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Usuario no encontrado o no es un alumno',
            confirmButtonColor: '#d33',
          });
          this.router.navigate(['/home']);
        }
      }
    });
  }

  async obtenerDatosFormulario() {
    const { repitepassword, ...alumnoData } = this.studentForm.value;
    const formData: Iusuario = {
      ...alumnoData,
      rol: 'alumno',
      activo: true,
    };
    console.log(formData);

    try {
      if (this.tipo === 'Actualizar') {
        await this.alumnosService.actualizarAlumno(formData);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Alumno actualizado exitosamente.',
          confirmButtonColor: '#28a745',
        });
      } else {
        await this.alumnosService.registroAlumno(formData);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Alumno registrado exitosamente.',
          confirmButtonColor: '#28a745',
        });
      }
      this.router.navigate(['/home']);
    } catch (error) {
      this.errorForm = error as any;
    }
  }

  obtenerImagen(event: Event): void {
    // Limitar el tamano maximo de la imagen
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    // Obtener el archivo
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const archivo = input.files[0];

      if (archivo.size > maxFileSize) {
        this.profileImgUrl = '/img/no_profile_freepick.webp';
        this.studentForm.patchValue({
          foto: null,
        });

        Swal.fire({
          icon: 'warning',
          title: 'Imagen demasiado grande.',
          text: 'La imagen excede el tamaño maximo de 2MB.',
          confirmButtonColor: '#28a745',
        });
        return;
      }
      // Crear URL temporal para mostrar la imagen
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.profileImgUrl = e.target.result as string;
        }
      };
      reader.readAsDataURL(archivo);

      // Guardar el archivo en el formulario
      this.studentForm.patchValue({
        foto: archivo,
      });
    }
  }
}
