import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../services/usuarios.service';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { SidebarMenuComponent } from '../../../components/sidebar-menu/sidebar-menu.component';
import { WelcomeMessageComponent } from '../../../components/welcome-message/welcome-message.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profesor-dashboard',
  templateUrl: './profesor-dashboard.component.html',
  styleUrls: ['./profesor-dashboard.component.css'],
  standalone: true, // Declaramos el componente como standalone
  imports: [
    NavbarComponent,
    FooterComponent,
    SidebarMenuComponent,
    WelcomeMessageComponent,
    RouterModule, // Importamos RouterModule para poder usar router-outlet
  ],
})
export class ProfesorDashboardComponent implements OnInit {
  nombreUsuario: string = '';

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    const usuario = this.usuariosService.getUsuarioActual();
    this.nombreUsuario = usuario?.nombre || 'Usuario'; // Si no hay usuario, muestra 'Usuario' por defecto
  }
}
