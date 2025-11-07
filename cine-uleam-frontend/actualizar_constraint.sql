-- SQL para actualizar el constraint de la tabla notificaciones
-- Ejecuta este SQL en el SQL Editor de Supabase

-- Paso 1: Eliminar el constraint existente
ALTER TABLE notificaciones 
DROP CONSTRAINT IF EXISTS notificaciones_tipo_check;

-- Paso 2: Crear el constraint actualizado con 'sugerencia' incluido
ALTER TABLE notificaciones 
ADD CONSTRAINT notificaciones_tipo_check 
CHECK (tipo IN ('reserva', 'anuncio', 'Recomendacion', 'sugerencia'));

-- Verificar que el constraint se creó correctamente
-- (Opcional) Puedes ejecutar esto para ver los constraints de la tabla:
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'notificaciones'::regclass 
-- AND conname = 'notificaciones_tipo_check';

