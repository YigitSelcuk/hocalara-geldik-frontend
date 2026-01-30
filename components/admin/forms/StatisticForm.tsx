import React from 'react';

interface StatisticFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const StatisticForm: React.FC<StatisticFormProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Değer</label>
          <input type="text" value={formData.value || ''} onChange={e => setFormData({ ...formData, value: e.target.value })} placeholder="81" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Etiket</label>
          <input type="text" value={formData.label || ''} onChange={e => setFormData({ ...formData, label: e.target.value })} placeholder="İl" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Icon (Emoji)</label>
          <input type="text" value={formData.icon || ''} onChange={e => setFormData({ ...formData, icon: e.target.value })} placeholder="🏛️" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
          <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
    </div>
  );
};
