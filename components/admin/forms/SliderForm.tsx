import React from 'react';
import { Upload } from 'lucide-react';
import { SliderItem } from '../../../types';

interface SliderFormProps {
  formData: any;
  setFormData: (data: any) => void;
  previewUrl: string;
  setPreviewUrl: (url: string) => void;
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SliderForm: React.FC<SliderFormProps> = ({
  formData,
  setFormData,
  previewUrl,
  setPreviewUrl,
  selectedFile,
  setSelectedFile,
  handleFileSelect
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Başlık</label>
          <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Alt Başlık</label>
          <input type="text" value={formData.subtitle || ''} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
      
      {/* File Upload */}
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Görsel</label>
        <div className="space-y-3">
          {previewUrl && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex items-center space-x-3">
            <label className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors border-2 border-dashed border-slate-300">
              <Upload className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-bold text-slate-600">
                {selectedFile ? selectedFile.name : 'Dosya Seç'}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            {previewUrl && (
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl('');
                  setFormData({ ...formData, image: '' });
                }}
                className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold transition-colors"
              >
                Temizle
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Primary Button */}
      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-xs font-black text-slate-600 mb-3 uppercase tracking-widest">Birinci Buton</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Buton Metni</label>
            <input
              type="text"
              value={formData.primaryButtonText || ''}
              onChange={e => setFormData({ ...formData, primaryButtonText: e.target.value })}
              placeholder="Hemen Eğitime Başla"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Buton Linki</label>
            <input
              type="text"
              value={formData.primaryButtonLink || ''}
              onChange={e => setFormData({ ...formData, primaryButtonLink: e.target.value })}
              placeholder="/hakkimizda"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
            />
          </div>
        </div>
      </div>

      {/* Secondary Button */}
      <div className="border-t border-slate-100 pt-4">
        <h3 className="text-xs font-black text-slate-600 mb-3 uppercase tracking-widest">İkinci Buton</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Buton Metni</label>
            <input
              type="text"
              value={formData.secondaryButtonText || ''}
              onChange={e => setFormData({ ...formData, secondaryButtonText: e.target.value })}
              placeholder="Yeni Şubemiz Olun"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Buton Linki</label>
            <input
              type="text"
              value={formData.secondaryButtonLink || ''}
              onChange={e => setFormData({ ...formData, secondaryButtonLink: e.target.value })}
              placeholder="/franchise"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
          <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
    </div>
  );
};
