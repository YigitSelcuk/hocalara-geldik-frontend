import React from 'react';

interface SocialMediaFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const SocialMediaForm: React.FC<SocialMediaFormProps> = ({ formData, setFormData }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Platform</label>
          <select value={formData.platform || ''} onChange={e => setFormData({ ...formData, platform: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold">
            <option value="">Seçin</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="twitter">Twitter</option>
            <option value="facebook">Facebook</option>
            <option value="linkedin">LinkedIn</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Sıra</label>
          <input type="number" value={formData.order || 0} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">URL</label>
        <input type="url" value={formData.url || ''} onChange={e => setFormData({ ...formData, url: e.target.value })} placeholder="https://youtube.com/@channel" className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>
    </div>
  );
};
