import { Imensaje } from '../interfaces/imensaje';

export const MENSAJES: Imensaje[] = [
  {
    id: 1,
    emisor_id: 2,
    destinatario_id: 1,
    asunto: 'Duda sobre la clase',
    contenido: '¿Podría explicarme de nuevo el tema de derivadas?',
    leido: false,
  },
  {
    id: 2,
    emisor_id: 1,
    destinatario_id: 2,
    asunto: 'RE: Duda sobre la clase',
    contenido: 'Claro, en la próxima clase repasaremos ese tema.',
    leido: true,
  },
  {
    id: 3,
    emisor_id: 5,
    destinatario_id: 4,
    asunto: 'Solicitud de tutoría',
    contenido: '¿Tiene disponibilidad para una tutoría el próximo jueves?',
    leido: false,
  },
  {
    id: 4,
    emisor_id: 7,
    destinatario_id: 6,
    asunto: 'Consulta sobre el examen',
    contenido: '¿Podría darme más detalles sobre el formato del examen final?',
    leido: false,
  },
  {
    id: 5,
    emisor_id: 6,
    destinatario_id: 7,
    asunto: 'RE: Consulta sobre el examen',
    contenido:
      'Por supuesto, te enviaré un documento con toda la información necesaria.',
    leido: true,
  },
  {
    id: 6,
    emisor_id: 9,
    destinatario_id: 8,
    asunto: 'Cambio de horario',
    contenido: '¿Sería posible cambiar mi clase del martes al jueves?',
    leido: false,
  },
  {
    id: 7,
    emisor_id: 8,
    destinatario_id: 9,
    asunto: 'RE: Cambio de horario',
    contenido:
      'Sí, podemos hacer el cambio. Te confirmo el nuevo horario pronto.',
    leido: true,
  },
  {
    id: 8,
    emisor_id: 4,
    destinatario_id: 1,
    asunto: 'Material adicional',
    contenido:
      '¿Tiene recursos extra para el tema de ecuaciones diferenciales?',
    leido: false,
  },
];
