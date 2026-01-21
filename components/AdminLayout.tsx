
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, ImageIcon, FileText, Building2,
    Video, Package, Users, Settings, LogOut,
    ChevronRight, Search, Map, List, HardDrive,
    MessageSquare, Menu
} from 'lucide-react';
import { AdminUser, UserRole } from '../types';

interface AdminLayoutProps {
    user: AdminUser | null;
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ user, children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const hasAccess = (requiredRoles: UserRole[]) => !!user && requiredRoles.includes(user.role);

    const menuItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN, UserRole.BRANCH_ADMIN] },
        { label: 'Menü Yönetimi', icon: Menu, path: '/admin/menus', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Sayfalar', icon: FileText, path: '/admin/pages', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Kategoriler', icon: List, path: '/admin/categories', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Slider Yönetimi', icon: ImageIcon, path: '/admin/sliders', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Haberler', icon: FileText, path: '/admin/news', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN, UserRole.BRANCH_ADMIN] },
        { label: 'Şubeler', icon: Building2, path: '/admin/branches', roles: [UserRole.SUPER_ADMIN] },
        { label: 'Şubem', icon: Map, path: `/admin/branch/${user?.assignedBranchId || ''}`, roles: [UserRole.BRANCH_ADMIN], condition: !!user?.assignedBranchId },
        { label: 'Videolar', icon: Video, path: '/admin/videos', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Paketler', icon: Package, path: '/admin/packages', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Medya Kütüphanesi', icon: HardDrive, path: '/admin/media', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Başvurular', icon: MessageSquare, path: '/admin/leads', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN, UserRole.BRANCH_ADMIN] },
        { label: 'Kullanıcılar', icon: Users, path: '/admin/users', roles: [UserRole.SUPER_ADMIN] },
        { label: 'Ayarlar', icon: Settings, path: '/admin/settings', roles: [UserRole.SUPER_ADMIN] },
    ].filter(item => hasAccess(item.roles) && (item.condition === undefined || item.condition));

    return (
        <div className="flex min-h-screen bg-slate-50 font-outfit">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-brand-dark/95 backdrop-blur-xl border-r border-white/5 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center space-x-3 mb-10 px-2 group">
                        <div className="p-2.5 bg-white rounded-xl shadow-lg shadow-brand-blue/20 group-hover:rotate-6 transition-transform">
                            <img src="/assets/images/logoblue.svg" alt="Hocalara Geldik" className="h-8 w-auto" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-black text-sm tracking-tight leading-none capitalize">Hocalara Geldik</span>
                            <span className="text-brand-blue/60 text-[8px] font-black capitalize tracking-[0.2em] mt-1.5">Admin Panel</span>
                        </div>
                    </div>

                    <nav className="flex-grow space-y-1.5 overflow-y-auto">
                        {menuItems.map((item) => (
                            <Link
                                key={item.label}
                                to={item.path}
                                className={`flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-300 ${location.pathname === item.path
                                    ? 'bg-gradient-to-r from-brand-blue to-blue-400 text-white shadow-xl shadow-brand-blue/20'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <item.icon className={`w-5 h-5 transition-transform duration-300 ${location.pathname === item.path ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    <span className="text-[13px] font-bold tracking-wide">{item.label}</span>
                                </div>
                                {location.pathname === item.path && <ChevronRight className="w-4 h-4" />}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-4 py-3.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all group"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[13px] font-bold">Çıkış Yap</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex flex-col min-w-0">
                {/* Topbar */}
                <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg">
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden sm:flex items-center text-xs font-bold text-slate-400 space-x-2">
                            <span>HG</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-brand-dark capitalize tracking-tight">Panel</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-brand-blue capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden md:relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="İçerik ara..."
                                className="pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-2xl text-[13px] w-64 focus:ring-2 ring-brand-blue/10 transition-all outline-none"
                            />
                        </div>

                        <div className="flex items-center space-x-3 pl-6 border-l border-slate-100">
                            <div className="text-right hidden sm:block">
                                <p className="text-[13px] font-black text-brand-dark leading-none">{user?.name || 'Admin'}</p>
                                <p className="text-[10px] font-bold text-brand-blue capitalize tracking-widest mt-1">{user?.role?.replace('_', ' ') || 'User'}</p>
                            </div>
                            <img src={user?.avatar || 'https://via.placeholder.com/100'} className="w-10 h-10 rounded-xl object-cover shadow-lg border-2 border-white" alt="profile" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <main className="flex-grow p-8 lg:p-12 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
