import React, { useState, useEffect } from 'react';
import { Award, Plus, Edit2, Trash2, X, Save, Upload, User } from 'lucide-react';
import api from '../../services/api';
import { yearlySuccessService } from '../../services/homepage.service';
import { mediaService } from '../../services/cms.service';
import Alert from '../Alert';
import { useAlert } from '../../hooks/useAlert';

interface TopStudent {
  id: string;
  name: string;
  exam: string;
  rank: string;
  score?: string;
  university?: string;
  branch?: string;
  image: string;
  features: string[];
}

interface YearlySuccess {
  id: string;
  year: number;
  title: string;
  description: string;
  banner?: {
    title: string;
    subtitle: string;
    image: string;
  };
  students: TopStudent[];
  isPending?: boolean;
  pendingType?: 'CREATE' | 'UPDATE';
}

interface BranchSuccessManagerProps {
  branchId: string;
}

const BranchSuccessManager: React.FC<BranchSuccessManagerProps> = ({ branchId }) => {
  const [successes, setSuccesses] = useState<YearlySuccess[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSuccess, setEditingSuccess] = useState<YearlySuccess | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();
  
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    title: '',
    description: '',
    bannerTitle: '',
    bannerSubtitle: '',
    bannerImage: ''
  });

  useEffect(() => {
    fetchSuccesses();
  }, [branchId]);

  const fetchSuccesses = async () => {
    try {
      setLoading(true);
      const response = await yearlySuccessService.getAll();
      const allSuccesses = response.data?.data || response.data || [];
      
      // Filter by branch
      const branchSuccesses = allSuccesses.filter((s: any) => s.branchId === branchId);
      setSuccesses(branchSuccesses);
    } catch (error) {
      console.error('Error fetching successes:', error);
      showAlert('error', 'Başarılar yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingSuccess(null);
    setForm({
      year: new Date().getFullYear(),
      title: '',
      description: '',
      bannerTitle: '',
      bannerSubtitle: '',
      bannerImage: ''
    });
    setIsModalOpen(true);
  };

  const handleEdit = (success: YearlySuccess) => {
    setEditingSuccess(success);
    setForm({
      year: success.year,
      title: success.title,
      description: success.description,
      bannerTitle: success.banner?.title || '',
      bannerSubtitle: success.banner?.subtitle || '',
      bannerImage: success.banner?.image || ''
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await mediaService.upload(file);
      const url = response.data?.data?.url || response.data?.url;
      setForm({ ...form, bannerImage: url });
      showAlert('success', 'Görsel yüklendi');
    } catch (error) {
      showAlert('error', 'Görsel yüklenemedi');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.title || !form.year) {
      showAlert('warning', 'Lütfen başlık ve yıl girin');
      return;
    }

    try {
      setSaving(true);
      
      const data = {
        year: form.year,
        title: form.title,
        description: form.description,
        banner: form.bannerTitle || form.bannerSubtitle || form.bannerImage ? {
          title: form.bannerTitle,
          subtitle: form.bannerSubtitle,
          image: form.bannerImage
        } : undefined,
        branchId
      };

      if (editingSuccess) {
        await api.put(`/yearly-successes/${editingSuccess.id}`, data);
        showAlert('success', 'Başarı güncelleme talebi oluşturuldu!');
      } else {
        await api.post('/yearly-successes', data);
        showAlert('success', 'Başarı ekleme talebi oluşturuldu!');
      }
      
      setIsModalOpen(false);
      fetchSuccesses();
    } catch (error: any) {
      if (error.response?.data?.error === 'DUPLICATE_REQUEST') {
        showAlert('warning', 'Bu başarı için zaten bekleyen bir talep var.');
      } else {
        showAlert('error', 'Kaydetme işlemi başarısız oldu.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu başarıyı silmek istediğinize emin misiniz?')) return;

    try {
      await api.delete(`/yearly-successes/${id}`);
      showAlert('success', 'Başarı silme talebi oluşturuldu!');
      fetchSuccesses();
    } catch (error: any) {
      if (error.response?.data?.error === 'DUPLICATE_REQUEST') {
        showAlert('warning', 'Bu başarı için zaten bekleyen bir silme talebi var.');
      } else {
        showAlert('error', 'Silme işlemi başarısız oldu.');
      }
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

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-brand-dark">Başarılar</h2>
          <p className="text-sm text-slate-500 mt-1">Şubenizin yıllık başarılarını yönetin</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-dark transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Yeni Başarı Ekle</span>
        </button>
      </div>

      {/* Success List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {successes.map((success) => (
          <div key={success.id} className="relative border-2 border-slate-100 rounded-2xl p-6 hover:border-brand-blue transition-all group">
            {success.isPending && (
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-black ${
                  success.pendingType === 'CREATE' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {success.pendingType === 'CREATE' ? 'Ekleme Bekliyor' : 'Güncelleme Bekliyor'}
                </span>
              </div>
            )}
            
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-black text-brand-dark">{success.year}</h3>
                <p className="text-sm font-bold text-slate-600 mt-1">{success.title}</p>
              </div>
              <Award className="w-8 h-8 text-brand-blue" />
            </div>
            
            {success.description && (
              <p className="text-sm text-slate-500 mb-4">{success.description}</p>
            )}
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-400">
                {success.students?.length || 0} Öğrenci
              </span>
              
              {!success.isPending && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(success)}
                    className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-brand-blue hover:text-white transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(success.id)}
                    className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {successes.length === 0 && (
        <div className="text-center py-20">
          <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-black text-slate-400 mb-2">Henüz başarı eklenmemiş</h3>
          <p className="text-sm text-slate-400">İlk başarıyı ekleyerek başlayın</p>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-2xl font-black text-brand-dark">
                {editingSuccess ? 'Başarı Düzenle' : 'Yeni Başarı Ekle'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">Yıl *</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={e => setForm({ ...form, year: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">Başlık *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                    placeholder="Örn: YKS Başarıları"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase">Açıklama</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-brand-blue resize-none"
                  placeholder="Başarı hakkında kısa açıklama"
                />
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-sm font-black text-slate-600 mb-4">Banner Ayarları (Opsiyonel)</h4>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Banner Başlık</label>
                    <input
                      type="text"
                      value={form.bannerTitle}
                      onChange={e => setForm({ ...form, bannerTitle: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Banner Alt Başlık</label>
                    <input
                      type="text"
                      value={form.bannerSubtitle}
                      onChange={e => setForm({ ...form, bannerSubtitle: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Banner Görseli</label>
                    <div className="flex items-center space-x-4">
                      {form.bannerImage ? (
                        <div className="relative flex-1">
                          <img
                            src={form.bannerImage}
                            alt="Banner"
                            className="w-full h-32 object-cover rounded-xl border-2 border-slate-200"
                          />
                          <button
                            onClick={() => setForm({ ...form, bannerImage: '' })}
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
                            </>
                          )}
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-50 px-8 py-6 flex items-center justify-end space-x-4 rounded-b-3xl border-t border-slate-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all"
              >
                İptal
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchSuccessManager;
