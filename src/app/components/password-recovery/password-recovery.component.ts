import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordRecoveryService } from '../../services/password-recovery.service';
import Swal from 'sweetalert2';

type userpass = {
  code: string,
  newpass: string
}

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.css'
})
export class PasswordRecoveryComponent {
  code:string = '';
  newpass:string = '';
  msg: string = "";
  passFrom: FormGroup;
  route = inject(ActivatedRoute);
  recuperarpass= inject(PasswordRecoveryService)

  ngOnInit(): void {
    // Solo para verificar que el parámetro se recibe
    this.route.queryParams.subscribe(params => {
      this.code =  params['code'];
      console.log(this.code)
    });
  }

  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  errorForm: any[] = [];
  tipo: string = 'Registra';
  limiteMateriasExcedido = false;
  desplegableAbierto = false;

  constructor() {
    this.passFrom = new FormGroup({
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(255),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
      ]),
      repitepassword: new FormControl(null, [Validators.required]),
    }, { validators: this.validadorCoincidenciaContraseñas });
  }

  validadorCoincidenciaContraseñas:ValidatorFn = (group: AbstractControl): { [key: string]: any } | null => {
    const password = group.get('password')?.value;
    const repitepassword = group.get('repitepassword')?.value;
    return password === repitepassword ? null : { checkpassword: true };
  };

  checkControl(formControlName: string, validador: string) {
    return (
      this.passFrom.get(formControlName)?.hasError(validador) &&
      this.passFrom.get(formControlName)?.touched
    );
  }

  async passwordForm() {
    this.newpass = this.passFrom.value.password

    try {
      if(this.passFrom.valid){
        const user = {
          code: this.code,
          newpass: this.newpass
        }
        const res = await this.recuperarpass.recoverypass(user);
        if (res.message === "contraseña actualizada") {
          Swal.fire({
              position: "center",
              icon: "success",
              title: '¡Felicidades!',
              text: 'Se ha restablecido su contraseña',
              showConfirmButton: false,
              timer: 5000,
              width: '35%',
            });
            this.router.navigate(['/login']);
          }
        }
    } catch ({ error }: any) {      
      this.msg = error.message;
    }
  }


     
   

}






