import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { IRespuestaTeachersForm } from '../../interfaces/iRespuestaTeachersForm.interface';
import { ProfesoresService } from '../../services/profesores.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MATERIAS } from '../../db/materias.db';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MATERIAS_PROFESORES } from '../../db/materias_profesores.db';
import { IMateriaProfesor } from '../../interfaces/imateria-profesor.interfaces';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  templateUrl: './teachers-form.component.html',
  styleUrls: ['./teachers-form.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class TeachersFormComponent implements OnInit {
  profesoresService = inject(ProfesoresService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  errorForm: any[] = [];
  tipo: string = 'Registra';
  teacherForm: FormGroup;
  materiasList = MATERIAS;
  limiteMateriasExcedido = false;
  desplegableAbierto = false;
  profileImgUrl: string = '/img/no_profile_freepick.webp';
  archivoSeleccionado: File | null = null;

  constructor() {
    this.teacherForm = new FormGroup(
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
        telefono: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^\d{9}$/),
        ]),
        precio_hora: new FormControl(null, [
          Validators.required,
          Validators.min(0),
          Validators.max(99.99),
        ]),
        localizacion: new FormControl(null, [Validators.maxLength(254)]),
        meses_experiencia: new FormControl(null, [
          Validators.required,
          Validators.min(0),
        ]),
        materias: new FormControl([], [Validators.required]),
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
      this.teacherForm.get(formControlName)?.hasError(validador) &&
      this.teacherForm.get(formControlName)?.touched
    );
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.id) {
        this.tipo = 'Actualizar';
        const profesor: IRespuestaTeachersForm | undefined =
          await this.profesoresService.getProfesorById(Number(params.id));
        if (profesor) {
          this.teacherForm.patchValue({
            id: profesor.usuario.id,
            nombre: profesor.usuario.nombre,
            apellidos: profesor.usuario.apellidos,
            email: profesor.usuario.email,
            foto: profesor.usuario.foto,
            telefono: profesor.profesor.telefono,
            precio_hora: profesor.profesor.precio_hora,
            localizacion: profesor.profesor.localizacion,
            meses_experiencia: profesor.profesor.meses_experiencia,
            materias: this.obtenerMateriasProfesor(profesor.usuario.id ?? 0),
          });
        }
      }
    });
  }

  obtenerMateriasProfesor(profesorId: number): number[] {
    return MATERIAS_PROFESORES.filter(
      (relacion: IMateriaProfesor) => relacion.usuarios_id === profesorId
    ).map((relacion: IMateriaProfesor) => relacion.materias_id);
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
    // Instanciar FormData para tener disponible el método append
    const formData = new FormData();

    const datosProfesor = {
      usuario: {
        id: this.teacherForm.value.id,
        nombre: this.teacherForm.value.nombre,
        apellidos: this.teacherForm.value.apellidos,
        email: this.teacherForm.value.email,
        password: this.teacherForm.value.password,
        rol: 'profesor',
        activo: true,
      },
      profesor: {
        precio_hora: this.teacherForm.value.precio_hora,
        localizacion: this.teacherForm.value.localizacion,
        telefono: this.teacherForm.value.telefono,
        meses_experiencia: this.teacherForm.value.meses_experiencia,
        validado: false,
      },
      materias: this.teacherForm.value.materias,
    };

    // Adjuntar datos del profesor
    formData.append('datos', JSON.stringify(datosProfesor));

    // Adjuntar imagen si existe (Hay que estar atento en el back para extraer la imagen y moverla a una carpeta en /Public)
    if (this.teacherForm.get('foto')?.value instanceof File) {
      formData.append('imagen', this.teacherForm.get('foto')?.value);
    }

    console.log(formData);

    try {
      if (this.tipo === 'Actualizar') {
        await this.profesoresService.actualizarProfesor(formData);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Profesor actualizado exitosamente.',
          confirmButtonColor: '#28a745',
        });
      } else {
        await this.profesoresService.registroProfesor(formData);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Profesor registrado exitosamente.',
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
        this.teacherForm.get('foto')?.setValue(null);

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
        this.teacherForm.get('foto')?.setValue(null);

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
      this.teacherForm.get('foto')?.setValue(archivo);

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
      this.teacherForm.get('foto')?.setValue(null);
    }
  }
}
