// controllers/tahlilController.js

const Tahlil = require('../models/Tahlil');

// Yeni tahlil ekleme
exports.addTahlil = async (req, res) => {
  try {
    const newTahlil = new Tahlil({
      kullanici: req.user.userId,
      tarih: req.body.tarih,
      degerler: req.body.degerler,
    });

    await newTahlil.save();

    res.status(201).json({ message: 'Tahlil eklendi', tahlil: newTahlil });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Tahlilleri listeleme
exports.getTahliller = async (req, res) => {
  try {
    const tahliller = await Tahlil.find({ kullanici: req.user.userId });
    res.json(tahliller);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Tahlil detaylarını getirme
exports.getUserTests = async (req, res) => {
  try {
    const userId = req.user.userId; // authMiddleware'den gelen kullanıcı ID'si

    // Kullanıcının tahlillerini veritabanından çekin
    const tests = await Test.find({ user: userId }).sort({ date: -1 });

    res.json(tests);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Tahlil detaylarını getirme
exports.getTestDetails = async (req, res) => {
  try {
    const userId = req.user.userId; // authenticateToken'den gelen kullanıcı ID'si
    const testId = req.params.id;

    // Tahlili veritabanından çekin
    const tahlil = await Tahlil.findOne({ _id: testId, kullanici: userId });

    if (!tahlil) {
      return res.status(404).json({ message: 'Tahlil bulunamadı' });
    }

    res.json(tahlil);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Tahlil arama
exports.getSearchTahliller = async (req, res) => {
  try {
    const { deger } = req.query;
    const regex = new RegExp(deger, 'i'); // Büyük/küçük harf duyarsız arama

    const tahliller = await Tahlil.find({ kullanici: req.user.userId });
    let results = [];

    tahliller.forEach(tahlil => {
      for (let [key, value] of Object.entries(tahlil.degerler)) {
        if (regex.test(key)) {
          results.push({
            tahlilId: tahlil._id,
            name: key,
            result: value,
            tarih: tahlil.tarih,
          });
        }
      }
    });

    res.json(results);
  } catch (err) {
    console.error('getSearchTahliller hatası:', err);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};