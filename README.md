# 🌳 Parque Botánico de Córdoba - Sistema de Gestión

Sistema de administración para el Parque Botánico de Córdoba desarrollado con Node.js, Express, MongoDB y Handlebars.

## 📋 Descripción del Proyecto

Este sistema permite gestionar de forma integral el Parque Botánico de Córdoba, incluyendo:

- **Zonas/Hábitats**: Gestión de diferentes áreas del parque con sus características
- **Especies**: Catálogo de plantas con información detallada de origen, características y cuidados
- **Servicios**: Administración de servicios como juegos, kioskos, paseos, baños, etc.
- **Mapas**: Visualización de la distribución de zonas, especies y servicios

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js v18+, Express.js
- **Base de Datos**: MongoDB Atlas (NoSQL en la nube)
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Motor de Plantillas**: Handlebars
- **Autenticación**: Express Session
- **Otras librerías**: Mongoose, dotenv, method-override

## 📁 Estructura del Proyecto

```
parque-botanico-cordoba/
├── src/
│   ├── config/
│   │   ├── config.js          # Configuración general
│   │   └── database.js        # Conexión a MongoDB
│   ├── models/
│   │   ├── Zona.js           # Modelo de Zonas
│   │   ├── Especie.js        # Modelo de Especies
│   │   └── Servicio.js       # Modelo de Servicios
│   ├── controllers/
│   │   ├── zonaController.js
│   │   ├── especieController.js
│   │   └── servicioController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── viewRoutes.js
│   │   ├── zonaRoutes.js
│   │   ├── especieRoutes.js
│   │   └── servicioRoutes.js
│   ├── middlewares/
│   │   └── auth.js           # Middleware de autenticación
│   └── app.js                # Archivo principal
├── views/
│   ├── layouts/
│   │   └── main.handlebars
│   ├── login.handlebars
│   ├── dashboard.handlebars
│   ├── zonas.handlebars
│   ├── especies.handlebars
│   ├── servicios.handlebars
│   └── mapa.handlebars
├── public/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── main.js
│       ├── dashboard.js
│       ├── zonas.js
│       ├── especies.js
│       ├── servicios.js
│       └── mapa.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Instalación y Configuración

### Requisitos Previos

- Node.js (v18 o superior)
- npm (v8 o superior)
- Cuenta de MongoDB Atlas (gratuita)

### Pasos de Instalación

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Copiar el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```

   Editar el archivo `.env` y configurar tu string de conexión de MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://tu_usuario:tu_password@cluster.mongodb.net/parque_botanico?retryWrites=true&w=majority
   ```

### Configuración de MongoDB Atlas

1. Ir a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear una cuenta gratuita
3. Crear un nuevo cluster
4. En "Database Access", crear un usuario con permisos de lectura/escritura
5. En "Network Access", agregar tu IP (o 0.0.0.0/0 para acceso desde cualquier lugar)
6. Obtener el string de conexión y colocarlo en el archivo `.env`

## 🎯 Ejecutar el Proyecto

### Modo Desarrollo
```bash
npm run dev
```

### Modo Producción
```bash
npm start
```

El servidor se ejecutará en: `http://localhost:3000`

## 🔐 Credenciales de Acceso

- **Usuario**: `alumno`
- **Contraseña**: `alu123`

## 📊 API REST - Endpoints

### Autenticación
- `POST /login` - Iniciar sesión
- `GET /logout` - Cerrar sesión

### Zonas
- `GET /api/zonas` - Obtener todas las zonas
- `GET /api/zonas/:id` - Obtener una zona por ID
- `POST /api/zonas` - Crear nueva zona
- `PUT /api/zonas/:id` - Actualizar zona
- `DELETE /api/zonas/:id` - Eliminar zona
- `GET /api/zonas/:id/estadisticas` - Estadísticas de una zona

### Especies
- `GET /api/especies` - Obtener todas las especies
- `GET /api/especies/:id` - Obtener una especie por ID
- `POST /api/especies` - Crear nueva especie
- `PUT /api/especies/:id` - Actualizar especie
- `DELETE /api/especies/:id` - Eliminar especie
- `GET /api/especies/buscar/:termino` - Buscar especies
- `GET /api/especies/continente/:continente` - Especies por continente
- `GET /api/especies/estadisticas/generales` - Estadísticas generales

### Servicios
- `GET /api/servicios` - Obtener todos los servicios
- `GET /api/servicios/:id` - Obtener un servicio por ID
- `POST /api/servicios` - Crear nuevo servicio
- `PUT /api/servicios/:id` - Actualizar servicio
- `DELETE /api/servicios/:id` - Eliminar servicio
- `GET /api/servicios/tipo/:tipo` - Servicios por tipo
- `GET /api/servicios/disponibles/ahora` - Servicios disponibles
- `GET /api/servicios/estadisticas/generales` - Estadísticas generales

## 🎨 Características Principales

### Dashboard
- Estadísticas en tiempo real
- Gráficos de distribución de especies por continente
- Visualización de tipos de especies y servicios
- Especies en riesgo de conservación
- Acciones rápidas para crear registros

### Gestión de Zonas
- CRUD completo de zonas
- Filtros por tipo y estado
- Búsqueda por nombre
- Visualización en tarjetas
- Información de ubicación con coordenadas

### Gestión de Especies
- CRUD completo de especies
- Información detallada (nombre común, científico, familia, origen)
- Características de la planta
- Estado de conservación
- Filtros y búsquedas

### Gestión de Servicios
- CRUD completo de servicios
- Asociación con zonas
- Información de disponibilidad
- Indicadores de costo
- Filtros por tipo y estado

### Mapa Interactivo
- Visualización del parque
- Estadísticas de elementos mapeados
- Leyenda de elementos

## 👥 Integrantes del Grupo

[Agregar nombres de los integrantes aquí]

## 📝 Notas de Desarrollo

### Modularización
El proyecto está organizado siguiendo el patrón MVC:
- **Models**: Esquemas de MongoDB con Mongoose
- **Views**: Plantillas Handlebars
- **Controllers**: Lógica de negocio
- **Routes**: Definición de endpoints

### Seguridad
- Autenticación basada en sesiones
- Middleware de protección de rutas
- Variables de entorno para datos sensibles

### Base de Datos
- MongoDB Atlas (cloud)
- Esquemas con validaciones
- Referencias entre colecciones
- Índices para optimización

## 🐛 Troubleshooting

### Error de conexión a MongoDB
- Verificar que el string de conexión en `.env` sea correcto
- Asegurarse de que la IP esté permitida en Network Access de MongoDB Atlas
- Verificar que el usuario tenga los permisos correctos

### El servidor no inicia
- Verificar que el puerto 3000 esté libre
- Ejecutar `npm install` para asegurarse de que las dependencias estén instaladas

## 📄 Licencia

Este proyecto es un trabajo académico para la materia Base de Datos 2.

## 🎓 Información Académica

- **Materia**: Base de Datos 2
- **Carrera**: Desarrollo Web
- **Docente**: Marina Ligorria
- **Institución**: Instituto Superior Santo Domingo

---

Desarrollado con 💚 para el Parque Botánico de Córdoba
