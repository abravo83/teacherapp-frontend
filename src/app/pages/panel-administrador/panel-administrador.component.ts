import { Component, OnInit } from '@angular/core';
import { ProfesoresService } from '../../services/profesores.service';
import { UsuariosService } from '../../services/usuarios.service';
import { AlumnosService } from '../../services/alumnos.service';
import { Iprofesor } from '../../interfaces/iprofesor';
import { Iusuario } from '../../interfaces/iusuario';

@Component({
  selector: 'app-panel-administrador',
  templateUrl: './panel-administrador.component.html',
  styleUrls: ['./panel-administrador.component.css'],
})
export class PanelAdministradorComponent implements OnInit {
  profesores: Iprofesor[] = [];
  alumnos: Iusuario[] = [];
  respuestaAPI: string = '';
  seccionActual: 'profesores' | 'alumnos' = 'profesores';

  constructor(
    private profesoresService: ProfesoresService,
    private usuariosService: UsuariosService,
    private alumnosService: AlumnosService
  ) {}

  ngOnInit(): void {
    this.cargarProfesores();
    this.cargarAlumnos();
  }

  async cargarProfesores() {
    try {
      const profesores = await this.profesoresService.listarProfesores();
      this.profesores = profesores.map((profesor) => {
        if (profesor.localizacion) {
          try {
            const localizacionObj = JSON.parse(profesor.localizacion);
            profesor.localizacion = localizacionObj.address.split(',')[0]; 
          } catch {            
            profesor.localizacion = profesor.localizacion; 
          }
        }
        return profesor;
      });
    } catch (error) {
      console.error('Error al cargar profesores', error);
    }
  }
  

  async cargarAlumnos() {
    try {
      this.alumnos = await this.alumnosService.listarAlumnos();
    } catch (error) {
      console.error('Error al cargar alumnos', error);
    }
  }

  async cambiarEstadoUsuario(id: number, activo: boolean) {
    try {
      const response = await this.usuariosService.activarUsuario(id, activo);
      this.respuestaAPI = response.message;

      setTimeout(() => {
        this.respuestaAPI = '';
      }, 3000);

      this.cargarProfesores();
      this.cargarAlumnos();
    } catch (error) {
      console.error('Error al cambiar el estado del usuario', error);
    }
  }

  async cambiarValidacionProfesor(id: number, validado: boolean) {
    try {
      const response = await this.profesoresService.validarProfesor(
        id,
        validado
      );
      this.respuestaAPI = response.message;

      setTimeout(() => {
        this.respuestaAPI = '';
      }, 3000);

      this.cargarProfesores();
    } catch (error) {
      console.error('Error al cambiar la validación del profesor', error);
    }
  }

  cambiarSeccion(seccion: 'profesores' | 'alumnos') {
    this.seccionActual = seccion;
    this.respuestaAPI = '';
  }

  limpiarMensajeAPI() {
    this.respuestaAPI = '';
  }
}
