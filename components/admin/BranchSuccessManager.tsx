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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewingSuccess, setViewingSuccess] = useState<YearlySuccess | null>(null);
  const [studentForm, setStudentForm] = useState({
    name: '',
    exam: '',
    rank: '',
    score: '',
    university: '',
    branch: '',
    image: '',
    order: 0
  });
  const [addingStudent, setAddingStudent] = useState(false);
  const { alert, showAlert, hideAlert } = useAlert();
  
  const [form, setForm] = useState({
    year: new Date().getFullYear(),
    title: '',
    description: '',
    bannerTitle: '',
    bannerSubtitle: '',
    bannerImage: '',
    totalDegrees: 0,
    placementCount: 0,
    successRate: 0,
    top100Count: 0,
    top1000Count: 0,
    yksAverage: 0,
    lgsAverage: 0
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
      bannerImage: '',
      totalDegrees: 0,
      placementCount: 0,
      successRate: 0,
      top100Count: 0,
      top1000Count: 0,
      yksAverage: 0,
      lgsAverage: 0
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
      bannerImage: success.banner?.image || '',
      totalDegrees: (success as any).totalDegrees || 0,
      placementCount: (success as any).placementCount || 0,
      successRate: (success as any).successRate || 0,
      top100Count: (success as any).top100Count || 0,
      top1000Count: (success as any).top1000Count || 0,
      yksAverage: (success as any).yksAverage || 0,
      lgsAverage: (success as any).lgsAverage || 0
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
        year: String(form.year), // Ensure year is string
        title: form.title,
        description: form.description,
        totalDegrees: form.totalDegrees,
        placementCount: form.placementCount,
        successRate: form.successRate,
        cityCount: 0, // Şube için il sayısı 0
        top100Count: form.top100Count,
        top1000Count: form.top1000Count,
        yksAverage: form.yksAverage,
        lgsAverage: form.lgsAverage,
        banner: form.bannerTitle || form.bannerSubtitle || form.bannerImage ? {
          title: form.bannerTitle || '',
          subtitle: form.bannerSubtitle || '',
          description: form.description || '',
          image: form.bannerImage || ''
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
      } else if (error.response?.data?.error === 'YEAR_EXISTS') {
        showAlert('error', error.response.data.message || `${form.year} yılı için zaten bir başarı kaydınız var. Lütfen mevcut kaydı düzenleyin.`);
      } else {
        showAlert('error', 'Kaydetme işlemi başarısız oldu.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await api.delete(`/yearly-successes/${deleteId}`);
      showAlert('success', 'Başarı silme talebi oluşturuldu!');
      fetchSuccesses();
    } catch (error: any) {
      if (error.response?.data?.error === 'DUPLICATE_REQUEST') {
        showAlert('warning', 'Bu başarı için zaten bekleyen bir silme talebi var.');
      } else {
        showAlert('error', 'Silme işlemi başarısız oldu.');
      }
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const handleViewStudents = (success: YearlySuccess) => {
    setViewingSuccess(success);
    setStudentForm({
      name: '',
      exam: '',
      rank: '',
      score: '',
      university: '',
      branch: '',
      image: '',
      order: success.students?.length || 0
    });
  };

  const handleStudentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await mediaService.upload(file);
      const url = response.data?.data?.url || response.data?.url;
      setStudentForm({ ...studentForm, image: url });
      showAlert('success', 'Görsel yüklendi');
    } catch (error) {
      showAlert('error', 'Görsel yüklenemedi');
    } finally {
      setUploading(false);
    }
  };

  const handleAddStudent = async () => {
    if (!viewingSuccess || !studentForm.name || !studentForm.exam || !studentForm.rank) {
      showAlert('warning', 'Lütfen öğrenci adı, sınav ve sıralama bilgilerini girin');
      return;
    }

    try {
      setAddingStudent(true);
      const response = await api.post(`/yearly-successes/${viewingSuccess.id}/students`, studentForm);
      
      // Check if it's a change request or direct creation
      if (response.data.message) {
        showAlert('success', response.data.message);
      } else {
        showAlert('success', 'Öğrenci eklendi!');
      }
      
      // Refresh the success data
      fetchSuccesses();
      
      // Reset form
      setStudentForm({
        name: '',
        exam: '',
        rank: '',
        score: '',
        university: '',
        branch: '',
        image: '',
        order: (viewingSuccess.students?.length || 0) + 1
      });
    } catch (error: any) {
      if (error.response?.data?.error === 'DUPLICATE_REQUEST') {
        showAlert('warning', 'Bu öğrenci için zaten bekleyen bir talep var.');
      } else {
        showAlert('error', 'Öğrenci eklenemedi');
      }
    } finally {
      setAddingStudent(false);
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!viewingSuccess) return;
    
    try {
      const response = await api.delete(`/yearly-successes/${viewingSuccess.id}/students/${studentId}`);
      
      // Check if it's a change request or direct deletion
      if (response.data.message && response.data.message.includes('talep')) {
        showAlert('success', response.data.message);
      } else {
        showAlert('success', 'Öğrenci silindi!');
      }
      
      fetchSuccesses();
    } catch (error: any) {
      if (error.response?.data?.error === 'DUPLICATE_REQUEST') {
        showAlert('warning', 'Bu öğrenci için zaten bekleyen bir silme talebi var.');
      } else {
        showAlert('error', 'Öğrenci silinemedi');
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
            
            {/* İstatistikler */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {(success as any).totalDegrees > 0 && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Toplam Derece</p>
                  <p className="text-lg font-black text-brand-blue">{(success as any).totalDegrees}</p>
                </div>
              )}
              {(success as any).placementCount > 0 && (
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Yerleşen</p>
                  <p className="text-lg font-black text-green-600">{(success as any).placementCount}</p>
                </div>
              )}
              {(success as any).successRate > 0 && (
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">Başarı Oranı</p>
                  <p className="text-lg font-black text-purple-600">%{(success as any).successRate}</p>
                </div>
              )}
              {(success as any).top100Count > 0 && (
                <div className="bg-yellow-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500">İlk 100</p>
                  <p className="text-lg font-black text-yellow-600">{(success as any).top100Count}</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold text-slate-400">
                  {success.students?.length || 0} Öğrenci
                </span>
                {!success.isPending && (
                  <button
                    onClick={() => handleViewStudents(success)}
                    className="text-xs font-bold text-brand-blue hover:text-brand-dark transition-all flex items-center space-x-1"
                  >
                    <User className="w-3 h-3" />
                    <span>Öğrencileri Yönet</span>
                  </button>
                )}
              </div>
              
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

              {/* İstatistikler */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-sm font-black text-slate-600 mb-4">📊 İstatistikler</h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Toplam Derece</label>
                    <input
                      type="number"
                      value={form.totalDegrees}
                      onChange={e => setForm({ ...form, totalDegrees: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Yerleşen Sayısı</label>
                    <input
                      type="number"
                      value={form.placementCount}
                      onChange={e => setForm({ ...form, placementCount: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Başarı Oranı (%)</label>
                    <input
                      type="number"
                      value={form.successRate}
                      onChange={e => setForm({ ...form, successRate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">İlk 100</label>
                    <input
                      type="number"
                      value={form.top100Count}
                      onChange={e => setForm({ ...form, top100Count: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">İlk 1000</label>
                    <input
                      type="number"
                      value={form.top1000Count}
                      onChange={e => setForm({ ...form, top1000Count: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">YKS Ortalaması</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.yksAverage}
                      onChange={e => setForm({ ...form, yksAverage: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">LGS Ortalaması</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.lgsAverage}
                      onChange={e => setForm({ ...form, lgsAverage: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-sm font-black text-slate-600 mb-4">🎨 Banner Ayarları (Opsiyonel)</h4>
                
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-black text-brand-dark text-center mb-2">
                Başarıyı Sil
              </h3>
              <p className="text-slate-600 text-center mb-6">
                Bu başarıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteId(null);
                  }}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  İptal
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Students Management Modal */}
      {viewingSuccess && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <div>
                <h3 className="text-2xl font-black text-brand-dark">Öğrenci Yönetimi</h3>
                <p className="text-sm text-slate-500 mt-1">{viewingSuccess.year} - {viewingSuccess.title}</p>
              </div>
              <button onClick={() => setViewingSuccess(null)} className="p-2 hover:bg-slate-100 rounded-xl">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Add Student Form */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h4 className="text-lg font-black text-brand-dark mb-4">Yeni Öğrenci Ekle</h4>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Öğrenci Adı *</label>
                    <input
                      type="text"
                      value={studentForm.name}
                      onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                      placeholder="Örn: Ahmet Yılmaz"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Sınav *</label>
                    <input
                      type="text"
                      value={studentForm.exam}
                      onChange={e => setStudentForm({ ...studentForm, exam: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                      placeholder="Örn: YKS, LGS"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Sıralama *</label>
                    <input
                      type="text"
                      value={studentForm.rank}
                      onChange={e => setStudentForm({ ...studentForm, rank: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                      placeholder="Örn: 1, 15, 100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Puan</label>
                    <input
                      type="text"
                      value={studentForm.score}
                      onChange={e => setStudentForm({ ...studentForm, score: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                      placeholder="Örn: 525.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Üniversite</label>
                    <input
                      type="text"
                      value={studentForm.university}
                      onChange={e => setStudentForm({ ...studentForm, university: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                      placeholder="Örn: Boğaziçi Üniversitesi"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Bölüm</label>
                    <input
                      type="text"
                      value={studentForm.branch}
                      onChange={e => setStudentForm({ ...studentForm, branch: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                      placeholder="Örn: Bilgisayar Mühendisliği"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <label className="text-xs font-black text-slate-400 uppercase">Öğrenci Fotoğrafı</label>
                  <div className="flex items-center space-x-4">
                    {studentForm.image ? (
                      <div className="relative">
                        <img
                          src={studentForm.image}
                          alt="Student"
                          className="w-24 h-24 rounded-full object-cover border-2 border-slate-200"
                        />
                        <button
                          onClick={() => setStudentForm({ ...studentForm, image: '' })}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-300 rounded-full cursor-pointer hover:border-brand-blue hover:bg-slate-50 transition-all">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleStudentImageUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        {uploading ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-brand-blue"></div>
                        ) : (
                          <Upload className="w-6 h-6 text-slate-400" />
                        )}
                      </label>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleAddStudent}
                  disabled={addingStudent}
                  className="w-full px-6 py-3 bg-brand-blue text-white rounded-xl font-bold hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {addingStudent ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      <span>Ekleniyor...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Öğrenci Ekle</span>
                    </>
                  )}
                </button>
              </div>

              {/* Students List */}
              <div>
                <h4 className="text-lg font-black text-brand-dark mb-4">
                  Öğrenciler ({viewingSuccess.students?.length || 0})
                </h4>
                
                {viewingSuccess.students && viewingSuccess.students.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {viewingSuccess.students.map((student) => (
                      <div key={student.id} className="bg-slate-50 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          {student.image && (
                            <img
                              src={student.image}
                              alt={student.name}
                              className="w-16 h-16 rounded-full object-cover border-2 border-slate-200"
                            />
                          )}
                          <div>
                            <h5 className="font-black text-brand-dark">{student.name}</h5>
                            <p className="text-sm text-slate-600">
                              {student.exam} - {student.rank}. Sıra
                              {student.score && ` - ${student.score} puan`}
                            </p>
                            {student.university && (
                              <p className="text-xs text-slate-500 mt-1">
                                {student.university}
                                {student.branch && ` - ${student.branch}`}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="p-2 bg-white text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-slate-50 rounded-xl">
                    <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Henüz öğrenci eklenmemiş</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BranchSuccessManager;
