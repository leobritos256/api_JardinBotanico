# 🎥 GUÍA PARA EL VIDEO DE PRESENTACIÓN

## Parque Botánico de Córdoba - Sistema de Gestión

---

## 📝 ESTRUCTURA SUGERIDA DEL VIDEO

### PARTE 1: INTRODUCCIÓN (2-3 minutos)

**Integrante 1:**
- Presentación del grupo y nombre del proyecto
- Explicación del tema elegido: "Administración del Parque Botánico de Córdoba"
- Justificación de la elección del tema
- Objetivos del proyecto

**Guión sugerido:**
"Hola, somos el grupo [NOMBRE DEL GRUPO] y hemos desarrollado un sistema de gestión para el Parque Botánico de Córdoba. Elegimos este tema porque nos permite trabajar con datos complejos y relacionados, demostrando las capacidades de MongoDB en un contexto real y útil. El objetivo es crear una plataforma que facilite la administración de zonas, especies y servicios del parque."

---

### PARTE 2: ARQUITECTURA Y TECNOLOGÍAS (3-4 minutos)

**Integrante 2:**
- Explicación de las tecnologías utilizadas
- Mostrar la estructura del proyecto en VS Code
- Explicar la modularización:
  * src/config (configuración y base de datos)
  * src/models (esquemas de MongoDB)
  * src/controllers (lógica de negocio)
  * src/routes (endpoints de la API)
  * src/middlewares (autenticación)

**Puntos clave a mostrar:**
```
📁 Estructura del Proyecto
├── src/
│   ├── config/        ← Configuración de MongoDB Atlas
│   ├── models/        ← Esquemas con Mongoose
│   ├── controllers/   ← Lógica CRUD
│   ├── routes/        ← API REST endpoints
│   └── middlewares/   ← Autenticación
├── views/             ← Templates Handlebars
└── public/            ← CSS y JavaScript
```

---

### PARTE 3: BASE DE DATOS EN LA NUBE (3-4 minutos)

**Integrante 1:**
- Mostrar MongoDB Atlas
- Explicar la conexión a la nube
- Mostrar las colecciones en MongoDB Compass:
  * zonas
  * especies
  * servicios

**Demostración:**
1. Abrir MongoDB Compass
2. Mostrar la conexión al cluster
3. Explorar las colecciones
4. Mostrar algunos documentos de ejemplo
5. Explicar las relaciones entre colecciones (referencias)

**Aspectos técnicos a mencionar:**
- Base de datos NoSQL en MongoDB Atlas (siempre en la nube)
- Uso de referencias entre documentos
- Índices para optimizar consultas
- Validaciones en los esquemas

---

### PARTE 4: ESQUEMAS Y MODELOS (4-5 minutos)

**Integrante 3:**
- Abrir y explicar el archivo models/Zona.js
- Mostrar campos importantes y validaciones
- Explicar las relaciones con otras colecciones

**Código a mostrar (Zona.js):**
```javascript
const zonaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  tipo: { type: String, enum: [...], required: true },
  ubicacion: {
    coordenadas: {
      latitud: Number,
      longitud: Number
    }
  },
  especiesAsociadas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Especie'  // ← RELACIÓN CON ESPECIES
  }]
});
```

**Repetir para:**
- models/Especie.js (mostrar origen, características, cuidados)
- models/Servicio.js (mostrar tipos de servicios, horarios)

---

### PARTE 5: DEMOSTRACIÓN DE LA API (8-10 minutos)

**Todos los integrantes participan alternándose:**

#### AUTENTICACIÓN (Integrante 1)
1. Mostrar página de login
2. Ingresar con usuario: `alumno`, contraseña: `alu123`
3. Explicar el middleware de autenticación (auth.js)
4. Mostrar el código de verificación de credenciales

#### DASHBOARD (Integrante 2)
1. Recorrer el dashboard
2. Explicar las estadísticas en tiempo real
3. Mostrar el código de dashboard.js que hace las peticiones
4. Explicar cómo se obtienen los datos desde la API

#### GESTIÓN DE ZONAS (Integrante 3)
**Crear una nueva zona:**
- Hacer clic en "Nueva Zona"
- Llenar el formulario:
  * Nombre: "Jardín de Cactus"
  * Tipo: "Jardín"
  * Descripción: "Colección de cactáceas y suculentas de diferentes regiones"
  * Extensión: 1500 m²
  * Coordenadas: -31.4165, -64.1840
  * Estado: "Abierta"
- Guardar y mostrar que aparece en la lista

**Mostrar código:**
```javascript
// zonaController.js - Método createZona
async createZona(req, res) {
  const nuevaZona = new Zona(req.body);
  await nuevaZona.save();
  // ...
}
```

**Editar una zona:**
- Seleccionar una zona existente
- Modificar algún campo
- Guardar cambios
- Verificar actualización

**Eliminar una zona:**
- Seleccionar una zona
- Hacer clic en eliminar
- Confirmar acción
- Verificar que desapareció

#### GESTIÓN DE ESPECIES (Integrante 1)
**Crear una nueva especie:**
- Hacer clic en "Nueva Especie"
- Llenar formulario:
  * Nombre Común: "Palo Borracho"
  * Nombre Científico: "Ceiba speciosa"
  * Familia: "Malvaceae"
  * Tipo: "Árbol"
  * Continente: "América"
  * País: "Argentina"
  * Descripción: "Árbol nativo con tronco espinoso..."
- Guardar y mostrar

**Mostrar búsqueda y filtros:**
- Buscar por nombre
- Filtrar por tipo de planta
- Filtrar por continente

**Mostrar código de búsqueda:**
```javascript
// especieController.js
async buscarEspecies(req, res) {
  const termino = req.params.termino;
  const regex = new RegExp(termino, 'i');
  const especies = await Especie.find({
    $or: [
      { nombreComun: regex },
      { nombreCientifico: regex }
    ]
  });
  // ...
}
```

#### GESTIÓN DE SERVICIOS (Integrante 2)
**Crear un nuevo servicio:**
- Hacer clic en "Nuevo Servicio"
- Llenar formulario:
  * Nombre: "Baños Sector Norte"
  * Tipo: "Baño"
  * Descripción: "Sanitarios públicos con accesibilidad"
  * Zona: Seleccionar una zona existente
  * Estado: "Disponible"
  * Coordenadas: -31.4171, -64.1846
- Guardar

**Mostrar relación con zonas:**
- Explicar cómo se asocia un servicio a una zona
- Mostrar el código de población (populate)

```javascript
const servicio = await Servicio.findById(id)
  .populate('zonaAsociada');  // ← TRAE DATOS DE LA ZONA
```

#### TRANSACCIONES Y MÉTODOS HTTP (Integrante 3)
**Demostrar todos los métodos CRUD:**

1. **CREATE (POST)**
   - Mostrar en DevTools la petición POST
   - Explicar el body JSON enviado
   - Mostrar respuesta del servidor

2. **READ (GET)**
   - Mostrar petición GET /api/zonas
   - Explicar la respuesta JSON con array de datos
   - Mostrar petición GET /api/zonas/:id para un elemento específico

3. **UPDATE (PUT)**
   - Mostrar petición PUT al editar
   - Explicar que se envía el ID y los datos modificados
   - Mostrar respuesta de éxito

4. **DELETE (DELETE)**
   - Mostrar petición DELETE
   - Explicar que solo se envía el ID
   - Mostrar respuesta de confirmación

**Código de rutas a mostrar:**
```javascript
// zonaRoutes.js
router.get('/', zonaController.getAllZonas);      // GET
router.get('/:id', zonaController.getZonaById);   // GET by ID
router.post('/', zonaController.createZona);      // CREATE
router.put('/:id', zonaController.updateZona);    // UPDATE
router.delete('/:id', zonaController.deleteZona); // DELETE
```

---

### PARTE 6: VERIFICACIÓN EN MONGODB (3 minutos)

**Integrante 1:**
- Abrir MongoDB Compass
- Refrescar las colecciones
- Mostrar los documentos creados durante la demo
- Explicar la estructura de los documentos JSON
- Mostrar las referencias entre documentos

**Ejemplo:**
```json
{
  "_id": "...",
  "nombre": "Jardín de Cactus",
  "tipo": "Jardín",
  "especiesAsociadas": [
    "6789abc...",  // ← ObjectId de una especie
    "6789def..."   // ← ObjectId de otra especie
  ]
}
```

---

### PARTE 7: CARACTERÍSTICAS TÉCNICAS (3 minutos)

**Integrante 2:**
- Explicar el sistema de autenticación
- Mostrar el middleware auth.js
- Explicar las sesiones con express-session
- Mostrar la protección de rutas

**Código a mostrar:**
```javascript
// middlewares/auth.js
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  res.redirect('/login');
};
```

**Otros aspectos técnicos:**
- Validaciones en el frontend y backend
- Manejo de errores
- Notificaciones de éxito/error
- Responsive design

---

### PARTE 8: CIERRE Y CONCLUSIONES (2 minutos)

**Todos los integrantes:**
- Resumen de lo implementado:
  * ✅ API REST completa con CRUD
  * ✅ Base de datos NoSQL en MongoDB Atlas
  * ✅ Frontend con HTML y JavaScript
  * ✅ Sistema de autenticación
  * ✅ Modularización del código
  * ✅ Relaciones entre colecciones
  * ✅ Validaciones y manejo de errores

- Posibles mejoras futuras:
  * Implementar mapas reales con Google Maps o Leaflet
  * Agregar carga de imágenes
  * Sistema de roles (admin, empleado, visitante)
  * Reportes en PDF
  * Estadísticas más avanzadas

**Frase de cierre:**
"Este proyecto demuestra la aplicación práctica de MongoDB en un sistema real de gestión, con todas las funcionalidades CRUD, relaciones entre entidades y una interfaz amigable para el usuario. Gracias por su atención."

---

## 📋 CHECKLIST PARA EL VIDEO

Asegurarse de incluir:

- [ ] Presentación del grupo y tema elegido
- [ ] Justificación de la elección
- [ ] Explicación de la estructura modularizada
- [ ] Demostración de MongoDB Atlas/Compass
- [ ] Mostrar las 3 colecciones (zonas, especies, servicios)
- [ ] Explicar al menos 2 esquemas de datos en detalle
- [ ] Login funcional con credenciales especificadas
- [ ] Demostrar CREATE (POST) en al menos 2 entidades
- [ ] Demostrar READ (GET) con filtros y búsquedas
- [ ] Demostrar UPDATE (PUT)
- [ ] Demostrar DELETE
- [ ] Verificar datos en MongoDB tras cada operación
- [ ] Mostrar código de controladores
- [ ] Mostrar código de rutas
- [ ] Explicar middleware de autenticación
- [ ] Todos los miembros participan activamente
- [ ] Enfoque en código y explicaciones técnicas
- [ ] Duración: 20-30 minutos aproximadamente

---

## 💡 CONSEJOS PARA LA GRABACIÓN

1. **Preparación:**
   - Ensayar antes de grabar
   - Tener datos de prueba listos
   - Cerrar aplicaciones innecesarias
   - Limpiar el escritorio

2. **Durante la grabación:**
   - Hablar claro y pausado
   - Hacer zoom en el código importante
   - Pausar entre secciones
   - Mostrar errores y cómo se manejan

3. **Herramientas sugeridas:**
   - OBS Studio (gratuito)
   - Zoom (para grabar)
   - Loom (online)
   - ScreenFlow (Mac)

4. **Calidad:**
   - Resolución mínima: 1080p
   - Audio claro (usar micrófono si es posible)
   - Buena iluminación si aparecen en cámara

---

## 🎯 OBJETIVO DEL VIDEO

El video debe demostrar claramente:
- Comprensión profunda de MongoDB y NoSQL
- Capacidad de relacionar teoría con práctica
- Dominio de las operaciones CRUD
- Buenas prácticas de programación
- Trabajo en equipo y organización

---

¡Éxitos con el proyecto y el video! 🌳🚀
