import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, Sparkles } from 'lucide-react';
import api from '../services/api';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email,
                password
            });

            if (response.data.accessToken) {
                // Store token with both keys for compatibility
                localStorage.setItem('accessToken', response.data.accessToken);
                localStorage.setItem('adminToken', response.data.accessToken);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                localStorage.setItem('adminUser', JSON.stringify(response.data.user));

                // Redirect to admin panel
                navigate('/admin');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-dark via-slate-900 to-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/5 rounded-full blur-[150px]"></div>
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-10 animate-in fade-in slide-in-from-top duration-700">
                    <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl shadow-2xl shadow-brand-blue/20 mb-6 group hover:scale-110 transition-transform">
                        <img src="/assets/images/logoblue.svg" alt="Hocalara Geldik" className="h-12 w-auto" />
                    </div>
                    <h1 className="text-4xl font-black text-white capitalize tracking-tight mb-3">
                        Admin <span className="text-brand-blue italic">Panel</span>
                    </h1>
                    <p className="text-slate-400 font-bold text-sm tracking-wide">
                        Yönetim paneline hoş geldiniz
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-10 shadow-2xl animate-in fade-in slide-in-from-bottom duration-700">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black capitalize tracking-widest text-brand-blue flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>E-posta Adresi</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@hocalarageldik.com"
                                    required
                                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ring-brand-blue/50 transition-all font-bold"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <label className="text-xs font-black capitalize tracking-widest text-brand-blue flex items-center space-x-2">
                                <Lock className="w-4 h-4" />
                                <span>Şifre</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 ring-brand-blue/50 transition-all font-bold pr-14"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 text-red-400 text-sm font-bold animate-in fade-in slide-in-from-top duration-300">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 bg-brand-blue text-white font-black rounded-2xl hover:bg-white hover:text-brand-dark shadow-2xl shadow-brand-blue/30 transition-all flex items-center justify-center space-x-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Giriş Yapılıyor...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                    <span>Giriş Yap</span>
                                </>
                            )}
                        </button>

                        {/* Demo Credentials Info */}
                        <div className="pt-6 border-t border-white/10">
                            <p className="text-xs text-slate-400 font-bold text-center mb-3">Demo Giriş Bilgileri:</p>
                            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-bold">Email:</span>
                                    <span className="text-white font-black">admin@hocalarageldik.com</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-400 font-bold">Şifre:</span>
                                    <span className="text-white font-black">admin123</span>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-slate-500 text-xs font-bold">
                    <p>© 2026 Hocalara Geldik. Tüm hakları saklıdır.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
