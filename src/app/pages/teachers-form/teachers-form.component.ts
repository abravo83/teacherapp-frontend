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
import { Imateria } from '../../interfaces/imateria';
import { ProfesoresService } from '../../services/profesores.service';
import { MateriasService } from '../../services/materias.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MATERIAS_PROFESORES } from '../../db/materias_profesores.db';
import { IMateriaProfesor } from '../../interfaces/imateria-profesor.interfaces';
import { GooglemapsService } from '../../services/googlemaps.service';
import { firstValueFrom } from 'rxjs';
import { Feature } from '../../interfaces/icoordinates';

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
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  coordenadas:string = ''; 
  time?:any;
  selectedPlace: Feature | null = null;
  
  errorForm: any[] = [];
  tipo: string = 'Registra';
  teacherForm: FormGroup;
  materiasList: Imateria[] = [];
  limiteMateriasExcedido = false;
  desplegableAbierto = false;
  profileImgUrl: string = '/img/no_profile_freepick.webp';
  archivoSeleccionado: File | null = null;

  constructor() {
    this.teacherForm = new FormGroup({
      id: new FormControl(null), 
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
      localizacion: new FormControl([],[Validators.required,Validators.min(4)]),
      meses_experiencia: new FormControl(null, [Validators.required, Validators.min(0)]),
      materias: new FormControl([], [Validators.required])
    }, { validators: this.validadorCoincidenciaContraseñas });
  }


  /* direccion a longitud y latitud */
  queryChanged(value:string):void{
    if(this.time) clearTimeout(this.time);
    this.time = setTimeout(()=>{
      this.CoordenadaService.getCoordByQuery(value);
    },
    500)  
  }

  get isLoadingPlaces():boolean{
    return this.CoordenadaService.isLoading;
  }

  get places():Feature[]{
    return this.CoordenadaService.places;
  }

  selectPlace(place:Feature):void{
    this.selectedPlace = place;
    this.teacherForm.get('localizacion')?.setValue(
      JSON.stringify(place.properties.full_address))
    this.coordenadas = JSON.stringify({
      /* si no es necesario el address se quita esta linea */
      address:place.properties.full_address,
      lat: place.geometry.coordinates[1],
      lng: place.geometry.coordinates[0]
    }
    )
   //console.log(this.coordenadas)
    this.CoordenadaService.places= [];  
  }
  /* direccion */


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

  async ngOnInit() {
    this.materiasList = await this.materiasService.getMaterias();

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
            materias: profesor.materias.map((mat: Imateria) => mat.id),
          });
        }
      }
    });
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
      materias: this.teacherForm.value.materias.map((materiaId: number) => {
        const materia = this.materiasList.find(
          (mat: Imateria) => mat.id === materiaId
        );
        return materia!;
      }),
    };

    console.log('Contenido de datosProfesor antes de enviar:', datosProfesor);

    formData.append('datos', JSON.stringify(datosProfesor));

    if (this.teacherForm.get('foto')?.value instanceof File) {
      formData.append('imagen', this.teacherForm.get('foto')?.value);
    }

    console.log('FormData contenido completo:');
    for (let pair of (formData as any).entries()) {
      console.log(pair[0] + ':', pair[1]);
    }

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




  














}
