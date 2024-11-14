import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MensajesService } from '../../services/mensajes.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  loginService = inject(LoginService);
  login: boolean = false;
  role:string = 'alumno';  
  notifications:Array<{id:number,contenido: string; leido: boolean}>=[];
  notiCount:number = 0;

  showNotifications= false;
  
  serviceMensaje= inject(MensajesService);
  //arrMensajes: []=[];

  /* async ngOnInit(){
   
    this.arrMensajes = await this.serviceMensaje.getAll();
    console.log(this.arrMensajes);
  } */
  ngOnInit() {
    // Cargar las notificaciones llamar al servicio de notificaciones)
    this.login = this.loginService.isLogged()

    this.notifications = [
      { id: 1, contenido: 'contenido Mensaje 1', leido: false },
    { id: 2, contenido: 'contenido Mensaje 2', leido: false },
    { id: 3, contenido: 'contenido Mensaje 3', leido: false },
    { id: 4, contenido: 'contenido Mensaje 4', leido: false },
    { id: 5, contenido: 'contenido Mensaje 5', leido: true },
    { id: 5, contenido: 'contenido Mensaje 5', leido: true }
    ];
  }

  //carga numero de notificaciones
  hasnoti():number{
    if(this.notifications.length){
      this.notiCount = this.notifications.filter(msj => !msj.leido).length;
      return this.notiCount > 0 ?this.notiCount:0;
    }
    return 0;
  }

  //desplega listado de notificaciones
  toggleNotificaciones():void{
    this.showNotifications = !this.showNotifications;
  }
   
  notificationUnRead(){
    //let result = this.notifications.filter(mensaje =>!mensaje.leido);
    return this.notifications.filter(mensaje =>!mensaje.leido);
  }

  readNotifications(notificacionid:number){
    const notification = this.notifications.find(n => n.id === notificacionid);
    if(notification)
      notification.leido = true;
  }

  

}
