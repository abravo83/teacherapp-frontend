import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Iusuario } from '../../../interfaces/iusuario';
import { Iprofesor } from '../../../interfaces/iprofesor';

// Importar las bases de datos simuladas
import { USUARIOS } from '../../../db/usuarios';
import { DATOS_PROFESORES } from '../../../db/profesores';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.css',
})
export class MyAccountComponent implements OnInit {
  myAccountForm: FormGroup;
  usuarioId = 1; // Este ID se puede obtener dinámicamente del sistema de autenticación

  constructor(private fb: FormBuilder) {
    this.myAccountForm = this.fb.group({
      usuario: this.fb.group({
        nombre: ['', Validators.required],
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
      ciudad: [''],
      provincia: [''],
      codigo_postal: [''],
      pais: [''],
      zona_horaria: [''],
      sobre_mi: [''],
    });
  }

  ngOnInit(): void {
    // Obtener el usuario y profesor actual desde los datos simulados
    const usuarioData = USUARIOS.find((user) => user.id === this.usuarioId);
    const profesorData = DATOS_PROFESORES.find(
      (profesor) => profesor.usuarios_id === this.usuarioId
    );

    if (usuarioData) {
      this.myAccountForm.get('usuario')?.patchValue(usuarioData);
    }

    if (profesorData) {
      this.myAccountForm.get('profesor')?.patchValue(profesorData);

      // Inicializar el FormArray de materias
      const materiasFormArray = this.myAccountForm.get([
        'profesor',
        'materias',
      ]) as FormArray;
      profesorData.materias.forEach((materia: any) =>
        materiasFormArray.push(this.fb.control(materia))
      );
    }
  }

  get materias(): FormArray {
    return this.myAccountForm.get('profesor.materias') as FormArray;
  }

  onSave(): void {
    if (this.myAccountForm.valid) {
      const formData: Iprofesor = this.myAccountForm.value;
      console.log('Datos actualizados:', formData);
      // Aquí iría la lógica para guardar los cambios, como llamar a un servicio
    }
  }
}
