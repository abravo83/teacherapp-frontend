import { Component, inject } from '@angular/core';
import { EmailValidator, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Iusuario } from '../../interfaces/iusuario';
import { CommonModule } from '@angular/common';
import { PasswordRecoveryService } from '../../services/password-recovery.service';
import Swal from 'sweetalert2';


type Response = { message: string, token: string };
type res = { message: string};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
    recoverypass= inject(PasswordRecoveryService)
  loginService = inject(LoginService)
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  error: boolean = false;
  msg: string = "";
  errorForm: any[] = [];
  email: string = "";
  showAlert: boolean = false;
    erroremail: boolean = false;
  ngOnInit() {
    
  }


  async getLoginData(formValue: Iusuario, form: any) {
    console.log("En funcion");
    try {
      this.error = false;
      console.log(formValue);
      let response: Response = await this.loginService.login(formValue);
      console.log(response);
      console.log(response.message);
      if (response.message === "Login correcto") {
          localStorage.setItem('token', response.token);
        //   if (this.loginService.getLoggedUserRole() === 'administrador') {
        //     this.router.navigate(['/dashboard', 'admin']);
        //   } else {
              this.router.navigate(['/dashboard']);
        //   }
      }
    } catch ({ error }: any) {
      console.log(error);
      this.error = true;
      this.msg = error.message;
      
      form.reset()
    }
  }
  
 
//Desarrollo lógica de la alerta
toggleAlert(event: Event): void {
    event.preventDefault(); // Evita que el formulario se envíe
    this.showAlert = !this.showAlert;
  }

  //solicitar correo a usuario y enviar al backend
  async getemail(resetKeyForm:Iusuario,form:any){
    //const email = resetKeyForm.email.trim();
    try {
        this.erroremail = false
        let resp: res = await this.recoverypass.sendRecoveryEmail(resetKeyForm);
      if (resp.message === "email correcto") {
        Swal.fire({
            position: "center",
            icon: "success",
            title: '¡Correo enviado!',
            text: 'Se ha enviado un correo de recuperacion',
            showConfirmButton: false,
            timer: 3500,
            width: '35%',
          });
    }
    } catch ({ error }: any) {
        this.erroremail = true;
        this.msg = error.message;
        
        form.reset()
      }
  }





/* sendEmail() {
    const email = this.email;

    // Método para validar el formato del correo electrónico
    const validarFormato = (email: string): boolean => {
        const re = /.+@.+\..+/; 
        email = email.trim();
        console.log(email);
        return re.test(email); 
    };

    // Método para validar el dominio del correo electrónico
    const validarDominio = (email: string): boolean => {
        const validDomains = ['hotmail.com', 'hotmail.es', 'yahoo.es', 'gmail.com', 'gmail.es']; // Lista de dominios válidos
        return validDomains.some(domain => email.endsWith(domain)); // Retorna verdadero si el dominio es válido
    };

    // Validar el formato del correo electrónico
    if (!validarFormato(email)) {
        alert('El formato del correo electrónico es incorrecto. Asegúrate de que incluya un "@" y no dejes espacios.');
        return;
    }

    // Validar el dominio del correo electrónico
    if (!validarDominio(email)) {
        alert('Por favor, introduce un correo electrónico válido. Asegúrate de que el dominio sea uno de los siguientes: hotmail.com, gmail.com, yahoo.es, etc.');
        return; // Salir si el dominio no es válido
    }

    // Simulación de envío de correo (puedes reemplazarlo con una llamada a un servicio real)
    this.simulateEmailSend(email)
        .then(() => {
            alert('¡Correo enviado! 👏 Se ha enviado un enlace para restablecer la contraseña a ' + email);
            this.showAlert = false; // Ocultar la alerta después de enviar
        })
        .catch((error) => {
            alert('Hubo un problema al enviar el correo: ' + error.message);
        });
} */

// Simulación de un servicio de envío de correo
/* private simulateEmailSend(email: string): Promise<void> {
    return new Promise((resolve, reject) => {

        setTimeout(() => {
            // Simular éxito o fallo
            const isSuccess = Math.random() > 0.2; // 80% de éxito
            if (isSuccess) {
                resolve(); // Envío exitoso
            } else {
                reject(new Error('No se pudo enviar el correo. Intenta más tarde.')); // Envío fallido
            }
        }, 1000); // 1 segundo de retraso
    });
}
 */


 }


