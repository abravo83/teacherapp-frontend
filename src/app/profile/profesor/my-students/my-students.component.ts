import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-students',
  templateUrl: './my-students.component.html',
  styleUrl: './my-students.component.css',
  standalone: true,
  imports: [DatePipe],
})
export class MyStudentsComponent {}
