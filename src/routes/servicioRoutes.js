const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');
const { isAuthenticated } = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.use(isAuthenticated);

/**
 * @route   GET /api/servicios/estadisticas/generales
 * @desc    Obtener estadísticas generales de servicios
 * @access  Privado
 */
router.get('/estadisticas/generales', servicioController.getEstadisticasServicios);

/**
 * @route   GET /api/servicios/disponibles/ahora
 * @desc    Obtener servicios disponibles actualmente
 * @access  Privado
 */
router.get('/disponibles/ahora', servicioController.getServiciosDisponibles);

/**
 * @route   GET /api/servicios/gratuitos/lista
 * @desc    Obtener servicios gratuitos
 * @access  Privado
 */
router.get('/gratuitos/lista', servicioController.getServiciosGratuitos);

/**
 * @route   GET /api/servicios/tipo/:tipo
 * @desc    Obtener servicios por tipo
 * @access  Privado
 */
router.get('/tipo/:tipo', servicioController.getServiciosPorTipo);

/**
 * @route   GET /api/servicios
 * @desc    Obtener todos los servicios (con filtros opcionales)
 * @query   tipo, estado, zona
 * @access  Privado
 */
router.get('/', servicioController.getAllServicios);

/**
 * @route   GET /api/servicios/:id
 * @desc    Obtener un servicio por ID
 * @access  Privado
 */
router.get('/:id', servicioController.getServicioById);

/**
 * @route   POST /api/servicios
 * @desc    Crear un nuevo servicio
 * @access  Privado
 */
router.post('/', servicioController.createServicio);

/**
 * @route   PUT /api/servicios/:id
 * @desc    Actualizar un servicio
 * @access  Privado
 */
router.put('/:id', servicioController.updateServicio);

/**
 * @route   DELETE /api/servicios/:id
 * @desc    Eliminar un servicio
 * @access  Privado
 */
router.delete('/:id', servicioController.deleteServicio);

module.exports = router;
