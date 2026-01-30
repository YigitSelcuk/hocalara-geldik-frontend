import React from 'react';

interface BannerCardFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const BannerCardForm: React.FC<BannerCardFormProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Icon (Emoji)</label>
          <input type="text" value={formData.icon || ''} onChange={e => setFormData({ ...formData, icon: e.target.value })} placeholder="📄" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
          <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Başlık</label>
        <input type="text" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Açıklama</label>
        <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Arkaplan Rengi</label>
          <input type="text" value={formData.bgColor || ''} onChange={e => setFormData({ ...formData, bgColor: e.target.value })} placeholder="bg-blue-500" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Hover Rengi</label>
          <input type="text" value={formData.hoverColor || ''} onChange={e => setFormData({ ...formData, hoverColor: e.target.value })} placeholder="hover:bg-blue-600" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Link</label>
        <input type="text" value={formData.link || ''} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="/franchise" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>
    </div>
  );
};
