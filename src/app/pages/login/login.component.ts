import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { Iusuario } from '../../interfaces/iusuario';

type response = {
  success: string;
  token: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  loginService = inject(LoginService)
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  error: boolean = false;
  msg: string = "";
  errorForm: any[] = [];

  ngOnInit() {
    
  }


  async getLoginData(formValue: Iusuario, form: any) {
    console.log("En funcion");
    try {
      let response: response = await this.loginService.login(formValue);
      if (response.success === "true") {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/dashboard']);
      }
    } catch ({ message }: any) {
      this.error = true;
      this.msg = message;
      
      form.reset()
    }

  }
 }


