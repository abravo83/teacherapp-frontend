import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { GooglemapsService } from '../../services/googlemaps.service';

import { environment } from '../../../environments/environments';
import { IRespuestaTeachersForm } from '../../interfaces/iRespuestaTeachersForm.interface';
import { Feature } from '../../interfaces/icoordinates';
import { Imateria } from '../../interfaces/imateria';
import { ProfesoresService } from '../../services/profesores.service';
import { MateriasService } from '../../services/materias.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  templateUrl: './teachers-form.component.html',
  styleUrls: ['./teachers-form.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
})
export class TeachersFormComponent implements OnInit {
  profesoresService = inject(ProfesoresService);
  CoordenadaService = inject(GooglemapsService);
  materiasService = inject(MateriasService);
  loginService = inject(LoginService);

  router = inject(Router);

  activatedRoute = inject(ActivatedRoute);

  coordenadas: string = '';
  time?: any;
  selectedPlace: Feature | null = null;

  errorForm: any[] = [];
  tipo: string = 'Registra';
  teacherForm: FormGroup;
  materiasList: Imateria[] = [];

  limiteMateriasExcedido = false;
  desplegableAbierto = false;
  profileImgUrl: string = '/img/no_profile_freepick.webp';
  archivoSeleccionado: File | null = null;

  mostrarCamposContrasena: boolean = false;
  constructor() {
    // Configuración del formulario
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
        localizacion: new FormControl(null, [
          Validators.required,
          Validators.min(4),
        ]),
        meses_experiencia: new FormControl(null, [
          Validators.required,
          Validators.min(0),
        ]),
        materias: new FormControl([], [Validators.required]),
      },
      { validators: this.validadorCoincidenciaContraseñas }
    );
  }

  toggleCamposContrasena() {
    this.mostrarCamposContrasena = !this.mostrarCamposContrasena;

    if (this.mostrarCamposContrasena) {
      this.teacherForm
        .get('password')
        ?.setValidators([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(255),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/),
        ]);
      this.teacherForm
        .get('repitepassword')
        ?.setValidators([Validators.required]);
    } else {
      this.teacherForm.get('password')?.clearValidators();
      this.teacherForm.get('repitepassword')?.clearValidators();
    }

    this.teacherForm.get('password')?.updateValueAndValidity();
    this.teacherForm.get('repitepassword')?.updateValueAndValidity();
  }

  /* direccion a longitud y latitud */
  queryChanged(value: string): void {
    if (this.time) clearTimeout(this.time);
    this.time = setTimeout(() => {
      this.CoordenadaService.getCoordByQuery(value);
    }, 500);
  }

  get isLoadingPlaces(): boolean {
    return this.CoordenadaService.isLoading;
  }

  get places(): Feature[] {
    return this.CoordenadaService.places;
  }

  selectPlace(place: Feature): void {
    this.selectedPlace = place;
    this.teacherForm
      .get('localizacion')
      ?.setValue(JSON.stringify(place.properties.full_address));
    this.coordenadas = JSON.stringify({
      /* si no es necesario el address se quita esta linea */
      address: place.properties.full_address,
      lat: place.geometry.coordinates[1],
      lng: place.geometry.coordinates[0],
    });
    //console.log(this.coordenadas)
    this.CoordenadaService.places = [];
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

  async ngOnInit() {
    try {
      const materias = await this.materiasService.getMaterias();
      this.materiasList = Array.isArray(materias) ? materias : [];
    } catch (error) {
      console.error('Error al cargar materias:', error);
      this.materiasList = [];
    }

    if (this.loginService.isLogged()) {
      this.tipo = 'Actualizar';
      const userId = this.loginService.getLoggedUserId();
      const profesor: IRespuestaTeachersForm | undefined =
        await this.profesoresService.getProfesorById(userId);

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
        });

        this.teacherForm.get('materias')?.setValue(profesor.materias);

        if (profesor.usuario.foto) {
          this.profileImgUrl = environment.API_URL + profesor.usuario.foto;
        }
      }
    } else {
      // Modo Registro
      this.tipo = 'Registra';
      this.mostrarCamposContrasena = true;
    }
  }

  alternarDesplegable() {
    this.desplegableAbierto = !this.desplegableAbierto;
  }

  async cambiarMateria(event: any) {
    const selectedMaterias = this.teacherForm.value.materias || [];
    const materiaId = Number(event.target.value);

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
    if (!this.teacherForm.valid) {
      console.log('Formulario no válido', this.teacherForm.errors);
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor, revisa los campos y corrige los errores.',
        confirmButtonColor: '#d33',
      });
      return;
    }

    const formData = new FormData();

    const datosProfesor: IRespuestaTeachersForm = {
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
        localizacion: this.coordenadas,
        telefono: this.teacherForm.value.telefono,
        meses_experiencia: this.teacherForm.value.meses_experiencia,
        validado: false,
      },
      materias: this.teacherForm.value.materias,
    };

    formData.append('datos', JSON.stringify(datosProfesor));

    if (this.teacherForm.get('foto')?.value instanceof File) {
      formData.append('imagen', this.teacherForm.get('foto')?.value);
    }

    console.log('FormData contenido completo:');
    for (let pair of (formData as any).entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

    try {
      if (this.tipo === 'Actualizar' && datosProfesor.usuario.id) {
        await this.profesoresService.actualizarProfesor(
          formData,
          datosProfesor.usuario.id
        );
        await Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Profesor actualizado exitosamente.',
          confirmButtonColor: '#28a745',
        });
        this.router.navigate(['/home']);
      } else {
        await this.profesoresService.registroProfesor(formData);
        await Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Profesor registrado exitosamente.',
          confirmButtonColor: '#28a745',
        });
        this.router.navigate(['/login']);
      }
    } catch (error: any) {
      const errorMessage =
        error?.error?.message || 'Ocurrió un error inesperado.';
      const errorsList = error?.error?.errors || [];

      // Caso específico: Correo duplicado
      if (errorMessage.toLowerCase().includes('duplicate')) {
        Swal.fire({
          icon: 'warning',
          title: 'Correo ya registrado',
          text: 'El correo proporcionado ya está registrado. Por favor, utiliza otro correo o inicia sesión.',
          confirmButtonColor: '#d33',
        });
        return;
      }

      // Mostrar otros errores si existen
      if (errorsList.length > 0) {
        const detailedErrors = errorsList
          .map(
            (err: { field: string; message: string }) =>
              `${err.field}: ${err.message}`
          )
          .join('<br>');

        Swal.fire({
          icon: 'error',
          title: 'Errores en los datos',
          html: detailedErrors,
          confirmButtonColor: '#d33',
        });
      } else {
        // Mensaje genérico para otros errores
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
        this.teacherForm.get('foto')?.setValue(null);

        Swal.fire({
          icon: 'warning',
          title: 'Imagen demasiado grande.',
          text: 'La imagen excede el tamaño maximo de 1MB.',
          confirmButtonColor: '#28a745',
        });
        return;
      }

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

      this.archivoSeleccionado = archivo;
      this.teacherForm.get('foto')?.setValue(archivo);

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
