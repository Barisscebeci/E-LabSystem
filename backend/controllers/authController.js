const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Kayıt fonksiyonu
exports.register = async (req, res) => {
  try {
    const { isim, soyisim, email, sifre, rol, telefon, dogumTarihi } = req.body;

    // Dogum tarihini parse et (format: "gg/aa/yyyy")
    const [dayStr, monthStr, yearStr] = dogumTarihi.split("/");
    const day = parseInt(dayStr, 10);
    const month = parseInt(monthStr, 10) - 1; // 0 tabanlı index
    const year = parseInt(yearStr, 10);

    const birthDate = new Date(year, month, day);

    // Email kontrolü
    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ message: "Bu email zaten kayıtlı" });

    const hashedPassword = await bcrypt.hash(sifre, 10);

    // Yaşın ay cinsinden hesaplanması
    const currentDate = new Date();
    let totalMonths = (currentDate.getFullYear() - year) * 12 + (currentDate.getMonth() - month);
    if (currentDate.getDate() < day) {
      totalMonths -= 1;
    }
    if (totalMonths < 0) totalMonths = 0;

    // İsteğe bağlı: Bu totalMonths değerini `yasAy` alanına yazıyoruz.
    // Eğer şemada `yas` zorunlu ise (Number required) basitçe yıl olarak atayabilirsiniz:
    const yas = Math.floor(totalMonths / 12); // Toplam yıl
    const yasAy = totalMonths; // Toplam ay sayısı

    user = new User({
      isim,
      soyisim,
      email,
      sifre: hashedPassword,
      yasAy, // Ay cinsinden yaş
      rol: rol || "user",
      telefon
    });

    await user.save();

    res.status(201).json({ message: "Kayıt başarılı" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};

// Giriş fonksiyonu
exports.login = async (req, res) => {
  try {
    const { email, sifre } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Geçersiz kimlik bilgileri" });

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(sifre, user.sifre);
    if (!isMatch)
      return res.status(400).json({ message: "Geçersiz kimlik bilgileri" });

    // JWT token oluşturma
    const token = jwt.sign(
      { userId: user._id, rol: user.rol },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Sunucu hatası" });
  }
};
