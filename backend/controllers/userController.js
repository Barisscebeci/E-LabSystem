// controllers/userController.js

const User = require('../models/User');

// Kullanıcı profilini görüntüleme
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-sifre');
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kullanıcı profilini güncelleme
exports.updateUserProfile = async (req, res) => {
  try {
    const { isim, soyisim, email, dogumTarihi } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    // İsim, soyisim, email güncelleme
    if (isim) user.isim = isim;
    if (soyisim) user.soyisim = soyisim;
    if (email) user.email = email;

    // Doğum tarihinin parse edilmesi
    if (dogumTarihi) {
      try {
        const [dayStr, monthStr, yearStr] = dogumTarihi.split('/');
        
        // Sayılara çevirme ve doğrulama
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10) - 1; // 0 tabanlı index
        const year = parseInt(yearStr, 10);

        if (
          isNaN(day) || 
          isNaN(month) || 
          isNaN(year) ||
          day < 1 || day > 31 ||
          month < 0 || month > 11 ||
          year < 1900 // Mantıksal bir alt sınır
        ) {
          return res.status(400).json({ message: 'Geçersiz doğum tarihi formatı. gg/aa/yyyy şeklinde giriniz.' });
        }

        const birthDate = new Date(year, month, day);

        // Ay cinsinden yaş hesaplama
        const currentDate = new Date();
        let totalMonths = (currentDate.getFullYear() - year) * 12 + (currentDate.getMonth() - month);

        if (currentDate.getDate() < day) {
          totalMonths -= 1;
        }

        if (totalMonths < 0) totalMonths = 0;

        user.dogumTarihi = birthDate;
        user.yasAy = totalMonths;
      } catch (parseErr) {
        console.error('Doğum tarihi parse hatası:', parseErr);
        return res.status(400).json({ message: 'Doğum tarihi parse edilirken hata oluştu. Lütfen formatı kontrol edin.' });
      }
    }

    await user.save();
    res.json({ message: 'Profil güncellendi', user });
  } catch (err) {
    console.error('Profil güncelleme hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
