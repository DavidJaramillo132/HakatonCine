# 🎬 Guía de Pruebas - Sistema de Reservas con QR

## ✅ Correcciones Realizadas

### 1. **EscanerQR.vue** - Nombre de tabla corregido
- **Problema:** La tabla se llamaba `ticket_qr` (sin 's')
- **Solución:** Cambiado a `tickets_qr` (con 's') en todas las consultas
- **Líneas afectadas:**
  - Búsqueda de ticket: `.from('tickets_qr')`
  - Actualización de estado: `.from('tickets_qr')`

### 2. **GeneradorQR.vue** - Renderizado del QR mejorado
- **Problema:** Canvas no se renderizaba después de crear la reserva
- **Solución:** 
  - Orden correcto: DB → DOM → Render
  - Uso de `nextTick()` + delay de 100ms
  - Logs detallados para debugging

## 📋 Flujo Completo del Sistema

```
1. Usuario ve Cartelera
   ↓
2. Selecciona película y hace clic en "Reservar"
   ↓
3. Redirige a GeneradorQR con película preseleccionada
   ↓
4. Usuario selecciona función y asientos
   ↓
5. Hace clic en "Generar Mi Código QR"
   ↓
6. Sistema crea reserva en BD
   ↓
7. Sistema crea ticket_qr en BD
   ↓
8. Sistema genera QR visual en canvas
   ↓
9. Usuario descarga QR
   ↓
10. Personal escanea QR en EscanerQR
   ↓
11. Sistema valida contra BD
   ↓
12. Personal confirma entrada
   ↓
13. Sistema marca ticket como "usado" y reserva como "asistida"
```

## 🧪 Pruebas a Realizar

### **Prueba 1: Generación de QR**

1. Inicia sesión en la aplicación
2. Ve a `/cartelera`
3. Selecciona una película
4. Haz clic en "Reservar"
5. **Verifica:** Deberías estar en `/generar-qr` con la película preseleccionada
6. Selecciona una función
7. Ingresa número de asientos (1-10)
8. Haz clic en "Generar Mi Código QR"
9. **Abre la consola (F12)** y verifica estos mensajes:
   ```
   Iniciando generación de QR...
   Reserva creada: {id: "...", ...}
   Datos del QR: {...}
   String del QR: {...}
   Ticket guardado en BD
   Canvas encontrado, generando QR visual...
   ✅ QR generado exitosamente en el canvas
   ```
10. **Verifica:** El código QR debe aparecer visualmente
11. **Verifica:** Debe aparecer la información de la reserva
12. Haz clic en "Descargar QR"
13. **Verifica:** Se descarga una imagen PNG con el QR

### **Prueba 2: Escaneo con Cámara**

1. Ve a `/escanear-qr`
2. Haz clic en "Escanear con Cámara"
3. Haz clic en "Iniciar Escaneo"
4. **Verifica:** Se solicita permiso de cámara
5. **Verifica:** La cámara se activa y muestra el video
6. Apunta la cámara al QR generado anteriormente
7. **Verifica:** El sistema detecta el QR automáticamente
8. **Verifica:** Muestra información del usuario y la función
9. **Verifica:** Estado es "ENTRADA VÁLIDA" ✅
10. Haz clic en "CONFIRMAR ENTRADA"
11. **Verifica:** Mensaje de confirmación aparece
12. Intenta escanear el mismo QR nuevamente
13. **Verifica:** Debe mostrar "Este código QR ya ha sido utilizado" ❌

### **Prueba 3: Escaneo Manual**

1. Ve a `/escanear-qr`
2. Haz clic en "Ingreso Manual"
3. Copia el ID de la reserva del QR generado
4. Pégalo en el campo de texto
5. Haz clic en "Validar Código"
6. **Verifica:** Muestra la misma información que el escaneo con cámara

### **Prueba 4: Validación de Errores**

#### QR Inválido
1. Ve a `/escanear-qr` → Ingreso Manual
2. Ingresa un texto aleatorio: `abc123xyz`
3. Haz clic en "Validar Código"
4. **Verifica:** Debe mostrar "Código QR no encontrado o inválido" ❌

#### QR Ya Usado
1. Genera un nuevo QR
2. Escanéalo y confirma la entrada
3. Intenta escanearlo nuevamente
4. **Verifica:** Debe mostrar "Este código QR ya ha sido utilizado" ❌

## 🗄️ Verificación de Base de Datos

### Después de Generar QR:

**Tabla `reservas`:**
```sql
SELECT * FROM reservas ORDER BY created_at DESC LIMIT 1;
```
- Debe tener: `usuario_id`, `funcion_id`, `asientos`, `estado='activa'`

**Tabla `tickets_qr`:**
```sql
SELECT * FROM tickets_qr ORDER BY fecha_generacion DESC LIMIT 1;
```
- Debe tener: `reserva_id`, `codigo_qr` (JSON string), `estado='activo'`

### Después de Confirmar Entrada:

**Tabla `tickets_qr`:**
```sql
SELECT * FROM tickets_qr WHERE id = '[ID_DEL_TICKET]';
```
- `estado` debe ser `'usado'`
- `verificado_en` debe tener fecha/hora

**Tabla `reservas`:**
```sql
SELECT * FROM reservas WHERE id = '[ID_DE_RESERVA]';
```
- `estado` debe ser `'asistida'`

## 🐛 Solución de Problemas

### El QR no se muestra después de generar
**Síntomas:** Reserva creada pero canvas vacío
**Solución:**
1. Abre la consola (F12)
2. Busca errores en rojo
3. Verifica si aparece "Canvas no encontrado"
4. Si aparece, reporta el problema con captura de consola

### Error al escanear: "ticket_qr no encontrado"
**Síntomas:** Al escanear muestra error de tabla
**Solución:** ✅ Ya corregido - Tabla cambiada a `tickets_qr`

### Cámara no se activa
**Síntomas:** No aparece video de cámara
**Solución:**
1. Verifica permisos de cámara en el navegador
2. Prueba con otro navegador (Chrome recomendado)
3. Usa "Ingreso Manual" como alternativa

### QR no es reconocido por el escáner
**Síntomas:** Escáner no detecta el QR
**Solución:**
1. Asegúrate de tener buena iluminación
2. Mantén el QR estable frente a la cámara
3. Prueba aumentar/disminuir la distancia
4. Usa "Ingreso Manual" copiando el ID de reserva

## 📱 Compatibilidad de Navegadores

| Navegador | Generación QR | Escaneo Cámara | Escaneo Manual |
|-----------|--------------|----------------|----------------|
| Chrome    | ✅           | ✅             | ✅             |
| Firefox   | ✅           | ✅             | ✅             |
| Edge      | ✅           | ✅             | ✅             |
| Safari    | ✅           | ⚠️ (requiere permisos) | ✅ |

## 🎯 Checklist de Validación Final

- [ ] Puedo iniciar sesión correctamente
- [ ] Veo las películas en la cartelera
- [ ] El botón "Reservar" me lleva a GeneradorQR
- [ ] La película se preselecciona automáticamente
- [ ] Veo mis datos (nombre, correo, carrera) sin tener que ingresarlos
- [ ] Puedo seleccionar una función
- [ ] El QR se genera y se muestra visualmente
- [ ] Puedo descargar el QR como imagen
- [ ] La consola muestra todos los mensajes de éxito
- [ ] El escáner detecta el QR con la cámara
- [ ] El escáner valida correctamente con ingreso manual
- [ ] La información mostrada en el escáner es correcta
- [ ] Puedo confirmar la entrada
- [ ] El QR usado no puede ser reutilizado
- [ ] El historial de escaneos se actualiza

---

## 📞 Soporte

Si encuentras algún problema no listado aquí:

1. **Abre la consola del navegador (F12)**
2. **Reproduce el error**
3. **Copia todos los mensajes de error**
4. **Toma captura de pantalla**
5. **Reporta con detalles:**
   - ¿Qué estabas haciendo?
   - ¿Qué esperabas que pasara?
   - ¿Qué pasó en realidad?
   - Mensajes de la consola
   - Capturas de pantalla
