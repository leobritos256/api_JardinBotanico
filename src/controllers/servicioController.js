const Servicio = require('../models/Servicio');
const Zona = require('../models/Zona');

const servicioController = {
  /**
   * Obtener todos los servicios
   * GET /api/servicios
   */
  getAllServicios: async (req, res) => {
    try {
      const { tipo, estado, zona } = req.query;
      const filter = {};
      
      if (tipo) filter.tipo = tipo;
      if (estado) filter.estado = estado;
      if (zona) filter.zonaAsociada = zona;
      
      const servicios = await Servicio.find(filter)
        .populate('zonaAsociada', 'nombre tipo')
        .sort({ nombre: 1 });
      
      res.json({
        success: true,
        count: servicios.length,
        data: servicios
      });
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los servicios',
        error: error.message
      });
    }
  },

  /**
   * Obtener un servicio por ID
   * GET /api/servicios/:id
   */
  getServicioById: async (req, res) => {
    try {
      const servicio = await Servicio.findById(req.params.id)
        .populate('zonaAsociada');
      
      if (!servicio) {
        return res.status(404).json({
          success: false,
          message: 'Servicio no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: servicio
      });
    } catch (error) {
      console.error('Error al obtener servicio:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el servicio',
        error: error.message
      });
    }
  },

  /**
   * Crear un nuevo servicio
   * POST /api/servicios
   */
  createServicio: async (req, res) => {
    try {
      const servicioData = req.body;
      
      // Verificar que la zona existe
      const zona = await Zona.findById(servicioData.zonaAsociada);
      if (!zona) {
        return res.status(404).json({
          success: false,
          message: 'La zona asociada no existe'
        });
      }
      
      const nuevoServicio = new Servicio(servicioData);
      await nuevoServicio.save();
      
      // Agregar servicio a la zona
      zona.serviciosAsociados.push(nuevoServicio._id);
      await zona.save();
      
      res.status(201).json({
        success: true,
        message: 'Servicio creado exitosamente',
        data: nuevoServicio
      });
    } catch (error) {
      console.error('Error al crear servicio:', error);
      res.status(400).json({
        success: false,
        message: 'Error al crear el servicio',
        error: error.message
      });
    }
  },

  /**
   * Actualizar un servicio
   * PUT /api/servicios/:id
   */
  updateServicio: async (req, res) => {
    try {
      const servicioAnterior = await Servicio.findById(req.params.id);
      
      if (!servicioAnterior) {
        return res.status(404).json({
          success: false,
          message: 'Servicio no encontrado'
        });
      }
      
      const zonaAnterior = servicioAnterior.zonaAsociada;
      const zonaNueva = req.body.zonaAsociada;
      
      // Si cambia la zona, verificar que existe
      if (zonaNueva && zonaAnterior && zonaAnterior.toString() !== zonaNueva.toString()) {
        const zona = await Zona.findById(zonaNueva);
        if (!zona) {
          return res.status(404).json({
            success: false,
            message: 'La nueva zona no existe'
          });
        }
        
        // Remover de zona anterior
        await Zona.findByIdAndUpdate(
          zonaAnterior,
          { $pull: { serviciosAsociados: servicioAnterior._id } }
        );
        
        // Agregar a zona nueva
        await Zona.findByIdAndUpdate(
          zonaNueva,
          { $addToSet: { serviciosAsociados: servicioAnterior._id } }
        );
      }
      
      const servicio = await Servicio.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      res.json({
        success: true,
        message: 'Servicio actualizado exitosamente',
        data: servicio
      });
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      res.status(400).json({
        success: false,
        message: 'Error al actualizar el servicio',
        error: error.message
      });
    }
  },

  /**
   * Eliminar un servicio
   * DELETE /api/servicios/:id
   */
  deleteServicio: async (req, res) => {
    try {
      const servicio = await Servicio.findByIdAndDelete(req.params.id);
      
      if (!servicio) {
        return res.status(404).json({
          success: false,
          message: 'Servicio no encontrado'
        });
      }
      
      // Remover de la zona
      await Zona.findByIdAndUpdate(
        servicio.zonaAsociada,
        { $pull: { serviciosAsociados: servicio._id } }
      );
      
      res.json({
        success: true,
        message: 'Servicio eliminado exitosamente',
        data: servicio
      });
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el servicio',
        error: error.message
      });
    }
  },

  /**
   * Obtener servicios por tipo
   * GET /api/servicios/tipo/:tipo
   */
  getServiciosPorTipo: async (req, res) => {
    try {
      const tipo = req.params.tipo;
      
      const servicios = await Servicio.find({ tipo })
        .populate('zonaAsociada', 'nombre');
      
      res.json({
        success: true,
        tipo: tipo,
        count: servicios.length,
        data: servicios
      });
    } catch (error) {
      console.error('Error al obtener servicios por tipo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener servicios',
        error: error.message
      });
    }
  },

  /**
   * Obtener servicios disponibles
   * GET /api/servicios/disponibles/ahora
   */
  getServiciosDisponibles: async (req, res) => {
    try {
      const servicios = await Servicio.find({ estado: 'Disponible' })
        .populate('zonaAsociada', 'nombre estado');
      
      res.json({
        success: true,
        count: servicios.length,
        data: servicios
      });
    } catch (error) {
      console.error('Error al obtener servicios disponibles:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener servicios disponibles',
        error: error.message
      });
    }
  },

  /**
   * Obtener servicios gratuitos
   * GET /api/servicios/gratuitos/lista
   */
  getServiciosGratuitos: async (req, res) => {
    try {
      const servicios = await Servicio.find({ 'costoAdicional.tieneCosto': false })
        .populate('zonaAsociada', 'nombre');
      
      res.json({
        success: true,
        count: servicios.length,
        data: servicios
      });
    } catch (error) {
      console.error('Error al obtener servicios gratuitos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener servicios gratuitos',
        error: error.message
      });
    }
  },

  /**
   * Obtener estadísticas de servicios
   * GET /api/servicios/estadisticas/generales
   */
  getEstadisticasServicios: async (req, res) => {
    try {
      const totalServicios = await Servicio.countDocuments();
      
      const estadisticas = {
        total: totalServicios,
        porTipo: await Servicio.aggregate([
          { $group: { _id: '$tipo', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        porEstado: await Servicio.aggregate([
          { $group: { _id: '$estado', count: { $sum: 1 } } }
        ]),
        gratuitos: await Servicio.countDocuments({ 'costoAdicional.tieneCosto': false }),
        disponibles: await Servicio.countDocuments({ estado: 'Disponible' }),
        accesibles: await Servicio.countDocuments({ 
          'accesibilidad.adaptadoMovilidadReducida': true 
        })
      };
      
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

module.exports = servicioController;
