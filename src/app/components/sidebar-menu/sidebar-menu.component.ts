import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css'],
  imports: [CommonModule, RouterModule], // Otras dependencias necesarias
})
export class SidebarMenuComponent {}
