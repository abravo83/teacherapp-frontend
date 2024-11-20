import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Iusuario } from '../../../interfaces/iusuario';
import { Iprofesor } from '../../../interfaces/iprofesor';
import { IMateriaProfesor } from '../../../interfaces/imateria-profesor.interfaces';
import { USUARIOS } from '../../../db/usuarios';
import { DATOS_PROFESORES } from '../../../db/profesores';
import { MATERIAS_PROFESORES } from '../../../db/materias_profesores.db';
import { MATERIAS } from '../../../db/materias.db';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css',
  standalone: true,
  imports: [DatePipe, FormsModule, ReactiveFormsModule, CommonModule],
})
export class MyAccountComponent implements OnInit {
  myAccountForm: FormGroup;
  fotoUrl: string | null = null; // Añadimos esta propiedad para la foto
  usuarioId = 1; // Este ID se puede obtener dinámicamente del sistema de autenticación
  modoEdicion: boolean = false; // Única variable para controlar el modo edición

  constructor(private fb: FormBuilder, private router: Router) {
    this.myAccountForm = this.fb.group({
      usuario: this.fb.group({
        nombre: ['', [Validators.required, Validators.maxLength(45)]],
        apellidos: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [''],
        telefono: ['', Validators.required],
      }),
      profesor: this.fb.group({
        precio_hora: ['', Validators.required],
        localizacion: ['', Validators.required],
        meses_experiencia: ['', Validators.required],
        materias: this.fb.array([]),
      }),
      direccion: [''],
      sobre_mi: [''],
    });
  }

  ngOnInit(): void {
    // Cargar datos de usuario y profesor
    const usuarioData: Iusuario | undefined = USUARIOS.find(
      (user) => user.id === this.usuarioId
    );
    console.log('Datos de usuario:', usuarioData);

    // Verifica si el usuario es profesor
    if (usuarioData?.rol !== 'profesor') {
      console.error('Acceso denegado: El usuario no es profesor.');
      this.router.navigate(['/']); // Redirige si el rol no es correcto
      return;
    }

    // Cargar datos del usuario en el formulario
    this.myAccountForm.get('usuario')?.patchValue(usuarioData);

    const profesorData = DATOS_PROFESORES.find(
      (profesor) => profesor.usuarios_id === this.usuarioId
    );

    if (profesorData) {
      this.myAccountForm.get('profesor')?.patchValue(profesorData);

      const materiasRelacionadas: IMateriaProfesor[] =
        MATERIAS_PROFESORES.filter(
          (relacion) => relacion.usuarios_id === this.usuarioId
        );

      // Cargar materias en el formulario
      const materiasFormArray = this.myAccountForm.get(
        'profesor.materias'
      ) as FormArray;

      materiasRelacionadas.forEach((relacion: IMateriaProfesor) => {
        const materia = MATERIAS.find((mat) => mat.id === relacion.materias_id);
        if (materia) {
          materiasFormArray.push(this.fb.control(materia.nombre));
        }
      });

      this.myAccountForm.get('usuario')?.disable();
      this.myAccountForm.get('profesor')?.disable();
    }
  }

  get materias(): FormArray {
    return this.myAccountForm.get('profesor.materias') as FormArray;
  }

  // Método para manejar la imagen seleccionada
  obtenerImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.fotoUrl = reader.result as string;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  // Método de validación de errores
  checkControl(controlName: string, errorType: string): boolean {
    const control = this.myAccountForm.get(controlName);
    return !!(control && control.hasError(errorType) && control.touched);
  }

  // Activar/desactivar modo de edición
  activarEdicion(): void {
    this.modoEdicion = !this.modoEdicion;

    const usuarioGroup = this.myAccountForm.get('usuario');
    const profesorGroup = this.myAccountForm.get('profesor');

    if (this.modoEdicion) {
      // Habilitar todos los controles del formulario al editar
      this.myAccountForm.get('usuario')?.enable();
      this.myAccountForm.get('profesor')?.enable();
    } else {
      // Deshabilitar controles al guardar
      this.myAccountForm.get('usuario')?.disable();
      this.myAccountForm.get('profesor')?.disable();
      this.guardarCambios();
    }
  }

  // Método para guardar cambios
  guardarCambios(): void {
    if (this.myAccountForm.valid) {
      const formData: Iprofesor = this.myAccountForm.value;
      console.log('Datos actualizados:', formData);
      // Aquí iría la lógica para guardar los cambios, como llamar a un servicio
    }
  }
}
