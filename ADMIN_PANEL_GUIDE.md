# Admin Panel - Sayfa İçerik Yönetimi

## 🎯 Yeni Yapı

Admin paneli artık **sayfa bazlı içerik yönetimi** sunuyor. Her frontend sayfası için ayrı sekmeler var ve tüm text içeriklerini tek yerden yönetebilirsiniz.

## 🗄️ Database Yapısı

Tüm sayfa içerikleri `HomeSection` tablosunda saklanır:

```sql
HomeSection {
  id          String   @id
  page        String   // 'home', 'about', 'branches', etc.
  section     String   // 'hero', 'intro', 'cta', etc.
  title       String?
  subtitle    String?
  description String?
  content     String?
  buttonText  String?
  buttonLink  String?
  @@unique([page, section])
}
```

## 🌱 Default İçerikler

Frontend'deki mevcut text içerikleri otomatik olarak DB'ye yüklenir:

```bash
# Backend klasöründe
npm run prisma:seed-pages
```

Bu komut 14 sayfa için toplam 55+ içerik kaydı oluşturur.

### ✨ Özellikler

#### **Sayfa İçerikleri** (`/admin/content-sections`)

Tek sayfadan tüm frontend sayfalarının içeriklerini yönetin:

**📄 Mevcut Sayfalar:**

1. **🏠 Anasayfa** - Ana sayfa tüm bölümleri
   - Hero Banner (Başlık, Alt Başlık, Buton)
   - Hakkımızda
   - Özellikler Başlık
   - Başarılar Başlık
   - Şubeler Başlık
   - Paketler Başlık
   - Öğretmenler Başlık
   - Videolar Başlık
   - Blog Başlık
   - İletişim

2. **📖 Hakkımızda** - Kurumsal bilgiler
   - Sayfa Başlığı
   - Misyonumuz
   - Vizyonumuz
   - Değerlerimiz
   - Tarihçemiz

3. **🏢 Şubeler** - Şube sayfası
   - Sayfa Başlığı
   - Giriş
   - Çağrı (CTA)

4. **👨‍🏫 Öğretmenler** - Öğretmen kadrosu
   - Sayfa Başlığı
   - Giriş
   - Kalite

5. **🏆 Başarılar** - Başarı hikayeleri
   - Sayfa Başlığı
   - Giriş
   - Çağrı (CTA)

6. **📦 Paketler** - Eğitim paketleri
   - Sayfa Başlığı
   - Giriş
   - Çağrı (CTA)

7. **🎥 Video Kütüphanesi** - Video içerikler
   - Sayfa Başlığı
   - Giriş
   - Kategoriler

8. **🌐 Dijital Platform** - Online eğitim
   - Sayfa Başlığı
   - Özellikler
   - Avantajlar
   - Çağrı (CTA)

9. **✈️ Yurtdışı Eğitim** - Uluslararası eğitim
   - Sayfa Başlığı
   - Giriş
   - Hizmetler
   - Çağrı (CTA)

10. **💼 Franchise** - Bayilik başvurusu
    - Sayfa Başlığı
    - Giriş
    - Avantajlar
    - Gereksinimler
    - Çağrı (CTA)

11. **📞 İletişim** - İletişim sayfası
    - Sayfa Başlığı
    - Giriş
    - Form Başlığı

12. **🎓 Rehberlik** - Rehberlik hizmetleri
    - Sayfa Başlığı
    - Giriş
    - Hizmetler

13. **🧮 Hesaplama Araçları** - Puan hesaplama
    - Sayfa Başlığı
    - Giriş

14. **📰 Haberler** - Haber listesi
    - Sayfa Başlığı
    - Giriş

### 🎨 Her Sayfa İçin Düzenlenebilir Alanlar

Her bölüm için aşağıdaki alanlar düzenlenebilir:
- ✏️ **Başlık**: Ana başlık metni
- 📝 **Alt Başlık**: Açıklayıcı alt başlık
- 📄 **Açıklama**: Detaylı açıklama metni
- 📋 **İçerik**: Uzun form içerik
- 🔘 **Buton Metni**: CTA buton yazısı
- 🔗 **Buton Linki**: Yönlendirme URL'i

### 🚀 Kullanım

1. Admin paneline giriş yapın: `/admin/login`
2. Sol menüden **"İçerik Bölümleri"** seçin
3. Üst kısımdaki sekmelerden düzenlemek istediğiniz sayfayı seçin
4. İlgili bölümlerin içeriklerini düzenleyin
5. **"Kaydet"** butonuna tıklayın

### 📱 Örnek Kullanım

**Anasayfa Hero Banner'ı Düzenlemek:**
1. "Anasayfa" sekmesine tıklayın
2. "Ana Banner" bölümünü bulun
3. Başlık: "Geleceğin Eğitimi Burada"
4. Alt Başlık: "Türkiye'nin en iyi eğitim kurumu"
5. Buton Metni: "Hemen Başla"
6. Buton Linki: "/subeler"
7. Kaydet

**Hakkımızda Sayfası Misyon:**
1. "Hakkımızda" sekmesine tıklayın
2. "Misyonumuz" bölümünü bulun
3. Başlık ve açıklamayı girin
4. Kaydet

### 🔄 Backend Entegrasyonu

Tüm içerikler `homeSectionService` üzerinden backend'e kaydedilir:
- Her içerik `page` ve `section` ile etiketlenir
- Örnek: `{ page: 'home', section: 'hero', title: '...' }`
- API otomatik olarak create/update işlemini yapar

### 📁 Dosya Yapısı

```
components/admin/
├── PageContentManager.tsx       # Sayfa içerik yönetici bileşeni
└── ContentSectionsManager.tsx   # Ana sayfa sekmeli yapı
```

### 🎯 Avantajlar

✅ Tek yerden tüm sayfa içeriklerini yönetme
✅ Sayfa bazlı organizasyon
✅ Kolay navigasyon (sekmeler)
✅ Her sayfa için özelleştirilmiş bölümler
✅ Otomatik kaydetme ve güncelleme
✅ Responsive tasarım

### 🔐 Yetki Seviyeleri

- **SUPER_ADMIN**: Tüm sayfalara erişim
- **CENTER_ADMIN**: Tüm sayfalara erişim
- **BRANCH_ADMIN**: Sınırlı erişim
- **EDITOR**: Sadece içerik düzenleme

### 🐛 Sorun Giderme

**İçerikler görünmüyor:**
- Backend'in çalıştığından emin olun
- Console'da hata var mı kontrol edin
- API endpoint'lerini test edin

**Kaydetme çalışmıyor:**
- Token'ın geçerli olduğunu kontrol edin
- Network tab'inde API çağrılarını inceleyin
- Backend log'larına bakın

### 🔮 Gelecek Geliştirmeler

- [ ] Önizleme modu (değişiklikleri canlı görme)
- [ ] Çoklu dil desteği
- [ ] Versiyon geçmişi
- [ ] Toplu düzenleme
- [ ] İçerik şablonları
- [ ] AI destekli içerik önerileri

---

**Not**: Bu sistem tüm frontend sayfalarının text içeriklerini merkezi olarak yönetir. Görseller, videolar ve diğer medya için ayrı yönetim panelleri kullanın.
