// controllers/adminUserController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');

// Yeni kullanıcı oluşturma
exports.createUser = async (req, res) => {
  try {
    const { isim, soyisim, email, sifre, dogumTarihi, rol, telefon } = req.body;

    // Gerekli alanların kontrolü
    if (!isim || !soyisim || !email || !sifre) {
      return res.status(400).json({ message: 'Gerekli tüm alanları doldurun' });
    }

    // Email kontrolü
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Bu email zaten kayıtlı' });
    }

    // Şifreyi hash'leme
    const hashedPassword = await bcrypt.hash(sifre, 10);

    // Doğum tarihini ayrıştırma ve yaş hesaplama
    let parsedDogumTarihi = null;
    let yasAy = null;
    if (dogumTarihi) {
      const [dayStr, monthStr, yearStr] = dogumTarihi.split('/');
      const day = parseInt(dayStr, 10);
      const month = parseInt(monthStr, 10) - 1; // 0 tabanlı index
      const year = parseInt(yearStr, 10);
      parsedDogumTarihi = new Date(year, month, day);

      // Ay cinsinden yaşı hesaplama
      const currentDate = new Date();
      yasAy = (currentDate.getFullYear() - year) * 12 + (currentDate.getMonth() - month);
      if (currentDate.getDate() < day) {
        yasAy -= 1;
      }
      if (yasAy < 0) yasAy = 0;
    }

    // Yeni kullanıcıyı oluşturma
    user = new User({
      isim,
      soyisim,
      email,
      sifre: hashedPassword,
      dogumTarihi: parsedDogumTarihi,
      yasAy,
      rol: rol || 'user',
      telefon: telefon || '',
    });

    await user.save();

    res.status(201).json({ message: 'Kullanıcı başarıyla oluşturuldu', user: { _id: user._id, isim: user.isim, soyisim: user.soyisim, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kullanıcı arama fonksiyonu
exports.searchUsers = async (req, res) => {
  try {
    const { isim } = req.query;
    if (!isim) {
      return res.status(400).json({ message: 'Arama için isim girilmelidir' });
    }

    // İsim veya soyisime göre arama yapabilirsiniz
    const regex = new RegExp(isim, 'i'); // Büyük/küçük harf duyarsız
    const users = await User.find({
      $or: [
        { isim: regex },
        { soyisim: regex },
      ],
    }).select('_id isim soyisim');

    if (users.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json(users);
  } catch (err) {
    console.error('Kullanıcı arama hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
