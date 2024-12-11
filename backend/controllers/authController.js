const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Kayıt fonksiyonu
exports.register = async (req, res) => {
  try {
    const { isim, soyisim, email, sifre, yas, rol, telefon } = req.body;

    // Email kontrolü
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Bu email zaten kayıtlı' });

 
    const hashedPassword = await bcrypt.hash(sifre, 10);
    
    user = new User({
      isim,
      soyisim,
      email,
      sifre: hashedPassword,
      yas,
      rol: rol || 'user', // rol belirtilmemişse 'user' kullan
      telefon // Eğer telefon alanı isteniyorsa bunu da req.body'den almanız gerekiyor.
    });

    await user.save();

    res.status(201).json({ message: 'Kayıt başarılı' });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Giriş fonksiyonu
exports.login = async (req, res) => {
  try {
    const { email, sifre } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Geçersiz kimlik bilgileri' });

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(sifre, user.sifre);
    if (!isMatch) return res.status(400).json({ message: 'Geçersiz kimlik bilgileri' });

    // JWT token oluşturma
    const token = jwt.sign(
      { userId: user._id, rol: user.rol },
      process.env.JWT_SECRET || 'SECRET_KEY',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
