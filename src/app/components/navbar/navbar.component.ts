import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  loginService = inject(LoginService);
  login: boolean = this.loginService.isLogged();
  role:string = 'alumno';
  notiCount: number = 1
  

  hasnoti():boolean{
    return this.notiCount>0;
  }


   

}
