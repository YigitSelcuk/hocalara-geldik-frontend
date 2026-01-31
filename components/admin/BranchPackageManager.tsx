import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Clock, X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import api, { API_BASE_URL } from '../../services/api';
import { mediaService, categoryService } from '../../services/cms.service';
import Alert from '../Alert';
import { useAlert } from '../../hooks/useAlert';

interface BranchPackageManagerProps {
  branchId: string;
}

const BranchPackageManager: React.FC<BranchPackageManagerProps> = ({ branchId }) => {
  const [packages, setPackages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { alert, showAlert, hideAlert } = useAlert();

  const [form, setForm] = useState({
    name: '',
    type: '',
    shortDescription: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    image: '',
    videoCount: '',
    subjectCount: '',
    duration: '',
    features: [] as string[],
    isPopular: false,
    isNew: false,
    isActive: true,
  });

  useEffect(() => {
    fetchPackages();
    fetchCategories();
  }, [branchId]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      const allCategories = response.data.categories || response.data.data || [];
      setCategories(allCategories.filter((c: any) => c.type === 'PACKAGE'));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await api.get('/packages');
      setPackages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      
      const response = await mediaService.upload(file);

      console.log('Upload response:', response.data);
      const imageUrl = response.data.url || response.data.data?.url || response.data.media?.url;
      console.log('Image URL:', imageUrl);

      if (imageUrl) {
        setForm(prev => ({ ...prev, image: imageUrl }));
      } else {
        showAlert('error', 'Resim URL\'si alınamadı');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      if (error.response?.status === 413) {
        showAlert('error', 'Dosya boyutu çok büyük (Maksimum 5MB)');
      } else {
        showAlert('error', error.response?.data?.message || error.message || 'Resim yüklenemedi');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = () => {
    setEditingPackage(null);
    setForm({
      name: '',
      type: '',
      shortDescription: '',
      description: '',
      price: '',
      originalPrice: '',
      discount: '',
      image: '',
      videoCount: '',
      subjectCount: '',
      duration: '',
      features: [],
      isPopular: false,
      isNew: false,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg);
    setForm({
      name: pkg.name || '',
      type: pkg.type || '',
      shortDescription: pkg.shortDescription || '',
      description: pkg.description || '',
      price: pkg.price?.toString() || '',
      originalPrice: pkg.originalPrice?.toString() || '',
      discount: pkg.discount?.toString() || '',
      image: pkg.image || '',
      videoCount: pkg.videoCount?.toString() || '',
      subjectCount: pkg.subjectCount?.toString() || '',
      duration: pkg.duration || '',
      features: pkg.features || [],
      isPopular: pkg.isPopular || false,
      isNew: pkg.isNew || false,
      isActive: pkg.isActive !== undefined ? pkg.isActive : true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/packages/${id}`);
      showAlert('success', 'Paket silme talebi oluşturuldu!');
      setDeleteConfirm(null);
      fetchPackages();
    } catch (error: any) {
      if (error.response?.data?.error === 'DUPLICATE_REQUEST') {
        showAlert('warning', 'Bu paket için zaten bekleyen bir silme talebi var.');
      } else {
        showAlert('error', 'Silme işlemi başarısız oldu.');
      }
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.shortDescription) {
      showAlert('warning', 'Lütfen paket adı ve kısa açıklama girin');
      return;
    }

    try {
      setSaving(true);

      const data = {
        ...form,
        price: form.price ? parseFloat(form.price) : null,
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : null,
        discount: form.discount ? parseInt(form.discount) : null,
        videoCount: form.videoCount ? parseInt(form.videoCount) : null,
        subjectCount: form.subjectCount ? parseInt(form.subjectCount) : null,
      };

      if (editingPackage) {
        await api.put(`/packages/${editingPackage.id}`, { ...data, branchId });
        showAlert('success', 'Paket güncelleme talebi oluşturuldu!');
      } else {
        await api.post('/packages', { ...data, branchId });
        showAlert('success', 'Paket ekleme talebi oluşturuldu!');
      }

      setIsModalOpen(false);
      fetchPackages();
    } catch (error: any) {
      if (error.response?.data?.error === 'DUPLICATE_REQUEST') {
        showAlert('warning', 'Bu paket için zaten bekleyen bir güncelleme talebi var.');
      } else {
        showAlert('error', 'Kaydetme işlemi başarısız oldu.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Yükleniyor...</div>;
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={hideAlert}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-white rounded-[32px] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-white sticky top-0">
              <div>
                <h2 className="text-2xl font-black text-brand-dark capitalize tracking-tight">
                  {editingPackage ? 'Düzenle' : 'Yeni Ekle'} <span className="text-brand-blue">Paket</span>
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-1">Lütfen tüm alanları profesyonel bir dille doldurun.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-gray transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Paket Adı <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Tür <span className="text-red-500">*</span></label>
                    <select
                      value={form.type}
                      onChange={e => setForm({ ...form, type: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold appearance-none"
                    >
                      <option value="">Seçiniz</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug || cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kısa Açıklama <span className="text-red-500">*</span></label>
                  <textarea
                    rows={2}
                    value={form.shortDescription}
                    onChange={e => setForm({ ...form, shortDescription: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Detaylı Açıklama <span className="text-red-500">*</span></label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Fiyat (₺) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={e => setForm({ ...form, price: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Orijinal Fiyat (₺)</label>
                    <input
                      type="number"
                      value={form.originalPrice}
                      onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">İndirim Oranı (%)</label>
                    <input
                      type="number"
                      value={form.discount}
                      onChange={e => setForm({ ...form, discount: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Video Sayısı</label>
                    <input
                      type="number"
                      value={form.videoCount}
                      onChange={e => setForm({ ...form, videoCount: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Ders Sayısı</label>
                    <input
                      type="number"
                      value={form.subjectCount}
                      onChange={e => setForm({ ...form, subjectCount: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Süre</label>
                    <input
                      type="text"
                      value={form.duration}
                      onChange={e => setForm({ ...form, duration: e.target.value })}
                      placeholder="Örn: 12 Ay"
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Özellikler</label>
                  <div className="space-y-2">
                    {form.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={e => {
                            const newFeatures = [...form.features];
                            newFeatures[index] = e.target.value;
                            setForm({ ...form, features: newFeatures });
                          }}
                          placeholder={`Özellik ${index + 1}`}
                          className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newFeatures = form.features.filter((_, i) => i !== index);
                            setForm({ ...form, features: newFeatures });
                          }}
                          className="px-4 py-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-black text-xs"
                        >
                          Sil
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, features: [...form.features, ''] })}
                      className="w-full px-4 py-3 bg-brand-blue/10 text-brand-blue rounded-xl hover:bg-brand-blue hover:text-white transition-all font-black text-xs"
                    >
                      + Özellik Ekle
                    </button>
                  </div>
                </div>

                {/* Paket Görseli Upload */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Paket Görseli <span className="text-red-500">*</span></label>
                  <div className="flex gap-4 items-end">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold"
                    />
                    {form.image && (
                      <img src={form.image} alt="Paket" className="w-32 h-20 object-cover border border-slate-200 rounded-lg" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPopular"
                      checked={form.isPopular}
                      onChange={e => setForm({ ...form, isPopular: e.target.checked })}
                      className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
                    />
                    <label htmlFor="isPopular" className="text-xs font-black text-slate-600">Popüler</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isNew"
                      checked={form.isNew}
                      onChange={e => setForm({ ...form, isNew: e.target.checked })}
                      className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
                    />
                    <label htmlFor="isNew" className="text-xs font-black text-slate-600">Yeni</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={form.isActive}
                      onChange={e => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 text-brand-blue rounded focus:ring-brand-blue"
                    />
                    <label htmlFor="isActive" className="text-xs font-black text-slate-600">Aktif</label>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-10 py-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-end space-x-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-4 text-slate-400 font-black text-sm capitalize tracking-widest hover:text-brand-dark transition-colors">
                İptal
              </button>
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="px-10 py-4 bg-brand-blue text-white font-black text-sm capitalize tracking-widest rounded-2xl shadow-xl shadow-brand-blue/20 hover:bg-brand-dark transition-all disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-brand-dark">Paketler</h2>
        <button
          onClick={handleAdd}
          className="px-6 py-3 bg-brand-blue text-white font-black rounded-xl hover:bg-brand-dark flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Paket Ekle</span>
        </button>
      </div>

      {/* Package List */}
      {packages.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Henüz paket eklenmemiş</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-slate-50 rounded-2xl overflow-hidden hover:shadow-lg transition-all group relative">
              {/* Pending Badge */}
              {pkg.isPending && (
                <div className="absolute top-3 right-3 z-10">
                  <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1 ${pkg.pendingType === 'CREATE'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    <Clock className="w-3 h-3" />
                    <span>
                      {pkg.pendingType === 'CREATE' ? 'Onay Bekliyor' : 'Güncelleme Onayı Bekliyor'}
                    </span>
                  </span>
                </div>
              )}

              {/* Package Image */}
              {pkg.image ? (
                <div className="w-full h-48 bg-slate-200">
                  <img
                    src={pkg.image?.startsWith('http') ? pkg.image : (pkg.image?.startsWith('/assets') ? pkg.image : `${API_BASE_URL}${pkg.image}`)}
                    alt={pkg.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-brand-blue to-brand-dark flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-white/30" />
                </div>
              )}

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-black text-brand-dark">{pkg.name}</h3>
                  <p className="text-sm text-slate-600 mt-1">{pkg.shortDescription}</p>
                </div>

                {pkg.price && (
                  <div className="flex items-baseline space-x-2 mb-4">
                    <span className="text-2xl font-black text-brand-blue">{pkg.price}₺</span>
                    {pkg.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">{pkg.originalPrice}₺</span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  {pkg.videoCount && <span>📹 {pkg.videoCount} Video</span>}
                  {pkg.subjectCount && <span>📚 {pkg.subjectCount} Konu</span>}
                  {pkg.duration && <span>⏱️ {pkg.duration}</span>}
                </div>

                {/* Action buttons */}
                {!pkg.isPending && (
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(pkg)}
                      className="flex-1 p-2 bg-brand-blue text-white rounded-lg hover:bg-brand-dark"
                    >
                      <Edit2 className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(pkg.id)}
                      className="flex-1 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                )}

                {pkg.isPending && (
                  <div className="text-center">
                    <p className="text-xs text-slate-500 italic">Admin onayı bekleniyor</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-100 mx-auto mb-4 flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-2">Paketi Sil</h3>
              <p className="text-slate-600">
                Bu paketi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 transition-all"
              >
                İptal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-6 py-3 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 transition-all"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchPackageManager;
