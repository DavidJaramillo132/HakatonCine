# Sistema de Encuestas - Cine ULEAM

## 📋 Descripción

Sistema completo de encuestas donde los **administradores** pueden crear encuestas con respuesta Sí/No y los **estudiantes** pueden responder.

## 🗄️ Configuración de Base de Datos

### Paso 1: Crear las Tablas en Supabase

Ejecuta el archivo `crear_tablas_encuestas.sql` en el SQL Editor de Supabase. Este script crea:

- ✅ Tabla `encuestas` - Almacena las encuestas
- ✅ Tabla `respuestas_encuesta` - Almacena las respuestas
- ✅ Políticas RLS (Row Level Security) para seguridad
- ✅ Vista `vista_estadisticas_encuestas` para reportes
- ✅ Índices para optimizar el rendimiento

### Estructura de Tablas

#### Tabla: `encuestas`
```sql
- id: BIGSERIAL (Primary Key)
- pregunta: TEXT (Requerido)
- descripcion: TEXT (Opcional)
- activa: BOOLEAN (Default: true)
- fecha_creacion: TIMESTAMP (Auto)
- fecha_cierre: TIMESTAMP (Opcional)
- creado_por: UUID (Referencia a auth.users)
```

#### Tabla: `respuestas_encuesta`
```sql
- id: BIGSERIAL (Primary Key)
- encuesta_id: BIGINT (FK a encuestas)
- usuario_id: UUID (FK a auth.users)
- respuesta: VARCHAR(2) ('si' o 'no')
- fecha_respuesta: TIMESTAMP (Auto)
- UNIQUE(encuesta_id, usuario_id) - Una respuesta por usuario
```

## 🎯 Funcionalidades

### Para Administradores (`/admin/encuestas`)

✅ **Crear Encuestas**
- Pregunta obligatoria
- Descripción opcional para contexto
- Fecha de cierre opcional
- Activar/desactivar inmediatamente

✅ **Gestionar Encuestas**
- Editar encuestas existentes
- Activar/desactivar encuestas
- Eliminar encuestas (con confirmación)
- Ver estado en tiempo real

✅ **Ver Estadísticas**
- Total de respuestas
- Cantidad de respuestas "Sí"
- Cantidad de respuestas "No"
- Porcentajes calculados automáticamente
- Barra visual de resultados

### Para Estudiantes (`/encuestas`)

✅ **Responder Encuestas**
- Ver encuestas activas
- Botones grandes para responder SÍ o NO
- Confirmación de respuesta
- No pueden responder dos veces la misma encuesta

✅ **Historial**
- Ver encuestas ya respondidas
- Ver su respuesta anterior
- Fecha y hora de respuesta

## 🚀 Rutas Configuradas

### Administradores
- `/admin/encuestas` - Gestión completa de encuestas

### Estudiantes
- `/encuestas` - Responder encuestas activas

## 🎨 Características del Diseño

### Vista Administrador
- 🟢 Badge verde para encuestas activas
- ⚪ Badge gris para encuestas inactivas
- 📊 Estadísticas en tiempo real
- 🎨 Barra de progreso visual (verde/rojo)
- 🔧 Botones de acción (editar, activar/desactivar, eliminar)

### Vista Estudiante
- 🎯 Encuestas pendientes destacadas con borde rojo
- ✅ Botones grandes y claros (Verde/Rojo)
- 📋 Historial de respuestas con opacidad reducida
- ⏰ Fecha de cierre visible

## 🔐 Seguridad (RLS)

### Políticas Implementadas

**Encuestas:**
- Admins: Acceso total (CRUD)
- Estudiantes: Solo pueden ver encuestas activas

**Respuestas:**
- Admins: Pueden ver todas las respuestas
- Estudiantes: Solo pueden ver sus propias respuestas
- Estudiantes: Solo pueden responder encuestas activas y no vencidas
- Restricción: Una respuesta por usuario por encuesta (UNIQUE constraint)

## 📊 Vista de Estadísticas

La vista `vista_estadisticas_encuestas` proporciona:
- Total de respuestas por encuesta
- Conteo de respuestas "sí" y "no"
- Porcentajes calculados automáticamente
- Datos en tiempo real

## 🧪 Ejemplo de Uso

### Crear una Encuesta (Admin)
1. Ir a `/admin/encuestas`
2. Click en "Nueva Encuesta"
3. Llenar formulario:
   - Pregunta: "¿Te gustaría más películas de terror?"
   - Descripción: "Estamos considerando agregar más películas de terror al catálogo"
   - Fecha de cierre: (opcional)
   - Activar: ✓
4. Click en "Crear Encuesta"

### Responder Encuesta (Estudiante)
1. Ir a `/encuestas`
2. Ver encuestas pendientes
3. Leer la pregunta
4. Click en botón "SÍ" o "NO"
5. Ver confirmación

## 📝 Notas Importantes

1. **Una respuesta por encuesta**: Los estudiantes solo pueden responder una vez cada encuesta
2. **Seguridad**: Las políticas RLS aseguran que cada rol solo acceda a lo permitido
3. **Eliminar encuestas**: Al eliminar una encuesta, se eliminan automáticamente todas sus respuestas (CASCADE)
4. **Fecha de cierre**: Si una encuesta tiene fecha de cierre, los estudiantes no podrán responder después de esa fecha

## 🔄 Integración

El sistema está completamente integrado con:
- ✅ Sistema de autenticación existente
- ✅ Router con protección por roles
- ✅ Supabase como base de datos
- ✅ Diseño consistente con el resto de la aplicación

## 🎉 ¡Listo para usar!

Solo necesitas ejecutar el SQL en Supabase y el sistema estará completamente funcional.
