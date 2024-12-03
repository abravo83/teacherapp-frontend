import {
  Component,
  Input,
  NgModule,
  EventEmitter,
  Output,
  inject,
} from '@angular/core';
import { Iprofesor } from '../../../interfaces/iprofesor';
import { IProfesorCompleto } from '../../../interfaces/iprofesor-completo.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Iusuario } from '../../../interfaces/iusuario';
import { UsuariosService } from '../../../services/usuarios.service';
import { ProfesoresService } from '../../../services/profesores.service';
import { OpinionesService } from '../../../services/opiniones.service';
import { MyInfoComponent } from '../../../pages/dashboard/my-info/my-info.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';

@Component({
  standalone: true,
  selector: 'app-pop-up-contactar',
  templateUrl: './pop-up-contactar.component.html',
  styleUrls: ['./pop-up-contactar.component.css'],
  imports: [CommonModule, RouterLink],
})

// RouterLink, Router, ActivatedRoute
export class PopUpContactarComponent {
  // router = inject(Router);
  // activatedRoute = inject(ActivatedRoute);
  @Input() myProfesor: any; // Recibimos el profesor seleccionado
  @Output() cerrarPopUp = new EventEmitter<void>();
  @Output() redirectregister = new EventEmitter<void>();
  // Instanciar servicios
  usuariosService = inject(UsuariosService);
  profesoresService = inject(ProfesoresService);
  opinionesService = inject(OpinionesService); 

  usuario!: Iusuario;
  profesor!: any;
  sobre_mi: string = '';
  opiniones: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  cerrar() {
    this.cerrarPopUp.emit();
  }

  redirect() {
    this.router.navigate(['/login']);
  }

  async ngOnInit(): Promise<void> {

    try {
      this.usuario = await this.usuariosService.getUsuarioActual();

      if (this.usuario.id) {
        const respuesta: any = await this.profesoresService.getProfesorById( this.usuario.id);
        this.opiniones = await this.opinionesService.getOpinionesFromProfesorId( this.usuario.id );
        console.log(this.usuario.id);
        this.profesor = respuesta.profesor;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
