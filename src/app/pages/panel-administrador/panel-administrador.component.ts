import { Component, OnInit } from '@angular/core';
import { ProfesoresService } from '../../services/profesores.service';
import { UsuariosService } from '../../services/usuarios.service';
import { AlumnosService } from '../../services/alumnos.service';
import { MateriasService } from '../../services/materias.service';
import { environment } from '../../../environments/environments';
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
  materiasPorProfesor: { [profesorId: number]: string[] } = {};
  seccionActual: 'profesores' | 'alumnos' = 'profesores';
  fotoSeleccionada: string | null = null;
  mostrarModalFoto: boolean = false;

  constructor(
    private profesoresService: ProfesoresService,
    private usuariosService: UsuariosService,
    private alumnosService: AlumnosService,
    private materiasService: MateriasService
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
        if (profesor.foto && profesor.foto.startsWith('/img/profiles/')) {
          profesor.foto = `${environment.API_URL}${profesor.foto}`;
        } else {
          profesor.foto = undefined;
        }
        return profesor;
      });

      for (const profesor of this.profesores) {
        try {
          if (profesor.id !== undefined) {
            const materias = await this.materiasService.obtenerMateriasProfesor(
              profesor.id
            );
            this.materiasPorProfesor[profesor.id] = materias.map(
              (m) => m.nombre
            );
          } else {
            if (profesor.id !== undefined) {
              this.materiasPorProfesor[profesor.id] = [];
            }
          }
        } catch {
          if (profesor.id !== undefined) {
            this.materiasPorProfesor[profesor.id] = [];
          }
        }
      }
    } catch (error) {
      console.error('Error al cargar profesores:', error);
    }
  }

  async cargarAlumnos() {
    try {
      const alumnos = await this.alumnosService.listarAlumnos();
      this.alumnos = alumnos.map((alumno) => {
        if (alumno.foto && alumno.foto.startsWith('/img/profiles/')) {
          alumno.foto = `${environment.API_URL}${alumno.foto}`;
        } else {
          alumno.foto = undefined;
        }
        return alumno;
      });
    } catch (error) {
      console.error('Error al cargar alumnos:', error);
    }
  }

  abrirFoto(foto: string) {
    if (
      foto.startsWith(`${environment.API_URL}/img/profiles/`) ||
      foto.startsWith('/img/profiles/')
    ) {
      this.fotoSeleccionada = foto.startsWith('http')
        ? foto
        : `${environment.API_URL}${foto}`;
      this.mostrarModalFoto = true;
    } else {
      console.warn('Foto no válida o de prueba');
    }
  }

  cerrarModalFoto() {
    this.fotoSeleccionada = null;
    this.mostrarModalFoto = false;
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
    } catch {}
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
    } catch {}
  }

  cambiarSeccion(seccion: 'profesores' | 'alumnos') {
    this.seccionActual = seccion;
    this.respuestaAPI = '';
  }

  limpiarMensajeAPI() {
    this.respuestaAPI = '';
  }
}
