const express = require('express');
const { engine } = require('express-handlebars');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');

const config = require('./config/config');
const connectDB = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const viewRoutes = require('./routes/viewRoutes');
const zonaRoutes = require('./routes/zonaRoutes');
const especieRoutes = require('./routes/especieRoutes');
const servicioRoutes = require('./routes/servicioRoutes');

// Inicializar Express
const app = express();

// Conectar a MongoDB Atlas
connectDB();

// Configurar Handlebars como motor de plantillas
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, '../views/layouts'),
  partialsDir: path.join(__dirname, '../views/partials'),
  helpers: {
    eq: (a, b) => a === b,
    json: (context) => JSON.stringify(context),
    formatDate: (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString('es-AR');
    }
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '../public')));

// Configurar sesiones
app.use(session(config.session));

// Middleware para pasar información de sesión a todas las vistas
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session && req.session.isAuthenticated;
  res.locals.username = req.session ? req.session.username : null;
  next();
});

// Rutas
app.use('/', authRoutes);
app.use('/', viewRoutes);
app.use('/api/zonas', zonaRoutes);
app.use('/api/especies', especieRoutes);
app.use('/api/servicios', servicioRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});


// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: config.nodeEnv === 'development' ? err : {}
  });
});

// Iniciar servidor
const PORT = config.port;
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🌳 PARQUE BOTÁNICO DE CÓRDOBA - SISTEMA DE GESTIÓN 🌳');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`🚀 Servidor ejecutándose en: http://localhost:${PORT}`);
  console.log(`📊 Entorno: ${config.nodeEnv}`);
  console.log(`🔐 Usuario de acceso: ${config.auth.username}`);
  console.log(`🔑 Contraseña: ${config.auth.password}`);
  console.log('═══════════════════════════════════════════════════════════');
});

module.exports = app;
