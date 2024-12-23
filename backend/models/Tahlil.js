const mongoose = require('mongoose');

const tahlilSchema = new mongoose.Schema({
  kullanici: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true // Performans için index ekleyin
  },
  tarih: { 
    type: Date, 
    default: Date.now,
    index: true // Performans için index ekleyin
  },
  degerler: {
    IgA: Number,
    IgM: Number,
    IgG: Number,
    IgG1: Number,
    IgG2: Number,
    IgG3: Number,
    IgG4: Number,
  },
}, { 
  timestamps: true,
  toJSON: { virtuals: true }, // Virtual alanları JSON'a dahil et
  toObject: { virtuals: true }
});

// Virtual alan olarak yasAy ekle
tahlilSchema.virtual('yasAy').get(function() {
  if (!this.kullanici?.dogumTarihi) return null;
  
  const now = new Date();
  const dogum = new Date(this.kullanici.dogumTarihi);
  let years = now.getFullYear() - dogum.getFullYear();
  let months = now.getMonth() - dogum.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  return years * 12 + months;
});

module.exports = mongoose.model('Tahlil', tahlilSchema);
