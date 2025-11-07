export interface Notificacion {
  id: string
  usuario_id: string
  titulo: string
  mensaje: string
  tipo: 'reserva' | 'anuncio' | 'recordatorio' | 'recomendacion'
  leida: boolean
  enviada_en?: string
}
