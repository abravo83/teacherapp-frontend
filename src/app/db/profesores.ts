import { Iprofesor } from '../interfaces/iprofesor';

export const PROFESORES: Iprofesor[] = [
  {
    id: 1,
    usuarios_id: 1,
    precio_hora: 25.0,
    localizacion: 'Madrid',
    telefono: '612345678',
    meses_experiencia: 36,
    validado: true,
  },
  {
    id: 2,
    usuarios_id: 4,
    precio_hora: 30.0,
    localizacion: 'Barcelona',
    telefono: '698765432',
    meses_experiencia: 48,
    validado: true,
  },
  {
    id: 3,
    usuarios_id: 6,
    precio_hora: 28.0,
    localizacion: 'Valencia',
    telefono: '634567890',
    meses_experiencia: 24,
    validado: true,
  },
  {
    id: 4,
    usuarios_id: 8,
    precio_hora: 35.0,
    localizacion: 'Sevilla',
    telefono: '645678901',
    meses_experiencia: 60,
    validado: true,
  },
];
