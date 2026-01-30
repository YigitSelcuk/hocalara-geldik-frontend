import React from 'react';
import { Plus, Settings2, Trash } from 'lucide-react';
import { AdminUser, UserRole, Branch } from '../../types';
import { API_BASE_URL } from '../../services/api';

interface UserManagerProps {
    adminUsers: AdminUser[];
    branches: Branch[];
    handleAdd: (type: 'user') => void;
    handleEdit: (type: 'user', item: AdminUser) => void;
    handleDelete: (type: 'user', id: string) => void;
}

export const UserManager: React.FC<UserManagerProps> = ({
    adminUsers,
    branches,
    handleAdd,
    handleEdit,
    handleDelete
}) => {
    // Only show SUPER_ADMIN and BRANCH_ADMIN
    const filteredUsers = adminUsers.filter(user => 
        user.role === UserRole.SUPER_ADMIN || user.role === UserRole.BRANCH_ADMIN
    );

    return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
            <div>
                <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">Kullanıcı <span className="text-brand-blue italic">Yönetimi</span></h1>
                <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">Sistem yöneticilerini ve şube yetkililerini yönetin.</p>
            </div>
            <button
                onClick={() => handleAdd('user')}
                className="px-8 py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-dark shadow-xl shadow-brand-blue/20 transition-all flex items-center space-x-2"
            >
                <Plus className="w-5 h-5" />
                <span>Yeni Yetkili Ekle</span>
            </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
            {filteredUsers.map((admin) => (
                <div key={admin.id} className="bg-white p-6 rounded-[24px] border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-lg transition-all">
                    <div className="flex items-center space-x-4 w-full md:w-auto">
                        <div className="min-w-0">
                            <h3 className="font-black text-brand-dark capitalize tracking-tight truncate">{admin.name}</h3>
                            <p className="text-xs text-slate-400 font-bold truncate">{admin.email}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-8 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-left sm:text-center">
                            <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest mb-1">Rol</p>
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black capitalize tracking-widest inline-block ${admin.role === UserRole.SUPER_ADMIN ? 'bg-red-50 text-red-600' :
                                admin.role === UserRole.BRANCH_ADMIN ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                {admin.role === UserRole.SUPER_ADMIN ? 'Admin' : admin.role === UserRole.BRANCH_ADMIN ? 'Şube Yöneticisi' : admin.role}
                            </span>
                        </div>

                        {admin.branchId && (
                            <div className="text-left sm:text-center min-w-[120px]">
                                <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest mb-1">Atanan Şube</p>
                                <p className="text-xs font-black text-brand-dark capitalize">{branches.find(b => b.id === admin.branchId)?.name.split(' ')[1] || 'Bilinmiyor'}</p>
                            </div>
                        )}

                        <div className="flex space-x-2 shrink-0 ml-auto sm:ml-0">
                            <button
                                onClick={() => handleEdit('user', admin)}
                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-blue hover:text-white transition-all"
                            >
                                <Settings2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete('user', admin.id)}
                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
};
