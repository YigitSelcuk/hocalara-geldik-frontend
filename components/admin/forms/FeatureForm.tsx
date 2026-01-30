import React from 'react';

interface FeatureFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const FeatureForm: React.FC<FeatureFormProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Başlık</label>
        <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Açıklama</label>
        <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Icon</label>
          <input type="text" value={formData.icon || ''} onChange={e => setFormData({ ...formData, icon: e.target.value })} placeholder="🎯" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Bölüm</label>
          <select value={formData.section || ''} onChange={e => setFormData({ ...formData, section: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
            <option value="">Seçin</option>
            <option value="success-centers">Success Centers</option>
            <option value="digital-platform">Digital Platform</option>
            <option value="abroad-education">Abroad Education</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
          <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
    </div>
  );
};
