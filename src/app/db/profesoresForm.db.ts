import { IRespuestaTeachersForm } from "../interfaces/iRespuestaTeachersForm.interface";


export const PROFESORES: IRespuestaTeachersForm[] = [
  {
    usuario: {
      id: 1,
      nombre: 'Juan',
      apellidos: 'García Pérez',
      email: 'juan@email.com',
      password: 'password123',
      rol: 'profesor',
      foto: 'https://example.com/photo.jpg',
      activo: true,
    },
    profesor: {
      id: 1,
      usuarios_id: 1,
      precio_hora: 25.0,
      localizacion: '0.337249,-78.137276',
      telefono: 612345678,
      meses_experiencia: 36,
      validado: true,
    },
    materias: [
      { id: 1, nombre: 'Matemáticas' },
      { id: 2, nombre: 'Física' }
    ]
  },
  {
    usuario: {
      id: 2,
      nombre: 'Ana',
      apellidos: 'Fernández Gómez',
      email: 'ana@email.com',
      password: 'passwordabc',
      rol: 'profesor',
      foto: 'https://example.com/photo.jpg',
      activo: true,
    },
    profesor: {
      id: 2,
      usuarios_id: 2,
      precio_hora: 30.0,
      localizacion: '0.320329,-78.207727',
      telefono: 698765432,
      meses_experiencia: 48,
      validado: true,
    },
    materias: [
      { id: 3, nombre: 'Química' },
      { id: 4, nombre: 'Biología' }
    ]
  },
  {
    usuario: {
      id: 3,
      nombre: 'Laura',
      apellidos: 'Gómez Sanz',
      email: 'laura@email.com',
      password: 'password101',
      rol: 'profesor',
      foto: 'https://example.com/photo.jpg',
      activo: true,
    },
    profesor: {
      id: 3,
      usuarios_id: 3,
      precio_hora: 28.0,
      localizacion: '0.353823,-78.122169',
      telefono: 634567890,
      meses_experiencia: 24,
      validado: true,
    },
    materias: [
      { id: 5, nombre: 'Literatura' },
      { id: 6, nombre: 'Historia' }
    ]
  }
];
