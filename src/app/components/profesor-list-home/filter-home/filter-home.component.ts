import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Imateria } from '../../../interfaces/imateria';
import { ProfesoresService } from '../../../services/profesores.service';

@Component({
  selector: 'app-filter-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter-home.component.html',
  styleUrl: './filter-home.component.css',
})
export class FilterHomeComponent {
  materiaList: Imateria[] = [];
  usuariosList: any[] = [];
  profesoresService = inject(ProfesoresService);
  @Output() materia_id_emitida: EventEmitter<number> = new EventEmitter();

  ngOnInit() {
    this.materiaList = this.profesoresService.getAllMaterias();
  }
  selectMateria(filterFormValue: any) {
    let idMateria = Number(filterFormValue.materia_id);
    this.materia_id_emitida.emit(idMateria);

    // this.usuariosList = this.profesoresService.fiterByMaterias(idMateria);
    // console.log(this.usuariosList);
  }
}
