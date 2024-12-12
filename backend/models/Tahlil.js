const mongoose = require('mongoose');

const tahlilSchema = new mongoose.Schema({
  kullanici: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tarih: { type: Date, default: Date.now },
  degerler: {
    IgA: Number,
    IgM: Number,
    IgG: Number,
    IgG1: Number,
    IgG2: Number,
    IgG3: Number,
    IgG4: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model('Tahlil', tahlilSchema);
