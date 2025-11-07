export interface Notificacion {
  id: string
  usuario_id: string
  titulo: string
  mensaje: string
  tipo: 'reserva' | 'anuncio' | 'Recomendacion' | 'sugerencia'
  leida: boolean
  enviada_en?: string
}
