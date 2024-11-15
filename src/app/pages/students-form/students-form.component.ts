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
import { environment } from '../../../environments/environments';

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
  archivoSeleccionado: File | null = null;
  mostrarCamposContrasena: boolean = false;

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
        password: new FormControl(null),
        repitepassword: new FormControl(null),
        foto: new FormControl(null),
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

  toggleCamposContrasena() {
    this.mostrarCamposContrasena = !this.mostrarCamposContrasena;

    if (this.mostrarCamposContrasena) {
      this.studentForm.get('password')?.setValidators([
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(255),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/),
      ]);
      this.studentForm.get('repitepassword')?.setValidators([
        Validators.required,
      ]);
    } else {
      this.studentForm.get('password')?.clearValidators();
      this.studentForm.get('repitepassword')?.clearValidators();
    }

    this.studentForm.get('password')?.updateValueAndValidity();
    this.studentForm.get('repitepassword')?.updateValueAndValidity();
  }

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
        const alumno: any | undefined = await this.alumnosService.getAlumnoById(
          Number(params.id)
        );
        if (alumno && alumno.rol === 'alumno') {
          this.studentForm.patchValue(alumno);
          if (alumno.foto) {
            this.profileImgUrl = environment.API_URL + alumno.foto;
          }
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

      // Mostrar opción de contraseña solo al actualizar
      if (this.tipo === 'Actualizar') {
        this.mostrarCamposContrasena = false; // Opcional al inicio
      }
    });
  }

  async obtenerDatosFormulario() {
    if (!this.studentForm.valid) {
      console.log('Formulario no válido', this.studentForm.errors);
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor, revisa los campos y corrige los errores.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    const formData = new FormData();

    const datosAlumno: Iusuario = {
      id: this.studentForm.value.id,
      nombre: this.studentForm.value.nombre,
      apellidos: this.studentForm.value.apellidos,
      email: this.studentForm.value.email,
      password: this.mostrarCamposContrasena ? this.studentForm.value.password : '',
      rol: 'alumno',
      activo: true,
    };

    if (this.mostrarCamposContrasena) {
      datosAlumno.password = this.studentForm.value.password;
    }

    formData.append('datos', JSON.stringify(datosAlumno));

    if (this.studentForm.get('foto')?.value instanceof File) {
      formData.append('imagen', this.studentForm.get('foto')?.value);
    }

    try {
      if (this.tipo === 'Actualizar') {
        await this.alumnosService.actualizarAlumno(formData, datosAlumno.id);
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
    } catch (error: any) {
      const errorMessage = error?.error?.message || 'Ocurrió un error inesperado.';
      const errorsList = error?.error?.errors || [];

      // Verificar si el error es un caso de duplicación
      if (errorMessage.toLowerCase().includes('duplicate')) {
        Swal.fire({
          icon: 'warning',
          title: 'Email ya registrado',
          text: 'El email proporcionado ya está registrado. Por favor, usa otro email o intenta iniciar sesión.',
          confirmButtonColor: '#d33',
        });
        return;
      }

      if (errorsList.length > 0) {
        const detailedErrors = errorsList.map(
          (err: { field: string; message: string }) =>
            `${err.field}: ${err.message}`
        ).join('<br>');

        Swal.fire({
          icon: 'error',
          title: 'Errores en los datos',
          html: detailedErrors, // Mostrar errores en formato HTML
          confirmButtonColor: '#d33',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          confirmButtonColor: '#d33',
        });
      }
    }
  }


  obtenerImagen(event: Event): void {
    const maxFileSize = 1 * 1024 * 1024; // 2MB
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const archivo = input.files[0];

      if (archivo.size > maxFileSize) {
        this.profileImgUrl = '/img/no_profile_freepick.webp';
        this.archivoSeleccionado = null;
        this.studentForm.get('foto')?.setValue(null);

        Swal.fire({
          icon: 'warning',
          title: 'Imagen demasiado grande.',
          text: 'La imagen excede el tamaño máximo de 1MB.',
          confirmButtonColor: '#28a745',
        });
        return;
      }

      if (!tiposPermitidos.includes(archivo.type)) {
        this.profileImgUrl = '/img/no_profile_freepick.webp';
        this.archivoSeleccionado = null;
        this.studentForm.get('foto')?.setValue(null);

        Swal.fire({
          icon: 'warning',
          title: 'Formato no válido',
          text: 'Solo se permiten archivos JPG, PNG o WEBP',
          confirmButtonColor: '#28a745',
        });
        return;
      }

      this.archivoSeleccionado = archivo;
      this.studentForm.get('foto')?.setValue(archivo);

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          this.profileImgUrl = e.target.result as string;
        }
      };
      reader.readAsDataURL(archivo);
    } else {
      this.profileImgUrl = '/img/no_profile_freepick.webp';
      this.archivoSeleccionado = null;
      this.studentForm.get('foto')?.setValue(null);
    }
  }
}
