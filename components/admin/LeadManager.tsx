import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Lead } from '../../types';

interface LeadManagerProps {
    leads: Lead[];
    handleEdit: (type: 'lead', item: Lead) => void;
}

export const LeadManager: React.FC<LeadManagerProps> = ({
    leads,
    handleEdit
}) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
            <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">Gelen <span className="text-brand-blue italic">Başvurular</span></h1>
            <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">İletişim ve kayıt formlarından gelen mesajlar.</p>
        </div>
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-slate-50/50">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Ad Soyad</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Konu</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50">Tarih</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-50 text-right">İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {(leads || []).map((lead: any) => (
                        <tr key={lead.id} className="group hover:bg-slate-50/50 border-b border-slate-50">
                            <td className="px-8 py-5">
                                <p className="font-black text-brand-dark text-sm">{lead.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold">{lead.email}</p>
                            </td>
                            <td className="px-8 py-5 text-xs font-bold text-slate-500">{lead.subject}</td>
                            <td className="px-8 py-5 text-xs font-black text-slate-400">{lead.date}</td>
                            <td className="px-8 py-5 text-right flex justify-end space-x-2">
                                <button onClick={() => handleEdit('lead', lead)} className="p-2 bg-slate-50 rounded-lg text-brand-blue hover:bg-brand-blue hover:text-white transition-all"><MessageSquare className="w-4 h-4" /></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);
