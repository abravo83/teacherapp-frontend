import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  login: boolean = false;
  role:string = 'alumno';
  notiCount: number = 1
  

  hasnoti():boolean{
    return this.notiCount>0;
  }


   

}
