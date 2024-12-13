const mongoose = require('mongoose');

const kilavuzSchema = new mongoose.Schema({
  yasAraligi: { type: String, required: true },
  referansDegerler: {
    minYas: Number,
    maxYas: Number,
    IgA: { min: Number, max: Number },
    IgM: { min: Number, max: Number },
    IgG: { min: Number, max: Number },
    IgG1: { min: Number, max: Number },
    IgG2: { min: Number, max: Number },
    IgG3: { min: Number, max: Number },
    IgG4: { min: Number, max: Number },
  },
}, { timestamps: true });

module.exports = mongoose.model('Kilavuz', kilavuzSchema);
