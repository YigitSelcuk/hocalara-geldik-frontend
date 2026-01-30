import React from 'react';
import { Plus, Settings2, Trash, Building2, MapPin, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Branch } from '../../types';
import { API_BASE_URL } from '../../services/api';

interface BranchManagerProps {
    branches: Branch[];
    handleAdd: (type: 'branch') => void;
    handleEdit: (type: 'branch', item: Branch) => void;
    handleDelete: (type: 'branch', id: string) => void;
    handleToggleStatus?: (type: 'branch', item: Branch) => void;
}

export const BranchManager: React.FC<BranchManagerProps> = ({
    branches,
    handleAdd,
    handleEdit,
    handleDelete,
    handleToggleStatus
}) => {
    const navigate = useNavigate();

    return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
            <div>
                <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">Şube <span className="text-brand-blue italic">Portföyü</span></h1>
                <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">Tüm şubeleri ve yetkili atamalarını buradan yönetin.</p>
            </div>
            <button
                onClick={() => handleAdd('branch')}
                className="px-8 py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-dark shadow-xl shadow-brand-blue/20 transition-all flex items-center space-x-2"
            >
                <Plus className="w-5 h-5" />
                <span>Yeni Şube Ekle</span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.map((branch) => {
                const logoUrl = branch.logo ? (branch.logo.startsWith('http') ? branch.logo : (branch.logo.startsWith('/assets') ? branch.logo : `${API_BASE_URL}${branch.logo}`)) : null;
                
                return (
                <div key={branch.id} className="bg-white rounded-[28px] border border-slate-100 p-6 space-y-6 shadow-sm hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-brand-blue/5 transition-all duration-700"></div>

                    <div className="flex justify-between items-start relative z-10">
                        <div
                            className="w-16 h-16 bg-slate-50 rounded-[20px] flex items-center justify-center group-hover:rotate-6 transition-all overflow-hidden border border-slate-50"
                            style={{ borderTop: `4px solid ${branch.primaryColor || '#0052FF'}` }}
                        >
                            {logoUrl ? (
                                <img src={logoUrl} className="w-10 h-10 object-contain" alt={branch.name} />
                            ) : (
                                <Building2 className="w-7 h-7 text-brand-blue group-hover:text-brand-dark transition-colors" />
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigate(`/admin/branch/${branch.id}`)}
                                className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-blue hover:text-white transition-all"
                                title="Şube Paneline Git"
                            >
                                <LogIn className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleEdit('branch', branch)}
                                className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-dark hover:text-white transition-all"
                            >
                                <Settings2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete('branch', branch.id)}
                                className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-brand-dark capitalize tracking-tight leading-tight">{branch.name}</h3>
                        <p className="text-xs text-slate-400 font-bold mt-1 capitalize tracking-widest flex items-center"><MapPin className="w-3 h-3 mr-1" /> {branch.slug}</p>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-slate-50">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-bold">Öğretmen Sayısı</span>
                            <span className="text-brand-dark font-black">{branch.teachers?.length || 0}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400 font-bold">Durum</span>
                            <button 
                                onClick={() => handleToggleStatus && handleToggleStatus('branch', branch)}
                                className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all ${branch.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}
                            >
                                <div className={`w-2 h-2 rounded-full ${branch.isActive !== false ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                                <span className="font-black">{branch.isActive !== false ? 'Aktif' : 'Pasif'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            );
        })}
        </div>
    </div>
    );
};
