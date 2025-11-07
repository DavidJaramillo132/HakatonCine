-- ============================================
-- Migración: Módulo de Alquiler de Sala
-- Sistema: Cine ULEAM Smart Experience
-- ============================================
-- IMPORTANTE: Este SQL debe ejecutarse en Supabase SQL Editor
-- Las tablas se crean en el esquema 'public' por defecto
-- ============================================

-- Tabla principal: solicitudes de alquiler de la sala de cine
CREATE TABLE IF NOT EXISTS alquiler_eventos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  usuario_id uuid NOT NULL,
  nombre_evento text NOT NULL,
  descripcion text,
  facultad text,
  fecha_inicio timestamp without time zone NOT NULL,
  fecha_fin timestamp without time zone NOT NULL,
  asistentes_estimados integer,
  estado text DEFAULT 'pendiente'::text CHECK (estado = ANY (ARRAY['pendiente'::text, 'aprobado'::text, 'rechazado'::text])),
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT alquiler_eventos_pkey PRIMARY KEY (id),
  CONSTRAINT alquiler_eventos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Tabla de archivos adjuntos (opcional)
CREATE TABLE IF NOT EXISTS alquiler_archivos (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  evento_id uuid NOT NULL,
  archivo_url text NOT NULL,
  created_at timestamp without time zone DEFAULT now(),
  CONSTRAINT alquiler_archivos_pkey PRIMARY KEY (id),
  CONSTRAINT alquiler_archivos_evento_id_fkey FOREIGN KEY (evento_id) REFERENCES alquiler_eventos(id) ON DELETE CASCADE
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_alquiler_eventos_usuario_id ON alquiler_eventos(usuario_id);
CREATE INDEX IF NOT EXISTS idx_alquiler_eventos_estado ON alquiler_eventos(estado);
CREATE INDEX IF NOT EXISTS idx_alquiler_eventos_fecha_inicio ON alquiler_eventos(fecha_inicio);
CREATE INDEX IF NOT EXISTS idx_alquiler_archivos_evento_id ON alquiler_archivos(evento_id);

-- ============================================
-- Políticas de Seguridad (Row Level Security)
-- ============================================

-- Habilitar RLS en ambas tablas
ALTER TABLE alquiler_eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE alquiler_archivos ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si existen (para poder recrearlas)
DROP POLICY IF EXISTS "Usuarios ven solo sus solicitudes" ON alquiler_eventos;
DROP POLICY IF EXISTS "Usuarios pueden crear solicitudes" ON alquiler_eventos;
DROP POLICY IF EXISTS "Administradores ven todas las solicitudes" ON alquiler_eventos;
DROP POLICY IF EXISTS "Administradores pueden actualizar solicitudes" ON alquiler_eventos;
DROP POLICY IF EXISTS "Usuarios ven archivos de sus solicitudes" ON alquiler_archivos;
DROP POLICY IF EXISTS "Administradores ven todos los archivos" ON alquiler_archivos;
DROP POLICY IF EXISTS "Usuarios pueden insertar archivos" ON alquiler_archivos;

-- Política: Usuarios ven solo sus propias solicitudes
-- Nota: usuarios.id coincide con auth.uid() según el esquema del sistema
CREATE POLICY "Usuarios ven solo sus solicitudes" 
  ON alquiler_eventos 
  FOR SELECT 
  USING (usuario_id::text = auth.uid()::text);

-- Política: Usuarios pueden crear solicitudes
CREATE POLICY "Usuarios pueden crear solicitudes" 
  ON alquiler_eventos 
  FOR INSERT 
  WITH CHECK (usuario_id::text = auth.uid()::text);

-- Política: Administradores pueden ver todas las solicitudes
CREATE POLICY "Administradores ven todas las solicitudes" 
  ON alquiler_eventos 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id::text = auth.uid()::text 
      AND rol = 'admin'
    )
  );

-- Política: Administradores pueden actualizar solicitudes
CREATE POLICY "Administradores pueden actualizar solicitudes" 
  ON alquiler_eventos 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id::text = auth.uid()::text 
      AND rol = 'admin'
    )
  );

-- Política: Usuarios pueden ver archivos de sus solicitudes
CREATE POLICY "Usuarios ven archivos de sus solicitudes" 
  ON alquiler_archivos 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM alquiler_eventos 
      WHERE id = evento_id 
      AND usuario_id::text = auth.uid()::text
    )
  );

-- Política: Administradores pueden ver todos los archivos
CREATE POLICY "Administradores ven todos los archivos" 
  ON alquiler_archivos 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE id::text = auth.uid()::text 
      AND rol = 'admin'
    )
  );

-- Política: Usuarios pueden insertar archivos en sus solicitudes
CREATE POLICY "Usuarios pueden insertar archivos" 
  ON alquiler_archivos 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM alquiler_eventos 
      WHERE id = evento_id 
      AND usuario_id::text = auth.uid()::text
    )
  );

-- ============================================
-- Comentarios en las Tablas
-- ============================================

COMMENT ON TABLE alquiler_eventos IS 'Solicitudes de alquiler de la sala de cine para eventos académicos';
COMMENT ON TABLE alquiler_archivos IS 'Archivos adjuntos de las solicitudes de alquiler (carteles, invitaciones, etc.)';

COMMENT ON COLUMN alquiler_eventos.estado IS 'Estado de la solicitud: pendiente, aprobado, rechazado';
COMMENT ON COLUMN alquiler_eventos.asistentes_estimados IS 'Número estimado de asistentes al evento';

-- ============================================
-- Verificación
-- ============================================

-- Verificar que las tablas se crearon correctamente
SELECT 
  table_name, 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name IN ('alquiler_eventos', 'alquiler_archivos')
ORDER BY table_name, ordinal_position;

-- Verificar que las políticas RLS están activas
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename IN ('alquiler_eventos', 'alquiler_archivos');
