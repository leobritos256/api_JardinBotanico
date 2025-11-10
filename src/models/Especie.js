const mongoose = require('mongoose');

const especieSchema = new mongoose.Schema({
  nombreComun: {
    type: String,
    required: [true, 'El nombre común es obligatorio'],
    trim: true
  },
  nombreCientifico: {
    type: String,
    required: [true, 'El nombre científico es obligatorio'],
    unique: true,
    trim: true
  },
  familia: {
    type: String,
    required: true,
    trim: true
  },
  origen: {
    continente: {
      type: String,
      enum: ['América', 'Europa', 'Asia', 'África', 'Oceanía', 'Antártida'],
      required: true
    },
    pais: {
      type: String,
      required: true
    },
    region: String
  },
  descripcion: {
    type: String,
    required: true,
    maxlength: 2000
  },
  caracteristicas: {
    altura: {
      minima: Number, // en metros
      maxima: Number
    },
    tipo: {
      type: String,
      enum: ['Árbol', 'Arbusto', 'Hierba', 'Trepadora', 'Suculenta', 'Palma', 'Helecho', 'Otro'],
      required: true
    },
    floracion: {
      epoca: String, // ej: "Primavera-Verano"
      color: String
    },
    fruto: {
      tipo: String,
      comestible: { type: Boolean, default: false }
    },
    hoja: {
      tipo: String, // ej: "Perenne", "Caduca"
      forma: String
    }
  },
  cuidados: {
    riego: {
      type: String,
      enum: ['Bajo', 'Moderado', 'Alto'],
      default: 'Moderado'
    },
    luz: {
      type: String,
      enum: ['Sol directo', 'Semi-sombra', 'Sombra'],
      default: 'Sol directo'
    },
    suelo: String,
    temperatura: {
      minima: Number,
      maxima: Number
    }
  },
  imagenes: [{
    url: String,
    tipo: {
      type: String,
      enum: ['General', 'Flor', 'Hoja', 'Fruto', 'Corteza', 'Hábitat']
    },
    descripcion: String
  }],
  estadoConservacion: {
    type: String,
    enum: ['No amenazada', 'Vulnerable', 'En peligro', 'Críticamente en peligro', 'Extinta en silvestre'],
    default: 'No amenazada'
  },
  usosMedicinales: {
    type: Boolean,
    default: false
  },
  toxicidad: {
    type: String,
    enum: ['No tóxica', 'Levemente tóxica', 'Tóxica', 'Altamente tóxica'],
    default: 'No tóxica'
  },
  curiosidades: [String],
  zonaActual: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Zona'
  },
  cantidad: {
    type: Number,
    default: 1,
    min: 0
  },
  fechaPlantacion: Date
}, {
  timestamps: true,
  collection: 'especies'
});

// Índices
especieSchema.index({ nombreComun: 1 });
especieSchema.index({ 'origen.continente': 1 });
especieSchema.index({ 'caracteristicas.tipo': 1 });

// Virtual para mostrar origen completo
especieSchema.virtual('origenCompleto').get(function() {
  return `${this.origen.region || ''} ${this.origen.pais}, ${this.origen.continente}`.trim();
});

// Método para verificar si necesita cuidados especiales
especieSchema.methods.necesitaCuidadosEspeciales = function() {
  return this.cuidados.riego === 'Alto' || 
         this.estadoConservacion !== 'No amenazada' ||
         this.toxicidad !== 'No tóxica';
};

module.exports = mongoose.model('Especie', especieSchema);
