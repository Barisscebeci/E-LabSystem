// app.js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const adminUserRouter = require('./routes/adminUserRouter');

// Ortam değişkenleri için dotenv kullanabilirsiniz
require('dotenv').config();

// Orta katmanlar
app.use(express.json());
app.use(cors({
  origin: '*', // Geliştirme aşamasında tüm origin'lere izin verebilirsiniz
}));
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});



// Veritabanı bağlantısı
const connectDB = require('./config/db');
connectDB();


app.get('/api/test', (req, res) => {
  res.json({ message: 'API çalışıyor!' });
});

// Rotalar
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

// Remove duplicate admin user routes
app.use('/api/admin', require('./routes/admin'));
app.use('/api/tahliller', require('./routes/tahliller'));
app.use('/api/kilavuzlar', require('./routes/kilavuzlar'));
app.use('/api/admin/users', adminUserRouter)

// Sunucuyu başlatma
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});





//"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzMzMjNlOWU0MzY1MzA0YmE2NjFlZGIiLCJyb2wiOiJ1c2VyIiwiaWF0IjoxNzMxNDA0OTI5LCJleHAiOjE3MzE0MDg1Mjl9.GZBiVbwUoZ7RU3fMJnFEH1hxAk7wurnHe5Vy7YGfiys"

// npm run dev