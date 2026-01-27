import React, { useState, useEffect } from 'react';
import { Building2, Phone, Mail, MapPin, Calendar, CheckCircle, Clock, X, Eye, Trash2 } from 'lucide-react';
import axios from 'axios';

interface FranchiseApplication {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  city?: string;
  message?: string;
  status: 'NEW' | 'CONTACTED' | 'APPROVED' | 'REJECTED';
  notes?: string;
  createdAt: string;
}

const FranchiseManager: React.FC = () => {
  const [applications, setApplications] = useState<FranchiseApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<FranchiseApplication | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('/api/franchise', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching franchise applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId: string, status: FranchiseApplication['status'], notes?: string) => {
    try {
      setUpdatingStatus(true);
      const token = localStorage.getItem('accessToken');
      await axios.patch(`/api/franchise/${applicationId}`, 
        { status, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchApplications();
      setShowDetailModal(false);
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error updating application:', error);
      alert('Durum güncellenirken hata oluştu');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!window.confirm('Bu başvuruyu silmek istediğinize emin misiniz?')) return;
    
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete(`/api/franchise/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchApplications();
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Başvuru silinirken hata oluştu');
    }
  };

  const getStatusBadge = (status: FranchiseApplication['status']) => {
    const badges = {
      NEW: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Yeni' },
      CONTACTED: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'İletişime Geçildi' },
      APPROVED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Onaylandı' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Reddedildi' }
    };
    const badge = badges[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-black ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getStatusIcon = (status: FranchiseApplication['status']) => {
    switch (status) {
      case 'NEW': return <Clock className="w-4 h-4" />;
      case 'CONTACTED': return <Phone className="w-4 h-4" />;
      case 'APPROVED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <X className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-blue mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Franchise başvuruları yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-2xl font-black text-brand-dark">Franchise Başvuru Detayı</h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedApplication(null);
                }}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">Ad Soyad</p>
                  <p className="text-lg font-bold text-brand-dark">{selectedApplication.name} {selectedApplication.surname}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">Durum</p>
                  {getStatusBadge(selectedApplication.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">Telefon</p>
                  <a href={`tel:${selectedApplication.phone}`} className="text-brand-blue font-bold hover:underline flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{selectedApplication.phone}</span>
                  </a>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">E-posta</p>
                  <a href={`mailto:${selectedApplication.email}`} className="text-brand-blue font-bold hover:underline flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>{selectedApplication.email}</span>
                  </a>
                </div>
              </div>

              {selectedApplication.city && (
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">Hedef Şehir</p>
                  <p className="text-slate-700 font-bold flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedApplication.city}</span>
                  </p>
                </div>
              )}

              <div>
                <p className="text-xs font-black text-slate-400 uppercase mb-2">Başvuru Tarihi</p>
                <p className="text-slate-700 font-medium flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selectedApplication.createdAt).toLocaleString('tr-TR')}</span>
                </p>
              </div>

              {selectedApplication.message && (
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">Mesaj</p>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-xl whitespace-pre-line">{selectedApplication.message}</p>
                </div>
              )}

              {selectedApplication.notes && (
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">Admin Notları</p>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-xl whitespace-pre-line">{selectedApplication.notes}</p>
                </div>
              )}

              <div className="border-t border-slate-200 pt-6">
                <p className="text-xs font-black text-slate-400 uppercase mb-3">Durum Güncelle</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'CONTACTED')}
                    disabled={updatingStatus || selectedApplication.status === 'CONTACTED'}
                    className="px-4 py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>İletişime Geçildi</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'APPROVED')}
                    disabled={updatingStatus || selectedApplication.status === 'APPROVED'}
                    className="px-4 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Onaylandı</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'REJECTED')}
                    disabled={updatingStatus || selectedApplication.status === 'REJECTED'}
                    className="px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Reddedildi</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'NEW')}
                    disabled={updatingStatus || selectedApplication.status === 'NEW'}
                    className="px-4 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Yeni</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-black text-brand-dark">Franchise Başvuruları</h2>
          <p className="text-slate-500 text-sm mt-1">Franchise olmak isteyen başvurular</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-bold uppercase">Toplam</p>
            <p className="text-2xl font-black text-brand-blue">{applications.length}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase">Yeni</p>
              <p className="text-2xl font-black text-blue-700">{applications.filter(a => a.status === 'NEW').length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-yellow-600 uppercase">İletişimde</p>
              <p className="text-2xl font-black text-yellow-700">{applications.filter(a => a.status === 'CONTACTED').length}</p>
            </div>
            <Phone className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-green-600 uppercase">Onaylandı</p>
              <p className="text-2xl font-black text-green-700">{applications.filter(a => a.status === 'APPROVED').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-red-600 uppercase">Reddedildi</p>
              <p className="text-2xl font-black text-red-700">{applications.filter(a => a.status === 'REJECTED').length}</p>
            </div>
            <X className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Henüz franchise başvurusu yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map(application => (
            <div
              key={application.id}
              className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                  <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center shrink-0">
                    {getStatusIcon(application.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-brand-dark truncate">{application.name} {application.surname}</h3>
                      {getStatusBadge(application.status)}
                      {application.city && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-black flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{application.city}</span>
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600">
                      <span className="flex items-center space-x-1 whitespace-nowrap">
                        <Phone className="w-3 h-3" />
                        <span>{application.phone}</span>
                      </span>
                      <span className="flex items-center space-x-1 truncate max-w-[200px]">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{application.email}</span>
                      </span>
                      <span className="flex items-center space-x-1 whitespace-nowrap">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(application.createdAt).toLocaleDateString('tr-TR')}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 shrink-0 self-end md:self-auto">
                  <button
                    onClick={() => {
                      setSelectedApplication(application);
                      setShowDetailModal(true);
                    }}
                    className="px-4 py-2 bg-brand-blue text-white font-bold rounded-lg hover:bg-brand-dark transition-all flex items-center space-x-2"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Detay</span>
                  </button>
                  <button
                    onClick={() => handleDelete(application.id)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FranchiseManager;
