const Kilavuz = require("../models/Kilavuz");

// Kılavuz oluşturma
exports.createKilavuz = async (req, res) => {
  try {
    const { kilavuzAdi } = req.body;
    const newKilavuz = new Kilavuz({
      kilavuzAdi,
      references: [],
    });

    await newKilavuz.save();

    res
      .status(201)
      .json({ message: "Kılavuz oluşturuldu", kilavuz: newKilavuz });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Kılavuz güncelleme
exports.updateKilavuz = async (req, res) => {
  try {
    const kilavuz = await Kilavuz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!kilavuz) {
      return res.status(404).json({ message: "Kılavuz bulunamadı" });
    }
    res.json({ message: "Kılavuz güncellendi", kilavuz });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Kılavuzları listeleme
exports.getKilavuzlar = async (req, res) => {
  try {
    const kilavuzlar = await Kilavuz.find();
    res.json(kilavuzlar);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

//Kılavuzları getirme
exports.getKilavuz = async (req, res) => {
  try {
    const { id } = req.params;
    const kilavuz = await Kilavuz.findById(id);
    if (!kilavuz) {
      return res.status(404).json({ message: "Kılavuz bulunamadı" });
    }
    res.json(kilavuz);
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// yaşa göre kılavuz getirme
exports.getKilavuzByAge = async (req, res) => {
  try {
    const { yasAy } = req.query;
    console.log('Aranan yaş (ay):', yasAy);

    if (!yasAy) {
      return res.status(400).json({ message: "Yaş parametresi gerekli" });
    }

    // Tüm kılavuzları getir
    const kilavuzlar = await Kilavuz.find();
    
    // Her kılavuzdan uygun referansları bul
    const uygunKilavuzlar = kilavuzlar.map(kilavuz => {
      // Yaşa uygun referansı bul
      const uygunReferans = kilavuz.references.find(ref => 
        ref.ageMin <= Number(yasAy) && ref.ageMax >= Number(yasAy)
      );

      if (uygunReferans) {
        return {
          kilavuzAdi: kilavuz.kilavuzAdi,
          ageRange: `${uygunReferans.ageMin}-${uygunReferans.ageMax}`,
          referans: uygunReferans
        };
      }
      return null;
    }).filter(k => k !== null);

    res.json(uygunKilavuzlar);

  } catch (err) {
    console.error('Kılavuz getirme hatası:', err);
    res.status(500).json({ 
      message: "Sunucu hatası",
      error: err.message
    });
  }
};

// Kılavuz silme
exports.deleteKilavuz = async (req, res) => {
  try {
    const { id } = req.params;
    const kilavuz = await Kilavuz.findByIdAndDelete(id);
    if (!kilavuz) {
      return res.status(404).json({ message: "Kılavuz bulunamadı" });
    }
    res.json({ message: "Kılavuz silindi" });
  } catch (err) {
    console.error("Kılavuz silinirken hata:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};


//referans ekleme
exports.addReferenceToKilavuz = async (req, res) => {
  try {
    const { id } = req.params;
    const referenceData = req.body;

    const kilavuz = await Kilavuz.findById(id);
    if (!kilavuz) {
      return res.status(404).json({ message: "Kılavuz bulunamadı" });
    }

    // Dizimize ekliyoruz
    kilavuz.references.push(referenceData);
    await kilavuz.save();

    res.status(201).json({ message: "Referans eklendi", kilavuz });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Referans güncelleme
exports.updateReference = async (req, res) => {
  try {
    const { kilavuzId, referenceId } = req.params;
    const updateData = req.body;

    const kilavuz = await Kilavuz.findById(kilavuzId);
    if (!kilavuz) {
      return res.status(404).json({ message: "Kılavuz bulunamadı" });
    }

    const reference = kilavuz.references.id(referenceId);
    if (!reference) {
      return res.status(404).json({ message: "Referans bulunamadı" });
    }

    // Güncellenebilir alanları belirleyin
    reference.ageMin = updateData.ageMin ?? reference.ageMin;
    reference.ageMax = updateData.ageMax ?? reference.ageMax;
    reference.IgA = updateData.IgA !== undefined ? updateData.IgA : reference.IgA;
    reference.IgM = updateData.IgM !== undefined ? updateData.IgM : reference.IgM;
    reference.IgG = updateData.IgG !== undefined ? updateData.IgG : reference.IgG;
    reference.IgG1 = updateData.IgG1 !== undefined ? updateData.IgG1 : reference.IgG1;
    reference.IgG2 = updateData.IgG2 !== undefined ? updateData.IgG2 : reference.IgG2;
    reference.IgG3 = updateData.IgG3 !== undefined ? updateData.IgG3 : reference.IgG3;
    reference.IgG4 = updateData.IgG4 !== undefined ? updateData.IgG4 : reference.IgG4;

    await kilavuz.save();

    res.json({ message: "Referans güncellendi", kilavuz });
  } catch (err) {
    console.error("Referans güncellenirken hata:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};


// Referans silme
exports.deleteReference = async (req, res) => {
  try {
    const { kilavuzId, referenceId } = req.params;
    const kilavuz = await Kilavuz.findById(kilavuzId);
    if (!kilavuz) {
      return res.status(404).json({ message: "Kılavuz bulunamadı" });
    }

    const reference = kilavuz.references.id(referenceId);
    if (!reference) {
      return res.status(404).json({ message: "Referans bulunamadı" });
    }

    kilavuz.references.pull(referenceId);
    await kilavuz.save();

    res.json({ message: "Referans silindi", kilavuz });
  } catch (err) {
    console.error("Referans silinirken hata:", err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
