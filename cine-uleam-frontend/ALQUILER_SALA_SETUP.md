# 📋 Guía de Configuración - Módulo de Alquiler de Sala

## 🗄️ Paso 1: Ejecutar Migración SQL

1. Abre el dashboard de Supabase
2. Ve a **SQL Editor**
3. Copia y ejecuta el contenido completo del archivo `supabase_migration_alquiler.sql`
4. Verifica que las tablas se crearon correctamente:
   - `alquiler_eventos` (con referencia a `usuarios(id)`)
   - `alquiler_archivos` (con referencia a `alquiler_eventos(id)`)
5. Las políticas RLS se crearán automáticamente

## 📦 Paso 2: Crear Bucket de Storage

1. Ve a **Storage** en el dashboard de Supabase
2. Haz clic en **New Bucket**
3. Configuración del bucket:
   - **Name**: `alquiler-archivos`
   - **Public bucket**: ❌ NO (desactivado - archivos privados)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: `image/*, application/pdf`

4. **Políticas de Storage**:
   
   **Opción A: Bucket Público (Recomendado - Más simple)**
   - Marca el bucket como **Público** ✅
   - El código del componente manejará las URLs automáticamente
   - Las políticas RLS de las tablas `alquiler_archivos` ya controlan el acceso a los metadatos
   
   **Opción B: Bucket Privado (Más seguro)**
   ```sql
   -- Política: Usuarios autenticados pueden subir archivos
   CREATE POLICY "Usuarios autenticados pueden subir"
   ON storage.objects
   FOR INSERT
   WITH CHECK (
     bucket_id = 'alquiler-archivos' AND
     auth.role() = 'authenticated'
   );

   -- Política: Usuarios pueden leer sus propios archivos
   -- Nota: Esto es básico; el control fino está en las tablas RLS
   CREATE POLICY "Usuarios autenticados pueden leer"
   ON storage.objects
   FOR SELECT
   USING (
     bucket_id = 'alquiler-archivos' AND
     auth.role() = 'authenticated'
   );
   ```
   
   **Recomendación:** Usa la Opción A (bucket público) ya que:
   - Es más simple de configurar
   - Los archivos solo son accesibles si conoces la URL exacta
   - El control de acceso está en las tablas RLS (quién puede ver qué archivo)
   - El código maneja automáticamente ambos casos

## 🔧 Paso 3: Verificar Políticas RLS

Asegúrate de que las políticas RLS estén correctamente configuradas:

1. Ve a **Authentication** → **Policies**
2. Verifica que las políticas para `alquiler_eventos` y `alquiler_archivos` estén activas

## ✅ Paso 4: Probar el Módulo

1. **Como Usuario Normal:**
   - Inicia sesión
   - Ve a "Alquiler de Sala" en el menú
   - Crea una solicitud de alquiler
   - Verifica que puedas ver tus solicitudes

2. **Como Administrador:**
   - Inicia sesión con una cuenta de admin
   - Ve a "Alquiler de Sala"
   - Verifica que puedas ver todas las solicitudes
   - Prueba aprobar/rechazar solicitudes
   - Verifica los filtros de estado y fecha

## 🎨 Características del Módulo

### Para Usuarios:
- ✅ Formulario completo de solicitud
- ✅ Autocompletado del nombre del solicitante
- ✅ Subida de archivos (carteles, invitaciones)
- ✅ Vista de mis solicitudes con estados
- ✅ Validación de fechas y horas

### Para Administradores:
- ✅ Tabla completa de todas las solicitudes
- ✅ Filtros por estado (pendiente, aprobado, rechazado)
- ✅ Filtros por rango de fechas
- ✅ Aprobar/Rechazar solicitudes
- ✅ Ver detalles completos de cada solicitud
- ✅ Notificaciones animadas al cambiar estado

## 🐛 Solución de Problemas

### Error: "No se pueden crear solicitudes"
- Verifica que las políticas RLS estén activas
- Asegúrate de que el usuario esté en la tabla `usuarios`
- Verifica que `usuario_id` coincida con el ID del usuario autenticado

### Error: "No se puede subir archivo"
- Verifica que el bucket `alquiler-archivos` existe
- Verifica las políticas de Storage
- Asegúrate de que el archivo no exceda 10MB

### Error: "No se muestran las solicitudes"
- Verifica que las políticas de SELECT estén activas
- Si eres admin, verifica que tu rol sea 'admin' en la tabla usuarios
- Revisa la consola del navegador para errores

## 📝 Notas Importantes

1. **Relación de Usuarios**: El módulo usa la tabla `usuarios`, no `auth.users` directamente
2. **Archivos**: Los archivos se almacenan en Supabase Storage en el bucket `alquiler-archivos`
3. **Estados**: Los estados válidos son: `pendiente`, `aprobado`, `rechazado`
4. **Colores Institucionales**: 
   - Rojo: `#C8102E`
   - Verde: `#006847`
   - Fondo: Blanco

## 🔗 Enlaces Útiles

- Ruta del módulo: `/alquiler-sala`
- Componente: `src/components/AlquilerSala.vue`
- Interfaces: `src/interface/IAlquiler.ts`
- SQL Migration: `supabase_migration_alquiler.sql`

