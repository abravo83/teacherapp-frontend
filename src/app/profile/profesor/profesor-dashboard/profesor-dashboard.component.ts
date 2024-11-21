import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UsuariosService } from '../../../services/usuarios.service';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { WelcomeMessageComponent } from '../../../components/welcome-message/welcome-message.component';
import { SidebarMenuComponent } from '../../../components/sidebar-menu/sidebar-menu.component';

@Component({
  selector: 'app-profesor-dashboard',
  templateUrl: './profesor-dashboard.component.html',
  styleUrls: ['./profesor-dashboard.component.css'],
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    SidebarMenuComponent,
    WelcomeMessageComponent,
    RouterModule,
  ],
})
export class ProfesorDashboardComponent implements OnInit {
  nombreUsuario: string = '';

  constructor(private usuariosService: UsuariosService) {}

  async ngOnInit(): Promise<void> {
    const usuario = await this.usuariosService.getUsuarioActual();
    this.nombreUsuario = usuario?.nombre || 'Usuario'; // Si no hay usuario, muestra 'Usuario' por defecto
  }
}
