import { Component, Input } from '@angular/core';
import { PopUpContactarComponent } from '../pop-up-contactar/pop-up-contactar.component';
import { CommonModule } from '@angular/common';
import { Iprofesor } from '../../../interfaces/iprofesor';
import { environment } from '../../../../environments/environments';

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
  API_URL = environment.API_URL;
  popUpVisible = false;

  mostrarPopUp() {
    // this.openPopUp.emit(this.myProfesor);
    this.popUpVisible = true;
  }

  cerrarPopUp() {
    this.popUpVisible = false;
  }
}
