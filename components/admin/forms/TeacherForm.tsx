import React from 'react';
import { Branch } from '../../../types';

interface TeacherFormProps {
  formData: any;
  setFormData: (data: any) => void;
  branches: Branch[];
}

export const TeacherForm: React.FC<TeacherFormProps> = ({
  formData,
  setFormData,
  branches
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Öğretmen Adı</label>
          <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Branş</label>
          <input type="text" value={formData.subject || ''} onChange={e => setFormData({ ...formData, subject: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Şube Ataması</label>
        <select value={formData.branchId || ''} onChange={e => setFormData({ ...formData, branchId: e.target.value || null })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
          <option value="">Tüm Şubeler</option>
          {branches.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Fotoğraf URL</label>
        <input type="text" value={formData.image || ''} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
        <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>
    </div>
  );
};
