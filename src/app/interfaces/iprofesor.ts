export interface Iprofesor {
  id?: number;
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  rol: string;
  foto?: string;
  activo: boolean;
  usuarios_id: number;
  precio_hora: number;
  localizacion: string;
  telefono: string;
  meses_experiencia: number;
  validado: boolean;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  pais?: string;
  zonaHoraria?: string;
  sobreMi?: string;
}
