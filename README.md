## **İçindekiler**

1. [Proje Genel Bakış](#proje-genel-bakış)  
2. [Özellikler](#özellikler)  
   - [Kullanıcı (Hasta) Özellikleri](#kullanıcı-hasta-özellikleri)  
   - [Yönetici (Admin) Özellikleri](#yönetici-admin-özellikleri)  
3. [Ekran Görüntüleri](#ekran-görüntüleri)  
   - [Kullanıcı Tarafı Ekranları](#kullanıcı-tarafı-ekranları)  
   - [Yönetici Tarafı Ekranları](#yönetici-tarafı-ekranları)  
4. [Teknolojiler](#teknolojiler)  
5. [Kurulum](#kurulum)  
   - [Mobil Uygulama (React Native) Kurulumu](#mobil-uygulama-react-native-kurulumu)  
   - [Backend (Node.js + MongoDB) Kurulumu](#backend-nodejs--mongodb-kurulumu)  
6. [Veritabanı Yapısı](#veritabanı-yapısı)  
7. [Güvenlik ve Yetkilendirme](#güvenlik-ve-yetkilendirme)  
8. [Katkıda Bulunma](#katkıda-bulunma)  
9. [Lisans](#lisans)  

---

## **Proje Genel Bakış**

**E-LabSystem**; hastaların kendi tahlil değerlerini ekleyerek **sağlık takibi** yapmalarını, doktorların (yöneticilerin) ise bu verilere ulaşarak **referans kılavuzları** oluşturmalarını sağlayan bir mobil uygulamadır.

- **Hastalar**:  
  - Kayıt & giriş yapabilir.  
  - Tahlil ekleme / güncelleme / silme işlemlerini gerçekleştirebilir.  
  - Sonuçlarını grafiksel olarak inceleyebilir.  

- **Doktorlar (Admin)**:  
  - Hasta tahlillerini görüntüler ve yönetir.  
  - **Referans değer kılavuzları** (yaş/ay aralıkları gibi) oluşturup düzenler.  
  - Tahlil sonuçlarını analiz edip gerektiğinde uyarı veya bilgilendirmede bulunur.

---

## **Özellikler**

### **Kullanıcı (Hasta) Özellikleri**

- **Kayıt & Giriş**  
  - E-posta / şifre veya opsiyonel sosyal giriş seçenekleri.  
- **Tahlil Ekleme / Güncelleme / Silme**  
  - IgA, IgM, IgG vb. değerleri yönetme.  
- **Tahlil Geçmişi**  
  - Daha önce eklenmiş tüm tahlilleri listeler, düzenler veya siler.  
- **Grafiksel Analiz**  
  - Zaman içerisindeki tahlil değerlerini grafik üzerinde görebilir.  
- **Profil Yönetimi**  
  - İsim, soyisim, doğum tarihi, şifre vb. bilgileri güncelleyebilir.  
- **Diğer**  
  - Koyu mod, bildirim ayarları gibi ek özelleştirme seçenekleri.

### **Yönetici (Admin) Özellikleri**

- **Yönetici Paneli**  
  - Kullanıcı / Hasta tahlillerini görüntüleyip düzenleyebilir.  
  - Sistemden çıkış (oturumu sonlandırma).  
- **Kılavuz Yönetimi**  
  - Yeni referans kılavuzları oluşturur (ör. belirli yaş aralıkları için min-max değerler).  
  - Kılavuzları listeleyip düzenler veya siler.  
- **Hasta Yönetimi**  
  - Yeni hasta oluşturabilir.  
  - Mevcut hastalara ait tahlilleri ekleyip güncelleyebilir.  
- **Tahlil Değer Analizi**  
  - Mevcut / önceki değerleri karşılaştırma, normal / alt / üst seviyeleri belirleme.  
- **Zaman Filtreleri**  
  - Tahlilleri gün, hafta, ay veya tüm zamanlar olarak filtreleme.

---

## **Ekran Görüntüleri**

### **Kullanıcı Tarafı Ekranları**

1. **Kayıt Ol / Giriş Yap**  
   - Kullanıcı kaydı (isim, soyisim, e-posta, şifre).  
   - E-posta / şifre ile oturum açma.
2. **Anasayfa (Dashboard)**  
   - Kullanıcı adı selamlama (örn. “Günaydın, bade!”).  
   - Hızlı ruh hâli seçimi, tahlil ekleme kartı, tahlil görüntüleme kartı.
3. **Yeni Tahlil Ekle**  
   - IgA, IgM, IgG vb. değerleri girme alanları.  
   - “Kaydet” butonu.
4. **Tahlil Geçmişi**  
   - Eklenen tahlillerin tarih, değer ve trend okları ile gösterimi.
5. **Tahlil Detayları**  
   - Seçilen tahlili düzenleme / silme, önceki değerler ve grafik kıyas.  
6. **Profil & Hesap Ayarları**  
   - Kişisel bilgiler, şifre değiştirme, bildirimler, koyu mod vb.

### **Yönetici Tarafı Ekranları**

1. **Yönetici Paneli**  
   - Kılavuz Ekle, Tahlil Ekle, Hasta Tahlilleri, Çıkış seçenekleri.
2. **Kılavuz Oluşturma / Kılavuz Listesi**  
   - Farklı yaş/ay aralıkları için min-max değer tanımlama.  
   - Mevcut kılavuzları düzenleme/silme.
3. **Referans Düzenle / Detay Ekranı**  
   - 0-1 Ay, 1-4 Ay vb. aralıklara göre IgA, IgM, IgG, IgG1 vb. değerleri belirleme.  
4. **Admin Tahlil Ekle**  
   - Var olan hastayı arama veya yeni hasta ekleme.  
   - Tahlil değerlerini girip kaydetme.  
5. **Hasta Tahlil Arama**  
   - Hastanın ismini arayarak tahlil sonuçlarını tablo şeklinde görüntüleme.  
   - Tarih, mevcut / önceki değer ve trend okları.  
6. **Tahlil Detayı (Admin)**  
   - Hasta bilgisi, tahlil tarihi, ilgili referans kılavuzları.  
   - Normal / kritik uyarılar.

---

## **Teknolojiler**

### **Mobil (Frontend)**

- **React Native** (UI geliştirme)  
- **Expo** (hızlı geliştirme ve dağıtım)  
- **React Hooks** (durum yönetimi)  
- **Expo Router** (navigasyon & yönlendirme)

### **Backend**

- **Node.js & Express** (RESTful API)  
- **MongoDB** (veritabanı)  
- **Mongoose** (ODM)  
- **JWT** (kullanıcı ve admin kimlik doğrulaması)

> **Not**: Uygulamanın kayıt & giriş (login, signup vb.) akışları **Node.js backend** üzerinden yönetilir.

---

## **Kurulum**

### **Mobil Uygulama (React Native) Kurulumu**

1. **Projeyi Klonlayın**
   ```bash
   git clone https://github.com/Barisscebeci/E-LabSystem.git
   ```
2. **Dizin Değiştirin ve Bağımlılıkları Yükleyin**
   ```bash
   cd E-LabSystem
   npm install
   # veya
   yarn install
   ```
3. **Expo CLI Kurulumu** (Eğer yoksa)
   ```bash
   npm install --global expo-cli
   # veya
   yarn global add expo-cli
   ```
4. **Ortam Değişkenleri / Konfigürasyon**  
   - `.env` veya benzer bir dosyada, **backend API URL** gibi ayarlarınızı yapın.
5. **Uygulamayı Çalıştırın**
   ```bash
   npx expo start
   ```
   - Ardından **akıllı telefon** veya **emulator** üzerinden uygulamayı test edin.

### **Backend (Node.js + MongoDB) Kurulumu**

1. **Backend Klasörüne Geçin**  
   ```bash
   cd server  # veya proje içerisindeki API klasörü
   ```
2. **Bağımlılıkları Kurun**
   ```bash
   npm install
   # veya
   yarn install
   ```
3. **.env Dosyası Oluşturun**  
   Örnek içerik:
   ```plaintext
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/elabsystem
   JWT_SECRET=SUPER_SECURE_SECRET_KEY
   ```
4. **Sunucuyu Başlatın**
   ```bash
   npm run dev
   # veya
   yarn dev
   # prod ortamı için:
   # npm start
   ```
5. **MongoDB’nin Çalıştığından Emin Olun**  
   - Yerel veya uzak bir **MongoDB instance** kullanabilirsiniz.

---

## **Veritabanı Yapısı**

**MongoDB Koleksiyonları:**

- **users**  
  ```js
  {
    _id, 
    name, 
    surname, 
    email, 
    passwordHash, 
    role: "user" | "admin",
    createdAt, 
    ...
  }
  ```
- **test_results**  
  ```js
  {
    _id,
    userId,
    values: { 
      IgA, 
      IgM, 
      IgG, 
      IgG1, 
      // ...
    },
    date, 
    ...
  }
  ```
- **guides** (Referans Kılavuzları)  
  ```js
  {
    _id,
    title,
    referenceRanges: [
      { min, max, ageRange, ... }
    ],
    ...
  }
  ```

> **guides** koleksiyonu, tahlillerin **yaş/ay aralığı** bazında min-max referans değerlerini tutar.

---

## **Güvenlik ve Yetkilendirme**

- **JWT (JSON Web Token)**  
  - Kullanıcı / admin girişinde token oluşturulur.  
  - Mobil uygulama, isteklerde **Authorization** header’ı ile bu token’ı gönderir.  
- **Rol Tabanlı Erişim**  
  - **Admin** rolü, hasta tahlillerini ve kılavuzları yönetebilir.  
  - **User** rolü, yalnızca kendi verilerini görebilir.  
- **Veri Gizliliği**  
  - Tüm istekler **HTTPS** üzerinden (canlı ortamda) iletilir.  
  - Veriler **MongoDB** içerisinde saklanır.

---

## **Katkıda Bulunma**

1. Projeyi **fork**’layın.  
2. Yeni bir özellik dalı oluşturun:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Değişiklikleri commit’leyin:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Dalı push edin:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Pull Request** açarak ana depoya teklif edin.

---

## **Lisans**

Bu proje, **açık kaynak** olarak yayımlanmıştır. Daha fazla bilgi için lütfen `LICENSE` dosyasına bakınız.

---

> Proje ile ilgili ek sorularınız veya geliştirme önerileriniz varsa **Pull Request** veya **Issue** açabilirsiniz.  

İyi çalışmalar!
