import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  exports: [ReactiveFormsModule], // Deja esto para que otros módulos puedan usar ReactiveForms
})
export class SharedModule {}
