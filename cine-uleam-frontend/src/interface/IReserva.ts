export interface Reserva {
  id: string
  usuario_id: string
  funcion_id: string
  asientos: number
  estado: 'activa' | 'cancelada' | 'asistida' | 'confirmada'
  fecha_reserva?: string
}
