const express = require('express');
const router = express.Router();
const { verifyLogin, logout, isAlreadyAuthenticated } = require('../middlewares/auth');

/**
 * @route   GET /login
 * @desc    Mostrar página de login
 * @access  Público
 */
router.get('/login', isAlreadyAuthenticated, (req, res) => {
  res.render('login', {
    title: 'Inicio de Sesión - Parque Botánico',
    error: null
  });
});

/**
 * @route   POST /login
 * @desc    Procesar login
 * @access  Público
 */
router.post('/login', verifyLogin, (req, res) => {
  res.json({
    success: true,
    message: 'Login exitoso',
    redirectUrl: '/dashboard'
  });
});

/**
 * @route   GET/POST /logout
 * @desc    Cerrar sesión
 * @access  Privado
 */
router.get('/logout', logout);
router.post('/logout', logout);

module.exports = router;
