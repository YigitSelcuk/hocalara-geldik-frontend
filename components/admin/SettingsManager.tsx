import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/cms.service';


export const SettingsManager: React.FC = () => {
    const [siteSettings, setSiteSettings] = useState<any>({
        name: 'Hocalara Geldik',
        email: 'akademi@hocalarageldik.com',
        phone: '0212 000 00 00',
        whatsapp: '905000000000',
        address: 'Merkez İstanbul',
        maintenanceMode: false,
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        googleAnalyticsId: '',
        facebook: '',
        instagram: '',
        youtube: '',
        twitter: '',
        footerDescription: 'Türkiye\'nin Öncü Eğitim Markası Olarak, Akademik Başarınızı En Modern Teknolojiler Ve Uzman Kadromuzla Destekliyoruz.',
        footerCopyright: 'Hocalara Geldik Akademi Grubu. Tüm hakları saklıdır.'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await settingsService.get();
                // Check if data is wrapped in 'settings' key or flat
                const settingsData = response.data?.settings || response.data;
                
                if (settingsData) {
                    const data = { ...settingsData };
                    if (data.maintenanceMode !== undefined) {
                        data.maintenanceMode = data.maintenanceMode === 'true' || data.maintenanceMode === true;
                    }
                    setSiteSettings((prev: any) => ({ ...prev, ...data }));
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleUpdate = async () => {
        try {
            // Convert boolean to string for backend as Prisma expects strings
            const dataToSend = {
                ...siteSettings,
                maintenanceMode: String(siteSettings.maintenanceMode)
            };

            await settingsService.update(dataToSend);
            alert('Ayarlar başarıyla güncellendi.');
        } catch (error) {
            console.error('Update error:', error);
            alert('Ayarlar güncellenirken bir hata oluştu.');
        }
    };

    if (loading) return <div className="p-8 text-slate-400 font-bold">Yükleniyor...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">Site <span className="text-brand-blue italic">Ayarları</span></h1>
                    <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">Sistem durumunu ve bakım modunu buradan yönetin.</p>
                </div>
                <button onClick={handleUpdate} className="w-full md:w-auto px-8 py-4 bg-brand-blue text-white font-black text-xs capitalize tracking-widest rounded-2xl hover:bg-brand-dark transition-all shadow-xl shadow-brand-blue/20">
                    Değişiklikleri Kaydet
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="font-black text-brand-dark capitalize tracking-tight">Sistem Durumu</h3>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                            <p className="text-xs font-black text-brand-dark">Bakım Modu</p>
                            <p className="text-[10px] text-slate-400 font-bold">Site geçici olarak kapanır.</p>
                        </div>
                        <button onClick={() => setSiteSettings({ ...siteSettings, maintenanceMode: !siteSettings.maintenanceMode })} className={`w-12 h-6 rounded-full relative transition-colors ${siteSettings.maintenanceMode ? 'bg-brand-blue' : 'bg-slate-200'}`}>
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${siteSettings.maintenanceMode ? 'right-1' : 'left-1'}`}></div>
                        </button>
                    </div>
                    <div className="p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                        <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest">Bilgilendirme</p>
                        <p className="text-[11px] text-slate-500 font-bold mt-1 leading-relaxed">Değişikliklerin canlı sitede görünmesi için "Tüm Değişiklikleri Kaydet" butonuna tıklamayı unutmayın.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
