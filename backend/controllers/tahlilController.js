// controllers/tahlilController.js

const Tahlil = require("../models/Tahlil");

// Yeni tahlil ekleme
exports.addTahlil = async (req, res) => {
  try {
    let targetUserId = req.user.userId;

    if (req.user.rol === "admin" && req.body.kullaniciId) {
      targetUserId = req.body.kullaniciId;
    }

    const newTahlil = new Tahlil({
      kullanici: targetUserId,
      tarih: req.body.tarih, // veya Date.now() kullanabilirsiniz
      degerler: req.body.degerler,
    });

    await newTahlil.save();

    res.status(201).json({ message: "Tahlil eklendi", tahlil: newTahlil });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Tahlilleri listeleme
exports.getTahliller = async (req, res) => {
  try {
    const tahliller = await Tahlil.find({ kullanici: req.user.userId });
    res.json(tahliller);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
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
    res.status(500).json({ message: "Sunucu hatası" });
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
      return res.status(404).json({ message: "Tahlil bulunamadı" });
    }

    res.json(tahlil);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Tahlil arama
exports.getSearchTahliller = async (req, res) => {
  try {
    const { deger } = req.query;
    const regex = new RegExp(deger, "i"); // Büyük/küçük harf duyarsız arama

    const tahliller = await Tahlil.find({ kullanici: req.user.userId });
    let results = [];

    tahliller.forEach((tahlil) => {
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
    console.error("getSearchTahliller hatası:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Tahlili silme
exports.deleteTahlil = async (req, res) => {
  try {
    const testId = req.params.id;
    const userId = req.user.userId; // authenticateToken middleware'den gelen kullanıcı ID'si
    const userRole = req.user.rol; // Kullanıcının rolünü alıyoruz (admin veya user)

    // Eğer kullanıcı admin ise, herhangi bir tahlili silebilir
    // Değilse, sadece kendi tahlillerini silebilir
    let query = { _id: testId };
    if (userRole !== "admin") {
      query.kullanici = userId;
    }

    // Tahlili bul ve sil
    const tahlil = await Tahlil.findOneAndDelete(query);

    if (!tahlil) {
      return res
        .status(404)
        .json({ message: "Tahlil bulunamadı veya silme yetkiniz yok." });
    }

    res.json({ message: "Tahlil başarıyla silindi." });
  } catch (err) {
    console.error("Tahlil silinirken hata:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

exports.updateTahlil = async (req, res) => {
  try {
    const testId = req.params.id;
    const userId = req.user.userId;

    // Gövdeden gelen { degerler: {...}, tarih: ... } vs.
    const { degerler, tarih } = req.body;

    // Tahlili bulup güncelle
    const updated = await Tahlil.findOneAndUpdate(
      { _id: testId, kullanici: userId },
      { $set: { degerler, tarih } }, // sadece degerler ve tarihi güncelliyoruz
      { new: true } // güncellenmiş dokümanı döndür
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Tahlil bulunamadı veya güncelleme yetkiniz yok." });
    }

    res.json({ message: "Tahlil başarıyla güncellendi.", tahlil: updated });
  } catch (err) {
    console.error("Tahlil güncellenirken hata:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

exports.getUserTahliller = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Eğer kullanıcı admin değilse ve kendi tahlillerini görmüyorsa izin vermeyin
    if (req.user.rol !== "admin" && req.user.userId !== userId) {
      return res.status(403).json({ message: "Yetkiniz yok." });
    }

    const tahliller = await Tahlil.find({ kullanici: userId }).sort({ tarih: -1 });
    res.json(tahliller);
  } catch (err) {
    console.error("Kullanıcı tahlillerini getirirken hata:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
