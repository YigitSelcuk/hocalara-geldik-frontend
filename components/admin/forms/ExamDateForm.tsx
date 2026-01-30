import React from 'react';

interface ExamDateFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const ExamDateForm: React.FC<ExamDateFormProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sınav Adı</label>
          <input type="text" value={formData.examName || ''} onChange={e => setFormData({ ...formData, examName: e.target.value })} placeholder="TYT" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Tarih</label>
          <input type="date" value={formData.examDate || ''} onChange={e => setFormData({ ...formData, examDate: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Açıklama</label>
        <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
        <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>
    </div>
  );
};
