import { Component, inject } from '@angular/core';
import { ProfesoresService } from '../../services/profesores.service';
import { Iprofesor } from '../../interfaces/iprofesor';
import { FilterHomeComponent } from './filter-home/filter-home.component';
import { ProfesorCardHomeComponent } from './profesor-card-home/profesor-card-home.component';

@Component({
  selector: 'app-profesor-list-home',
  standalone: true,
  imports: [FilterHomeComponent, ProfesorCardHomeComponent],
  templateUrl: './profesor-list-home.component.html',
  styleUrl: './profesor-list-home.component.css',
})
export class ProfesorListHomeComponent {
  //inyectable
  profesorService = inject(ProfesoresService);
  //variables
  usuariosList: any[] = [];

  ngOnInit() {
    this.usuariosList = this.profesorService.getAll();
    console.log(this.usuariosList);
  }

  filterProfesorByMaterias(event: number) {
    if (event !== 0) {
      this.usuariosList = this.profesorService.filterByMaterias(event);
    } else {
      this.usuariosList = this.profesorService.getAll();
    }
  }
}
