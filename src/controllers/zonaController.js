const Zona = require('../models/Zona');
const Especie = require('../models/Especie');
const Servicio = require('../models/Servicio');

const zonaController = {
  /**
   * Obtener todas las zonas
   * GET /api/zonas
   */
  getAllZonas: async (req, res) => {
    try {
      const { tipo, estado } = req.query;
      const filter = {};
      
      if (tipo) filter.tipo = tipo;
      if (estado) filter.estado = estado;
      
      const zonas = await Zona.find(filter)
        .populate('especiesAsociadas', 'nombreComun nombreCientifico')
        .populate('serviciosAsociados', 'nombre tipo')
        .sort({ nombre: 1 });
      
      res.json({
        success: true,
        count: zonas.length,
        data: zonas
      });
    } catch (error) {
      console.error('Error al obtener zonas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las zonas',
        error: error.message
      });
    }
  },

  /**
   * Obtener una zona por ID
   * GET /api/zonas/:id
   */
  getZonaById: async (req, res) => {
    try {
      const zona = await Zona.findById(req.params.id)
        .populate('especiesAsociadas')
        .populate('serviciosAsociados');
      
      if (!zona) {
        return res.status(404).json({
          success: false,
          message: 'Zona no encontrada'
        });
      }
      
      res.json({
        success: true,
        data: zona
      });
    } catch (error) {
      console.error('Error al obtener zona:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la zona',
        error: error.message
      });
    }
  },

  /**
   * Crear una nueva zona
   * POST /api/zonas
   */
  createZona: async (req, res) => {
    try {
      const zonaData = req.body;
      
      // Verificar si ya existe una zona con ese nombre
      const zonaExistente = await Zona.findOne({ nombre: zonaData.nombre });
      if (zonaExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una zona con ese nombre'
        });
      }
      
      const nuevaZona = new Zona(zonaData);
      await nuevaZona.save();
      
      res.status(201).json({
        success: true,
        message: 'Zona creada exitosamente',
        data: nuevaZona
      });
    } catch (error) {
      console.error('Error al crear zona:', error);
      res.status(400).json({
        success: false,
        message: 'Error al crear la zona',
        error: error.message
      });
    }
  },

  /**
   * Actualizar una zona
   * PUT /api/zonas/:id
   */
  updateZona: async (req, res) => {
    try {
      const zona = await Zona.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      if (!zona) {
        return res.status(404).json({
          success: false,
          message: 'Zona no encontrada'
        });
      }
      
      res.json({
        success: true,
        message: 'Zona actualizada exitosamente',
        data: zona
      });
    } catch (error) {
      console.error('Error al actualizar zona:', error);
      res.status(400).json({
        success: false,
        message: 'Error al actualizar la zona',
        error: error.message
      });
    }
  },

  /**
   * Eliminar una zona
   * DELETE /api/zonas/:id
   */
  deleteZona: async (req, res) => {
    try {
      const zona = await Zona.findByIdAndDelete(req.params.id);
      
      if (!zona) {
        return res.status(404).json({
          success: false,
          message: 'Zona no encontrada'
        });
      }
      
      // Actualizar especies que estaban en esta zona
      await Especie.updateMany(
        { zonaActual: zona._id },
        { $unset: { zonaActual: 1 } }
      );
      
      // Eliminar servicios asociados
      await Servicio.deleteMany({ zonaAsociada: zona._id });
      
      res.json({
        success: true,
        message: 'Zona eliminada exitosamente',
        data: zona
      });
    } catch (error) {
      console.error('Error al eliminar zona:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la zona',
        error: error.message
      });
    }
  },

  /**
   * Agregar una especie a una zona
   * POST /api/zonas/:id/especies/:especieId
   */
  addEspecieToZona: async (req, res) => {
    try {
      const { id, especieId } = req.params;
      
      const zona = await Zona.findById(id);
      const especie = await Especie.findById(especieId);
      
      if (!zona || !especie) {
        return res.status(404).json({
          success: false,
          message: 'Zona o especie no encontrada'
        });
      }
      
      // Agregar especie a la zona si no está ya
      if (!zona.especiesAsociadas.includes(especieId)) {
        zona.especiesAsociadas.push(especieId);
        await zona.save();
      }
      
      // Actualizar zona actual de la especie
      especie.zonaActual = id;
      await especie.save();
      
      res.json({
        success: true,
        message: 'Especie agregada a la zona exitosamente',
        data: zona
      });
    } catch (error) {
      console.error('Error al agregar especie a zona:', error);
      res.status(500).json({
        success: false,
        message: 'Error al agregar especie a la zona',
        error: error.message
      });
    }
  },

  /**
   * Obtener estadísticas de una zona
   * GET /api/zonas/:id/estadisticas
   */
  getZonaEstadisticas: async (req, res) => {
    try {
      const zona = await Zona.findById(req.params.id)
        .populate('especiesAsociadas')
        .populate('serviciosAsociados');
      
      if (!zona) {
        return res.status(404).json({
          success: false,
          message: 'Zona no encontrada'
        });
      }
      
      const estadisticas = {
        nombre: zona.nombre,
        extension: zona.extension,
        cantidadEspecies: zona.especiesAsociadas.length,
        cantidadServicios: zona.serviciosAsociados.length,
        tiposEspecies: {},
        serviciosDisponibles: zona.serviciosAsociados.filter(s => s.estado === 'Disponible').length
      };
      
      // Contar tipos de especies
      zona.especiesAsociadas.forEach(especie => {
        const tipo = especie.caracteristicas.tipo;
        estadisticas.tiposEspecies[tipo] = (estadisticas.tiposEspecies[tipo] || 0) + 1;
      });
      
      res.json({
        success: true,
        data: estadisticas
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: error.message
      });
    }
  }
};

module.exports = zonaController;
