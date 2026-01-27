import React from 'react';
import { Settings, RefreshCw, ArrowRight } from 'lucide-react';

const MaintenancePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-1/2 -right-24 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl animate-pulse delay-700"></div>
                <div className="absolute -bottom-24 left-1/2 w-80 h-80 bg-brand-red/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full text-center space-y-8">
                {/* Icon Animation Container */}
                <div className="relative w-32 h-32 mx-auto mb-8">
                    <div className="absolute inset-0 bg-brand-blue/10 rounded-full animate-ping opacity-20"></div>
                    <div className="relative w-full h-full bg-white rounded-full shadow-2xl shadow-brand-blue/20 flex items-center justify-center border-4 border-slate-50">
                        <Settings className="w-16 h-16 text-brand-blue animate-[spin_3s_linear_infinite]" />
                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-3 rounded-full border-4 border-white shadow-lg">
                            <RefreshCw className="w-6 h-6 text-white animate-spin" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-4xl md:text-6xl font-black text-brand-dark tracking-tight">
                        Bakım <span className="text-brand-blue">Modundayız</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                        Sizlere daha iyi hizmet verebilmek için altyapımızı güçlendiriyoruz. Kısa süre sonra yenilenmiş yüzümüzle buradayız!
                    </p>
                </div>

                {/* Status Indicator */}
                <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 animate-in fade-in duration-1000 delay-300">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-bold text-slate-600">Sistem güncelleniyor...</span>
                </div>

                {/* Footer Info */}
                <div className="pt-12 text-slate-400 text-xs font-semibold uppercase tracking-widest animate-in fade-in duration-1000 delay-500">
                    Hocalara Geldik &copy; {new Date().getFullYear()}
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;
