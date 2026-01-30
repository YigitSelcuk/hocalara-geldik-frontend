import React from 'react';

interface CategoryFormProps {
  formData: any;
  setFormData: (data: any) => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  formData,
  setFormData
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kategori Adı</label>
        <input 
          type="text" 
          value={formData.name || ''} 
          onChange={e => {
            const name = e.target.value;
            // Auto-generate slug
            const slug = name.toLowerCase()
              .replace(/ğ/g, 'g')
              .replace(/ü/g, 'u')
              .replace(/ş/g, 's')
              .replace(/ı/g, 'i')
              .replace(/ö/g, 'o')
              .replace(/ç/g, 'c')
              .replace(/[^a-z0-9\s-]/g, '')
              .trim()
              .replace(/\s+/g, '-');
              
            setFormData({ ...formData, name, slug });
          }} 
          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-blue font-bold" 
        />
      </div>
    </div>
  );
};
