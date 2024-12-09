import { Iopinion } from '../interfaces/iopinion';

export const OPINIONES: Iopinion[] = [
  {
    estudiante_id: 2,
    profesor_id: 1,
    puntuacion: 5,
    comentario: 'Excelente profesor, muy claro en sus explicaciones',
    fecha: new Date(),
  },
  {
    estudiante_id: 5,
    profesor_id: 1,
    puntuacion: 4,
    comentario: 'Buen profesor, pero a veces va demasiado rápido',
    fecha: new Date(Date.now() - 86400000),
  },
  {
    estudiante_id: 2,
    profesor_id: 4,
    puntuacion: 5,
    comentario: 'Ana es una profesora fantástica, muy paciente',
    fecha: new Date(Date.now() - 172800000),
  },
  {
    estudiante_id: 7,
    profesor_id: 6,
    puntuacion: 4,
    comentario: 'Muy buen profesor, explica con claridad',
    fecha: new Date(Date.now() - 259200000),
  },
  {
    estudiante_id: 9,
    profesor_id: 8,
    puntuacion: 5,
    comentario: 'Excelente metodología y atención personalizada',
    fecha: new Date(Date.now() - 345600000),
  },
  {
    estudiante_id: 4,
    profesor_id: 1,
    puntuacion: 4,
    comentario: 'Clases dinámicas y entretenidas',
    fecha: new Date(Date.now() - 432000000),
  },
  {
    estudiante_id: 5,
    profesor_id: 4,
    puntuacion: 3,
    comentario: 'Buena profesora, pero podría mejorar el material de estudio',
    fecha: new Date(Date.now() - 518400000),
  },
  {
    estudiante_id: 7,
    profesor_id: 8,
    puntuacion: 5,
    comentario: 'Javier es un profesor excepcional, muy recomendado',
    fecha: new Date(Date.now() - 604800000),
  },
  {
    estudiante_id: 9,
    profesor_id: 6,
    puntuacion: 4,
    comentario: 'Clases interesantes y bien estructuradas',
    fecha: new Date(Date.now() - 691200000),
  },
  {
    estudiante_id: 2,
    profesor_id: 6,
    puntuacion: 5,
    comentario: 'David hace que las clases sean muy interactivas',
    fecha: new Date(Date.now() - 777600000),
  },
];
