import React from 'react';

interface YearlySuccessFormProps {
  formData: any;
  setFormData: (data: any) => void;
  handleImageUpload: (file: File) => Promise<string>;
  showAlert: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  editingItem: any;
}

export const YearlySuccessForm: React.FC<YearlySuccessFormProps> = ({
  formData,
  setFormData,
  handleImageUpload,
  showAlert,
  editingItem
}) => {
  const years = Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() + 3 - i).toString());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Yıl</label>
          {editingItem ? (
            <input type="text" value={formData.year || ''} disabled className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-500" />
          ) : (
            <div className="relative">
              <select
                value={formData.year || ''}
                onChange={e => setFormData({ ...formData, year: e.target.value })}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold appearance-none cursor-pointer"
              >
                <option value="">Yıl Seçin</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Toplam Derece</label>
          <input type="number" value={formData.totalDegrees || 0} onChange={e => setFormData({ ...formData, totalDegrees: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Yerleşme Sayısı</label>
          <input type="number" value={formData.placementCount || 0} onChange={e => setFormData({ ...formData, placementCount: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Başarı Oranı (%)</label>
          <input type="number" value={formData.successRate || 0} onChange={e => setFormData({ ...formData, successRate: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">İl Sayısı</label>
          <input type="number" value={formData.cityCount || 0} onChange={e => setFormData({ ...formData, cityCount: parseInt(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>

      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-4">
        <h4 className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Banner Bilgileri</h4>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Banner Başlığı</label>
          <input type="text" value={formData.banner?.title || ''} onChange={e => setFormData({ ...formData, banner: { ...formData.banner, title: e.target.value } })} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Banner Alt Başlık</label>
          <input type="text" value={formData.banner?.subtitle || ''} onChange={e => setFormData({ ...formData, banner: { ...formData.banner, subtitle: e.target.value } })} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Banner Açıklama</label>
          <textarea value={formData.banner?.description || ''} onChange={e => setFormData({ ...formData, banner: { ...formData.banner, description: e.target.value } })} rows={3} className="w-full bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Banner Görseli</label>
          <div className="flex gap-4 items-end">
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  try {
                    const url = await handleImageUpload(file);
                    setFormData({ ...formData, banner: { ...formData.banner, image: url } });
                  } catch (error: any) {
                    showAlert('error', error.message || 'Görsel yüklenemedi');
                  }
                }
              }}
              className="flex-1 bg-white border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
            />
            {formData.banner?.image && (
              <img src={formData.banner.image} alt="Banner" className="w-32 h-20 object-cover border border-slate-200 rounded-lg" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
