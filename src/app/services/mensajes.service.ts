import { inject, Injectable } from '@angular/core';

import { Imensaje, MensajeConEmisor } from '../interfaces/imensaje';
import { MENSAJES } from '../db/mensajes';
import { environment } from '../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { filter, firstValueFrom, lastValueFrom, map } from 'rxjs';
import { Iusuario } from '../interfaces/iusuario';

@Injectable({
  providedIn: 'root',
})
export class MensajesService {
  arrMensajes: Imensaje[] = MENSAJES;
  http= inject(HttpClient);

  private baseUrl: string = `${environment.API_URL}/api/mensajes`;
  private httpClient = inject(HttpClient);

  constructor() {}

  /* getAll(){
    console.log(`base url: ${this.baseUrl}`);
    return lastValueFrom(this.httpClient.get<Imensaje[]>(this.baseUrl));
  } */
    
  //obtener mensajes no leidos
  getMensajesNoLeidos(userid: number): Promise<MensajeConEmisor[]> {
    return firstValueFrom(
      this.httpClient.get<MensajeConEmisor[]>(`${this.baseUrl}/${userid}`)
    );
  }

  //obtener solo mis alumnos
  getMisAlumnos(userid:number){
    //console.log(`base url: ${this.baseUrlA}`);
    return firstValueFrom(this.httpClient.get<Iusuario[]>(`${this.baseUrl}/misalumnos/${userid}`));
  }
  getMisProfesores(userid:number){
    //console.log(`base url: ${this.baseUrlA}`);
    return firstValueFrom(this.httpClient.get<Iusuario[]>(`${this.baseUrl}/misprofesores/${userid}`));
  }

  //obtener los mensajes entre 2 usuarios en especifico
  getmsjbetweenusers(emisorid:number, destinatarioid:number): Promise<Imensaje[]> {
    return firstValueFrom(this.httpClient.get<Imensaje[]>(`${this.baseUrl}/${emisorid}/${destinatarioid}`));
    }


  //envio de mensaje
  sendMessage(mensaje: Imensaje): Promise<Imensaje> {
    return firstValueFrom(this.httpClient.post<Imensaje>(`${this.baseUrl}/enviar`, mensaje));
  }

  //cambia estado de mensajes de true a false
  marcarLeido(notificacionid:number):Promise<void>{    
    return firstValueFrom(this.http.patch<void>(`${this.baseUrl}/${notificacionid}`,{leido:1}));
  }

  

  

  

  

}
