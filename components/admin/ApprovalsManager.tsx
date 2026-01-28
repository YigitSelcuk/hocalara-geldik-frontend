import React, { useState, useEffect } from 'react';
import { Check, X, Clock, Eye, User, Building2, Users as UsersIcon } from 'lucide-react';
import axios from 'axios';
import Alert from '../Alert';
import { useAlert } from '../../hooks/useAlert';
import { API_BASE_URL } from '../../services/api';

const API_URL = API_BASE_URL || '/api';

interface ChangeRequest {
  id: string;
  changeType: string;
  status: string;
  branchId: string;
  entityId?: string;
  entityType?: string;
  oldData?: any;
  newData: any;
  reviewNote?: string;
  createdAt: string;
  reviewedAt?: string;
  requester: {
    id: string;
    name: string;
    email: string;
  };
  reviewer?: {
    id: string;
    name: string;
    email: string;
  };
  branch: {
    id: string;
    name: string;
  };
}

export const ApprovalsManager: React.FC = () => {
  const [requests, setRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');
  const [selectedRequest, setSelectedRequest] = useState<ChangeRequest | null>(null);
  const [reviewNote, setReviewNote] = useState('');
  const [processing, setProcessing] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ type: 'approve' | 'reject'; id: string } | null>(null);
  const { alert, showAlert, hideAlert } = useAlert();

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const url = filter === 'ALL'
        ? `${API_URL}/change-requests`
        : `${API_URL}/change-requests?status=${filter}`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRequests(response.data.data || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `${API_URL}/change-requests/${requestId}/approve`,
        { reviewNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert('success', 'Değişiklik onaylandı ve uygulandı!');
      setSelectedRequest(null);
      setReviewNote('');
      setConfirmAction(null);
      fetchRequests();
    } catch (error) {
      console.error('Error approving request:', error);
      showAlert('error', 'Onaylama işlemi başarısız oldu.');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('accessToken');
      await axios.post(
        `${API_URL}/change-requests/${requestId}/reject`,
        { reviewNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showAlert('success', 'Değişiklik reddedildi.');
      setSelectedRequest(null);
      setReviewNote('');
      setConfirmAction(null);
      fetchRequests();
    } catch (error) {
      console.error('Error rejecting request:', error);
      showAlert('error', 'Reddetme işlemi başarısız oldu.');
    } finally {
      setProcessing(false);
    }
  };

  const getChangeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      TEACHER_CREATE: '👨‍🏫 Yeni Öğretmen Ekleme',
      TEACHER_UPDATE: '✏️ Öğretmen Güncelleme',
      TEACHER_DELETE: '🗑️ Öğretmen Silme',
      BRANCH_UPDATE: '🏢 Şube Bilgisi Güncelleme',
      PACKAGE_CREATE: '📦 Yeni Paket Ekleme',
      PACKAGE_UPDATE: '✏️ Paket Güncelleme',
      PACKAGE_DELETE: '🗑️ Paket Silme',
      BLOG_CREATE: '📰 Yeni Haber Ekleme',
      BLOG_UPDATE: '✏️ Haber Güncelleme',
      BLOG_DELETE: '🗑️ Haber Silme',
      SUCCESS_CREATE: '🏆 Yeni Başarı Ekleme',
      SUCCESS_UPDATE: '✏️ Başarı Güncelleme',
      SUCCESS_DELETE: '🗑️ Başarı Silme',
      STUDENT_CREATE: '👨‍🎓 Yeni Öğrenci Ekleme',
      STUDENT_DELETE: '🗑️ Öğrenci Silme',
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Bekliyor' },
      APPROVED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Onaylandı' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Reddedildi' },
    };
    const badge = badges[status] || badges.PENDING;
    return (
      <span className={`px-3 py-1 ${badge.bg} ${badge.text} text-xs font-bold rounded-full`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={hideAlert}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-brand-dark">Onay Bekleyen Değişiklikler</h1>
          <p className="text-slate-500 mt-1">Şube yöneticilerinin yaptığı değişiklikleri inceleyin</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-2 shadow-sm">
        <div className="flex space-x-2">
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${filter === status
                  ? 'bg-brand-blue text-white shadow-lg'
                  : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
              {status === 'PENDING' && '⏳ Bekleyenler'}
              {status === 'APPROVED' && '✅ Onaylananlar'}
              {status === 'REJECTED' && '❌ Reddedilenler'}
              {status === 'ALL' && '📋 Tümü'}
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-blue mx-auto"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
          <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Gösterilecek talep yok</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((request) => (
            <div key={request.id} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h3 className="text-lg font-black text-brand-dark">
                      {getChangeTypeLabel(request.changeType)}
                    </h3>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Building2 className="w-4 h-4" />
                      <span>{request.branch.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <User className="w-4 h-4" />
                      <span>{request.requester.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-slate-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(request.createdAt).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {request.reviewer && (
                      <div className="flex items-center space-x-2 text-slate-600">
                        <UsersIcon className="w-4 h-4" />
                        <span>İnceleyen: {request.reviewer.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all"
                  >
                    <Eye className="w-5 h-5" />
                  </button>

                  {request.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setConfirmAction({ type: 'approve', id: request.id });
                          setReviewNote('');
                        }}
                        className="px-4 py-2 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all flex items-center space-x-2"
                      >
                        <Check className="w-4 h-4" />
                        <span>Onayla</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setConfirmAction({ type: 'reject', id: request.id });
                          setReviewNote('');
                        }}
                        className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all flex items-center space-x-2"
                      >
                        <X className="w-4 h-4" />
                        <span>Reddet</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-2xl font-black text-brand-dark">
                {getChangeTypeLabel(selectedRequest.changeType)}
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {/* Request Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-1">Şube</p>
                  <p className="text-sm font-bold text-brand-dark">{selectedRequest.branch.name}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-1">Talep Eden</p>
                  <p className="text-sm font-bold text-brand-dark">{selectedRequest.requester.name}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-1">Tarih</p>
                  <p className="text-sm font-bold text-brand-dark">
                    {new Date(selectedRequest.createdAt).toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-1">Durum</p>
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </div>

              {/* Changes Comparison */}
              <div className="bg-slate-50 rounded-2xl p-6">
                <h4 className="text-lg font-black text-brand-dark mb-4">Değişiklikler</h4>

                {selectedRequest.changeType === 'TEACHER_CREATE' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Öğretmen Adı</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.name || ''}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Branş</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.subject || ''}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                    </div>
                    {selectedRequest.newData.image && (
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Fotoğraf</label>
                        <img src={selectedRequest.newData.image?.startsWith('http') ? selectedRequest.newData.image : (selectedRequest.newData.image?.startsWith('/assets') ? selectedRequest.newData.image : `${API_BASE_URL}${selectedRequest.newData.image}`)} alt="Teacher" className="w-32 h-32 rounded-full object-cover border-4 border-green-200" />
                      </div>
                    )}
                  </div>
                )}

                {selectedRequest.changeType === 'TEACHER_UPDATE' && (
                  <div className="space-y-4">
                    {Object.keys(selectedRequest.newData).map((key) => {
                      if (key === 'branchId' || key === 'id') return null;
                      const oldValue = selectedRequest.oldData?.[key];
                      const newValue = selectedRequest.newData[key];
                      const hasChanged = oldValue !== newValue;

                      if (!hasChanged) return null;

                      return (
                        <div key={key} className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-black text-slate-400 uppercase mb-2 block">
                              {key === 'name' ? 'Öğretmen Adı' : key === 'subject' ? 'Branş' : key === 'image' ? 'Fotoğraf' : key} (Eski)
                            </label>
                            {key === 'image' && oldValue ? (
                              <img src={oldValue?.startsWith('http') ? oldValue : (oldValue?.startsWith('/assets') ? oldValue : `${API_BASE_URL}${oldValue}`)} alt="Old" className="w-24 h-24 rounded-full object-cover border-2 border-red-200" />
                            ) : (
                              <input
                                type="text"
                                value={oldValue || '-'}
                                readOnly
                                className="w-full px-4 py-3 bg-white border-2 border-red-200 rounded-xl font-bold text-slate-600 line-through"
                              />
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-black text-slate-400 uppercase mb-2 block">
                              {key === 'name' ? 'Öğretmen Adı' : key === 'subject' ? 'Branş' : key === 'image' ? 'Fotoğraf' : key} (Yeni)
                            </label>
                            {key === 'image' && newValue ? (
                              <img src={newValue?.startsWith('http') ? newValue : (newValue?.startsWith('/assets') ? newValue : `${API_BASE_URL}${newValue}`)} alt="New" className="w-24 h-24 rounded-full object-cover border-2 border-green-200" />
                            ) : (
                              <input
                                type="text"
                                value={newValue || '-'}
                                readOnly
                                className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedRequest.changeType === 'TEACHER_DELETE' && selectedRequest.oldData && (
                  <div className="space-y-4">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                      <p className="text-sm font-bold text-red-700 mb-3">⚠️ Bu öğretmen silinecek:</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Öğretmen Adı</label>
                          <input
                            type="text"
                            value={selectedRequest.oldData.name || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-bold text-red-700"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Branş</label>
                          <input
                            type="text"
                            value={selectedRequest.oldData.subject || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-bold text-red-700"
                          />
                        </div>
                      </div>
                      {selectedRequest.oldData.image && (
                        <div className="mt-4">
                          <img src={selectedRequest.oldData.image?.startsWith('http') ? selectedRequest.oldData.image : (selectedRequest.oldData.image?.startsWith('/assets') ? selectedRequest.oldData.image : `${API_BASE_URL}${selectedRequest.oldData.image}`)} alt="Teacher" className="w-24 h-24 rounded-full object-cover border-4 border-red-300" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedRequest.changeType === 'BRANCH_UPDATE' && (
                  <div className="space-y-4">
                    {Object.keys(selectedRequest.newData).map((key) => {
                      if (key === 'id' || key === 'slug' || key === 'createdAt' || key === 'updatedAt') return null;
                      const oldValue = selectedRequest.oldData?.[key];
                      const newValue = selectedRequest.newData[key];
                      const hasChanged = oldValue !== newValue;

                      if (!hasChanged) return null;

                      const fieldLabels: Record<string, string> = {
                        name: 'Şube Adı',
                        description: 'Açıklama',
                        address: 'Adres',
                        phone: 'Telefon',
                        whatsapp: 'WhatsApp',
                        email: 'E-posta',
                        weekdayHours: 'Hafta İçi Çalışma Saatleri',
                        weekendHours: 'Hafta Sonu Çalışma Saatleri',
                        features: 'Şube Özellikleri',
                        lat: 'Enlem',
                        lng: 'Boylam',
                        image: 'Kapak Görseli',
                        logo: 'Logo',
                        successBanner: 'Başarı Banner',
                        customBanner: 'Özel Banner',
                        primaryColor: 'Ana Renk',
                      };

                      const isImage = ['image', 'logo', 'successBanner', 'customBanner'].includes(key);
                      const isFeatures = key === 'features';

                      return (
                        <div key={key} className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-black text-slate-400 uppercase mb-2 block">
                              {fieldLabels[key] || key} (Eski)
                            </label>
                            {isImage && oldValue ? (
                              <img src={oldValue?.startsWith('http') ? oldValue : (oldValue?.startsWith('/assets') ? oldValue : `${API_BASE_URL}${oldValue}`)} alt="Old" className="w-full h-32 object-cover rounded-xl border-2 border-red-200" />
                            ) : isFeatures && Array.isArray(oldValue) ? (
                              <div className="space-y-2">
                                {oldValue.map((feature: any, idx: number) => (
                                  <div key={idx} className="flex items-center space-x-2 p-2 bg-white border-2 border-red-200 rounded-lg">
                                    <span className="text-slate-600 line-through text-sm">{feature.text}</span>
                                  </div>
                                ))}
                                {oldValue.length === 0 && <p className="text-slate-400 text-sm italic">Özellik yok</p>}
                              </div>
                            ) : key === 'description' ? (
                              <textarea
                                value={oldValue || '-'}
                                readOnly
                                rows={3}
                                className="w-full px-4 py-3 bg-white border-2 border-red-200 rounded-xl font-medium text-slate-600 line-through resize-none"
                              />
                            ) : (
                              <input
                                type="text"
                                value={oldValue || '-'}
                                readOnly
                                className="w-full px-4 py-3 bg-white border-2 border-red-200 rounded-xl font-bold text-slate-600 line-through"
                              />
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-black text-slate-400 uppercase mb-2 block">
                              {fieldLabels[key] || key} (Yeni)
                            </label>
                            {isImage && newValue ? (
                              <img src={newValue?.startsWith('http') ? newValue : (newValue?.startsWith('/assets') ? newValue : `${API_BASE_URL}${newValue}`)} alt="New" className="w-full h-32 object-cover rounded-xl border-2 border-green-200" />
                            ) : isFeatures && Array.isArray(newValue) ? (
                              <div className="space-y-2">
                                {newValue.map((feature: any, idx: number) => (
                                  <div key={idx} className="flex items-center space-x-2 p-2 bg-white border-2 border-green-200 rounded-lg">
                                    <span className="text-brand-dark font-medium text-sm">{feature.text}</span>
                                  </div>
                                ))}
                                {newValue.length === 0 && <p className="text-slate-400 text-sm italic">Özellik yok</p>}
                              </div>
                            ) : key === 'description' ? (
                              <textarea
                                value={newValue || '-'}
                                readOnly
                                rows={3}
                                className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-medium text-brand-dark resize-none"
                              />
                            ) : (
                              <input
                                type="text"
                                value={newValue || '-'}
                                readOnly
                                className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedRequest.changeType === 'PACKAGE_CREATE' && (
                  <div className="space-y-4">
                    {selectedRequest.newData.image && (
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Paket Görseli</label>
                        <img
                          src={selectedRequest.newData.image?.startsWith('http') ? selectedRequest.newData.image : (selectedRequest.newData.image?.startsWith('/assets') ? selectedRequest.newData.image : `${API_BASE_URL}${selectedRequest.newData.image}`)}
                          alt="Package"
                          className="w-full max-w-md h-64 object-cover rounded-xl border-2 border-green-200"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Paket Adı</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.name || ''}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Paket Tipi</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.type || ''}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Kısa Açıklama</label>
                      <input
                        type="text"
                        value={selectedRequest.newData.shortDescription || ''}
                        readOnly
                        className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                      />
                    </div>
                    {selectedRequest.newData.description && (
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Detaylı Açıklama</label>
                        <textarea
                          value={selectedRequest.newData.description}
                          readOnly
                          rows={3}
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-medium text-brand-dark resize-none"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      {selectedRequest.newData.price !== undefined && selectedRequest.newData.price !== null && (
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Fiyat</label>
                          <input
                            type="text"
                            value={`${selectedRequest.newData.price}₺`}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                          />
                        </div>
                      )}
                      {selectedRequest.newData.originalPrice !== undefined && selectedRequest.newData.originalPrice !== null && (
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Orijinal Fiyat</label>
                          <input
                            type="text"
                            value={`${selectedRequest.newData.originalPrice}₺`}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                          />
                        </div>
                      )}
                      {selectedRequest.newData.discount !== undefined && selectedRequest.newData.discount !== null && (
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">İndirim Oranı</label>
                          <input
                            type="text"
                            value={`%${selectedRequest.newData.discount}`}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                          />
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedRequest.newData.videoCount !== undefined && selectedRequest.newData.videoCount !== null && (
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Video Sayısı</label>
                          <input
                            type="text"
                            value={selectedRequest.newData.videoCount}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                          />
                        </div>
                      )}
                      {selectedRequest.newData.subjectCount !== undefined && selectedRequest.newData.subjectCount !== null && (
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Ders Sayısı</label>
                          <input
                            type="text"
                            value={selectedRequest.newData.subjectCount}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                          />
                        </div>
                      )}
                      {selectedRequest.newData.duration && (
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Süre</label>
                          <input
                            type="text"
                            value={selectedRequest.newData.duration}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                          />
                        </div>
                      )}
                    </div>
                    {selectedRequest.newData.features && Array.isArray(selectedRequest.newData.features) && selectedRequest.newData.features.length > 0 && (
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Özellikler</label>
                        <div className="space-y-2">
                          {selectedRequest.newData.features.map((feature: string, idx: number) => (
                            <div key={idx} className="flex items-center space-x-2 p-3 bg-white border-2 border-green-200 rounded-lg">
                              <span className="text-brand-dark font-medium text-sm">✓ {feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Popüler</label>
                        <div className={`px-4 py-3 rounded-xl font-bold text-center ${selectedRequest.newData.isPopular ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {selectedRequest.newData.isPopular ? '✓ Evet' : '✗ Hayır'}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Yeni</label>
                        <div className={`px-4 py-3 rounded-xl font-bold text-center ${selectedRequest.newData.isNew ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {selectedRequest.newData.isNew ? '✓ Evet' : '✗ Hayır'}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Aktif</label>
                        <div className={`px-4 py-3 rounded-xl font-bold text-center ${selectedRequest.newData.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {selectedRequest.newData.isActive !== false ? '✓ Evet' : '✗ Hayır'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRequest.changeType === 'PACKAGE_UPDATE' && (
                  <div className="space-y-4">
                    {Object.keys(selectedRequest.newData).map((key) => {
                      if (key === 'branchId' || key === 'id' || key === 'createdAt' || key === 'updatedAt' || key === 'slug') return null;
                      const oldValue = selectedRequest.oldData?.[key];
                      const newValue = selectedRequest.newData[key];

                      // Check if values are different
                      const hasChanged = JSON.stringify(oldValue) !== JSON.stringify(newValue);
                      if (!hasChanged) return null;

                      const fieldLabels: Record<string, string> = {
                        name: 'Paket Adı',
                        type: 'Tür',
                        shortDescription: 'Kısa Açıklama',
                        description: 'Detaylı Açıklama',
                        price: 'Fiyat',
                        originalPrice: 'Orijinal Fiyat',
                        discount: 'İndirim Oranı',
                        image: 'Paket Görseli',
                        videoCount: 'Video Sayısı',
                        subjectCount: 'Ders Sayısı',
                        duration: 'Süre',
                        features: 'Özellikler',
                        isPopular: 'Popüler',
                        isNew: 'Yeni',
                        isActive: 'Aktif',
                      };

                      const isImage = key === 'image';
                      const isFeatures = key === 'features';
                      const isBoolean = ['isPopular', 'isNew', 'isActive'].includes(key);

                      return (
                        <div key={key} className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-black text-slate-400 uppercase mb-2 block">
                              {fieldLabels[key] || key} (Eski)
                            </label>
                            {isImage && oldValue ? (
                              <img src={oldValue?.startsWith('http') ? oldValue : (oldValue?.startsWith('/assets') ? oldValue : `${API_BASE_URL}${oldValue}`)} alt="Old" className="w-full h-32 object-cover rounded-xl border-2 border-red-200" />
                            ) : isFeatures && Array.isArray(oldValue) ? (
                              <div className="space-y-2">
                                {oldValue.map((feature: string, idx: number) => (
                                  <div key={idx} className="p-2 bg-white border-2 border-red-200 rounded-lg">
                                    <span className="text-slate-600 line-through text-sm">✓ {feature}</span>
                                  </div>
                                ))}
                                {oldValue.length === 0 && <p className="text-slate-400 text-sm italic">Özellik yok</p>}
                              </div>
                            ) : isBoolean ? (
                              <div className={`px-4 py-3 rounded-xl font-bold text-center border-2 border-red-200 ${oldValue ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-500'}`}>
                                {oldValue ? '✓ Evet' : '✗ Hayır'}
                              </div>
                            ) : ['description', 'shortDescription'].includes(key) ? (
                              <textarea
                                value={oldValue || '-'}
                                readOnly
                                rows={3}
                                className="w-full px-4 py-3 bg-white border-2 border-red-200 rounded-xl font-medium text-slate-600 line-through resize-none"
                              />
                            ) : (
                              <input
                                type="text"
                                value={key === 'price' || key === 'originalPrice' ? `${oldValue}₺` : key === 'discount' ? `%${oldValue}` : oldValue || '-'}
                                readOnly
                                className="w-full px-4 py-3 bg-white border-2 border-red-200 rounded-xl font-bold text-slate-600 line-through"
                              />
                            )}
                          </div>
                          <div>
                            <label className="text-xs font-black text-slate-400 uppercase mb-2 block">
                              {fieldLabels[key] || key} (Yeni)
                            </label>
                            {isImage && newValue ? (
                              <img src={newValue?.startsWith('http') ? newValue : (newValue?.startsWith('/assets') ? newValue : `${API_BASE_URL}${newValue}`)} alt="New" className="w-full h-32 object-cover rounded-xl border-2 border-green-200" />
                            ) : isFeatures && Array.isArray(newValue) ? (
                              <div className="space-y-2">
                                {newValue.map((feature: string, idx: number) => (
                                  <div key={idx} className="p-2 bg-white border-2 border-green-200 rounded-lg">
                                    <span className="text-brand-dark font-medium text-sm">✓ {feature}</span>
                                  </div>
                                ))}
                                {newValue.length === 0 && <p className="text-slate-400 text-sm italic">Özellik yok</p>}
                              </div>
                            ) : isBoolean ? (
                              <div className={`px-4 py-3 rounded-xl font-bold text-center border-2 border-green-200 ${newValue ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-500'}`}>
                                {newValue ? '✓ Evet' : '✗ Hayır'}
                              </div>
                            ) : ['description', 'shortDescription'].includes(key) ? (
                              <textarea
                                value={newValue || '-'}
                                readOnly
                                rows={3}
                                className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-medium text-brand-dark resize-none"
                              />
                            ) : (
                              <input
                                type="text"
                                value={key === 'price' || key === 'originalPrice' ? `${newValue}₺` : key === 'discount' ? `%${newValue}` : newValue || '-'}
                                readOnly
                                className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedRequest.changeType === 'PACKAGE_DELETE' && selectedRequest.oldData && (
                  <div className="space-y-4">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                      <p className="text-sm font-bold text-red-700 mb-3">⚠️ Bu paket silinecek:</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Paket Adı</label>
                          <input
                            type="text"
                            value={selectedRequest.oldData.name || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-bold text-red-700"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Paket Tipi</label>
                          <input
                            type="text"
                            value={selectedRequest.oldData.type || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-bold text-red-700"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Kısa Açıklama</label>
                        <input
                          type="text"
                          value={selectedRequest.oldData.shortDescription || ''}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-bold text-red-700"
                        />
                      </div>
                      {selectedRequest.oldData.price && (
                        <div className="mt-4">
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Fiyat</label>
                          <input
                            type="text"
                            value={`${selectedRequest.oldData.price}₺`}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-bold text-red-700"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* BLOG POST DISPLAYS */}
                {selectedRequest.changeType === 'BLOG_CREATE' && (
                  <div className="space-y-4">
                    {selectedRequest.newData.image && (
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Haber Görseli</label>
                        <img
                          src={selectedRequest.newData.image?.startsWith('http') ? selectedRequest.newData.image : (selectedRequest.newData.image?.startsWith('/assets') ? selectedRequest.newData.image : `${API_BASE_URL}${selectedRequest.newData.image}`)}
                          alt="News"
                          className="w-full max-w-md h-64 object-cover rounded-xl border-2 border-green-200"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Başlık</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.title || ''}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Kategori</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.category || ''}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Özet</label>
                      <textarea
                        value={selectedRequest.newData.excerpt || ''}
                        readOnly
                        rows={2}
                        className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-medium text-brand-dark resize-none"
                      />
                    </div>
                    {selectedRequest.newData.content && (
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">İçerik</label>
                        <textarea
                          value={selectedRequest.newData.content}
                          readOnly
                          rows={6}
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-medium text-brand-dark resize-none"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      {selectedRequest.newData.author && (
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Yazar</label>
                          <input
                            type="text"
                            value={selectedRequest.newData.author}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                          />
                        </div>
                      )}
                      {selectedRequest.newData.date && (
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Tarih</label>
                          <input
                            type="text"
                            value={selectedRequest.newData.date}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                          />
                        </div>
                      )}
                      {selectedRequest.newData.readTime && (
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Okuma Süresi</label>
                          <input
                            type="text"
                            value={selectedRequest.newData.readTime}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                          />
                        </div>
                      )}
                    </div>

                    {/* SEO Section */}
                    {(selectedRequest.newData.seoTitle || selectedRequest.newData.seoDescription || selectedRequest.newData.seoKeywords) && (
                      <div className="border-t border-slate-200 pt-4 mt-4">
                        <h4 className="text-sm font-black text-slate-600 mb-3">SEO Bilgileri</h4>
                        <div className="space-y-3">
                          {selectedRequest.newData.seoTitle && (
                            <div>
                              <label className="text-xs font-black text-slate-400 uppercase mb-2 block">SEO Başlık</label>
                              <input
                                type="text"
                                value={selectedRequest.newData.seoTitle}
                                readOnly
                                className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                              />
                            </div>
                          )}
                          {selectedRequest.newData.seoDescription && (
                            <div>
                              <label className="text-xs font-black text-slate-400 uppercase mb-2 block">SEO Açıklama</label>
                              <textarea
                                value={selectedRequest.newData.seoDescription}
                                readOnly
                                rows={2}
                                className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-medium text-brand-dark resize-none"
                              />
                            </div>
                          )}
                          {selectedRequest.newData.seoKeywords && (
                            <div>
                              <label className="text-xs font-black text-slate-400 uppercase mb-2 block">SEO Anahtar Kelimeler</label>
                              <input
                                type="text"
                                value={selectedRequest.newData.seoKeywords}
                                readOnly
                                className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status Badges */}
                    <div className="flex items-center gap-3 pt-2">
                      {selectedRequest.newData.isFeatured && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                          ⭐ Öne Çıkan
                        </span>
                      )}
                      {selectedRequest.newData.isActive !== false && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                          ✓ Aktif
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {selectedRequest.changeType === 'BLOG_UPDATE' && (
                  <div className="space-y-4">
                    {Object.keys(selectedRequest.newData).map((key) => {
                      if (key === 'branchId' || key === 'id' || key === 'createdAt' || key === 'updatedAt') return null;
                      const oldValue = selectedRequest.oldData?.[key];
                      const newValue = selectedRequest.newData[key];
                      const hasChanged = oldValue !== newValue;

                      if (!hasChanged) return null;

                      const fieldLabels: Record<string, string> = {
                        title: 'Başlık',
                        slug: 'URL Slug',
                        excerpt: 'Özet',
                        content: 'İçerik',
                        category: 'Kategori',
                        author: 'Yazar',
                        date: 'Tarih',
                        readTime: 'Okuma Süresi',
                        image: 'Görsel',
                        isActive: 'Aktif',
                        isFeatured: 'Öne Çıkan',
                        seoTitle: 'SEO Başlık',
                        seoDescription: 'SEO Açıklama',
                        seoKeywords: 'SEO Anahtar Kelimeler',
                      };

                      const isImage = key === 'image';
                      const isTextarea = ['excerpt', 'content', 'seoDescription'].includes(key);
                      const isBoolean = ['isActive', 'isFeatured'].includes(key);

                      return (
                        <div key={key} className={isImage ? 'col-span-2' : 'grid grid-cols-2 gap-4'}>
                          {isImage ? (
                            <div className="space-y-2">
                              <label className="text-xs font-black text-slate-400 uppercase mb-2 block">
                                {fieldLabels[key] || key}
                              </label>
                              <div className="grid grid-cols-2 gap-4">
                                {oldValue && (
                                  <div>
                                    <p className="text-xs text-slate-500 mb-2">Eski</p>
                                    <img src={oldValue} alt="Old" className="w-full h-48 object-cover rounded-xl border-2 border-red-200" />
                                  </div>
                                )}
                                {newValue && (
                                  <div>
                                    <p className="text-xs text-slate-500 mb-2">Yeni</p>
                                    <img src={newValue} alt="New" className="w-full h-48 object-cover rounded-xl border-2 border-green-200" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div>
                                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">
                                  {fieldLabels[key] || key} (Eski)
                                </label>
                                {isTextarea ? (
                                  <textarea
                                    value={oldValue || '-'}
                                    readOnly
                                    rows={key === 'content' ? 6 : 2}
                                    className="w-full px-4 py-3 bg-white border-2 border-red-200 rounded-xl font-medium text-slate-600 line-through resize-none"
                                  />
                                ) : isBoolean ? (
                                  <div className="w-full px-4 py-3 bg-white border-2 border-red-200 rounded-xl font-bold text-slate-600 line-through">
                                    {oldValue ? '✓ Evet' : '✗ Hayır'}
                                  </div>
                                ) : (
                                  <input
                                    type="text"
                                    value={oldValue || '-'}
                                    readOnly
                                    className="w-full px-4 py-3 bg-white border-2 border-red-200 rounded-xl font-bold text-slate-600 line-through"
                                  />
                                )}
                              </div>
                              <div>
                                <label className="text-xs font-black text-slate-400 uppercase mb-2 block">
                                  {fieldLabels[key] || key} (Yeni)
                                </label>
                                {isTextarea ? (
                                  <textarea
                                    value={newValue || '-'}
                                    readOnly
                                    rows={key === 'content' ? 6 : 2}
                                    className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-medium text-brand-dark resize-none"
                                  />
                                ) : isBoolean ? (
                                  <div className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark">
                                    {newValue ? '✓ Evet' : '✗ Hayır'}
                                  </div>
                                ) : (
                                  <input
                                    type="text"
                                    value={newValue || '-'}
                                    readOnly
                                    className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                                  />
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedRequest.changeType === 'BLOG_DELETE' && selectedRequest.oldData && (
                  <div className="space-y-4">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                      <p className="text-sm font-bold text-red-700 mb-3">⚠️ Bu haber silinecek:</p>
                      {selectedRequest.oldData.image && (
                        <div className="mb-4">
                          <img src={selectedRequest.oldData.image} alt="News" className="w-full h-48 object-cover rounded-xl border-2 border-red-300" />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Başlık</label>
                          <input
                            type="text"
                            value={selectedRequest.oldData.title || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-bold text-red-700"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Kategori</label>
                          <input
                            type="text"
                            value={selectedRequest.oldData.category || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-bold text-red-700"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Özet</label>
                        <textarea
                          value={selectedRequest.oldData.excerpt || ''}
                          readOnly
                          rows={2}
                          className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-medium text-red-700 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* YEARLY SUCCESS DISPLAYS */}
                {selectedRequest.changeType === 'SUCCESS_CREATE' && (
                  <div className="space-y-4">
                    {selectedRequest.newData.banner?.image && (
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Banner Görseli</label>
                        <img
                          src={selectedRequest.newData.banner.image}
                          alt="Success Banner"
                          className="w-full max-w-md h-64 object-cover rounded-xl border-2 border-green-200"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Yıl</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.year || ''}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Toplam Derece</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.totalDegrees || '0'}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                    </div>
                    {selectedRequest.newData.banner && (
                      <>
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Banner Başlık</label>
                          <input
                            type="text"
                            value={selectedRequest.newData.banner.title || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Banner Alt Başlık</label>
                          <input
                            type="text"
                            value={selectedRequest.newData.banner.subtitle || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                          />
                        </div>
                      </>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Yerleşen Sayısı</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.placementCount || '0'}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Başarı Oranı</label>
                        <input
                          type="text"
                          value={`%${selectedRequest.newData.successRate || '0'}`}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">İl Sayısı</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.cityCount || '0'}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">İlk 100</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.top100Count || '0'}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">İlk 1000</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.top1000Count || '0'}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">YKS Ortalaması</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.yksAverage || '0'}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">LGS Ortalaması</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.lgsAverage || '0'}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedRequest.changeType === 'SUCCESS_UPDATE' && (
                  <div className="space-y-4">
                    {Object.keys(selectedRequest.newData).map((key) => {
                      if (key === 'branchId' || key === 'id' || key === 'createdAt' || key === 'updatedAt' || key === 'students') return null;
                      const oldValue = selectedRequest.oldData?.[key];
                      const newValue = selectedRequest.newData[key];

                      // Handle banner object
                      if (key === 'banner') {
                        const oldBanner = oldValue;
                        const newBanner = newValue;
                        if (!oldBanner && !newBanner) return null;

                        return (
                          <div key={key} className="space-y-4 border-t pt-4">
                            <h5 className="font-black text-brand-dark">Banner Değişiklikleri</h5>
                            {newBanner?.image && (
                              <div className="grid grid-cols-2 gap-4">
                                {oldBanner?.image && (
                                  <div>
                                    <p className="text-xs text-slate-500 mb-2">Eski Banner</p>
                                    <img src={oldBanner.image} alt="Old" className="w-full h-32 object-cover rounded-xl border-2 border-red-200" />
                                  </div>
                                )}
                                <div>
                                  <p className="text-xs text-slate-500 mb-2">Yeni Banner</p>
                                  <img src={newBanner.image} alt="New" className="w-full h-32 object-cover rounded-xl border-2 border-green-200" />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      }

                      const hasChanged = JSON.stringify(oldValue) !== JSON.stringify(newValue);
                      if (!hasChanged) return null;

                      const fieldLabels: Record<string, string> = {
                        year: 'Yıl',
                        totalDegrees: 'Toplam Derece',
                        placementCount: 'Yerleşen Sayısı',
                        successRate: 'Başarı Oranı',
                        cityCount: 'İl Sayısı',
                        top100Count: 'İlk 100',
                        top1000Count: 'İlk 1000',
                        yksAverage: 'YKS Ortalaması',
                        lgsAverage: 'LGS Ortalaması',
                      };

                      return (
                        <div key={key} className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-black text-slate-400 uppercase mb-2 block">
                              {fieldLabels[key] || key} (Eski)
                            </label>
                            <input
                              type="text"
                              value={oldValue || '-'}
                              readOnly
                              className="w-full px-4 py-3 bg-white border-2 border-red-200 rounded-xl font-bold text-slate-600 line-through"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-black text-slate-400 uppercase mb-2 block">
                              {fieldLabels[key] || key} (Yeni)
                            </label>
                            <input
                              type="text"
                              value={newValue || '-'}
                              readOnly
                              className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {selectedRequest.changeType === 'SUCCESS_DELETE' && selectedRequest.oldData && (
                  <div className="space-y-4">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                      <p className="text-sm font-bold text-red-700 mb-3">⚠️ Bu başarı silinecek:</p>
                      {selectedRequest.oldData.banner?.image && (
                        <div className="mb-4">
                          <img src={selectedRequest.oldData.banner.image} alt="Success" className="w-full h-48 object-cover rounded-xl border-2 border-red-300" />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Yıl</label>
                          <input
                            type="text"
                            value={selectedRequest.oldData.year || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-bold text-red-700"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Toplam Derece</label>
                          <input
                            type="text"
                            value={selectedRequest.oldData.totalDegrees || '0'}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-bold text-red-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STUDENT DISPLAYS */}
                {selectedRequest.changeType === 'STUDENT_CREATE' && (
                  <div className="space-y-4">
                    {selectedRequest.newData.image && (
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Öğrenci Fotoğrafı</label>
                        <img
                          src={selectedRequest.newData.image}
                          alt="Student"
                          className="w-32 h-32 rounded-full object-cover border-2 border-green-200"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Öğrenci Adı</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.name || ''}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Sınav</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.exam || ''}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Sıralama</label>
                        <input
                          type="text"
                          value={selectedRequest.newData.rank || ''}
                          readOnly
                          className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                        />
                      </div>
                      {selectedRequest.newData.score && (
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Puan</label>
                          <input
                            type="text"
                            value={selectedRequest.newData.score}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                          />
                        </div>
                      )}
                      {selectedRequest.newData.university && (
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Üniversite</label>
                          <input
                            type="text"
                            value={selectedRequest.newData.university}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                          />
                        </div>
                      )}
                      {selectedRequest.newData.branch && (
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Bölüm</label>
                          <input
                            type="text"
                            value={selectedRequest.newData.branch}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-green-200 rounded-xl font-bold text-brand-dark"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {selectedRequest.changeType === 'STUDENT_DELETE' && selectedRequest.oldData && (
                  <div className="space-y-4">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                      <p className="text-sm font-bold text-red-700 mb-3">⚠️ Bu öğrenci silinecek:</p>
                      {selectedRequest.oldData.image && (
                        <div className="mb-4">
                          <img src={selectedRequest.oldData.image} alt="Student" className="w-32 h-32 rounded-full object-cover border-2 border-red-300 mx-auto" />
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Öğrenci Adı</label>
                          <input
                            type="text"
                            value={selectedRequest.oldData.name || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-bold text-red-700"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Sınav</label>
                          <input
                            type="text"
                            value={selectedRequest.oldData.exam || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-bold text-red-700"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Sıralama</label>
                          <input
                            type="text"
                            value={selectedRequest.oldData.rank || ''}
                            readOnly
                            className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-bold text-red-700"
                          />
                        </div>
                        {selectedRequest.oldData.university && (
                          <div>
                            <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Üniversite</label>
                            <input
                              type="text"
                              value={selectedRequest.oldData.university}
                              readOnly
                              className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-xl font-bold text-red-700"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Review Note */}
              {selectedRequest.status === 'PENDING' && (
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">
                    İnceleme Notu (Opsiyonel)
                  </label>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-blue resize-none"
                    placeholder="Onay/red nedeni..."
                  />
                </div>
              )}

              {selectedRequest.reviewNote && (
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">İnceleme Notu</p>
                  <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">
                    {selectedRequest.reviewNote}
                  </p>
                </div>
              )}

              {/* Actions */}
              {selectedRequest.status === 'PENDING' && (
                <div className="flex items-center space-x-4 pt-4">
                  <button
                    onClick={() => setConfirmAction({ type: 'reject', id: selectedRequest.id })}
                    disabled={processing}
                    className="flex-1 px-6 py-3 bg-red-500 text-white font-black rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>{processing ? 'İşleniyor...' : 'Reddet'}</span>
                  </button>
                  <button
                    onClick={() => setConfirmAction({ type: 'approve', id: selectedRequest.id })}
                    disabled={processing}
                    className="flex-1 px-6 py-3 bg-green-500 text-white font-black rounded-xl hover:bg-green-600 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>{processing ? 'İşleniyor...' : 'Onayla'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${confirmAction.type === 'approve' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                {confirmAction.type === 'approve' ? (
                  <Check className={`w-8 h-8 text-green-600`} />
                ) : (
                  <X className={`w-8 h-8 text-red-600`} />
                )}
              </div>
              <h3 className="text-2xl font-black text-brand-dark mb-2">
                {confirmAction.type === 'approve' ? 'Değişikliği Onayla' : 'Değişikliği Reddet'}
              </h3>
              <p className="text-slate-600">
                {confirmAction.type === 'approve'
                  ? 'Bu değişikliği onaylamak istediğinize emin misiniz? Değişiklik hemen uygulanacaktır.'
                  : 'Bu değişikliği reddetmek istediğinize emin misiniz?'
                }
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setConfirmAction(null)}
                disabled={processing}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 font-black rounded-xl hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  if (confirmAction.type === 'approve') {
                    handleApprove(confirmAction.id);
                  } else {
                    handleReject(confirmAction.id);
                  }
                }}
                disabled={processing}
                className={`flex-1 px-6 py-3 text-white font-black rounded-xl transition-all disabled:opacity-50 ${confirmAction.type === 'approve'
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-red-500 hover:bg-red-600'
                  }`}
              >
                {processing ? 'İşleniyor...' : confirmAction.type === 'approve' ? 'Onayla' : 'Reddet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
