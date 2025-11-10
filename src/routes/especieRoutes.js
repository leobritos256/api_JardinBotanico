const express = require('express');
const router = express.Router();
const especieController = require('../controllers/especieController');
const { isAuthenticated } = require('../middlewares/auth');

// Todas las rutas requieren autenticación
router.use(isAuthenticated);

/**
 * @route   GET /api/especies/estadisticas/generales
 * @desc    Obtener estadísticas generales de especies
 * @access  Privado
 */
router.get('/estadisticas/generales', especieController.getEstadisticasEspecies);

/**
 * @route   GET /api/especies/buscar/:termino
 * @desc    Buscar especies por nombre
 * @access  Privado
 */
router.get('/buscar/:termino', especieController.buscarEspecies);

/**
 * @route   GET /api/especies/continente/:continente
 * @desc    Obtener especies por continente de origen
 * @access  Privado
 */
router.get('/continente/:continente', especieController.getEspeciesPorContinente);

/**
 * @route   GET /api/especies
 * @desc    Obtener todas las especies (con filtros opcionales)
 * @query   tipo, continente, familia, toxicidad
 * @access  Privado
 */
router.get('/', especieController.getAllEspecies);

/**
 * @route   GET /api/especies/:id
 * @desc    Obtener una especie por ID
 * @access  Privado
 */
router.get('/:id', especieController.getEspecieById);

/**
 * @route   POST /api/especies
 * @desc    Crear una nueva especie
 * @access  Privado
 */
router.post('/', especieController.createEspecie);

/**
 * @route   PUT /api/especies/:id
 * @desc    Actualizar una especie
 * @access  Privado
 */
router.put('/:id', especieController.updateEspecie);

/**
 * @route   DELETE /api/especies/:id
 * @desc    Eliminar una especie
 * @access  Privado
 */
router.delete('/:id', especieController.deleteEspecie);

module.exports = router;
