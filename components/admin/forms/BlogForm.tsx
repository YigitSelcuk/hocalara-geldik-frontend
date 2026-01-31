import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Category } from '../../../types';

interface BlogFormProps {
  formData: any;
  setFormData: (data: any) => void;
  handleImageUpload: (file: File) => Promise<string>;
  showAlert: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  categories?: Category[];
}

export const BlogForm: React.FC<BlogFormProps> = ({
  formData,
  setFormData,
  handleImageUpload,
  showAlert,
  categories = []
}) => {
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Başlık *</label>
        <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">URL Slug</label>
        <input type="text" value={formData.slug || ''} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder="otomatik-olusturulacak" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Özet *</label>
        <textarea value={formData.excerpt || ''} onChange={e => setFormData({ ...formData, excerpt: e.target.value })} rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">İçerik <span className="text-red-500">*</span></label>
        <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
          <ReactQuill
            theme="snow"
            value={formData.content || ''}
            onChange={(content) => setFormData({ ...formData, content })}
            modules={modules}
            formats={formats}
            className="h-64 mb-12"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kategori</label>
          {categories && categories.length > 0 ? (
            <div className="relative">
              <select
                value={formData.category || ''}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold appearance-none cursor-pointer"
              >
                <option value="">Kategori Seçin</option>
                {categories
                  .filter(c => !c.type || c.type === 'BLOG')
                  .map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))
                }
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          ) : (
            <input 
              type="text" 
              value={formData.category || ''} 
              onChange={e => setFormData({ ...formData, category: e.target.value })} 
              placeholder="Rehberlik" 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
            />
          )}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Yazar</label>
          <input type="text" value={formData.author || ''} onChange={e => setFormData({ ...formData, author: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Tarih</label>
          <input type="date" value={formData.date || ''} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Okuma Süresi</label>
          <input type="text" value={formData.readTime || ''} onChange={e => setFormData({ ...formData, readTime: e.target.value })} placeholder="5 dk" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">
          Kapak Görseli <span className="text-red-500">*</span> <span className="text-brand-blue normal-case tracking-normal">(Önerilen: 800x600px)</span>
        </label>
        <div className="flex gap-4 items-end">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const url = await handleImageUpload(file);
                  setFormData({ ...formData, image: url });
                } catch (error: any) {
                  showAlert('error', error.message || 'Görsel yüklenemedi');
                }
              }
            }}
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
          />
          {formData.image && (
            <img src={formData.image} alt="Preview" className="w-24 h-16 object-cover border border-slate-200 rounded-lg" />
          )}
        </div>
      </div>

      {/* SEO Fields */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="text-xs font-black text-slate-600 mb-3">SEO Ayarları</h4>
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Başlık</label>
            <input type="text" value={formData.seoTitle || ''} onChange={e => setFormData({ ...formData, seoTitle: e.target.value })} placeholder="Arama motorları için başlık" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Açıklama</label>
            <textarea value={formData.seoDescription || ''} onChange={e => setFormData({ ...formData, seoDescription: e.target.value })} rows={2} placeholder="Arama motorları için açıklama" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">SEO Anahtar Kelimeler</label>
            <input type="text" value={formData.seoKeywords || ''} onChange={e => setFormData({ ...formData, seoKeywords: e.target.value })} placeholder="kelime1, kelime2, kelime3" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex items-center space-x-6 pt-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" checked={formData.isFeatured || false} onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
          <span className="text-xs font-bold text-slate-600">Öne Çıkan</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
          <span className="text-xs font-bold text-slate-600">Aktif</span>
        </label>
      </div>
    </div>
  );
};
