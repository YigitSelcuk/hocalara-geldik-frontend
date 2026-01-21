# Frontend Setup & Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Backend API running on http://localhost:4000

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Frontend runs on **http://localhost:3003**

---

## 📦 Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

---

## 🎯 Performance Optimizations Implemented

### 1. Image Optimization
- Lazy loading with Intersection Observer
- WebP format support
- Responsive image sizes
- Blur placeholder for better UX

### 2. Code Splitting
- React.lazy() for route-based splitting
- Dynamic imports for heavy components
- Vendor bundle separation

### 3. Bundle Optimization
- Tree shaking enabled
- Minification and compression
- CSS extraction and minification
- Remove unused code

### 4. Caching Strategy
- Service Worker for offline support
- API response caching
- Static asset caching
- Cache-first strategy for images

### 5. Mobile Optimization
- Touch-friendly interactions
- Reduced animations on mobile
- Optimized font loading
- Viewport meta tags

---

## 📊 Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | ✅ |
| Time to Interactive | < 3s | ✅ |
| Largest Contentful Paint | < 2.5s | ✅ |
| Cumulative Layout Shift | < 0.1 | ✅ |
| PageSpeed Score (Mobile) | > 90 | 🔄 |
| PageSpeed Score (Desktop) | > 95 | 🔄 |

---

## 🔧 Configuration Files

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          utils: ['axios', 'lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

### .env.local
```bash
VITE_API_URL=http://localhost:4000/api
VITE_SITE_NAME=Hocalara Geldik
VITE_SITE_URL=http://localhost:3003
```

---

## 🌐 SEO Optimization

### Meta Tags
All pages include:
- Title tags (< 60 characters)
- Meta descriptions (< 160 characters)
- Open Graph tags
- Twitter Cards
- Canonical URLs

### Structured Data
- Organization schema
- BreadcrumbList schema
- Article schema (for news/blog)
- LocalBusiness schema (for branches)

### Sitemap
Auto-generated XML sitemap at `/sitemap.xml`

---

## 📱 Mobile Responsiveness

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px
- Large Desktop: > 1600px

### Touch Optimization
- Minimum touch target: 44x44px
- Swipe gestures for sliders
- Pull-to-refresh disabled
- Tap highlight removed

---

## 🔐 Security

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:;">
```

### HTTPS
- Force HTTPS in production
- HSTS headers enabled
- Secure cookies only

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build command
npm run build

# Publish directory
dist
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3003
CMD ["npm", "run", "preview"]
```

---

## 📈 Monitoring

### Analytics
- Google Analytics 4
- Facebook Pixel
- Custom event tracking

### Error Tracking
- Sentry integration
- Error boundaries
- User feedback collection

### Performance Monitoring
- Web Vitals tracking
- Real User Monitoring (RUM)
- Lighthouse CI

---

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

### Performance Tests
```bash
npm run lighthouse
```

---

## 📝 Best Practices

1. **Images**: Always use WebP with fallback
2. **Fonts**: Preload critical fonts
3. **CSS**: Critical CSS inline, rest async
4. **JavaScript**: Defer non-critical scripts
5. **API**: Implement request debouncing
6. **State**: Use React Context wisely
7. **Routing**: Prefetch on hover
8. **Forms**: Client-side validation first

---

## 🔄 Updates & Maintenance

### Dependencies
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update to latest
npm install <package>@latest
```

### Security Audits
```bash
# Check vulnerabilities
npm audit

# Fix automatically
npm audit fix
```

---

## 📞 Support

For issues or questions:
- Email: tech@hocalarageldik.com
- Documentation: /docs
- API Docs: http://localhost:4000/api-docs
