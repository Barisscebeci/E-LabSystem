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
    const { isim, soyisim, email } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    user.isim = isim || user.isim;
    user.soyisim = soyisim || user.soyisim;
    user.email = email || user.email;

    await user.save();

    res.json({ message: 'Profil güncellendi', user });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
