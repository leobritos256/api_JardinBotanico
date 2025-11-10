require('dotenv').config();

module.exports = {
  // Configuración del servidor
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Configuración de MongoDB
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/Jardin_Botanico',
  },
  
  // Configuración de sesión
  session: {
    secret: process.env.SESSION_SECRET || 'secret_key_default',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 24 horas
    }
  },
  
  // Credenciales de login
  auth: {
    username: process.env.LOGIN_USERNAME || 'alumno',
    password: process.env.LOGIN_PASSWORD || 'alu123'
  }
};
