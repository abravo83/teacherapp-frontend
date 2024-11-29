export interface Iregistros {
  id: number;
  alumno_id: number;
  profesor_id: number;
  nombre_alumno?: string;
  nombre_profesor?: string;
  apellidos_alumno?: string;
  apellidos_profesor?: string;
  foto_alumno?: string;
  foto_profesor?: string;
  email_alumno?: string;
  email_profesor?: string;
  fecha_registro: Date;
  fecha_fin?: Date;
}
