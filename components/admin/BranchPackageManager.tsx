import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Clock, X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import api from '../../services/api';
import axios from 'axios';
import Alert from '../Alert';
import { useAlert } from '../../hooks/useAlert';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface BranchPackageManagerProps {
  branchId: string;
}

const BranchPackageManager: React.FC<BranchPackageManagerProps> = ({ branchId }) => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { alert, showAlert, hideAlert } = useAlert();

  const [form, setForm] = useState({
    name: '',
    type: 'STANDARD',
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
  }, [branchId]);

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
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('accessToken');
      const response = await axios.post(`${API_URL}/media/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Upload response:', response.data);
      const imageUrl = response.data.url || response.data.data?.url || response.data.path;
      console.log('Image URL:', imageUrl);

      if (imageUrl) {
        setForm(prev => ({ ...prev, image: imageUrl }));
      } else {
        showAlert('error', 'Resim URL\'si alınamadı');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      showAlert('error', 'Resim yüklenemedi');
    } finally {
      setUploading(false);
    }
  };

  const handleAdd = () => {
    setEditingPackage(null);
    setForm({
      name: '',
      type: 'STANDARD',
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
      type: pkg.type || 'STANDARD',
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
        await api.put(`/packages/${editingPackage.id}`, data);
        showAlert('success', 'Paket güncelleme talebi oluşturuldu!');
      } else {
        await api.post('/packages', data);
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-2xl font-black text-brand-dark">
                {editingPackage ? 'Paket Düzenle' : 'Yeni Paket Ekle'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">Paket Adı *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">Paket Tipi</label>
                  <select
                    value={form.type}
                    onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                  >
                    <option value="STANDARD">Standart</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase">Kısa Açıklama *</label>
                <input
                  type="text"
                  value={form.shortDescription}
                  onChange={e => setForm({ ...form, shortDescription: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase">Detaylı Açıklama</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-brand-blue resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">Fiyat (₺)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">Orijinal Fiyat (₺)</label>
                  <input
                    type="number"
                    value={form.originalPrice}
                    onChange={e => setForm({ ...form, originalPrice: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">İndirim Oranı (%)</label>
                  <input
                    type="number"
                    value={form.discount}
                    onChange={e => setForm({ ...form, discount: e.target.value })}
                    placeholder="Örn: 20"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">Video Sayısı</label>
                  <input
                    type="number"
                    value={form.videoCount}
                    onChange={e => setForm({ ...form, videoCount: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">Ders Sayısı</label>
                  <input
                    type="number"
                    value={form.subjectCount}
                    onChange={e => setForm({ ...form, subjectCount: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">Süre</label>
                  <input
                    type="text"
                    value={form.duration}
                    onChange={e => setForm({ ...form, duration: e.target.value })}
                    placeholder="Örn: 6 Ay"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                  />
                </div>
              </div>

              {/* Özellikler */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-slate-400 uppercase">Özellikler</label>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, features: [...form.features, ''] })}
                    className="px-3 py-1 bg-brand-blue text-white text-xs font-bold rounded-lg hover:bg-brand-dark transition-all flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Özellik Ekle</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {form.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={e => {
                          const newFeatures = [...form.features];
                          newFeatures[index] = e.target.value;
                          setForm({ ...form, features: newFeatures });
                        }}
                        placeholder="Özellik açıklaması"
                        className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold focus:outline-none focus:border-brand-blue"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newFeatures = form.features.filter((_, i) => i !== index);
                          setForm({ ...form, features: newFeatures });
                        }}
                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {form.features.length === 0 && (
                    <p className="text-sm text-slate-400 italic text-center py-4">
                      Henüz özellik eklenmemiş. "Özellik Ekle" butonuna tıklayarak başlayın.
                    </p>
                  )}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase">Paket Görseli</label>
                <div className="flex items-center space-x-4">
                  {form.image ? (
                    <div className="relative">
                      <img
                        src={form.image}
                        alt="Package"
                        className="w-32 h-32 object-cover rounded-xl border-2 border-slate-200"
                      />
                      <button
                        onClick={() => setForm({ ...form, image: '' })}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-brand-blue hover:bg-slate-50 transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                      {uploading ? (
                        <div className="text-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-blue mx-auto mb-2"></div>
                          <p className="text-sm text-slate-500">Yükleniyor...</p>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-slate-400 mb-2" />
                          <p className="text-sm font-bold text-slate-600">Görsel Yükle</p>
                          <p className="text-xs text-slate-400 mt-1">PNG, JPG (Max 5MB)</p>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-3 gap-5">
                <label className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                  <input
                    type="checkbox"
                    checked={form.isPopular}
                    onChange={e => setForm({ ...form, isPopular: e.target.checked })}
                    className="w-5 h-5 text-brand-blue rounded focus:ring-brand-blue"
                  />
                  <span className="text-sm font-bold text-slate-700">Popüler</span>
                </label>

                <label className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={e => setForm({ ...form, isNew: e.target.checked })}
                    className="w-5 h-5 text-brand-blue rounded focus:ring-brand-blue"
                  />
                  <span className="text-sm font-bold text-slate-700">Yeni</span>
                </label>

                <label className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-all">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={e => setForm({ ...form, isActive: e.target.checked })}
                    className="w-5 h-5 text-brand-blue rounded focus:ring-brand-blue"
                  />
                  <span className="text-sm font-bold text-slate-700">Aktif</span>
                </label>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200"
                >
                  İptal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-brand-blue text-white font-black rounded-xl hover:bg-brand-dark disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                </button>
              </div>
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
                    src={pkg.image}
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
