import React from 'react';
import { Plus, Settings2, Trash } from 'lucide-react';
import { EducationPackage } from '../../types';

interface PackageManagerProps {
    packages: EducationPackage[];
    handleAdd: (type: 'package') => void;
    handleEdit: (type: 'package', item: EducationPackage) => void;
    handleDelete: (type: 'package', id: string) => void;
}

export const PackageManager: React.FC<PackageManagerProps> = ({
    packages,
    handleAdd,
    handleEdit,
    handleDelete
}) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
            <div>
                <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">Paket <span className="text-brand-blue italic">Yönetimi</span></h1>
                <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">Eğitim paketlerini ve fiyatları düzenleyin.</p>
            </div>
            <button
                onClick={() => handleAdd('package')}
                className="px-8 py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-dark shadow-xl shadow-brand-blue/20 transition-all flex items-center space-x-2"
            >
                <Plus className="w-5 h-5" />
                <span>Yeni Paket Oluştur</span>
            </button>
        </div>

        <div className="space-y-4">
            {packages.map((pkg) => (
                <div key={pkg.id} className="bg-white p-6 rounded-[24px] border border-slate-100 flex items-center justify-between hover:shadow-lg transition-all">
                    <div className="flex items-center space-x-6">
                        <div className="w-20 h-16 bg-slate-50 rounded-xl overflow-hidden shadow-sm">
                            <img src={pkg.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                            <h3 className="font-black text-brand-dark capitalize tracking-tight">{pkg.name}</h3>
                            <p className="text-xs text-slate-400 font-bold max-w-sm truncate">{pkg.shortDescription}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-12">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 capitalize tracking-widest mb-1">Fiyat</p>
                            <p className="text-lg font-black text-brand-dark">₺{pkg.price?.toLocaleString()}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit('package', pkg)}
                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-brand-blue hover:text-white transition-all"
                            >
                                <Settings2 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete('package', pkg.id)}
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
