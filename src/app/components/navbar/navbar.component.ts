import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { MensajesService } from '../../services/mensajes.service';
import { Imensaje, MensajeConEmisor } from '../../interfaces/imensaje';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  loginService = inject(LoginService);
  serviceMensaje= inject(MensajesService);
  router= inject(Router);

  notifications:MensajeConEmisor[]=[];
  mensajesAgrupados: {id:number ;nombre: string; apellido: string; count: number }[] = [];     
  login: boolean = false;
  showNotifications= false; 
  role:string = '';  
  userid:number = 0;
  notiCount:number = 0;
  
  ngOnInit() {    
    this.login = this.loginService.isLogged();  
    if (this.login) {      
      this.role = this.loginService.getLoggedUserRole();
      this.userid = this.loginService.getLoggedUserId();      
      this.cargarMensajesNoLeidos();/* // Cargar la funcion de notificaciones) */
    }
  }
 
  //cuando login es true se ejecuta la funcion
  async cargarMensajesNoLeidos(): Promise<void> {
    try {         
      const response = await this.serviceMensaje.getMensajesNoLeidos(this.userid);  
      this.notifications = response || [] //asignamos respuesta a notifications    
      
      if(this.notifications.length){
      this.notiCount = this.notifications.length;// Actualizamos el número de mensajes no leídos
      }
      const agrupados = this.notifications.reduce((acc, mensaje) => {        
      const id = mensaje.emisor_id;
      const nombre = mensaje.nombre_emisor;
      const apellido = mensaje.apellidos_emisor;  
          if (!acc[id]) {
            acc[id] = {id, nombre, apellido, count: 0 };
          }
          acc[id].count++;
          return acc;
      }, {} as { [id: number]: {id:number; nombre: string; apellido: string; count: number } });  
      // Convertir el objeto agrupado a un array 
      this.mensajesAgrupados = Object.values(agrupados);
    } catch (error) {
      console.error('Error al obtener mensajes no leídos:', error);
      this.notiCount= 0;
    }
  }  

  /* limpia las notificaciones solo de un usuario seleccionado */
  async readNotifications(emisorId: number): Promise<void> {
    try {
      // Filtramos todas las notificaciones de un mismo emisor
      const notificacionesDeEmisor = this.notifications.filter(n => n.emisor_id === emisorId);  
      // Usamos un ciclo for para marcar cada notificación como leída
      for (const noti of notificacionesDeEmisor) {
        await this.serviceMensaje.marcarLeido(noti.id);  // Esperamos que cada notificación se marque como leída
      }  
      // Eliminar todas las notificaciones de ese emisor de la lista
      this.notifications = this.notifications.filter(n => n.emisor_id !== emisorId); 
      this.mensajesAgrupados = this.mensajesAgrupados.filter(group => group.id !== emisorId);   
      // Actualizar el contador de notificaciones no leídas
      const notificationUnRead = this.notifications.filter(mensaje =>!mensaje.leido); 
      this.notiCount = notificationUnRead.length;  
    } catch (error) {
      console.error(`Error al marcar las notificaciones como leídas:`, error);
    }
  }  

  /* limpia todas las notificaciones */
  async limpiarNotificaciones():Promise<void>{
    try {
      //actualiza el estado en DB/marca como leido
      const actualizarNotificaciones = this.notifications.map(noti =>
        this.serviceMensaje.marcarLeido(noti.id)
      )
      await Promise.all(actualizarNotificaciones);
      //actualiza la campana cada vez q toque una notificacion
      this.notifications = [];
      this.notiCount = 0;      
      } catch (error) {
          console.error(`Error al marcar la notificación como leída:`, error);
      }
  }
  
  /* desplega listado de notificaciones */
  async toggleNotificaciones(){
    this.showNotifications = !this.showNotifications;
  }

  /* cuando se pulse en la notificacion redirige a mensajes */
  actualizarRutaDestino() {
    if (this.role === 'alumno') {
      this.role = '/dashboard/messages';
    } else if (this.role === 'profesor') {
      this.role = '/dashboard/messages'; 
    }
  }

  /* eliminar token boton salir */
  logout(){
    localStorage.removeItem('token');
    this.router.navigateByUrl('/home')
  }  

}
