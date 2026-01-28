
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, ImageIcon, FileText, Building2,
    Video, Package, Users, Settings, LogOut,
    ChevronRight, Search, Map, List, HardDrive,
    MessageSquare, Menu, Layers, Trophy, Bell, X, Newspaper, Award, UserPlus, ArrowLeft
} from 'lucide-react';
import { AdminUser, UserRole } from '../types';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface AdminLayoutProps {
    user: AdminUser | null;
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ user, children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [myNotifications, setMyNotifications] = useState<any[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Fetch pending change requests for admins
    useEffect(() => {
        if (user && ['SUPER_ADMIN', 'CENTER_ADMIN'].includes(user.role)) {
            fetchPendingRequests();
            // Poll every 30 seconds
            const interval = setInterval(fetchPendingRequests, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    // Fetch notifications for branch admins
    useEffect(() => {
        if (user && user.role === 'BRANCH_ADMIN') {
            fetchMyNotifications();
            // Poll every 30 seconds
            const interval = setInterval(fetchMyNotifications, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    // Close notifications when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (showNotifications && !target.closest('.notifications-container')) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showNotifications]);

    const fetchPendingRequests = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/change-requests?status=PENDING`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingRequests(response.data.data || []);
        } catch (error) {
            console.error('Error fetching pending requests:', error);
        }
    };

    const fetchMyNotifications = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/notifications/my?isRead=false`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyNotifications(response.data.data || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            await axios.post(
                `${API_URL}/notifications/${notificationId}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchMyNotifications();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const hasAccess = (requiredRoles: UserRole[]) => !!user && requiredRoles.includes(user.role);

    interface MenuItem {
        label: string;
        icon: any;
        path: string;
        roles: UserRole[];
        condition?: boolean;
        badge?: number;
    }

    // Helper to get branch ID from URL if present (for Super Admin viewing branch)
    const getBranchIdFromUrl = () => {
        const match = location.pathname.match(/\/admin\/branch\/([^\/]+)/);
        return match ? match[1] : null;
    };

    const viewedBranchId = user?.role === UserRole.BRANCH_ADMIN ? user.branchId : getBranchIdFromUrl();
    const isBranchView = !!viewedBranchId && (user?.role === UserRole.BRANCH_ADMIN || (user?.role === UserRole.SUPER_ADMIN && location.pathname.includes('/admin/branch/')));

    // Branch admin menu items (Dynamic based on viewedBranchId)
    const getBranchMenuItems = (branchId: string): MenuItem[] => [
        { 
            label: 'Şubem', 
            icon: Building2, 
            path: `/admin/branch/${branchId}`, 
            roles: [UserRole.BRANCH_ADMIN, UserRole.SUPER_ADMIN], 
            condition: !!branchId 
        },
        { 
            label: 'Paketler', 
            icon: Package, 
            path: user?.role === UserRole.SUPER_ADMIN ? `/admin/branch/${branchId}/packages` : '/admin/branch-packages', 
            roles: [UserRole.BRANCH_ADMIN, UserRole.SUPER_ADMIN] 
        },
        { 
            label: 'Haberler', 
            icon: Newspaper, 
            path: user?.role === UserRole.SUPER_ADMIN ? `/admin/branch/${branchId}/news` : '/admin/branch-news', 
            roles: [UserRole.BRANCH_ADMIN, UserRole.SUPER_ADMIN] 
        },
        { 
            label: 'Başarılar', 
            icon: Award, 
            path: user?.role === UserRole.SUPER_ADMIN ? `/admin/branch/${branchId}/successes` : '/admin/branch-successes', 
            roles: [UserRole.BRANCH_ADMIN, UserRole.SUPER_ADMIN] 
        },
        { 
            label: 'Ön Kayıtlar', 
            icon: UserPlus, 
            path: user?.role === UserRole.SUPER_ADMIN ? `/admin/branch/${branchId}/leads` : '/admin/branch-leads', 
            roles: [UserRole.BRANCH_ADMIN, UserRole.SUPER_ADMIN] 
        },
        // Add a "Back to Dashboard" for SUPER_ADMIN
        ...(user?.role === UserRole.SUPER_ADMIN ? [{
            label: 'Şubeler Listesi',
            icon: LayoutDashboard,
            path: '/admin/branches',
            roles: [UserRole.SUPER_ADMIN]
        }] : [])
    ];

    // Genel admin menüsü
    const generalMenuItems: MenuItem[] = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Onaylar', icon: Bell, path: '/admin/approvals', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN], badge: pendingRequests.length },
        { label: 'Sayfa İçerikleri', icon: Layers, path: '/admin/content-sections', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Slider Yönetimi', icon: ImageIcon, path: '/admin/sliders', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Haberler', icon: FileText, path: '/admin/news', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Şubeler', icon: Building2, path: '/admin/branches', roles: [UserRole.SUPER_ADMIN] },
        { label: 'Videolar', icon: Video, path: '/admin/videos', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Paketler', icon: Package, path: '/admin/packages', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Başarılar', icon: Trophy, path: '/admin/successes', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Ön Kayıtlar', icon: UserPlus, path: '/admin/leads', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Franchise Başvuruları', icon: Building2, path: '/admin/franchise', roles: [UserRole.SUPER_ADMIN, UserRole.CENTER_ADMIN] },
        { label: 'Kullanıcılar', icon: Users, path: '/admin/users', roles: [UserRole.SUPER_ADMIN] },
        { label: 'Ayarlar', icon: Settings, path: '/admin/settings', roles: [UserRole.SUPER_ADMIN] },
    ];

    // Kullanıcı rolüne göre menü seç
    const menuItems = (isBranchView && viewedBranchId ? getBranchMenuItems(viewedBranchId) : generalMenuItems)
        .filter(item => hasAccess(item.roles) && (item.condition === undefined || item.condition));

    return (
        <div className="flex min-h-screen bg-slate-50 font-outfit relative w-full max-w-[100vw] overflow-x-hidden">
            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            
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

                    <nav className="flex-grow space-y-1.5 overflow-y-auto min-h-0">
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
                                <div className="flex items-center space-x-2">
                                    {item.badge && item.badge > 0 && (
                                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-black rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                    {location.pathname === item.path && <ChevronRight className="w-4 h-4" />}
                                </div>
                            </Link>
                        ))}
                    </nav>

                    <div className="pt-6 border-t border-white/5 mt-auto flex-shrink-0">
                        {/* Logout moved to header */}
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
                        
                        {/* Super Admin Back to Dashboard Button */}
                        {user?.role === UserRole.SUPER_ADMIN && isBranchView && (
                             <button 
                                onClick={() => navigate('/admin/branches')}
                                className="flex items-center space-x-2 px-4 py-2 bg-brand-dark text-white rounded-xl hover:bg-brand-blue transition-all shadow-lg shadow-brand-dark/20 mr-4"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="text-xs font-bold">Admin Paneline Dön</span>
                            </button>
                        )}

                        <div className="hidden sm:flex items-center text-xs font-bold text-slate-400 space-x-2">
                            <span>HG</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-brand-dark capitalize tracking-tight">Panel</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-brand-blue capitalize">
                                {(() => {
                                    const pathParts = location.pathname.split('/').filter(Boolean);
                                    const lastPart = pathParts[pathParts.length - 1];
                                    
                                    // UUID pattern kontrolü (8-4-4-4-12 format)
                                    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(lastPart);
                                    
                                    if (isUUID) {
                                        // Eğer UUID ise, bir önceki path parçasını kullan
                                        const previousPart = pathParts[pathParts.length - 2];
                                        
                                        // Path'e göre özel isimler
                                        const pathNames: Record<string, string> = {
                                            'branch': user?.role === 'BRANCH_ADMIN' ? 'Şubem' : 'Şube Detay',
                                            'admin': 'Dashboard',
                                            'sliders': 'Slider Yönetimi',
                                            'news': 'Haberler',
                                            'branches': 'Şubeler',
                                            'videos': 'Videolar',
                                            'packages': 'Paketler',
                                            'successes': 'Başarılar',
                                            'leads': 'Ön Kayıtlar',
                                            'franchise': 'Franchise Başvuruları',
                                            'users': 'Kullanıcılar',
                                            'settings': 'Ayarlar',
                                            'approvals': 'Onaylar',
                                            'content-sections': 'Sayfa İçerikleri',
                                            'branch-packages': 'Paketler',
                                            'branch-news': 'Haberler',
                                            'branch-successes': 'Başarılar',
                                            'branch-leads': 'Ön Kayıtlar',
                                        };
                                        
                                        return pathNames[previousPart] || previousPart;
                                    }
                                    
                                    // UUID değilse normal göster
                                    const pathNames: Record<string, string> = {
                                        'admin': 'Dashboard',
                                        'sliders': 'Slider Yönetimi',
                                        'news': 'Haberler',
                                        'branches': 'Şubeler',
                                        'videos': 'Videolar',
                                        'packages': 'Paketler',
                                        'successes': 'Başarılar',
                                        'leads': 'Ön Kayıtlar',
                                        'franchise': 'Franchise Başvuruları',
                                        'users': 'Kullanıcılar',
                                        'settings': 'Ayarlar',
                                        'approvals': 'Onaylar',
                                        'content-sections': 'Sayfa İçerikleri',
                                        'branch': user?.role === 'BRANCH_ADMIN' ? 'Şubem' : 'Şube Detay',
                                        'branch-packages': 'Paketler',
                                        'branch-news': 'Haberler',
                                        'branch-successes': 'Başarılar',
                                        'branch-leads': 'Ön Kayıtlar',
                                    };
                                    
                                    return pathNames[lastPart] || lastPart;
                                })()}
                            </span>
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

                        {/* Notifications for Admins */}
                        {user && ['SUPER_ADMIN', 'CENTER_ADMIN'].includes(user.role) && (
                            <div className="relative notifications-container">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    <Bell className="w-5 h-5 text-slate-600" />
                                    {pendingRequests.length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                                            {pendingRequests.length}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50">
                                        <div className="p-4 border-b border-slate-100">
                                            <h3 className="text-sm font-black text-brand-dark">Onay Bekleyen Değişiklikler</h3>
                                            <p className="text-xs text-slate-500 mt-1">{pendingRequests.length} talep bekliyor</p>
                                        </div>
                                        
                                        <div className="max-h-96 overflow-y-auto">
                                            {pendingRequests.length === 0 ? (
                                                <div className="p-8 text-center">
                                                    <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                                                    <p className="text-sm text-slate-500">Bekleyen talep yok</p>
                                                </div>
                                            ) : (
                                                pendingRequests.map((request) => (
                                                    <div key={request.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-all">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-brand-dark">
                                                                    {request.changeType === 'TEACHER_CREATE' && '👨‍🏫 Yeni Öğretmen'}
                                                                    {request.changeType === 'TEACHER_UPDATE' && '✏️ Öğretmen Güncelleme'}
                                                                    {request.changeType === 'TEACHER_DELETE' && '🗑️ Öğretmen Silme'}
                                                                    {request.changeType === 'BRANCH_UPDATE' && '🏢 Şube Güncelleme'}
                                                                </p>
                                                                <p className="text-xs text-slate-600 mt-1">
                                                                    {request.branch?.name} - {request.requester?.name}
                                                                </p>
                                                                <p className="text-xs text-slate-400 mt-1">
                                                                    {new Date(request.createdAt).toLocaleDateString('tr-TR', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    navigate('/admin/approvals');
                                                                    setShowNotifications(false);
                                                                }}
                                                                className="ml-2 px-3 py-1 bg-brand-blue text-white text-xs font-bold rounded-lg hover:bg-brand-dark transition-all"
                                                            >
                                                                İncele
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        
                                        {pendingRequests.length > 0 && (
                                            <div className="p-3 border-t border-slate-100">
                                                <button
                                                    onClick={() => {
                                                        navigate('/admin/approvals');
                                                        setShowNotifications(false);
                                                    }}
                                                    className="w-full py-2 text-sm font-bold text-brand-blue hover:bg-slate-50 rounded-lg transition-all"
                                                >
                                                    Tümünü Görüntüle
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Notifications for Branch Admins */}
                        {user && user.role === 'BRANCH_ADMIN' && (
                            <div className="relative notifications-container">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    <Bell className="w-5 h-5 text-slate-600" />
                                    {myNotifications.length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-black rounded-full flex items-center justify-center">
                                            {myNotifications.length}
                                        </span>
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50">
                                        <div className="p-4 border-b border-slate-100">
                                            <h3 className="text-sm font-black text-brand-dark">Bildirimler</h3>
                                            <p className="text-xs text-slate-500 mt-1">{myNotifications.length} okunmamış bildirim</p>
                                        </div>
                                        
                                        <div className="max-h-96 overflow-y-auto">
                                            {myNotifications.length === 0 ? (
                                                <div className="p-8 text-center">
                                                    <Bell className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                                                    <p className="text-sm text-slate-500">Yeni bildirim yok</p>
                                                </div>
                                            ) : (
                                                myNotifications.map((notification) => (
                                                    <div key={notification.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-all">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-brand-dark">
                                                                    {notification.title}
                                                                </p>
                                                                <p className="text-xs text-slate-600 mt-1 whitespace-pre-line">
                                                                    {notification.message}
                                                                </p>
                                                                <p className="text-xs text-slate-400 mt-2">
                                                                    {new Date(notification.createdAt).toLocaleDateString('tr-TR', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => markAsRead(notification.id)}
                                                                className="ml-2 p-1 hover:bg-slate-200 rounded-lg transition-all"
                                                                title="Okundu olarak işaretle"
                                                            >
                                                                <X className="w-4 h-4 text-slate-400" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center space-x-3 pl-6 border-l border-slate-100">
                            <button
                                onClick={handleLogout}
                                className="p-2 ml-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                title="Çıkış Yap"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
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
