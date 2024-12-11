const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  isim: { type: String, required: true },
  soyisim: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sifre: { type: String, required: true },
  yas: { type: Number, required: true }, // Yeni eklenen alan
  rol: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
