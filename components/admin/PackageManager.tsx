import React, { useState, useCallback, useRef } from 'react';
import { Plus, Settings2, Trash, Star, Sparkles, Video, BookOpen, Clock, GripVertical, Tag } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { EducationPackage } from '../../types';
import api, { API_BASE_URL } from '../../services/api';
import { useNavigate } from 'react-router-dom';

interface PackageManagerProps {
    packages: EducationPackage[];
    handleAdd: (type: 'package') => void;
    handleEdit: (type: 'package', item: EducationPackage) => void;
    handleDelete: (type: 'package', id: string) => void;
    onReorder?: () => void;
}

interface DraggablePackageCardProps {
    pkg: EducationPackage;
    index: number;
    movePackage: (dragIndex: number, hoverIndex: number) => void;
    handleEdit: (type: 'package', item: EducationPackage) => void;
    handleDelete: (type: 'package', id: string) => void;
}

const DraggablePackageCard: React.FC<DraggablePackageCardProps> = ({
    pkg,
    index,
    movePackage,
    handleEdit,
    handleDelete
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ handlerId }, drop] = useDrop({
        accept: 'package',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: any, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }

            movePackage(dragIndex, hoverIndex);
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag, preview] = useDrag({
        type: 'package',
        item: () => {
            return { id: pkg.id, index };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <div
            ref={ref}
            data-handler-id={handlerId as any}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className="bg-white rounded-[24px] border border-slate-100 overflow-hidden hover:shadow-xl transition-all group"
        >
            {/* Drag Handle */}
            <div className="bg-slate-50 px-4 py-2 flex items-center justify-center cursor-move border-b border-slate-100">
                <GripVertical className="w-5 h-5 text-slate-400" />
            </div>

            {/* Image */}
            <div className="relative h-40 bg-slate-50 overflow-hidden">
                {pkg.image && (
                    <img
                        src={pkg.image?.startsWith('http') ? pkg.image : (pkg.image?.startsWith('/assets') ? pkg.image : `${API_BASE_URL}${pkg.image}`)}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        alt={pkg.name}
                    />
                )}
                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {pkg.isPopular && (
                        <div className="px-2 py-1 bg-brand-blue text-white rounded-lg text-[9px] font-black flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-white" />
                            <span>Popüler</span>
                        </div>
                    )}
                    {pkg.isNew && (
                        <div className="px-2 py-1 bg-green-500 text-white rounded-lg text-[9px] font-black">
                            Yeni
                        </div>
                    )}
                </div>
                {pkg.discount && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-red-500 text-white rounded-lg text-[9px] font-black">
                        %{pkg.discount} İndirim
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                <div>
                    <h3 className="font-black text-brand-dark text-lg capitalize tracking-tight leading-tight">{pkg.name}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 line-clamp-2">{pkg.shortDescription}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100">
                    {pkg.videoCount && (
                        <div className="text-center">
                            <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-brand-blue mx-auto mb-1">
                                <Video className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-[9px] font-black text-slate-400">Video</p>
                            <p className="text-xs font-black text-brand-dark">{pkg.videoCount}+</p>
                        </div>
                    )}
                    {pkg.subjectCount && (
                        <div className="text-center">
                            <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 mx-auto mb-1">
                                <BookOpen className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-[9px] font-black text-slate-400">Ders</p>
                            <p className="text-xs font-black text-brand-dark">{pkg.subjectCount}</p>
                        </div>
                    )}
                    {pkg.duration && (
                        <div className="text-center">
                            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 mx-auto mb-1">
                                <Clock className="w-3.5 h-3.5" />
                            </div>
                            <p className="text-[9px] font-black text-slate-400">Süre</p>
                            <p className="text-xs font-black text-brand-dark">{pkg.duration}</p>
                        </div>
                    )}
                </div>

                {/* Price */}
                <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-black text-brand-dark">₺{pkg.price?.toLocaleString()}</span>
                    {pkg.originalPrice && (
                        <span className="text-sm font-bold text-slate-400 line-through">₺{pkg.originalPrice?.toLocaleString()}</span>
                    )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                    <button
                        onClick={() => handleEdit('package', pkg)}
                        className="flex-1 p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-brand-blue hover:text-white transition-all text-xs font-black"
                    >
                        Düzenle
                    </button>
                    <button
                        onClick={() => handleDelete('package', pkg.id)}
                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                    >
                        <Trash className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export const PackageManager: React.FC<PackageManagerProps> = ({
    packages: initialPackages,
    handleAdd,
    handleEdit,
    handleDelete,
    onReorder
}) => {
    const [packages, setPackages] = useState(initialPackages);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();

    // Update local state when props change
    React.useEffect(() => {
        setPackages(initialPackages);
    }, [initialPackages]);

    const movePackage = useCallback((dragIndex: number, hoverIndex: number) => {
        setPackages((prevPackages) => {
            const newPackages = [...prevPackages];
            const draggedPackage = newPackages[dragIndex];
            newPackages.splice(dragIndex, 1);
            newPackages.splice(hoverIndex, 0, draggedPackage);
            return newPackages;
        });
    }, []);

    const saveOrder = async () => {
        try {
            setIsSaving(true);

            // Create array with id and order
            const reorderedPackages = packages.map((pkg: any, index) => ({
                id: pkg.id,
                order: index
            }));

            await api.post('/packages/reorder', { packages: reorderedPackages });

            if (onReorder) {
                onReorder();
            }

            alert('Paket sıralaması başarıyla güncellendi!');
        } catch (error) {
            console.error('Error saving order:', error);
            alert('Sıralama kaydedilirken hata oluştu.');
        } finally {
            setIsSaving(false);
        }
    };

    const hasOrderChanged = () => {
        return packages.some((pkg: any, index) => pkg.order !== index);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="space-y-8 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm">
                    <div>
                        <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">
                            Paket <span className="text-brand-blue italic">Yönetimi</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">
                            Eğitim paketlerini ve fiyatları düzenleyin. Sürükleyerek sıralayın.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/admin/categories')}
                            className="px-6 py-4 bg-purple-50 text-purple-600 font-bold rounded-2xl hover:bg-purple-100 transition-all flex items-center space-x-2"
                        >
                            <Tag className="w-5 h-5" />
                            <span>Kategorileri Yönet</span>
                        </button>
                        {hasOrderChanged() && (
                            <button
                                onClick={saveOrder}
                                disabled={isSaving}
                                className="px-8 py-4 bg-green-500 text-white font-black rounded-2xl hover:bg-green-600 shadow-xl shadow-green-500/20 transition-all disabled:opacity-50"
                            >
                                {isSaving ? 'Kaydediliyor...' : 'Sıralamayı Kaydet'}
                            </button>
                        )}
                        <button
                            onClick={() => handleAdd('package')}
                            className="px-8 py-4 bg-brand-blue text-white font-black rounded-2xl hover:bg-brand-dark shadow-xl shadow-brand-blue/20 transition-all flex items-center space-x-2"
                        >
                            <Plus className="w-5 h-5" />
                            <span>Yeni Paket Oluştur</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg, index) => (
                        <DraggablePackageCard
                            key={pkg.id}
                            pkg={pkg}
                            index={index}
                            movePackage={movePackage}
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    ))}
                </div>

                {packages.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-[24px] border-2 border-dashed border-slate-200">
                        <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-400 mb-2">Henüz paket eklenmemiş</h3>
                        <p className="text-sm text-slate-400 mb-6">İlk eğitim paketinizi oluşturun</p>
                        <button
                            onClick={() => handleAdd('package')}
                            className="px-6 py-3 bg-brand-blue text-white font-black rounded-xl hover:bg-brand-dark transition-all inline-flex items-center space-x-2"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Paket Ekle</span>
                        </button>
                    </div>
                )}
            </div>
        </DndProvider>
    );
};
