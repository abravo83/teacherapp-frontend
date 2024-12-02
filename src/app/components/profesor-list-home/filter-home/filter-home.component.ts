import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Imateria } from '../../../interfaces/imateria';
import { ProfesoresService } from '../../../services/profesores.service';
import { CommonModule, JsonPipe } from '@angular/common';
import { MateriasService } from '../../../services/materias.service';

@Component({
  selector: 'app-filter-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filter-home.component.html',
  styleUrl: './filter-home.component.css',
})
export class FilterHomeComponent {
  //injectables
  materiaService = inject(MateriasService);
  //varialbles
  materiaList: Imateria[] = [];
  experienciaList: any[] = [];
  showFilters: boolean = false;

  @Output() filtro_emitido: EventEmitter<any> = new EventEmitter();

  async ngOnInit() {
    this.materiaList = await this.materiaService.getMaterias();
  }
  toggleFilters() {
    this.showFilters = !this.showFilters;
    console.log('toggleFilters called, showFilters is now:', this.showFilters);
  }

  selectMateria(filterFormValue: any) {
    let materiaNombre = filterFormValue.materiaNombre;
    let valmin = filterFormValue.valmin;
    let valmax = filterFormValue.valmax;
    let puntuacion = filterFormValue.puntuacion;
    let criterio = filterFormValue.criterio;
    if (valmin === null) valmin = '';
    if (valmax === null) valmax = '';

    this.filtro_emitido.emit([
      materiaNombre,
      valmin,
      valmax,
      puntuacion,
      criterio,
    ]);
  }
}
