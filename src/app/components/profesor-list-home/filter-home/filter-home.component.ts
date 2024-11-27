import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Imateria } from '../../../interfaces/imateria';
import { ProfesoresService } from '../../../services/profesores.service';
import { CommonModule, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-filter-home',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filter-home.component.html',
  styleUrl: './filter-home.component.css',
})
export class FilterHomeComponent {
  //injectables
  profesoresService = inject(ProfesoresService);
  //varialbles
  materiaList: Imateria[] = [];
  experienciaList: any[] = [];
  showFilters: boolean = false;

  @Output() filtro_emitido: EventEmitter<[any, any, any]> = new EventEmitter();

  async ngOnInit() {
    this.materiaList = await this.profesoresService.getAllMaterias();
  }
  toggleFilters() {
    this.showFilters = !this.showFilters;
    console.log('toggleFilters called, showFilters is now:', this.showFilters);
  }

  selectMateria(filterFormValue: any) {
    let idMateria = Number(filterFormValue.materiaId);

    if (filterFormValue.experiencia) {
      var exper = filterFormValue.experiencia.split(',').map(Number);
    } else {
      exper = [0, 100000];
    }

    if (filterFormValue.precio) {
      var precio = filterFormValue.precio.split(',').map(Number);
    } else {
      precio = [0, 100000];
    }

    this.filtro_emitido.emit([idMateria, exper, precio]);
  }
}
