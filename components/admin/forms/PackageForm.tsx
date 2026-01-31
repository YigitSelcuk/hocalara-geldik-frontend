import React from 'react';
import { Category } from '../../../types';

interface PackageFormProps {
  formData: any;
  setFormData: (data: any) => void;
  handleImageUpload: (file: File) => Promise<string>;
  showAlert: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  categories?: Category[];
}

export const PackageForm: React.FC<PackageFormProps> = ({
  formData,
  setFormData,
  handleImageUpload,
  showAlert,
  categories
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Paket Adı <span className="text-red-500">*</span></label>
          <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Tür <span className="text-red-500">*</span></label>
          <select
            value={formData.type || ''}
            onChange={e => setFormData({ ...formData, type: e.target.value })}
            className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
          >
            <option value="">Seçiniz</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.slug || cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kısa Açıklama <span className="text-red-500">*</span></label>
        <textarea rows={2} value={formData.shortDescription || ''} onChange={e => setFormData({ ...formData, shortDescription: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Detaylı Açıklama <span className="text-red-500">*</span></label>
        <textarea rows={4} value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Fiyat (₺) <span className="text-red-500">*</span></label>
          <input type="number" value={formData.price || 0} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Orijinal Fiyat (₺)</label>
          <input type="number" value={formData.originalPrice || 0} onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">İndirim Oranı (%)</label>
          <input type="number" value={formData.discount || 0} onChange={e => setFormData({ ...formData, discount: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Video Sayısı</label>
          <input type="number" value={formData.videoCount || 0} onChange={e => setFormData({ ...formData, videoCount: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Ders Sayısı</label>
          <input type="number" value={formData.subjectCount || 0} onChange={e => setFormData({ ...formData, subjectCount: Number(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Süre</label>
          <input type="text" placeholder="Örn: 12 Ay" value={formData.duration || ''} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Özellikler</label>
        <div className="space-y-2">
          {(Array.isArray(formData.features) ? formData.features : []).map((feature: string, index: number) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={feature}
                onChange={e => {
                  const newFeatures = [...(Array.isArray(formData.features) ? formData.features : [])];
                  newFeatures[index] = e.target.value;
                  setFormData({ ...formData, features: newFeatures });
                }}
                placeholder={`Özellik ${index + 1}`}
                className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
              />
              <button
                type="button"
                onClick={() => {
                  const newFeatures = (Array.isArray(formData.features) ? formData.features : []).filter((_: any, i: number) => i !== index);
                  setFormData({ ...formData, features: newFeatures });
                }}
                className="px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black text-xs"
              >
                Sil
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => {
              const newFeatures = [...(Array.isArray(formData.features) ? formData.features : []), ''];
              setFormData({ ...formData, features: newFeatures });
            }}
            className="w-full px-4 py-3 bg-brand-blue/10 text-brand-blue rounded-xl hover:bg-brand-blue hover:text-white transition-all font-black text-xs"
          >
            + Özellik Ekle
          </button>
        </div>
      </div>

      {/* Paket Görseli Upload */}
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">
          Paket Görseli <span className="text-red-500">*</span> <span className="text-brand-blue normal-case tracking-normal">(Önerilen: 800x600px)</span>
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
            <img src={formData.image} alt="Paket" className="w-32 h-20 object-cover border border-slate-200 rounded-lg" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isPopular"
            checked={formData.isPopular || false}
            onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
            className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
          />
          <label htmlFor="isPopular" className="text-xs font-black text-slate-600">Popüler</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isNew"
            checked={formData.isNew || false}
            onChange={e => setFormData({ ...formData, isNew: e.target.checked })}
            className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
          />
          <label htmlFor="isNew" className="text-xs font-black text-slate-600">Yeni</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive !== false}
            onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
            className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
          />
          <label htmlFor="isActive" className="text-xs font-black text-slate-600">Aktif</label>
        </div>
      </div>
    </div>
  );
};
