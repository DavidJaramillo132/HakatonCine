export interface IAlquilerEvento {
  id: string
  usuario_id: string
  nombre_evento: string
  descripcion?: string
  facultad?: string
  fecha_inicio: string
  fecha_fin: string
  asistentes_estimados?: number
  estado: 'pendiente' | 'aprobado' | 'rechazado'
  created_at?: string
  // Relaciones
  usuario?: {
    nombre: string
    correo: string
    carrera?: string
  }
}

export interface IAlquilerArchivo {
  id: string
  evento_id: string
  archivo_url: string
  created_at?: string
}

