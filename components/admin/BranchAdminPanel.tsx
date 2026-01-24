import React, { useState, useEffect } from 'react';
import { 
  Building2, Save, Upload, MapPin, Phone, Mail, Globe, Clock, 
  Image as ImageIcon, FileText, Users, Award, Video, Calendar,
  Trash2, Plus, Edit2, Eye, X, CheckCircle, AlertCircle, Info, Package
} from 'lucide-react';
import { Branch, AdminUser, Teacher } from '../../types';
import { branchService, mediaService } from '../../services/cms.service';
import { teacherService } from '../../services/homepage.service';
import BranchPackageManager from './BranchPackageManager';
import BranchSuccessManager from './BranchSuccessManager';
import LeadManager from './LeadManager';

// Simple Alert Component
const Alert: React.FC<{ type: 'success' | 'error' | 'warning' | 'info'; message: string; onClose: () => void }> = ({ type, message, onClose }) => {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  
  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <AlertCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />,
  };
  
  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md p-4 rounded-xl border-2 ${colors[type]} shadow-xl animate-slide-in-right flex items-start space-x-3`}>
      {icons[type]}
      <p className="flex-1 font-bold text-sm whitespace-pre-line">{message}</p>
      <button onClick={onClose} className="hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Custom hook for alerts
const useAlert = () => {
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | 'warning' | 'info'; message: string } | null>(null);
  
  const showAlert = (type: 'success' | 'error' | 'warning' | 'info', message: string) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };
  
  const hideAlert = () => setAlert(null);
  
  return { alert, showAlert, hideAlert };
};

interface BranchAdminPanelProps {
  user: AdminUser;
}

export const BranchAdminPanel: React.FC<BranchAdminPanelProps> = ({ user }) => {
  const { alert, showAlert, hideAlert } = useAlert();
  const [branch, setBranch] = useState<Branch | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'content' | 'teachers' | 'media' | 'successes' | 'leads'>('info');
  const [hasChanges, setHasChanges] = useState(false);
  const [hasPendingBranchUpdate, setHasPendingBranchUpdate] = useState(false);
  
  // Form states - tüm değişiklikler burada toplanacak
  const [basicInfo, setBasicInfo] = useState<Partial<Branch>>({});
  const [contentData, setContentData] = useState({
    description: '',
    features: [] as string[],
    successStory: '',
  });
  
  // Teacher changes tracking
  const [teacherChanges, setTeacherChanges] = useState<{
    created: Array<{ name: string; subject: string; image: string }>;
    updated: Array<{ id: string; name: string; subject: string; image: string }>;
    deleted: string[];
  }>({
    created: [],
    updated: [],
    deleted: []
  });
  
  // Teacher modal state
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teacherForm, setTeacherForm] = useState({
    name: '',
    subject: '',
    image: '',
  });

  useEffect(() => {
    fetchBranchData();
  }, [user.branchId]);

  const fetchBranchData = async () => {
    try {
      setLoading(true);
      
      if (!user.branchId) {
        showAlert('error', 'Size atanmış bir şube bulunamadı. Lütfen sistem yöneticisi ile iletişime geçin.');
        setLoading(false);
        return;
      }
      
      const [branchRes, teachersRes] = await Promise.all([
        branchService.getById(user.branchId),
        teacherService.getAll()
      ]);
      
      const branchData = branchRes.data.branch || branchRes.data;
      setBranch(branchData);
      setBasicInfo(branchData);
      
      // Parse content data if exists
      if (branchData.description) {
        setContentData(prev => ({ ...prev, description: branchData.description }));
      }
      
      // Filter teachers for this branch
      const branchTeachers = teachersRes.data?.data || teachersRes.data?.teachers || [];
      setTeachers(branchTeachers.filter((t: Teacher) => t.branchId === user.branchId));
      
      // Check for pending branch update
      try {
        const token = localStorage.getItem('accessToken');
        const pendingRes = await fetch('/api/change-requests?status=PENDING', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const pendingData = await pendingRes.json();
        const hasPending = pendingData.data?.some((req: any) => 
          req.changeType === 'BRANCH_UPDATE' && req.branchId === user.branchId
        );
        setHasPendingBranchUpdate(hasPending);
      } catch (error) {
        console.error('Error checking pending requests:', error);
      }
      
    } catch (error: any) {
      console.error('❌ Error fetching branch data:', error);
      showAlert('error', 'Şube bilgileri yüklenirken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const response = await mediaService.upload(file);
      return response.data?.data?.url || response.data?.url || response.data?.media?.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  // Tek kaydet butonu - tüm değişiklikleri toplu olarak gönder
  const handleSaveAllChanges = async () => {
    if (!branch) return;
    
    // Eğer zaten pending bir talep varsa, kaydetmeye izin verme
    if (hasPendingBranchUpdate) {
      showAlert('warning', '⚠️ Zaten bekleyen bir güncelleme talebiniz var. Admin onayını bekleyin.');
      return;
    }
    
    try {
      setSaving(true);
      
      // Şube bilgilerini güncelle
      const branchUpdateData = {
        ...basicInfo,
        description: contentData.description
      };
      
      const response = await branchService.update(branch.id, branchUpdateData);
      
      if (response.data.isPending) {
        showAlert('success', '✅ Tüm değişiklikleriniz onaya gönderildi!\n\nAdmin onayından sonra yayınlanacak.');
        setHasPendingBranchUpdate(true);
      } else {
        showAlert('success', '✅ Tüm değişiklikler başarıyla kaydedildi!');
      }
      
      setHasChanges(false);
      setTeacherChanges({ created: [], updated: [], deleted: [] });
      fetchBranchData();
    } catch (error: any) {
      console.error('Save error:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('bekleyen')) {
        showAlert('warning', '⚠️ Bu şube için zaten bekleyen bir güncelleme talebi var.');
        setHasPendingBranchUpdate(true);
      } else {
        showAlert('error', '❌ Kaydetme işlemi başarısız oldu.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddTeacher = async () => {
    setEditingTeacher(null);
    setTeacherForm({ name: '', subject: '', image: '' });
    setIsTeacherModalOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setTeacherForm({
      name: teacher.name,
      subject: teacher.subject,
      image: teacher.image || '',
    });
    setIsTeacherModalOpen(true);
  };

  const handleDeleteTeacher = async (teacherId: string) => {
    if (!window.confirm('Bu öğretmeni silmek istediğinize emin misiniz?')) return;
    
    try {
      const response = await teacherService.delete(teacherId);
      
      if (response.data.isPending) {
        showAlert('success', '✅ Öğretmen silme talebi oluşturuldu!\n\nDeğişiklikleriniz admin onayından sonra yayınlanacak.');
        fetchBranchData(); // Refresh to hide the teacher
      } else {
        showAlert('success', '✅ Öğretmen silindi!');
        fetchBranchData();
      }
    } catch (error: any) {
      console.error('Delete error:', error);
      if (error.response?.data?.error === 'DUPLICATE_REQUEST') {
        showAlert('warning', '⚠️ Bu öğretmen için zaten bekleyen bir silme talebi var.');
      } else {
        showAlert('error', '❌ Silme işlemi başarısız oldu.');
      }
    }
  };

  const handleSaveTeacher = async () => {
    if (!teacherForm.name || !teacherForm.subject) {
      showAlert('warning', 'Lütfen tüm alanları doldurun');
      return;
    }

    try {
      setSaving(true);
      
      if (editingTeacher) {
        // Update existing teacher
        const response = await teacherService.update(editingTeacher.id, {
          ...teacherForm,
          branchId: user.branchId,
        });
        
        if (response.data.isPending) {
          showAlert('success', '✅ Öğretmen güncelleme talebi oluşturuldu!\n\nDeğişiklikleriniz admin onayından sonra yayınlanacak.');
        } else {
          showAlert('success', '✅ Öğretmen güncellendi!');
        }
      } else {
        // Create new teacher
        const response = await teacherService.create({
          ...teacherForm,
          branchId: user.branchId,
        });
        
        if (response.data.isPending) {
          showAlert('success', '✅ Öğretmen ekleme talebi oluşturuldu!\n\nDeğişiklikleriniz admin onayından sonra yayınlanacak.');
        } else {
          showAlert('success', '✅ Öğretmen eklendi!');
        }
      }
      
      setIsTeacherModalOpen(false);
      fetchBranchData();
    } catch (error: any) {
      console.error('Save error:', error);
      if (error.response?.data?.error === 'DUPLICATE_REQUEST') {
        showAlert('warning', '⚠️ Bu öğretmen için zaten bekleyen bir güncelleme talebi var.');
      } else {
        showAlert('error', '❌ Kaydetme işlemi başarısız oldu.');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-brand-blue mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Şube bilgileri yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-3xl shadow-xl">
          <Building2 className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-brand-dark mb-2">Şube Bulunamadı</h2>
          <p className="text-slate-500">Size atanmış bir şube bulunamadı.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Alert */}
      {alert && <Alert type={alert.type} message={alert.message} onClose={hideAlert} />}
      
      {/* Sticky Save Button */}
      {hasChanges && !hasPendingBranchUpdate && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
          <button
            onClick={handleSaveAllChanges}
            disabled={saving}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-black rounded-2xl hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 flex items-center space-x-3 shadow-2xl shadow-green-500/30"
          >
            <Save className="w-6 h-6" />
            <span>{saving ? 'Kaydediliyor...' : 'Tüm Değişiklikleri Kaydet'}</span>
          </button>
        </div>
      )}

      {/* Teacher Modal */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-2xl font-black text-brand-dark">
                {editingTeacher ? 'Öğretmen Düzenle' : 'Yeni Öğretmen Ekle'}
              </h3>
              <button
                onClick={() => setIsTeacherModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase">Öğretmen Adı</label>
                <input
                  type="text"
                  value={teacherForm.name}
                  onChange={e => setTeacherForm({ ...teacherForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                  placeholder="Örn: Ahmet Yılmaz"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase">Branş</label>
                <input
                  type="text"
                  value={teacherForm.subject}
                  onChange={e => setTeacherForm({ ...teacherForm, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue"
                  placeholder="Örn: Matematik, Fizik, Kimya"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase">Fotoğraf</label>
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await handleImageUpload(file);
                          setTeacherForm({ ...teacherForm, image: url });
                        } catch (error) {
                          showAlert('error', '❌ Görsel yüklenemedi');
                        }
                      }
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-blue file:text-white file:font-bold file:cursor-pointer"
                  />
                  {teacherForm.image && (
                    <div className="flex items-center justify-center">
                      <img src={teacherForm.image} alt="Preview" className="w-32 h-32 rounded-full object-cover border-4 border-slate-200" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <button
                  onClick={() => setIsTeacherModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 transition-all"
                >
                  İptal
                </button>
                <button
                  onClick={handleSaveTeacher}
                  disabled={saving}
                  className="flex-1 px-6 py-3 bg-brand-blue text-white font-black rounded-xl hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
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
      <div className="bg-gradient-to-r from-brand-blue to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {branch.logo && (
              <div className="w-20 h-20 bg-white rounded-2xl p-3 shadow-xl">
                <img src={branch.logo} alt={branch.name} className="w-full h-full object-contain" />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-4xl font-black mb-2">{branch.name}</h1>
                {hasPendingBranchUpdate && (
                  <span className="px-4 py-2 bg-yellow-400 text-yellow-900 rounded-xl text-sm font-black flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Güncelleme Bekliyor</span>
                  </span>
                )}
              </div>
              <p className="text-white/80 font-medium">Şube Yönetim Paneli</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-white/60">Yönetici</p>
            <p className="text-xl font-black">{user.name}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 shadow-sm">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'info'
                ? 'bg-brand-blue text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span>Temel Bilgiler</span>
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'content'
                ? 'bg-brand-blue text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>İçerik & Açıklama</span>
          </button>
          <button
            onClick={() => setActiveTab('teachers')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'teachers'
                ? 'bg-brand-blue text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Öğretmenler</span>
          </button>
          <button
            onClick={() => setActiveTab('successes')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'successes'
                ? 'bg-brand-blue text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Award className="w-5 h-5" />
            <span>Başarılar</span>
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'leads'
                ? 'bg-brand-blue text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Ön Kayıtlar</span>
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'media'
                ? 'bg-brand-blue text-white shadow-lg'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-5 h-5" />
            <span>Görseller</span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm relative">
              {/* Pending Overlay */}
              {hasPendingBranchUpdate && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl z-10 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-2xl font-black text-brand-dark mb-2">Onay Bekleniyor</h3>
                    <p className="text-slate-600">Yaptığınız değişiklikler admin onayı bekliyor.</p>
                    <p className="text-sm text-slate-500 mt-2">Onaylandıktan sonra tekrar düzenleme yapabilirsiniz.</p>
                  </div>
                </div>
              )}
              
              <h2 className="text-2xl font-black text-brand-dark mb-6">Temel Bilgiler</h2>
              
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Şube Adı</label>
                    <input
                      type="text"
                      value={basicInfo.name || ''}
                      onChange={e => {
                        setBasicInfo({ ...basicInfo, name: e.target.value });
                        setHasChanges(true);
                      }}
                      disabled={hasPendingBranchUpdate}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Telefon</label>
                    <input
                      type="text"
                      value={basicInfo.phone || ''}
                      onChange={e => {
                        setBasicInfo({ ...basicInfo, phone: e.target.value });
                        setHasChanges(true);
                      }}
                      disabled={hasPendingBranchUpdate}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase">Adres</label>
                  <textarea
                    rows={3}
                    value={basicInfo.address || ''}
                    onChange={e => {
                      setBasicInfo({ ...basicInfo, address: e.target.value });
                      setHasChanges(true);
                    }}
                    disabled={hasPendingBranchUpdate}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">WhatsApp</label>
                    <input
                      type="text"
                      value={basicInfo.whatsapp || ''}
                      onChange={e => {
                        setBasicInfo({ ...basicInfo, whatsapp: e.target.value });
                        setHasChanges(true);
                      }}
                      disabled={hasPendingBranchUpdate}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">E-posta</label>
                    <input
                      type="email"
                      value={basicInfo.email || ''}
                      onChange={e => {
                        setBasicInfo({ ...basicInfo, email: e.target.value });
                        setHasChanges(true);
                      }}
                      disabled={hasPendingBranchUpdate}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Enlem (Latitude)</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={basicInfo.lat || ''}
                      onChange={e => {
                        setBasicInfo({ ...basicInfo, lat: parseFloat(e.target.value) });
                        setHasChanges(true);
                      }}
                      disabled={hasPendingBranchUpdate}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase">Boylam (Longitude)</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={basicInfo.lng || ''}
                      onChange={e => {
                        setBasicInfo({ ...basicInfo, lng: parseFloat(e.target.value) });
                        setHasChanges(true);
                      }}
                      disabled={hasPendingBranchUpdate}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:border-brand-blue disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-brand-blue to-purple-600 rounded-3xl p-6 text-white">
              <Clock className="w-8 h-8 mb-4" />
              <h3 className="text-lg font-black mb-4">Çalışma Saatleri</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-90">Hafta İçi:</span>
                  <span className="font-black">08:30 - 19:30</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-90">Hafta Sonu:</span>
                  <span className="font-black">09:00 - 18:00</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 rounded-3xl p-6">
              <h3 className="text-lg font-black text-brand-dark mb-3">💡 İpuçları</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>• Değişikliklerinizi kaydetmeyi unutmayın</li>
                <li>• Görseller için önerilen boyut: 1920x1080px</li>
                <li>• Konum bilgilerini Google Maps'ten alabilirsiniz</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm relative">
          {/* Pending Overlay */}
          {hasPendingBranchUpdate && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl z-10 flex items-center justify-center">
              <div className="text-center p-8">
                <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
                <h3 className="text-2xl font-black text-brand-dark mb-2">Onay Bekleniyor</h3>
                <p className="text-slate-600">Yaptığınız değişiklikler admin onayı bekliyor.</p>
                <p className="text-sm text-slate-500 mt-2">Onaylandıktan sonra tekrar düzenleme yapabilirsiniz.</p>
              </div>
            </div>
          )}
          
          <h2 className="text-2xl font-black text-brand-dark mb-6">Şube İçeriği</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase">Şube Açıklaması</label>
              <textarea
                rows={8}
                value={contentData.description}
                onChange={e => {
                  setContentData({ ...contentData, description: e.target.value });
                  setHasChanges(true);
                }}
                disabled={hasPendingBranchUpdate}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-brand-blue resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Şubeniz hakkında detaylı bilgi yazın..."
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'teachers' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-brand-dark">Öğretmenler</h2>
            <button
              onClick={handleAddTeacher}
              className="px-6 py-3 bg-brand-blue text-white font-black rounded-xl hover:bg-brand-dark transition-all flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Öğretmen Ekle</span>
            </button>
          </div>

          {teachers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">Henüz öğretmen eklenmemiş</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.map(teacher => (
                <div key={teacher.id} className="bg-slate-50 rounded-2xl p-6 hover:shadow-lg transition-all group relative">
                  {/* Pending Badge */}
                  {teacher.isPending && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className={`px-3 py-1 rounded-full text-xs font-black flex items-center space-x-1 ${
                        teacher.pendingType === 'CREATE' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        <Clock className="w-3 h-3" />
                        <span>
                          {teacher.pendingType === 'CREATE' ? 'Ekleme Bekliyor' : 'Güncelleme Bekliyor'}
                        </span>
                      </span>
                    </div>
                  )}
                  
                  {teacher.image && (
                    <img src={teacher.image} alt={teacher.name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg" />
                  )}
                  {!teacher.image && (
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 bg-brand-blue/10 flex items-center justify-center">
                      <Users className="w-10 h-10 text-brand-blue" />
                    </div>
                  )}
                  <h3 className="text-lg font-black text-brand-dark text-center">{teacher.name}</h3>
                  <p className="text-sm text-slate-600 text-center mt-1">{teacher.subject}</p>
                  
                  {/* Action buttons - hide for pending creates */}
                  {!teacher.isPending && (
                    <div className="flex items-center justify-center space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEditTeacher(teacher)}
                        className="p-2 bg-brand-blue text-white rounded-lg hover:bg-brand-dark transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTeacher(teacher.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* Pending info */}
                  {teacher.isPending && (
                    <div className="mt-4 text-center">
                      <p className="text-xs text-slate-500 italic">Admin onayı bekleniyor</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'media' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm relative">
            {/* Pending Overlay */}
            {hasPendingBranchUpdate && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl z-10 flex items-center justify-center">
                <div className="text-center p-8">
                  <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-2xl font-black text-brand-dark mb-2">Onay Bekleniyor</h3>
                  <p className="text-slate-600">Yaptığınız değişiklikler admin onayı bekliyor.</p>
                  <p className="text-sm text-slate-500 mt-2">Onaylandıktan sonra tekrar düzenleme yapabilirsiniz.</p>
                </div>
              </div>
            )}
            
            <h2 className="text-2xl font-black text-brand-dark mb-6">Şube Görselleri</h2>
            
            <div className="space-y-6">
              {/* Logo */}
              <div className="space-y-3">
                <label className="text-sm font-black text-brand-dark">Logo</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await handleImageUpload(file);
                          setBasicInfo({ ...basicInfo, logo: url });
                          setHasChanges(true);
                          showAlert('success', '✅ Logo yüklendi! Kaydetmeyi unutmayın.');
                        } catch (error) {
                          showAlert('error', '❌ Görsel yüklenemedi');
                        }
                      }
                    }}
                    disabled={hasPendingBranchUpdate}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-blue file:text-white file:font-bold file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {basicInfo.logo && (
                    <div className="w-24 h-24 bg-slate-50 rounded-xl border-2 border-slate-200 p-2 flex items-center justify-center">
                      <img src={basicInfo.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                    </div>
                  )}
                </div>
              </div>

              {/* Kapak Görseli */}
              <div className="space-y-3">
                <label className="text-sm font-black text-brand-dark">Kapak Görseli</label>
                <div className="flex gap-4 items-end">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await handleImageUpload(file);
                          setBasicInfo({ ...basicInfo, image: url });
                          setHasChanges(true);
                          showAlert('success', '✅ Kapak görseli yüklendi! Kaydetmeyi unutmayın.');
                        } catch (error) {
                          showAlert('error', '❌ Görsel yüklenemedi');
                        }
                      }
                    }}
                    disabled={hasPendingBranchUpdate}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-blue file:text-white file:font-bold file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {basicInfo.image && (
                    <img src={basicInfo.image} alt="Kapak" className="w-40 h-24 object-cover rounded-xl border-2 border-slate-200" />
                  )}
                </div>
              </div>

              {/* Başarı Banner */}
              <div className="space-y-3">
                <label className="text-sm font-black text-brand-dark">Başarı Banner</label>
                <div className="flex gap-4 items-end">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const url = await handleImageUpload(file);
                          setBasicInfo({ ...basicInfo, successBanner: url });
                          setHasChanges(true);
                          showAlert('success', '✅ Başarı banner yüklendi! Kaydetmeyi unutmayın.');
                        } catch (error) {
                          showAlert('error', '❌ Görsel yüklenemedi');
                        }
                      }
                    }}
                    disabled={hasPendingBranchUpdate}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-blue file:text-white file:font-bold file:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {basicInfo.successBanner && (
                    <img src={basicInfo.successBanner} alt="Banner" className="w-40 h-24 object-cover rounded-xl border-2 border-slate-200" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'successes' && (
        <BranchSuccessManager branchId={user.branchId!} />
      )}

      {activeTab === 'leads' && (
        <LeadManager branchId={user.branchId!} />
      )}
    </div>
  );
};
