const Especie = require('../models/Especie');
const Zona = require('../models/Zona');

const especieController = {
  /**
   * Obtener todas las especies
   * GET /api/especies
   */
  getAllEspecies: async (req, res) => {
    try {
      const { tipo, continente, familia, toxicidad } = req.query;
      const filter = {};
      
      if (tipo) filter['caracteristicas.tipo'] = tipo;
      if (continente) filter['origen.continente'] = continente;
      if (familia) filter.familia = new RegExp(familia, 'i');
      if (toxicidad) filter.toxicidad = toxicidad;
      
      const especies = await Especie.find(filter)
        .populate('zonaActual', 'nombre tipo')
        .sort({ nombreComun: 1 });
      
      res.json({
        success: true,
        count: especies.length,
        data: especies
      });
    } catch (error) {
      console.error('Error al obtener especies:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las especies',
        error: error.message
      });
    }
  },

  /**
   * Obtener una especie por ID
   * GET /api/especies/:id
   */
  getEspecieById: async (req, res) => {
    try {
      const especie = await Especie.findById(req.params.id)
        .populate('zonaActual');
      
      if (!especie) {
        return res.status(404).json({
          success: false,
          message: 'Especie no encontrada'
        });
      }
      
      res.json({
        success: true,
        data: especie
      });
    } catch (error) {
      console.error('Error al obtener especie:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la especie',
        error: error.message
      });
    }
  },

  /**
   * Crear una nueva especie
   * POST /api/especies
   */
  createEspecie: async (req, res) => {
    try {
      const especieData = req.body;
      
      // Verificar si ya existe una especie con ese nombre científico
      const especieExistente = await Especie.findOne({ 
        nombreCientifico: especieData.nombreCientifico 
      });
      
      if (especieExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una especie con ese nombre científico'
        });
      }
      
      const nuevaEspecie = new Especie(especieData);
      await nuevaEspecie.save();
      
      // Si tiene zona asignada, agregar a la zona
      if (nuevaEspecie.zonaActual) {
        await Zona.findByIdAndUpdate(
          nuevaEspecie.zonaActual,
          { $addToSet: { especiesAsociadas: nuevaEspecie._id } }
        );
      }
      
      res.status(201).json({
        success: true,
        message: 'Especie creada exitosamente',
        data: nuevaEspecie
      });
    } catch (error) {
      console.error('Error al crear especie:', error);
      res.status(400).json({
        success: false,
        message: 'Error al crear la especie',
        error: error.message
      });
    }
  },

  /**
   * Actualizar una especie
   * PUT /api/especies/:id
   */
  updateEspecie: async (req, res) => {
    try {
      const especieAnterior = await Especie.findById(req.params.id);
      
      if (!especieAnterior) {
        return res.status(404).json({
          success: false,
          message: 'Especie no encontrada'
        });
      }
      
      const zonaAnterior = especieAnterior.zonaActual;
      const zonaNueva = req.body.zonaActual;
      
      const especie = await Especie.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      
      // Si cambió de zona, actualizar referencias
      if (zonaAnterior && zonaNueva && zonaAnterior.toString() !== zonaNueva.toString()) {
        // Remover de zona anterior
        await Zona.findByIdAndUpdate(
          zonaAnterior,
          { $pull: { especiesAsociadas: especie._id } }
        );
        
        // Agregar a zona nueva
        await Zona.findByIdAndUpdate(
          zonaNueva,
          { $addToSet: { especiesAsociadas: especie._id } }
        );
      }
      
      res.json({
        success: true,
        message: 'Especie actualizada exitosamente',
        data: especie
      });
    } catch (error) {
      console.error('Error al actualizar especie:', error);
      res.status(400).json({
        success: false,
        message: 'Error al actualizar la especie',
        error: error.message
      });
    }
  },

  /**
   * Eliminar una especie
   * DELETE /api/especies/:id
   */
  deleteEspecie: async (req, res) => {
    try {
      const especie = await Especie.findByIdAndDelete(req.params.id);
      
      if (!especie) {
        return res.status(404).json({
          success: false,
          message: 'Especie no encontrada'
        });
      }
      
      // Remover de la zona si tenía una asignada
      if (especie.zonaActual) {
        await Zona.findByIdAndUpdate(
          especie.zonaActual,
          { $pull: { especiesAsociadas: especie._id } }
        );
      }
      
      res.json({
        success: true,
        message: 'Especie eliminada exitosamente',
        data: especie
      });
    } catch (error) {
      console.error('Error al eliminar especie:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la especie',
        error: error.message
      });
    }
  },

  /**
   * Buscar especies por nombre
   * GET /api/especies/buscar/:termino
   */
  buscarEspecies: async (req, res) => {
    try {
      const termino = req.params.termino;
      const regex = new RegExp(termino, 'i');
      
      const especies = await Especie.find({
        $or: [
          { nombreComun: regex },
          { nombreCientifico: regex },
          { familia: regex }
        ]
      }).populate('zonaActual', 'nombre')
        .limit(20);
      
      res.json({
        success: true,
        count: especies.length,
        data: especies
      });
    } catch (error) {
      console.error('Error al buscar especies:', error);
      res.status(500).json({
        success: false,
        message: 'Error al buscar especies',
        error: error.message
      });
    }
  },

  /**
   * Obtener especies por continente de origen
   * GET /api/especies/continente/:continente
   */
  getEspeciesPorContinente: async (req, res) => {
    try {
      const continente = req.params.continente;
      
      const especies = await Especie.find({
        'origen.continente': continente
      }).populate('zonaActual');
      
      res.json({
        success: true,
        continente: continente,
        count: especies.length,
        data: especies
      });
    } catch (error) {
      console.error('Error al obtener especies por continente:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener especies',
        error: error.message
      });
    }
  },

  /**
   * Obtener estadísticas generales de especies
   * GET /api/especies/estadisticas/generales
   */
  getEstadisticasEspecies: async (req, res) => {
    try {
      const totalEspecies = await Especie.countDocuments();
      
      const estadisticas = {
        total: totalEspecies,
        porContinente: await Especie.aggregate([
          { $group: { _id: '$origen.continente', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        porTipo: await Especie.aggregate([
          { $group: { _id: '$caracteristicas.tipo', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ]),
        porEstadoConservacion: await Especie.aggregate([
          { $group: { _id: '$estadoConservacion', count: { $sum: 1 } } }
        ]),
        especiesEnPeligro: await Especie.countDocuments({
          estadoConservacion: { $in: ['Vulnerable', 'En peligro', 'Críticamente en peligro'] }
        }),
        especiesToxicas: await Especie.countDocuments({
          toxicidad: { $ne: 'No tóxica' }
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

module.exports = especieController;
