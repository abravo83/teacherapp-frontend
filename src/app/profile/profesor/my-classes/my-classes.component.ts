import { Component, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { TeacherDataService } from '../../../services/teacher-data.service';

@Component({
  selector: 'app-my-classes',
  templateUrl: './my-classes.component.html',
  styleUrls: ['./my-classes.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class MyClassesComponent {
  courses$: Observable<any[]>;

  constructor(private teacherDataService: TeacherDataService) {
    this.courses$ = this.teacherDataService.getScheduledClasses();

    this.courses$.subscribe((data) => {
      console.log('Datos de las clases programadas:', data);
    });
  }
}
