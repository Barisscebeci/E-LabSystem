const mongoose = require("mongoose");

// Tek bir yaş aralığına ait referans değerlerini tutan alt şema
// Tek bir yaş aralığına ait referans değerlerini tutan alt şema
const referenceSchema = new mongoose.Schema({
  ageMin: Number,
  ageMax: Number,
  IgA: { min: Number, max: Number },
  IgM: { min: Number, max: Number },
  IgG: { min: Number, max: Number },
  IgG1: { min: Number, max: Number },
  IgG2: { min: Number, max: Number },
  IgG3: { min: Number, max: Number },
  IgG4: { min: Number, max: Number },
},

{ timestamps: true });

const kilavuzSchema = new mongoose.Schema(
  {
    kilavuzAdi: { type: String, required: true },
    references: [referenceSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Kilavuz", kilavuzSchema);