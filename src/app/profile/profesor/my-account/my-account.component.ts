import { Component, inject, OnInit } from '@angular/core';
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
import { DATOS_PROFESORES } from '../../../db/profesores';
import { MATERIAS_PROFESORES } from '../../../db/materias_profesores.db';
import { MATERIAS } from '../../../db/materias.db';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { UsuariosService } from '../../../services/usuarios.service';
import { StudentsFormComponent } from '../../../pages/students-form/students-form.component';
import { TeachersFormComponent } from '../../../pages/teachers-form/teachers-form.component';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    StudentsFormComponent,
    TeachersFormComponent,
  ],
})
export class MyAccountComponent implements OnInit {
  // !La zona privada es común para todos los perfiles (profesor o alumno)

  // Inyectables
  loginService = inject(LoginService);
  usuariosService = inject(UsuariosService);

  // Variables
  usuarioLogueado: Iusuario = {
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    rol: '',
    activo: false,
  };
  fotoUrl: string | null = null;
  usuarioId = 1; // Este ID obtener del serv login
  modoEdicion: boolean = false; // Controlar del modo edición

  myAccountForm: FormGroup;

  // Constructor
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

  async ngOnInit(): Promise<void> {
    const usuarioId = this.loginService.getLoggedUserId();

    if (this.usuariosService.arrUsuarios.length) {
      this.usuarioLogueado = this.getUsuarioLogueado(
        usuarioId,
        this.usuariosService.arrUsuarios
      );
    } else {
      this.usuariosService.arrUsuarios =
        await this.usuariosService.getAllUsers();
      this.usuarioLogueado = this.getUsuarioLogueado(
        usuarioId,
        this.usuariosService.arrUsuarios
      );
    }

    // Volcamos los datos del usuario logueado
    const usuarioData: Iusuario = this.usuarioLogueado;

    // Cargar datos del usuario en el formulario
    this.myAccountForm.get('usuario.nombre')?.patchValue(usuarioData.nombre);
    this.myAccountForm
      .get('usuario.apellidos')
      ?.patchValue(usuarioData.apellidos);
    this.myAccountForm.get('usuario.email')?.patchValue(usuarioData.email);
    this.myAccountForm
      .get('usuario.password')
      ?.patchValue(usuarioData.password);
    this.myAccountForm.get('usuario.foto')?.patchValue(usuarioData.foto);

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

  getUsuarioLogueado(idUsuario: number, arrayUsuarios: Iusuario[]): Iusuario {
    return (
      arrayUsuarios.find((user) => user.id === idUsuario) || ({} as Iusuario)
    );
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
