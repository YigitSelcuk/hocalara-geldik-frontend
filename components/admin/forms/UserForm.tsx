import React from 'react';
import { UserRole, Branch } from '../../../types';

interface UserFormProps {
  formData: any;
  setFormData: (data: any) => void;
  branches: Branch[];
}

export const UserForm: React.FC<UserFormProps> = ({
  formData,
  setFormData,
  branches
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Ad Soyad</label>
          <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">E-posta</label>
          <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Rol</label>
          <select value={formData.role || UserRole.BRANCH_ADMIN} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
            <option value={UserRole.SUPER_ADMIN}>Admin</option>
            <option value={UserRole.BRANCH_ADMIN}>Şube Yöneticisi</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Atanan Şube (Opsiyonel)</label>
          <select value={formData.branchId || ''} onChange={e => setFormData({ ...formData, branchId: e.target.value || undefined })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
            <option value="">Yok (Genel)</option>
            {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Şifre</label>
        <input 
          type="password" 
          value={formData.password || ''} 
          onChange={e => setFormData({ ...formData, password: e.target.value })} 
          placeholder={formData.id ? "Değiştirmek için yeni şifre girin" : "Şifre belirleyin"}
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
        />
      </div>
    </div>
  );
};
