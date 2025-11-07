export interface Usuario {
  id: string
  nombre: string
  correo: string
  rol: 'estudiante' | 'admin'
  carrera?: string
  creado_en?: string
}
