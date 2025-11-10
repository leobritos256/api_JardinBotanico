const express = require('express');
const router = express.Router();
const zonaController = require('../controllers/zonaController');
const { isAuthenticated } = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.use(isAuthenticated);

/**
 * @route   GET /api/zonas
 * @desc    Obtener todas las zonas (con filtros opcionales)
 * @query   tipo, estado
 * @access  Privado
 */
router.get('/', zonaController.getAllZonas);

/**
 * @route   GET /api/zonas/:id
 * @desc    Obtener una zona por ID
 * @access  Privado
 */
router.get('/:id', zonaController.getZonaById);

/**
 * @route   POST /api/zonas
 * @desc    Crear una nueva zona
 * @access  Privado
 */
router.post('/', zonaController.createZona);

/**
 * @route   PUT /api/zonas/:id
 * @desc    Actualizar una zona
 * @access  Privado
 */
router.put('/:id', zonaController.updateZona);

/**
 * @route   DELETE /api/zonas/:id
 * @desc    Eliminar una zona
 * @access  Privado
 */
router.delete('/:id', zonaController.deleteZona);

/**
 * @route   POST /api/zonas/:id/especies/:especieId
 * @desc    Agregar una especie a una zona
 * @access  Privado
 */
router.post('/:id/especies/:especieId', zonaController.addEspecieToZona);

/**
 * @route   GET /api/zonas/:id/estadisticas
 * @desc    Obtener estadísticas de una zona
 * @access  Privado
 */
router.get('/:id/estadisticas', zonaController.getZonaEstadisticas);

module.exports = router;
