const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');

/**
 * @route   GET /
 * @desc    Página de inicio - redirige al dashboard
 * @access  Público
 */
router.get('/', (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

/**
 * @route   GET /dashboard
 * @desc    Panel principal del sistema
 * @access  Privado
 */
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard - Parque Botánico de Córdoba',
    username: req.session.username,
    layout: 'main'
  });
});

/**
 * @route   GET /zonas
 * @desc    Página de gestión de zonas
 * @access  Privado
 */
router.get('/zonas', isAuthenticated, (req, res) => {
  res.render('zonas', {
    title: 'Gestión de Zonas',
    username: req.session.username,
    layout: 'main'
  });
});

/**
 * @route   GET /especies
 * @desc    Página de gestión de especies
 * @access  Privado
 */
router.get('/especies', isAuthenticated, (req, res) => {
  res.render('especies', {
    title: 'Gestión de Especies',
    username: req.session.username,
    layout: 'main'
  });
});

/**
 * @route   GET /servicios
 * @desc    Página de gestión de servicios
 * @access  Privado
 */
router.get('/servicios', isAuthenticated, (req, res) => {
  res.render('servicios', {
    title: 'Gestión de Servicios',
    username: req.session.username,
    layout: 'main'
  });
});

/**
 * @route   GET /mapa
 * @desc    Mapa interactivo del parque
 * @access  Privado
 */
router.get('/mapa', isAuthenticated, (req, res) => {
  res.render('mapa', {
    title: 'Mapa del Parque',
    username: req.session.username,
    layout: 'main'
  });
});

module.exports = router;
