import React, { useState, useEffect } from 'react';
import { Settings, Globe, Share2 } from 'lucide-react';
import { settingsService } from '../../services/cms.service';
import { systemService } from '../../services/system.service';


export const SettingsManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'general' | 'seo' | 'social' | 'footer'>('general');
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
                if (response.data) {
                    // Normalize data from API if it's an array of {key, value}
                    if (Array.isArray(response.data)) {
                        const normalized: any = {};
                        response.data.forEach((item: any) => {
                            normalized[item.key] = item.value;
                        });
                        setSiteSettings((prev: any) => ({ ...prev, ...normalized }));
                    } else {
                        setSiteSettings((prev: any) => ({ ...prev, ...response.data }));
                    }
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
            await settingsService.update(siteSettings);
            alert('Ayarlar başarıyla güncellendi.');
        } catch (error) {
            alert('Ayarlar güncellenirken bir hata oluştu.');
        }
    };

    if (loading) return <div className="p-8 text-slate-400 font-bold">Yükleniyor...</div>;

    const tabs = [
        { id: 'general', label: 'Genel Bilgiler', icon: Settings },
        { id: 'seo', label: 'SEO Ayarları', icon: Globe },
        { id: 'social', label: 'Sosyal Medya', icon: Share2 },
        { id: 'footer', label: 'Footer Ayarları', icon: Settings }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-white p-8 rounded-[24px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-brand-dark capitalize tracking-tight leading-none">Site <span className="text-brand-blue italic">Ayarları</span></h1>
                    <p className="text-slate-500 font-bold text-[13px] mt-2 tracking-wide">Platform genelindeki tüm yapılandırmaları buradan yönetin.</p>
                </div>
                <button onClick={handleUpdate} className="px-8 py-4 bg-brand-blue text-white font-black text-xs capitalize tracking-widest rounded-2xl hover:bg-brand-dark transition-all shadow-xl shadow-brand-blue/20">Tüm Değişiklikleri Kaydet</button>
            </div>

            <div className="flex space-x-2 p-1.5 bg-slate-100/50 rounded-2xl w-fit">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-black transition-all ${activeTab === tab.id ? 'bg-white text-brand-blue shadow-sm' : 'text-slate-500 hover:text-brand-dark'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-10 rounded-[32px] border border-slate-100 shadow-sm">
                        {activeTab === 'general' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Site Adı</label>
                                        <input type="text" value={siteSettings.name} onChange={e => setSiteSettings({ ...siteSettings, name: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Kurumsal E-posta</label>
                                        <input type="email" value={siteSettings.email} onChange={e => setSiteSettings({ ...siteSettings, email: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Telefon</label>
                                        <input type="text" value={siteSettings.phone} onChange={e => setSiteSettings({ ...siteSettings, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">WhatsApp Hattı</label>
                                        <input type="text" value={siteSettings.whatsapp} onChange={e => setSiteSettings({ ...siteSettings, whatsapp: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Merkez Adres</label>
                                    <textarea rows={3} value={siteSettings.address} onChange={e => setSiteSettings({ ...siteSettings, address: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" />
                                </div>
                            </div>
                        )}

                        {activeTab === 'seo' && (
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Global Sayfa Başlığı (Title)</label>
                                    <input type="text" value={siteSettings.metaTitle} onChange={e => setSiteSettings({ ...siteSettings, metaTitle: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Meta Açıklaması (Description)</label>
                                    <textarea rows={3} value={siteSettings.metaDescription} onChange={e => setSiteSettings({ ...siteSettings, metaDescription: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Anahtar Kelimeler (Keywords)</label>
                                        <input type="text" value={siteSettings.metaKeywords} onChange={e => setSiteSettings({ ...siteSettings, metaKeywords: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Google Analytics ID</label>
                                        <input type="text" value={siteSettings.googleAnalyticsId} onChange={e => setSiteSettings({ ...siteSettings, googleAnalyticsId: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'social' && (
                            <div className="space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Facebook URL</label>
                                        <input type="text" value={siteSettings.facebook} onChange={e => setSiteSettings({ ...siteSettings, facebook: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Instagram URL</label>
                                        <input type="text" value={siteSettings.instagram} onChange={e => setSiteSettings({ ...siteSettings, instagram: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">YouTube URL</label>
                                        <input type="text" value={siteSettings.youtube} onChange={e => setSiteSettings({ ...siteSettings, youtube: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Twitter (X) URL</label>
                                        <input type="text" value={siteSettings.twitter} onChange={e => setSiteSettings({ ...siteSettings, twitter: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'footer' && (
                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Footer Açıklaması</label>
                                    <textarea rows={3} value={siteSettings.footerDescription} onChange={e => setSiteSettings({ ...siteSettings, footerDescription: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold resize-none" placeholder="Türkiye'nin Öncü Eğitim Markası..." />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black capitalize tracking-widest text-slate-400">Copyright Metni</label>
                                    <input type="text" value={siteSettings.footerCopyright} onChange={e => setSiteSettings({ ...siteSettings, footerCopyright: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-brand-blue font-bold" placeholder="Hocalara Geldik Akademi Grubu" />
                                </div>
                                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Bilgi</p>
                                    <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                                        Footer menü linkleri ve iletişim bilgileri yukarıdaki "Genel Bilgiler" ve "Sosyal Medya" sekmelerinden düzenlenir.
                                        Menü yönetimi için "Menüler" bölümünü kullanabilirsiniz.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
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

                        <div className="pt-6 border-t border-slate-100">
                            <h3 className="font-black text-brand-dark capitalize tracking-tight mb-4">Gelişmiş İşlemler</h3>
                            <button
                                onClick={async () => {
                                    if (window.confirm('DİKKAT: Tüm site verilerini SIFIRLAYIP mock verilerle doldurmak istediğinize emin misiniz? Mevcut tüm içerikler silinecektir.')) {
                                        try {
                                            await systemService.seedDatabase(true);
                                            alert('Mock veriler başarıyla yüklendi. Sayfayı yenileyebilirsiniz.');
                                        } catch (error) {
                                            alert('Veriler yüklenirken bir hata oluştu.');
                                        }
                                    }
                                }}
                                className="w-full py-4 bg-slate-900 text-white font-black text-xs capitalize tracking-widest rounded-2xl hover:bg-black transition-all shadow-xl"
                            >
                                Siteyi Mock Verilerle Doldur
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
