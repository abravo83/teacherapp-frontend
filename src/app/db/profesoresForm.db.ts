import { Iprofesor } from '../interfaces/iprofesor';
import { ImateriaProfesor } from '../interfaces/imateriaprofesor';

export const PROFESORES: Iprofesor[] = [
  {
    id: 1,
    usuarios_id: 1,
    nombre: 'Juan',
    apellidos: 'García Pérez',
    email: 'juan@email.com',
    password: 'password123',
    rol: 'profesor',
    foto: 'https://example.com/photo.jpg',
    activo: true,
    precio_hora: 25.0,
    localizacion: '0.337249,-78.137276',
    telefono: '612345678',
    meses_experiencia: 36,
    validado: true,
  },
  {
    id: 2,
    usuarios_id: 4,
    nombre: 'Ana',
    apellidos: 'Fernández Gómez',
    email: 'ana@email.com',
    password: 'passwordabc',
    rol: 'profesor',
    foto: 'https://example.com/photo.jpg',
    activo: true,
    precio_hora: 30.0,
    localizacion: '0.320329,-78.207727',
    telefono: '698765432',
    meses_experiencia: 48,
    validado: true,
  },
  {
    id: 3,
    usuarios_id: 6,
    nombre: 'Laura',
    apellidos: 'Gómez Sanz',
    email: 'laura@email.com',
    password: 'password101',
    rol: 'profesor',
    foto: 'https://example.com/photo.jpg',
    activo: true,
    precio_hora: 28.0,
    localizacion: '0.353823,-78.122169',
    telefono: '634567890',
    meses_experiencia: 24,
    validado: true,
  }
];

export const MATERIAS_PROFESORES: ImateriaProfesor[] = [
  { id: 1, usuarios_id: 1, Materias_id: 1 },
  { id: 2, usuarios_id: 1, Materias_id: 10 },
  { id: 3, usuarios_id: 4, Materias_id: 3 },
  { id: 4, usuarios_id: 4, Materias_id: 4 },
  { id: 5, usuarios_id: 6, Materias_id: 5 },
  { id: 6, usuarios_id: 6, Materias_id: 6 },
];
