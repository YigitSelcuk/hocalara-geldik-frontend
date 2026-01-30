import React from 'react';
import { Settings } from 'lucide-react';

interface BranchFormProps {
  formData: any;
  setFormData: (data: any) => void;
  handleImageUpload: (file: File) => Promise<string>;
  showAlert: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  editingItem: any;
}

export const BranchForm: React.FC<BranchFormProps> = ({
  formData,
  setFormData,
  handleImageUpload,
  showAlert,
  editingItem
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Şube Adı</label>
          <input type="text" value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">URL Slug</label>
          <input type="text" value={formData.slug || ''} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
          <p className="text-[10px] text-slate-400 font-medium">* Boş bırakılırsa şube adından otomatik oluşturulur.</p>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Açıklama</label>
        <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} rows={2} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Adres</label>
        <input type="text" value={formData.address || ''} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Telefon</label>
          <input type="text" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">WhatsApp</label>
          <input type="text" value={formData.whatsapp || ''} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">E-posta</label>
          <input type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Enlem (Lat)</label>
          <input type="number" step="0.000001" value={formData.lat || ''} onChange={e => setFormData({ ...formData, lat: parseFloat(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Boylam (Lng)</label>
          <input type="number" step="0.000001" value={formData.lng || ''} onChange={e => setFormData({ ...formData, lng: parseFloat(e.target.value) })} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" />
        </div>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Logo</label>
        <div className="flex gap-4 items-end">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const url = await handleImageUpload(file);
                  setFormData({ ...formData, logo: url });
                } catch (error) {
                  showAlert('error', 'Görsel yüklenemedi');
                }
              }
            }}
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
          />
          {formData.logo && (
            <img src={formData.logo} alt="Logo" className="w-16 h-16 object-contain border border-slate-200 rounded-lg" />
          )}
        </div>
      </div>

      {/* Kapak Görseli Upload */}
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kapak Görseli</label>
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
                } catch (error) {
                  showAlert('error', 'Görsel yüklenemedi');
                }
              }
            }}
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
          />
          {formData.image && (
            <img src={formData.image} alt="Kapak" className="w-24 h-16 object-cover border border-slate-200 rounded-lg" />
          )}
        </div>
      </div>

      {/* Başarı Banner Upload */}
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Başarı Banner</label>
        <div className="flex gap-4 items-end">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (file) {
                try {
                  const url = await handleImageUpload(file);
                  setFormData({ ...formData, successBanner: url });
                } catch (error) {
                  showAlert('error', 'Görsel yüklenemedi');
                }
              }
            }}
            className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
          />
          {formData.successBanner && (
            <img src={formData.successBanner} alt="Banner" className="w-24 h-16 object-cover border border-slate-200 rounded-lg" />
          )}
        </div>
      </div>



      {/* Checkboxes */}
      <div className="flex items-center space-x-6 pt-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input type="checkbox" checked={formData.isActive !== false} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-brand-blue focus:ring-brand-blue" />
          <span className="text-xs font-bold text-slate-600">Aktif</span>
        </label>
      </div>

      {/* Şube Yöneticisi Hesap Bilgileri - Sadece yeni şube eklerken */}
      {!editingItem && (
        <div className="border-t border-slate-200 pt-6 mt-6">
          <h3 className="text-sm font-black text-brand-dark mb-4 flex items-center">
            <div className="w-8 h-8 bg-brand-blue/10 rounded-lg flex items-center justify-center mr-3">
              <Settings className="w-4 h-4 text-brand-blue" />
            </div>
            Şube Yöneticisi Hesap Bilgileri
          </h3>
          <p className="text-xs text-slate-500 mb-4">Bu bilgilerle şube yöneticisi admin panele giriş yapabilecek.</p>

          <div className="space-y-4 bg-slate-50 p-4 rounded-xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Yönetici Adı *</label>
                <input
                  type="text"
                  value={formData.adminName || ''}
                  onChange={e => setFormData({ ...formData,adminName: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                  placeholder="Örn: Ahmet Yılmaz"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">E-posta (Giriş) *</label>
                <input
                  type="email"
                  value={formData.adminEmail || ''}
                  onChange={e => setFormData({ ...formData, adminEmail: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                  placeholder="sube@hocalarageldik.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Şifre *</label>
              <input
                type="password"
                value={formData.adminPassword || ''}
                onChange={e => setFormData({ ...formData, adminPassword: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                placeholder="Minimum 6 karakter"
                minLength={6}
                required
              />
              <p className="text-xs text-slate-400 mt-1">⚠️ Bu şifreyi not edin, şube yöneticisine iletmeniz gerekecek.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
