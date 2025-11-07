export interface TicketQR {
  id: string
  reserva_id: string
  codigo_qr: string
  fecha_generacion?: string
  fecha_expiracion?: string
  estado: 'activo' | 'usado' | 'expirado'
  verificado_en?: string
}
