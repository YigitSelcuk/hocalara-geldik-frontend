import React, { useState } from 'react';
import { MessageSquare, Eye, Trash, X, Mail, Phone, Calendar, User } from 'lucide-react';
import { Lead } from '../../types';

interface LeadManagerProps {
    leads: Lead[];
    handleEdit: (type: 'lead', item: Lead) => void;
}

export const LeadManager: React.FC<LeadManagerProps> = ({
    leads,
    handleEdit
}) => {
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
                <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">Gelen <span className="text-brand-blue italic">Başvurular</span></h1>
                <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">İletişim ve kayıt formlarından gelen mesajlar.</p>
            </div>

            {leads.length === 0 ? (
                <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-16 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-10 h-10 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-black text-brand-dark mb-2">Henüz Başvuru Yok</h3>
                    <p className="text-slate-500 font-medium">İletişim formundan gelen mesajlar burada görünecek.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Ad Soyad</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">İletişim</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Konu</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Tarih</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 text-right">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead: any) => (
                                <tr key={lead.id} className="group hover:bg-slate-50/50 border-b border-slate-50">
                                    <td className="px-8 py-5">
                                        <p className="font-black text-brand-dark text-sm">{lead.name}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-medium text-slate-600 flex items-center gap-1">
                                            <Mail className="w-3 h-3" />
                                            {lead.email}
                                        </p>
                                        {lead.phone && (
                                            <p className="text-xs font-medium text-slate-600 flex items-center gap-1 mt-1">
                                                <Phone className="w-3 h-3" />
                                                {lead.phone}
                                            </p>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                                            {lead.subject || 'Genel'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-xs font-black text-slate-400">
                                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('tr-TR') : '-'}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <button 
                                                onClick={() => setSelectedLead(lead)} 
                                                className="p-2.5 bg-brand-blue text-white rounded-xl hover:bg-brand-dark transition-all hover:scale-105"
                                                title="Görüntüle"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail Modal */}
            {selectedLead && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex items-center justify-between rounded-t-[24px]">
                            <h2 className="text-2xl font-black text-brand-dark">Başvuru Detayı</h2>
                            <button 
                                onClick={() => setSelectedLead(null)}
                                className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Ad Soyad
                                    </label>
                                    <p className="text-lg font-bold text-brand-dark">{selectedLead.name}</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Tarih
                                    </label>
                                    <p className="text-lg font-bold text-brand-dark">
                                        {selectedLead.createdAt ? new Date(selectedLead.createdAt).toLocaleDateString('tr-TR') : '-'}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                        <Mail className="w-4 h-4" />
                                        E-posta
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-medium text-slate-600 flex-1">{selectedLead.email}</p>
                                        <a
                                            href={`mailto:${selectedLead.email}?subject=Hocalara Geldik - ${selectedLead.subject || 'İletişim'}&body=Merhaba ${selectedLead.name},%0D%0A%0D%0A`}
                                            className="px-4 py-2 bg-gradient-to-r from-brand-blue to-purple-600 text-white text-xs font-black rounded-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                            title="Mail Gönder"
                                        >
                                            <Mail className="w-3.5 h-3.5" />
                                            Mail Gönder
                                        </a>
                                    </div>
                                </div>

                                {selectedLead.phone && (
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Telefon
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <p className="text-sm font-medium text-slate-600 flex-1">{selectedLead.phone}</p>
                                            <a
                                                href={`tel:${selectedLead.phone}`}
                                                className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white text-xs font-black rounded-lg hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                                                title="Ara"
                                            >
                                                <Phone className="w-3.5 h-3.5" />
                                                Ara
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Subject */}
                            {selectedLead.subject && (
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Konu</label>
                                    <p className="text-sm font-bold text-brand-dark">{selectedLead.subject}</p>
                                </div>
                            )}

                            {/* Message */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Mesaj</label>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">
                                        {selectedLead.message}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-100 p-6 rounded-b-[24px]">
                            <button
                                onClick={() => setSelectedLead(null)}
                                className="w-full px-6 py-3 bg-brand-blue text-white font-black rounded-xl hover:bg-brand-dark transition-all"
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
