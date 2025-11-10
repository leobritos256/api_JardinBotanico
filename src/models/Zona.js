const mongoose = require('mongoose');

const zonaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la zona es obligatorio'],
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    maxlength: 1000
  },
  tipo: {
    type: String,
    required: true,
    enum: ['Jardín', 'Bosque', 'Invernadero', 'Lago', 'Sendero', 'Plaza', 'Otro'],
    default: 'Jardín'
  },
  ubicacion: {
    coordenadas: {
      latitud: {
        type: Number,
        required: true
      },
      longitud: {
        type: Number,
        required: true
      }
    },
    descripcionUbicacion: String
  },
  extension: {
    type: Number, // en metros cuadrados
    required: true
  },
  mapaUrl: {
    type: String, // URL de la imagen del mapa
    default: '/images/mapa-default.jpg'
  },
  imagenes: [{
    url: String,
    descripcion: String
  }],
  caracteristicas: [{
    nombre: String,
    valor: String
  }],
  clima: {
    temperatura: String,
    humedad: String,
    luz: String
  },
  accesibilidad: {
    rampa: { type: Boolean, default: false },
    senderoAdaptado: { type: Boolean, default: false },
    bancos: { type: Boolean, default: false }
  },
  estado: {
    type: String,
    enum: ['Abierta', 'Cerrada', 'Mantenimiento'],
    default: 'Abierta'
  },
  especiesAsociadas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Especie'
  }],
  serviciosAsociados: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Servicio'
  }]
}, {
  timestamps: true,
  collection: 'zonas'
});

// Índices para mejorar búsquedas
zonaSchema.index({ tipo: 1 });
zonaSchema.index({ estado: 1 });

// Virtual para cantidad de especies
zonaSchema.virtual('cantidadEspecies').get(function() {
  return this.especiesAsociadas ? this.especiesAsociadas.length : 0;
});

// Método para obtener información resumida
zonaSchema.methods.getResumen = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    tipo: this.tipo,
    estado: this.estado,
    extension: this.extension
  };
};

module.exports = mongoose.model('Zona', zonaSchema);
