export interface Imensaje {
  id: number;
  emisor_id: number;
  destinatario_id: number;
  asunto: string;
  contenido: string;
  leido: boolean;
}
