import React from 'react';
import { Category, Branch } from '../../../types';

interface NewsFormProps {
  formData: any;
  setFormData: (data: any) => void;
  categories: Category[];
  branches: Branch[];
  handleImageUpload: (file: File) => Promise<string>;
  showAlert: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

export const NewsForm: React.FC<NewsFormProps> = ({
  formData,
  setFormData,
  categories,
  branches,
  handleImageUpload,
  showAlert
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Haber Başlığı *</label>
        <input
          type="text"
          value={formData.title || ''}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
          placeholder="Örn: 2024 YKS Sonuçları Açıklandı"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">URL Slug</label>
        <input
          type="text"
          value={formData.slug || ''}
          onChange={e => setFormData({ ...formData, slug: e.target.value })}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
          placeholder="Otomatik oluşturulacak"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Özet (Excerpt)</label>
        <textarea
          rows={2}
          value={formData.excerpt || ''}
          onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none"
          placeholder="Kısa özet (liste görünümünde gösterilir)"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Haber İçeriği *</label>
        <textarea
          rows={8}
          value={formData.content || ''}
          onChange={e => setFormData({ ...formData, content: e.target.value })}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none"
          placeholder="HTML içerik desteklenir"
        />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kapak Görseli *</label>
        <div className="flex gap-4 items-end">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const url = await handleImageUpload(file);
                  setFormData({ ...formData, featuredImage: url });
                } catch (error: any) {
                  showAlert('error', error.message || 'Görsel yüklenemedi');
                }
              }
            }}
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
          />
          {formData.featuredImage && (
            <img src={formData.featuredImage} alt="Preview" className="w-24 h-16 object-cover border border-slate-200 rounded-lg" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kategori</label>
          <select
            value={formData.categoryId || ''}
            onChange={e => setFormData({ ...formData, categoryId: e.target.value || null })}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
          >
            <option value="">Kategori Seçin</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kapsam</label>
          <select
            value={formData.branchId || ''}
            onChange={e => setFormData({ ...formData, branchId: e.target.value || null })}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
          >
            <option value="">Genel / Kurumsal</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Durum</label>
        <select
          value={formData.status || 'DRAFT'}
          onChange={e => setFormData({ ...formData, status: e.target.value })}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
        >
          <option value="DRAFT">Taslak</option>
          <option value="PUBLISHED">Yayında</option>
          <option value="ARCHIVED">Arşivlendi</option>
        </select>
      </div>

      <div className="flex items-center space-x-4 pt-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFeatured || false}
            onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue"
          />
          <span className="text-xs font-bold text-slate-600">Öne Çıkan Haber</span>
        </label>
      </div>

      {/* SEO Section */}
      <div className="border-t border-slate-200 pt-4 mt-4">
        <h3 className="text-sm font-black text-slate-700 mb-3">SEO Ayarları</h3>
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Başlık</label>
            <input
              type="text"
              value={formData.seoTitle || ''}
              onChange={e => setFormData({ ...formData, seoTitle: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
              placeholder="Boş bırakılırsa haber başlığı kullanılır"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Açıklama</label>
            <textarea
              rows={2}
              value={formData.seoDescription || ''}
              onChange={e => setFormData({ ...formData, seoDescription: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none"
              placeholder="Arama motorları için açıklama"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Anahtar Kelimeler</label>
            <input
              type="text"
              value={formData.seoKeywords || ''}
              onChange={e => setFormData({ ...formData, seoKeywords: e.target.value })}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
              placeholder="Virgülle ayırın: yks, üniversite, başarı"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
