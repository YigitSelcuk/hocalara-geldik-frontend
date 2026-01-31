import React from 'react';
import { Branch } from '../../../types';

interface StudentFormProps {
  formData: any;
  setFormData: (data: any) => void;
  branches: Branch[];
  handleImageUpload: (file: File) => Promise<string>;
  showAlert: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({
  formData,
  setFormData,
  branches,
  handleImageUpload,
  showAlert
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Öğrenci Adı</label>
          <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sınav Türü</label>
          <input type="text" value={formData.exam || ''} onChange={e => setFormData({ ...formData, exam: e.target.value })} placeholder="YKS, LGS" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Derece/Sıralama</label>
          <input type="text" value={formData.rank || ''} onChange={e => setFormData({ ...formData, rank: e.target.value })} placeholder="1" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Puan (Opsiyonel)</label>
          <input type="number" step="0.01" value={formData.score || ''} onChange={e => setFormData({ ...formData, score: e.target.value })} placeholder="548.5" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Üniversite/Bölüm</label>
        <input type="text" value={formData.university || ''} onChange={e => setFormData({ ...formData, university: e.target.value })} placeholder="İTÜ Bilgisayar Mühendisliği" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Şube</label>
        <select
          value={formData.branch || ''}
          onChange={e => {
            const selectedBranch = branches.find(b => b.name === e.target.value);
            setFormData({ ...formData, branch: selectedBranch?.name || '' });
          }}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
        >
          <option value="">Şube Seçiniz</option>
          {branches.map(b => (
            <option key={b.id} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Öğrenci Fotoğrafı</label>
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
            <img src={formData.image} alt="Öğrenci" className="w-20 h-20 object-cover border border-slate-200 rounded-lg" />
          )}
        </div>
      </div>
    </div>
  );
};
