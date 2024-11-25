import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Iusuario } from '../../../interfaces/iusuario';
import { Imensaje } from '../../../interfaces/imensaje';
import { USUARIOS } from '../../../db/usuarios';
import { MENSAJES } from '../../../db/mensajes';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class MessagesComponent implements OnInit {
  usuarioId = 1; // ID del profesor logueado
  alumnos: Iusuario[] = [];
  mensajes: Imensaje[] = [];
  alumnoSeleccionado: Iusuario | null = null;
  chatForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.chatForm = this.fb.group({
      contenido: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    const alumnosIds = new Set<number>();
    MENSAJES.forEach((msg) => {
      if (msg.emisor_id === this.usuarioId) {
        alumnosIds.add(msg.destinatario_id);
      }
      if (msg.destinatario_id === this.usuarioId) {
        alumnosIds.add(msg.emisor_id);
      }
    });

    this.alumnos = USUARIOS.filter(
      (user) => user.rol === 'alumno' && alumnosIds.has(user.id!)
    );
  }

  seleccionarAlumno(alumno: Iusuario): void {
    this.alumnoSeleccionado = alumno;
    this.cargarMensajes(alumno.id!);
  }

  cargarMensajes(alumnoId: number): void {
    this.mensajes = MENSAJES.filter(
      (msg) =>
        (msg.emisor_id === this.usuarioId &&
          msg.destinatario_id === alumnoId) ||
        (msg.emisor_id === alumnoId && msg.destinatario_id === this.usuarioId)
    );
  }

  enviarMensaje(): void {
    if (this.chatForm.valid && this.alumnoSeleccionado) {
      const nuevoMensaje: Imensaje = {
        id: MENSAJES.length + 1,
        emisor_id: this.usuarioId,
        destinatario_id: this.alumnoSeleccionado.id!,
        asunto: '',
        contenido: this.chatForm.value.contenido,
        leido: false,
      };
      MENSAJES.push(nuevoMensaje);
      this.mensajes.push(nuevoMensaje);
      this.chatForm.reset();
    }
  }

  tieneMensajesNoLeidos(alumnoId: number): boolean {
    return this.mensajes.some(
      (mensaje) => mensaje.destinatario_id === alumnoId && !mensaje.leido
    );
  }
}
