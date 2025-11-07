# 🎬 Cine ULEAM - Sistema de Gestión Cinematográfica

Sistema completo de gestión cinematográfica para la Universidad Laica Eloy Alfaro de Manabí (ULEAM). Permite a estudiantes y administradores gestionar películas, funciones, reservas y validación de entradas mediante códigos QR.

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Funcionalidades Principales](#-funcionalidades-principales)
- [Roles de Usuario](#-roles-de-usuario)
- [API Externa](#-api-externa)

## ✨ Características

### Para Estudiantes
- 📱 **Visualización de Cartelera**: Explora películas disponibles con filtros por género y búsqueda por título
- 🎫 **Sistema de Reservas**: Reserva asientos para funciones disponibles
- 📱 **Códigos QR**: Genera y descarga códigos QR únicos para cada reserva
- 💡 **Sugerencias de Películas**: Sugiere películas nuevas usando la API de OMDb
- 🔐 **Autenticación Segura**: Sistema de login y registro con correo institucional
- 🔄 **Recuperación de Contraseña**: Restablece tu contraseña si la olvidaste

### Para Administradores
- 🎬 **Gestión de Películas**: 
  - Agregar películas desde la API de OMDb con traducción automática de sinopsis
  - Agregar películas manualmente
  - Editar y eliminar películas
- 📅 **Programación de Funciones**: Crea horarios para películas en diferentes salas
- 📊 **Dashboard de Estadísticas**: 
  - Reservas del día
  - Películas activas
  - Actualización automática cada 30 segundos
- ✅ **Escaneo de QR**: Valida entradas escaneando códigos QR o ingresando el código manualmente
- 👥 **Gestión de Usuarios**: Registro de nuevos administradores con código secreto

## 🛠️ Tecnologías

### Frontend
- **Vue 3** - Framework JavaScript progresivo
- **TypeScript** - Tipado estático para JavaScript
- **Vue Router** - Enrutamiento para aplicaciones Vue
- **Tailwind CSS** - Framework de CSS utility-first
- **Vite** - Build tool y servidor de desarrollo

### Backend y Base de Datos
- **Supabase** - Backend as a Service (BaaS)
  - Autenticación
  - Base de datos PostgreSQL
  - Almacenamiento

### Bibliotecas Externas
- **QRCode** - Generación de códigos QR
- **@zxing/browser** - Escaneo de códigos QR desde la cámara
- **OMDb API** - Base de datos de películas
- **MyMemory Translation API** - Traducción automática de sinopsis

## 📁 Estructura del Proyecto

```
cine-uleam-frontend/
├── src/
│   ├── components/          # Componentes Vue
│   │   ├── Home.vue         # Página de inicio
│   │   ├── Login.vue        # Inicio de sesión
│   │   ├── Register.vue     # Registro de usuarios
│   │   ├── Cartelera.vue    # Visualización de películas
│   │   ├── GeneradorQR.vue  # Generación de códigos QR
│   │   ├── EscanerQR.vue    # Escaneo de códigos QR
│   │   ├── AdminCartelera.vue # Panel de administración
│   │   ├── Sugerencia.vue   # Sugerencias de películas
│   │   ├── Navbar.vue       # Barra de navegación
│   │   ├── Footer.vue       # Pie de página
│   │   ├── Contacto.vue     # Página de contacto
│   │   ├── AcercaDe.vue     # Información sobre el cine
│   │   └── Proximas.vue     # Próximos estrenos
│   ├── router/
│   │   └── router.ts        # Configuración de rutas
│   ├── lib/
│   │   └── connectSupabase.ts # Conexión a Supabase
│   ├── interface/           # Interfaces TypeScript
│   │   ├── IPeliculas.ts
│   │   ├── IFuncion.ts
│   │   ├── IReserva.ts
│   │   ├── IUsuario.ts
│   │   └── ...
│   ├── assets/              # Recursos estáticos
│   ├── App.vue              # Componente principal
│   └── main.ts              # Punto de entrada
├── package.json
├── vite.config.ts
└── README.md
```

## 🚀 Instalación

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn
- Cuenta de Supabase

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd cine-uleam-frontend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

4. **Iniciar servidor de desarrollo**
```bash
npm run dev
```

5. **Construir para producción**
```bash
npm run build
```

## ⚙️ Configuración

### Configuración de Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Configura las siguientes tablas en tu base de datos:

#### Tabla: `usuarios`
```sql
- id (uuid, primary key)
- nombre (text)
- correo (text, unique)
- carrera (text)
- rol (text) -- 'estudiante' o 'admin'
- creada_en (timestamp)
```

#### Tabla: `peliculas`
```sql
- id (uuid, primary key)
- titulo (text)
- director (text)
- duracion_min (integer)
- genero (text)
- poster_url (text)
- sinopsis (text)
- creada_en (timestamp)
```

#### Tabla: `sala`
```sql
- id (uuid, primary key)
- nombre (text)
- capacidad (integer)
```

#### Tabla: `funciones`
```sql
- id (uuid, primary key)
- pelicula_id (uuid, foreign key -> peliculas)
- sala_id (uuid, foreign key -> sala)
- fecha (date)
- hora_inicio (time)
- hora_fin (time)
```

#### Tabla: `reservas`
```sql
- id (uuid, primary key)
- usuario_id (uuid, foreign key -> usuarios)
- funcion_id (uuid, foreign key -> funciones)
- asientos (integer)
- estado (text) -- 'activa', 'cancelada', 'asistida', 'confirmada'
- creada_en (timestamp)
```

#### Tabla: `tickets_qr`
```sql
- id (uuid, primary key)
- reserva_id (uuid, foreign key -> reservas)
- codigo_qr (text)
- estado (text) -- 'activo', 'usado'
- fecha_generacion (timestamp)
```

### Configuración de OMDb API

1. Obtén una API key gratuita en [OMDb API](http://www.omdbapi.com/apikey.aspx)
2. La API key está configurada en el código (línea 641 de `AdminCartelera.vue`)
3. Para producción, considera mover la API key a variables de entorno

## 📖 Uso

### Para Estudiantes

1. **Registro/Login**
   - Ve a `/register` para crear una cuenta
   - Usa tu correo institucional (@live.uleam.edu.ec)
   - Completa tu información (nombre, carrera)

2. **Ver Cartelera**
   - Accede a `/cartelera` después de iniciar sesión
   - Filtra por género o busca por título
   - Haz clic en "Ver Detalles" para más información

3. **Hacer una Reserva**
   - Selecciona una película y haz clic en "Reservar"
   - Elige una función disponible
   - Selecciona el número de asientos (1-10)
   - Genera tu código QR
   - Descarga el QR para presentarlo en el cine

4. **Sugerir Películas**
   - Ve a `/sugerencia` (solo estudiantes)
   - Busca películas en la API de OMDb
   - Completa el formulario de sugerencia

### Para Administradores

1. **Acceso al Panel**
   - Inicia sesión con una cuenta de administrador
   - Accede a `/admin`

2. **Agregar Películas**
   - **Desde API**: Busca películas en OMDb, selecciona una (la sinopsis se traduce automáticamente)
   - **Manual**: Completa el formulario manualmente
   - Guarda la película

3. **Programar Funciones**
   - Ve a la pestaña "Programación de Horarios"
   - Selecciona película, sala, fecha y hora
   - El sistema valida que no haya solapamientos

4. **Validar Entradas**
   - Ve a `/escanear-qr`
   - Escanea el código QR con la cámara o ingresa el código manualmente
   - Confirma la entrada

5. **Registrar Nuevos Administradores**
   - Ve a `/admin-secret-register`
   - Ingresa el código secreto y crea la cuenta

## 🎯 Funcionalidades Principales

### Sistema de Reservas con QR
1. El usuario selecciona una película y función
2. El sistema crea una reserva en la base de datos
3. Se genera un código QR único con toda la información
4. El QR se guarda en la base de datos
5. El usuario descarga el QR
6. El personal escanea el QR para validar la entrada
7. El sistema marca el ticket como usado y la reserva como asistida

### Traducción Automática
- Las sinopsis obtenidas de OMDb se traducen automáticamente al español
- Utiliza MyMemory Translation API
- Si falla la traducción, se usa el texto original

### Dashboard de Estadísticas
- Actualización automática cada 30 segundos
- Botón de actualización manual
- Muestra reservas del día, películas activas, funciones programadas

### Validación de Horarios
- El sistema valida que no haya solapamientos de funciones en la misma sala
- Calcula automáticamente la hora de fin basada en la duración de la película

## 👥 Roles de Usuario

### Estudiante
- Ver cartelera
- Hacer reservas
- Generar códigos QR
- Sugerir películas
- Acceder a información del cine

### Administrador
- Todas las funcionalidades de estudiante
- Gestión de películas (crear, editar, eliminar)
- Programación de funciones
- Validación de entradas
- Ver estadísticas
- Registrar nuevos administradores

## 🌐 API Externa

### OMDb API
- **Uso**: Búsqueda y obtención de información de películas
- **Endpoint**: `https://www.omdbapi.com/`
- **Autenticación**: API key

### MyMemory Translation API
- **Uso**: Traducción de sinopsis de inglés a español
- **Endpoint**: `https://api.mymemory.translated.net/get`
- **Autenticación**: No requerida (límite de uso gratuito)

## 🛡️ Seguridad

- Autenticación con Supabase Auth
- Validación de correos institucionales
- Rutas protegidas según rol de usuario
- Validación de permisos en el frontend y backend
- Códigos secretos para registro de administradores

## 📱 Responsive Design

El sistema está completamente optimizado para:
- 📱 Dispositivos móviles
- 💻 Tablets
- 🖥️ Desktop

## 🚧 Próximas Mejoras

- [ ] Notificaciones por email
- [ ] Sistema de favoritos
- [ ] Historial de reservas para usuarios
- [ ] Reportes avanzados para administradores
- [ ] Sistema de reseñas y calificaciones
- [ ] Integración con métodos de pago

## 📝 Licencia

Este proyecto está desarrollado para la Universidad Laica Eloy Alfaro de Manabí.

## 👨‍💻 Desarrollo

Desarrollado con ❤️ para la comunidad ULEAM

## 📞 Soporte

Para soporte o preguntas:
- Email: cine@uleam.edu.ec
- Teléfono: (05) 262-3740

---

**Cine ULEAM** - Entretenimiento y cultura cinematográfica para toda la comunidad universitaria 🎬
