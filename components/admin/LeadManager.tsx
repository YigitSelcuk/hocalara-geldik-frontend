import React, { useState, useEffect } from 'react';
import { Users, Phone, Mail, Calendar, CheckCircle, Clock, X, Eye, Trash2 } from 'lucide-react';
import api from '../../services/api';

interface Lead {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email?: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'REJECTED';
  notes?: string;
  createdAt: string;
  branch?: {
    id: string;
    name: string;
  };
}

interface LeadManagerProps {
  branchId?: string;
}

const LeadManager: React.FC<LeadManagerProps> = ({ branchId }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, [branchId]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const url = branchId ? `/leads?branchId=${branchId}` : '/leads';
      console.log('Fetching leads from:', url);
      const response = await api.get(url);
      console.log('Leads response:', response.data);
      setLeads(response.data.data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (leadId: string, status: Lead['status'], notes?: string) => {
    try {
      setUpdatingStatus(true);
      await api.patch(`/leads/${leadId}`, { status, notes });
      await fetchLeads();
      setShowDetailModal(false);
      setSelectedLead(null);
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Durum güncellenirken hata oluştu');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: Lead['status']) => {
    const badges = {
      NEW: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Yeni' },
      CONTACTED: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'İletişime Geçildi' },
      CONVERTED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Kayıt Oldu' },
      REJECTED: { bg: 'bg-red-100', text: 'text-red-700', label: 'İptal' }
    };
    const badge = badges[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-black ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const getStatusIcon = (status: Lead['status']) => {
    switch (status) {
      case 'NEW': return <Clock className="w-4 h-4" />;
      case 'CONTACTED': return <Phone className="w-4 h-4" />;
      case 'CONVERTED': return <CheckCircle className="w-4 h-4" />;
      case 'REJECTED': return <X className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-blue mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Ön kayıtlar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm">
      {/* Detail Modal */}
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-8 py-6 flex items-center justify-between rounded-t-3xl">
              <h3 className="text-2xl font-black text-brand-dark">Ön Kayıt Detayı</h3>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedLead(null);
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
                  <p className="text-lg font-bold text-brand-dark">{selectedLead.name} {selectedLead.surname}</p>
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">Durum</p>
                  {getStatusBadge(selectedLead.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">Telefon</p>
                  <a href={`tel:${selectedLead.phone}`} className="text-brand-blue font-bold hover:underline flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{selectedLead.phone}</span>
                  </a>
                </div>
                {selectedLead.email && (
                  <div>
                    <p className="text-xs font-black text-slate-400 uppercase mb-2">E-posta</p>
                    <a href={`mailto:${selectedLead.email}`} className="text-brand-blue font-bold hover:underline flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{selectedLead.email}</span>
                    </a>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-black text-slate-400 uppercase mb-2">Kayıt Tarihi</p>
                <p className="text-slate-700 font-medium flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(selectedLead.createdAt).toLocaleString('tr-TR')}</span>
                </p>
              </div>

              {selectedLead.notes && (
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase mb-2">Notlar</p>
                  <p className="text-slate-700 bg-slate-50 p-4 rounded-xl">{selectedLead.notes}</p>
                </div>
              )}

              <div className="border-t border-slate-200 pt-6">
                <p className="text-xs font-black text-slate-400 uppercase mb-3">Durum Güncelle</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, 'CONTACTED')}
                    disabled={updatingStatus || selectedLead.status === 'CONTACTED'}
                    className="px-4 py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>İletişime Geçildi</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, 'CONVERTED')}
                    disabled={updatingStatus || selectedLead.status === 'CONVERTED'}
                    className="px-4 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Kayıt Oldu</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, 'REJECTED')}
                    disabled={updatingStatus || selectedLead.status === 'REJECTED'}
                    className="px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <X className="w-4 h-4" />
                    <span>İptal</span>
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedLead.id, 'NEW')}
                    disabled={updatingStatus || selectedLead.status === 'NEW'}
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
          <h2 className="text-2xl font-black text-brand-dark">Ön Kayıtlar</h2>
          <p className="text-slate-500 text-sm mt-1">
            {branchId ? 'Şubenize yapılan ön kayıt başvuruları' : 'Tüm şubelere yapılan ön kayıt başvuruları'}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-xs text-slate-400 font-bold uppercase">Toplam</p>
            <p className="text-2xl font-black text-brand-blue">{leads.length}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase">Yeni</p>
              <p className="text-2xl font-black text-blue-700">{leads.filter(l => l.status === 'NEW').length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-yellow-600 uppercase">İletişimde</p>
              <p className="text-2xl font-black text-yellow-700">{leads.filter(l => l.status === 'CONTACTED').length}</p>
            </div>
            <Phone className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-green-600 uppercase">Kayıt Oldu</p>
              <p className="text-2xl font-black text-green-700">{leads.filter(l => l.status === 'CONVERTED').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-red-50 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-red-600 uppercase">İptal</p>
              <p className="text-2xl font-black text-red-700">{leads.filter(l => l.status === 'REJECTED').length}</p>
            </div>
            <X className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Leads List */}
      {leads.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Henüz ön kayıt başvurusu yok</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leads.map(lead => (
            <div
              key={lead.id}
              className="bg-slate-50 rounded-xl p-4 hover:bg-slate-100 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start md:items-center space-x-4 flex-1 w-full">
                  <div className="w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(lead.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-brand-dark truncate">{lead.name} {lead.surname}</h3>
                      {getStatusBadge(lead.status)}
                      {!branchId && lead.branch && (
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-black whitespace-nowrap">
                          {lead.branch.name}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center space-x-1">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{lead.phone}</span>
                      </span>
                      {lead.email && (
                        <span className="flex items-center space-x-1">
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{lead.email}</span>
                        </span>
                      )}
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString('tr-TR')}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedLead(lead);
                    setShowDetailModal(true);
                  }}
                  className="w-full md:w-auto px-4 py-2 bg-brand-blue text-white font-bold rounded-lg hover:bg-brand-dark transition-all flex items-center justify-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Detay</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadManager;
