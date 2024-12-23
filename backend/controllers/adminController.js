const User = require('../models/User');
const bcrypt = require('bcrypt');
const Tahlil = require('../models/Tahlil');



exports.registerAdmin = async (req, res) => {
  try {
    const { isim, soyisim, email, sifre } = req.body;


    // Email kontrolü
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Bu email zaten kayıtlı' });

    // Şifre hashleme
    const hashedPassword = await bcrypt.hash(sifre, 10);

    // Yeni admin kullanıcı oluşturma
    user = new User({
      isim,
      soyisim,
      email,
      sifre: hashedPassword,
      rol: 'admin',
    });

    await user.save();

    res.status(201).json({ message: 'Admin kullanıcı oluşturuldu', user });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Tüm kullanıcıları listeleme (isteğe bağlı)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-sifre');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// İsim soyisim ile kullanıcı arama
exports.getUserByName = async (req, res) => {
  try {
    const { isim, soyisim } = req.query;

    const query = {};
    if (isim) query.isim = { $regex: isim, $options: 'i' }; // case-insensitive arama
    if (soyisim) query.soyisim = { $regex: soyisim, $options: 'i' };

    const users = await User.find(query).select('-sifre');

    if (users.length === 0) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
    }

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Belirli bir kullanıcının tahlillerini getir
exports.getUserTestsById = async (req, res) => {
  try {
    const { userId } = req.params;
    // Kullanıcının tahlillerini çekiyoruz
    const tahliller = await Tahlil.find({ kullanici: userId }).sort({ tarih: 1 });

    if (tahliller.length === 0) {
      return res.status(404).json({ message: 'Bu kullanıcıya ait tahlil bulunamadı' });
    }

    // Trend hesaplaması
    let resultsWithTrend = tahliller.map((tahlil, index) => {
      if (index === 0) {
        // İlk test için tüm trend ↔
        return {
          ...tahlil._doc,
          trend: {
            IgA: '↔', IgM: '↔', IgG: '↔', IgG1: '↔', IgG2: '↔', IgG3: '↔', IgG4: '↔'
          }
        };
      } else {
        const previous = tahliller[index - 1];
        const trend = {};
        const calcTrend = (currentVal, prevVal) => {
          if (currentVal > prevVal) return '↑';
          else if (currentVal < prevVal) return '↓';
          else return '↔';
        };

        for (let key of ['IgA', 'IgM', 'IgG', 'IgG1', 'IgG2', 'IgG3', 'IgG4']) {
          trend[key] = calcTrend(tahlil.degerler[key], previous.degerler[key]);
        }

        return { ...tahlil._doc, trend };
      }
    });

    res.json(resultsWithTrend);
  } catch (err) {
    console.error('getUserTestsById hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Tahlil detaylarını getirme
exports.getTahlilDetay = async (req, res) => {
  try {
    const { tahlilId } = req.params;
    console.log('İstek yapılan tahlil ID:', tahlilId);

    const tahlil = await Tahlil.findById(tahlilId)
      .populate('kullanici', 'isim soyisim dogumTarihi');

    if (!tahlil) {
      console.log('Tahlil bulunamadı');
      return res.status(404).json({ message: "Tahlil bulunamadı." });
    }

    // Kullanıcı bilgilerini kontrol et
    const user = await User.findById(tahlil.kullanici._id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    if (!user.dogumTarihi) {
      return res.status(400).json({ 
        message: "Kullanıcı doğum tarihi eksik",
        userId: user._id 
      });
    }

    // Yaş hesapla
    const yasAy = calculateYasAy(user.dogumTarihi);
    
    const response = {
      _id: tahlil._id,
      tarih: tahlil.tarih,
      degerler: tahlil.degerler,
      kullanici: {
        _id: user._id,
        isim: user.isim,
        soyisim: user.soyisim
      },
      yasAy: yasAy
    };

    console.log('Gönderilen response:', response);
    res.json(response);

  } catch (err) {
    console.error("Hata detayı:", err);
    res.status(500).json({ 
      message: "Sunucu hatası",
      error: err.message
    });
  }
};

const calculateYasAy = (dogumTarihi) => {
  try {
    const now = new Date();
    const dogum = new Date(dogumTarihi);
    
    if (isNaN(dogum.getTime())) {
      console.log('Geçersiz tarih formatı:', dogumTarihi); // Debug log
      return null;
    }

    let years = now.getFullYear() - dogum.getFullYear();
    let months = now.getMonth() - dogum.getMonth();

    if (months < 0) {
      years--;
      months += 12;
    }

    const totalMonths = years * 12 + months;
    console.log('Hesaplanan toplam ay:', totalMonths); // Debug log
    return totalMonths;
  } catch (error) {
    console.error('Yaş hesaplama hatası:', error);
    return null;
  }
};


