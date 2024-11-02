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
  private login: boolean = false
  private role:string = 'admin'


    getlogin(): {islogin:boolean; role:string}
    {
    return{
      islogin: this.login,
      role: this.role
    }
  }


}
