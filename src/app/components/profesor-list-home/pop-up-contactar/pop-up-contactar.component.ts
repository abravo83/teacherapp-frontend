import { Component, Input, NgModule, EventEmitter, Output } from '@angular/core';
import { Iprofesor } from '../../../interfaces/iprofesor';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-pop-up-contactar',
  templateUrl: './pop-up-contactar.component.html',
  styleUrls: ['./pop-up-contactar.component.css'],
  imports: [CommonModule], 
  standalone: true
})
export class PopUpContactarComponent {
  @Input() myProfesor: any; // Recibimos el profesor seleccionado
  @Output() cerrarPopUp= new EventEmitter <void>();

  cerrar(){
    this.cerrarPopUp.emit();
    console.log(2);
  }
}
