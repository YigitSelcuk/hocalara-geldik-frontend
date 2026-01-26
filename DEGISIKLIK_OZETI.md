# API URL Configuration - Değişiklik Özeti

## Yapılan Değişiklikler

Tüm hardcoded (sabit kodlanmış) API URL'leri environment variable (ortam değişkenleri) kullanacak şekilde güncellendi.

### 1. Environment Dosyaları Oluşturuldu

- **`.env`** - Ana environment dosyası (production sunucu IP'si ile)
  ```
  VITE_API_URL=/api
  VITE_BACKEND_URL=http://212.68.46.84:4000
  ```

- **`.env.example`** - Geliştirme için örnek dosya (localhost ile)
  ```
  VITE_API_URL=/api
  VITE_BACKEND_URL=http://localhost:4000
  ```

- **`.env.production`** - Production ortamı için (sunucu IP'si ile)
  ```
  VITE_API_URL=/api
  VITE_BACKEND_URL=http://212.68.46.84:4000
  ```

### 2. Güncellenen Dosyalar

#### vite.config.ts
- ❌ Önceki: `target: 'http://localhost:4000'` (hardcoded)
- ✅ Yeni: `target: backendUrl` (environment variable'dan alınıyor)
- Vite proxy ayarları artık `VITE_BACKEND_URL` environment variable'ını kullanıyor

#### pages/ContactPage.tsx
- ❌ Önceki: `fetch('http://localhost:3003/api/contact/submit')`
- ✅ Yeni: `fetch(\`\${apiUrl}/contact/submit\`)` 
- API URL artık `VITE_API_URL` environment variable'ından alınıyor

#### components/admin/PackageManager.tsx
- ❌ Önceki: `const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api'`
- ✅ Yeni: `const API_URL = import.meta.env.VITE_API_URL || '/api'`

#### components/admin/BranchPackageManager.tsx
- ❌ Önceki: `const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api'`
- ✅ Yeni: `const API_URL = import.meta.env.VITE_API_URL || '/api'`

#### components/admin/BranchNewsManager.tsx
- ❌ Önceki: `const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api'`
- ✅ Yeni: `const API_URL = import.meta.env.VITE_API_URL || '/api'`

#### components/admin/ApprovalsManager.tsx
- ❌ Önceki: `const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api'`
- ✅ Yeni: `const API_URL = import.meta.env.VITE_API_URL || '/api'`

### 3. .gitignore Güncellendi
`.env` dosyaları artık git'e commit edilmeyecek:
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 4. Dokümantasyon
- **ENV_CONFIG.md** - Environment variable'lar için detaylı dokümantasyon oluşturuldu

## Faydalar

1. ✅ **Artık hardcoded IP yok** - Tüm API URL'leri environment variable'lardan alınıyor
2. ✅ **Kolay ortam değişimi** - Development, staging, production için farklı .env dosyaları kullanılabilir
3. ✅ **Güvenlik** - Hassas bilgiler .env dosyasında ve git'e commit edilmiyor
4. ✅ **Esneklik** - Sunucu IP değiştiğinde sadece .env dosyasını güncellemek yeterli

## Kullanım

### Development (Yerel Geliştirme)
```bash
# .env.example'ı .env olarak kopyala
cp .env.example .env

# Development server'ı başlat
npm run dev
```

### Production (Canlı Ortam)
```bash
# Production build
npm run build

# .env.production otomatik olarak kullanılır
```

## Sunucu IP Değiştirme

Sunucu IP'si değiştiğinde sadece `.env` dosyasındaki `VITE_BACKEND_URL` değerini güncelle:

```env
VITE_BACKEND_URL=http://YENİ_IP:4000
```

Sonra uygulamayı yeniden başlat veya build et.
