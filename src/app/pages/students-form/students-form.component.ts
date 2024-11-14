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
          // Si el alumno tiene una foto, establecer la URL de la imagen
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
    });
  }

  async obtenerDatosFormulario() {
    if (!this.studentForm.valid) {
      console.log('Formulario no válido', this.studentForm.errors);
      return;
    }

    const formData = new FormData();

    // Crear objeto datosAlumno compatible con la interfaz Iusuario
    const datosAlumno: Iusuario = {
      id: this.studentForm.value.id,
      nombre: this.studentForm.value.nombre,
      apellidos: this.studentForm.value.apellidos,
      email: this.studentForm.value.email,
      password: this.studentForm.value.password,
      rol: 'alumno',
      activo: true,
    };

    // Adjuntar datos del alumno
    formData.append('datos', JSON.stringify(datosAlumno));

    // Adjuntar imagen de perfil si existe
    if (this.studentForm.get('foto')?.value instanceof File) {
      formData.append('imagen', this.studentForm.get('foto')?.value);
    }

    console.log('Contenido completo de FormData:');
    for (let pair of (formData as any).entries()) {
      console.log(pair[0] + ':', pair[1]);
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
    } catch (error) {
      this.errorForm = error as any;
    }
  }

  obtenerImagen(event: Event): void {
    const maxFileSize = 1 * 1024 * 1024; // 2MB
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];

    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const archivo = input.files[0];

      // Validar tamaño del archivo
      if (archivo.size > maxFileSize) {
        this.profileImgUrl = '/img/no_profile_freepick.webp';
        this.archivoSeleccionado = null;
        this.studentForm.get('foto')?.setValue(null);

        Swal.fire({
          icon: 'warning',
          title: 'Imagen demasiado grande.',
          text: 'La imagen excede el tamaño maximo de 1MB.',
          confirmButtonColor: '#28a745',
        });
        return;
      }

      // Validar tipo de archivo
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

      // Almacenar el archivo seleccionado
      this.archivoSeleccionado = archivo;

      // Actualizar el FormControl
      this.studentForm.get('foto')?.setValue(archivo);

      // Crear URL temporal para mostrar la imagen
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
