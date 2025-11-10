const mongoose = require('mongoose');

const servicioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del servicio es obligatorio'],
    trim: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['Juego', 'Kiosco', 'Paseo', 'Baño', 'Banco', 'Fuente', 'Mirador', 'Estacionamiento', 'Centro de Información', 'Otro'],
    default: 'Otro'
  },
  descripcion: {
    type: String,
    required: true,
    maxlength: 500
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
    referencia: String // ej: "Cerca del lago principal"
  },
  zonaAsociada: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zona',
    required: true
  },
  imagenes: [{
    url: String,
    descripcion: String
  }],
  horario: {
    apertura: String, // ej: "08:00"
    cierre: String,   // ej: "18:00"
    diasDisponibles: [{
      type: String,
      enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
    }]
  },
  capacidad: {
    type: Number, // Para juegos o áreas con límite de personas
    default: null
  },
  accesibilidad: {
    adaptadoMovilidadReducida: { type: Boolean, default: false },
    aptoNinos: { type: Boolean, default: true },
    aptoAdultosMayores: { type: Boolean, default: true }
  },
  amenidades: {
    techado: { type: Boolean, default: false },
    iluminado: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    aguaPotable: { type: Boolean, default: false }
  },
  estado: {
    type: String,
    enum: ['Disponible', 'No disponible', 'Mantenimiento'],
    default: 'Disponible'
  },
  contacto: {
    telefono: String,
    email: String
  },
  costoAdicional: {
    tieneCosto: { type: Boolean, default: false },
    precio: Number,
    moneda: { type: String, default: 'ARS' }
  },
  valoracion: {
    promedio: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    cantidadResenas: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  collection: 'servicios'
});

// Índices
servicioSchema.index({ tipo: 1 });
servicioSchema.index({ estado: 1 });
servicioSchema.index({ zonaAsociada: 1 });

// Virtual para determinar si está abierto ahora
servicioSchema.virtual('estaAbierto').get(function() {
  if (!this.horario.apertura || !this.horario.cierre) return true;
  
  const now = new Date();
  const diaActual = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][now.getDay()];
  
  if (!this.horario.diasDisponibles.includes(diaActual)) return false;
  
  return this.estado === 'Disponible';
});

// Método para verificar si es gratuito
servicioSchema.methods.esGratuito = function() {
  return !this.costoAdicional.tieneCosto;
};

// Método para información básica
servicioSchema.methods.getInfoBasica = function() {
  return {
    id: this._id,
    nombre: this.nombre,
    tipo: this.tipo,
    estado: this.estado,
    gratuito: this.esGratuito()
  };
};

module.exports = mongoose.model('Servicio', servicioSchema);
