import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PopUpContactarComponent } from "../pop-up-contactar/pop-up-contactar.component";
import { CommonModule } from '@angular/common';
import { Iprofesor } from '../../../interfaces/iprofesor';

@Component({
  selector: 'app-profesor-card-home',
  standalone: true,
  imports: [PopUpContactarComponent, CommonModule],
  templateUrl: './profesor-card-home.component.html',
  styleUrl: './profesor-card-home.component.css',
})
export class ProfesorCardHomeComponent {
  @Input() myProfesor!: Iprofesor;
  // @Output() openPopUp = new EventEmitter<any>(); // evento para abrir el contenido de pop-up
  popUpVisible = false;


  mostrarPopUp() {
    // this.openPopUp.emit(this.myProfesor);
    this.popUpVisible = true;
    console.log(1);
  }

  cerrarPopUp() {
    this.popUpVisible = false;
  }

}
