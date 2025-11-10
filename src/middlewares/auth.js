const config = require('../config/config');

/**
 * Middleware para verificar si el usuario está autenticado
 */
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  
  // Si es una petición AJAX/API, devolver JSON
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    return res.status(401).json({
      success: false,
      message: 'No autenticado. Por favor inicie sesión.'
    });
  }
  
  // Si es navegación normal, redirigir a login
  res.redirect('/login');
};

/**
 * Middleware para verificar credenciales de login
 */
const verifyLogin = (req, res, next) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: 'Usuario y contraseña son requeridos'
    });
  }
  
  // Verificar credenciales contra configuración
  if (username === config.auth.username && password === config.auth.password) {
    req.session.isAuthenticated = true;
    req.session.username = username;
    req.session.loginTime = new Date();
    
    return next();
  }
  
  res.status(401).json({
    success: false,
    message: 'Credenciales inválidas'
  });
};

/**
 * Middleware para verificar si el usuario ya está autenticado
 */
const isAlreadyAuthenticated = (req, res, next) => {
  if (req.session && req.session.isAuthenticated) {
    return res.redirect('/dashboard');
  }
  next();
};

/**
 * Middleware para logout
 */
const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
      return res.status(500).json({
        success: false,
        message: 'Error al cerrar sesión'
      });
    }
    
    res.clearCookie('connect.sid');
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      return res.json({
        success: true,
        message: 'Sesión cerrada exitosamente'
      });
    }
    
    res.redirect('/login');
  });
};

module.exports = {
  isAuthenticated,
  verifyLogin,
  isAlreadyAuthenticated,
  logout
};
