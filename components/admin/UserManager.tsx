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
    const [searchTerm, setSearchTerm] = React.useState('');

    // Show all admin users (SUPER_ADMIN, CENTER_ADMIN, and BRANCH_ADMIN)
    const filteredUsers = adminUsers
        .filter(user => 
            user.role === UserRole.SUPER_ADMIN || 
            user.role === UserRole.CENTER_ADMIN || 
            user.role === UserRole.BRANCH_ADMIN
        )
        .filter(user => {
            if (!searchTerm) return true;
            const search = searchTerm.toLowerCase();
            return (
                user.name?.toLowerCase().includes(search) ||
                user.email?.toLowerCase().includes(search) ||
                branches.find(b => b.id === user.branchId)?.name?.toLowerCase().includes(search)
            );
        })
        .sort((a, b) => {
            // Sort by name alphabetically
            const nameA = a.name?.toLowerCase() || '';
            const nameB = b.name?.toLowerCase() || '';
            return nameA.localeCompare(nameB, 'tr');
        });

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

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
            <div className="relative">
                <input
                    type="text"
                    placeholder="İsim, e-posta veya şube ile ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-5 py-4 pl-12 text-sm focus:outline-none focus:border-brand-blue font-bold transition-all"
                />
                <svg 
                    className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            {searchTerm && (
                <p className="text-xs text-slate-500 font-bold mt-3">
                    {filteredUsers.length} kullanıcı bulundu
                </p>
            )}
        </div>

        <div className="grid grid-cols-1 gap-4">
            {filteredUsers.length === 0 ? (
                <div className="bg-white p-12 rounded-[24px] border border-slate-100 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-black text-slate-400 mb-2">
                        {searchTerm ? 'Kullanıcı bulunamadı' : 'Henüz kullanıcı yok'}
                    </h3>
                    <p className="text-sm text-slate-400 mb-6">
                        {searchTerm ? 'Arama kriterlerinize uygun kullanıcı bulunamadı' : 'İlk kullanıcıyı ekleyerek başlayın'}
                    </p>
                    {!searchTerm && (
                        <button
                            onClick={() => handleAdd('user')}
                            className="px-6 py-3 bg-brand-blue text-white font-bold rounded-xl hover:bg-brand-dark transition-all inline-flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>İlk Kullanıcıyı Ekle</span>
                        </button>
                    )}
                </div>
            ) : (
                filteredUsers.map((admin) => (
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
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black capitalize tracking-widest inline-block ${
                                admin.role === UserRole.SUPER_ADMIN ? 'bg-red-50 text-red-600' :
                                admin.role === UserRole.CENTER_ADMIN ? 'bg-purple-50 text-purple-600' :
                                admin.role === UserRole.BRANCH_ADMIN ? 'bg-amber-50 text-amber-600' : 
                                'bg-blue-50 text-blue-600'
                            }`}>
                                {admin.role === UserRole.SUPER_ADMIN ? 'Süper Admin' : 
                                 admin.role === UserRole.CENTER_ADMIN ? 'Merkez Admin' :
                                 admin.role === UserRole.BRANCH_ADMIN ? 'Şube Yöneticisi' : 
                                 admin.role}
                            </span>
                        </div>

                        {admin.branchId && (
                            <div className="text-left sm:text-center min-w-[120px]">
                                <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest mb-1">Atanan Şube</p>
                                <p className="text-xs font-black text-brand-dark capitalize">
                                    {branches.find(b => b.id === admin.branchId)?.name || 'Bilinmiyor'}
                                </p>
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
            ))
            )}
        </div>
    </div>
    );
};
