import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { IProfesorCompleto } from '../../interfaces/iprofesor-completo.interface';
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
  imports: [ReactiveFormsModule, CommonModule]
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
        const profesor: IProfesorCompleto | undefined = await this.profesoresService.getProfesorById(Number(params.id));
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
    return MATERIAS_PROFESORES
      .filter((relacion: IMateriaProfesor) => relacion.usuarios_id === profesorId)
      .map((relacion: IMateriaProfesor) => relacion.materias_id);
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
      usuario: {
        id: this.teacherForm.value.id,
        nombre: this.teacherForm.value.nombre,
        apellidos: this.teacherForm.value.apellidos,
        email: this.teacherForm.value.email,
        password: this.teacherForm.value.password,
        foto: this.teacherForm.value.foto,
        rol: 'profesor',
        activo: true
      },
      profesor: {
        precio_hora: this.teacherForm.value.precio_hora,
        localizacion: this.teacherForm.value.localizacion,
        telefono: this.teacherForm.value.telefono,
        meses_experiencia: this.teacherForm.value.meses_experiencia,
        validado: false
      },
      materias: this.teacherForm.value.materias
    };
    
    console.log(formData);

    try {
      if (this.tipo === 'Actualizar') {
        await this.profesoresService.actualizarProfesor(formData);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Profesor actualizado exitosamente.',
          confirmButtonColor: '#28a745'
        });
      } else {
        await this.profesoresService.registroProfesor(formData);
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: 'Profesor registrado exitosamente.',
          confirmButtonColor: '#28a745'
        });
      }
      this.router.navigate(['/home']);
    } catch (error) {
      this.errorForm = error as any;
    }
  }
}