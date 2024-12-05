import {
  Component,
  Input,
  NgModule,
  EventEmitter,
  Output,
  inject,
  input,
} from '@angular/core';
import { Iprofesor } from '../../../interfaces/iprofesor';
import { IProfesorCompleto } from '../../../interfaces/iprofesor-completo.interface';
import { Iopinion } from '../../../interfaces/iopinion';
import { Iusuario } from '../../../interfaces/iusuario';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
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
  imports: [CommonModule, RouterLink, StarRatingComponent],
})


export class PopUpContactarComponent {
  @Input() myProfesor: any; // Recibimos el profesor seleccionado
  @Input() profesorId: number | undefined;
  @Output() cerrarPopUp = new EventEmitter<void>();
  @Output() redirectregister = new EventEmitter<void>();
  // Instanciar servicios
  usuariosService = inject(UsuariosService);
  profesoresService = inject(ProfesoresService);
  opinionesService = inject(OpinionesService); 

  usuario!: Iusuario;
  // profesor!: any;
  profesores: Iprofesor[] = []
  sobre_mi: string = '';
  opinionesProfesor: Iopinion[] = [];
  opinion: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  cerrar() {
    this.cerrarPopUp.emit();
  }

  redirect() {
    this.router.navigate(['/login']);
  }

  async ngOnInit(): Promise<void> {
    try {
      // Obtener todos los profesores
      const profesores = await this.profesoresService.getMateriasandProfesor();
  
      // Filtrar para obtener solo el profesor con el ID específico
      if (this.profesorId) {
        this.myProfesor = profesores.find(profesor => profesor.id === this.profesorId);
      }

       // Si encontramos al profesor, extraemos las opiniones
       if (this.myProfesor) {
        this.opinionesProfesor = this.myProfesor.opiniones || [];
        // console.log('Opiniones:', this.opinionesProfesor); // Verifica las opiniones en la consola
      }
  
      // console.log(this.myProfesor); // Verifica que se obtiene el profesor correcto
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }


}