import { Component, Input, NgModule, EventEmitter, Output } from '@angular/core';
import { Iprofesor } from '../../../interfaces/iprofesor';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';




@Component({
  standalone: true,
  selector: 'app-pop-up-contactar',
  templateUrl: './pop-up-contactar.component.html',
  styleUrls: ['./pop-up-contactar.component.css'],
  imports: [CommonModule, RouterLink] 
})

// RouterLink, Router, ActivatedRoute
export class PopUpContactarComponent {
  // router = inject(Router);
  // activatedRoute = inject(ActivatedRoute);
  @Input() myProfesor: any; // Recibimos el profesor seleccionado
  @Output() cerrarPopUp= new EventEmitter <void>();
  @Output() redirectregister= new EventEmitter <void>();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  cerrar(){
    this.cerrarPopUp.emit();
    console.log(2);
  }

  redirect(){
    this.router.navigate(['/login']);
  }

  
}
