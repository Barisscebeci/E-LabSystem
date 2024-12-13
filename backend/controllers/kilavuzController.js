const Kilavuz = require('../models/Kilavuz');

// Kılavuz oluşturma
exports.createKilavuz = async (req, res) => {
  try {
    const newKilavuz = new Kilavuz({
      yasAraligi: req.body.yasAraligi,
      referansDegerler: req.body.referansDegerler,
    });

    await newKilavuz.save();

    res.status(201).json({ message: 'Kılavuz oluşturuldu', kilavuz: newKilavuz });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kılavuz güncelleme
exports.updateKilavuz = async (req, res) => {
  try {
    const kilavuz = await Kilavuz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!kilavuz) {
      return res.status(404).json({ message: 'Kılavuz bulunamadı' });
    }
    res.json({ message: 'Kılavuz güncellendi', kilavuz });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// Kılavuzları listeleme
exports.getKilavuzlar = async (req, res) => {
  try {
    const kilavuzlar = await Kilavuz.find();
    res.json(kilavuzlar);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};

// controllers/kilavuzController.js
exports.getKilavuzByAge = async (req, res) => {
  try {
    const { age } = req.query;
    if (!age) return res.status(400).json({ message: 'Yaş parametresi gerekli' });

    // Kilavuzlar yaş aralığına göre kaydedildiği varsayılıyor.
    // Örneğin yasAraligi: "18-25", "26-35" gibi bir string tutuyorsanız
    // Bu durumda age'in bu aralığa düştüğü kılavuzu bulmanız gerekir.
    // Veya yaş aralığını minAge-maxAge olarak tutup direkt sorgu yapabilirsiniz.
    // Basit bir örnek:
    // Eğer yasAraligi: {minYas: Number, maxYas: Number} şeklinde kılavuz schema değiştirirseniz:
    const kilavuz = await Kilavuz.findOne({
      "referansDegerler.minYas": { $lte: Number(age) },
      "referansDegerler.maxYas": { $gte: Number(age) }
    });

    if (!kilavuz) {
      return res.status(404).json({ message: 'Bu yaş için kılavuz bulunamadı' });
    }

    res.json(kilavuz);
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};
