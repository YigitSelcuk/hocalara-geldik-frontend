
import React from 'react';
import { HashRouter, Routes, Route, useParams, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import MainHome from './pages/MainHome';
import BranchHome from './pages/BranchHome';
import BranchList from './pages/BranchList';
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './pages/AdminLogin';
import SuccessPage from './pages/SuccessPage';
import BranchSuccessPage from './pages/BranchSuccessPage';
import FranchisePage from './pages/FranchisePage';
import VideoGallery from './pages/VideoGallery';
import PackagesPage from './pages/PackagesPage';
import CalculatorPage from './pages/CalculatorPage';
import AboutPage from './pages/AboutPage';
import TeachersPage from './pages/TeachersPage';
import ContactPage from './pages/ContactPage';
import BranchesFeaturePage from './pages/BranchesFeaturePage';
import DigitalPlatformPage from './pages/DigitalPlatformPage';
import InternationalPage from './pages/InternationalPage';
import VideoLibraryPage from './pages/VideoLibraryPage';
import GuidancePage from './pages/GuidancePage';
import AdminLayout from './components/AdminLayout';
import { branchService } from './services/cms.service';
import { AdminUser, UserRole, Branch } from './types';

// ScrollToTop component - scrolls to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const BranchWrapper: React.FC = () => {
  const [branch, setBranch] = React.useState<Branch | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { slug } = useParams<{ slug: string }>();

  React.useEffect(() => {
    const fetchBranch = async () => {
      try {
        if (!slug) return;
        const res = await branchService.getBySlug(slug);
        setBranch(res.data.branch);
      } catch (error) {
        console.error('Error fetching branch:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBranch();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!branch) {
    return <Navigate to="/subeler" replace />;
  }

  return <BranchHome branch={branch} />;
};

// Protected Admin Route Component
const ProtectedAdminRoute = ({ user, setUser }: { user: AdminUser | null; setUser: (user: AdminUser | null) => void }) => {
  const [loading, setLoading] = React.useState(true);
  const token = localStorage.getItem('adminToken');

  React.useEffect(() => {
    // Reload user from localStorage when component mounts
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as UserRole,
          branchId: userData.branchId,
          avatar: userData.avatar
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setLoading(false);
  }, [setUser]);

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Show loading while user data is being loaded
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-blue mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout user={user}>
      <AdminPanel user={user} />
    </AdminLayout>
  );
};

const SiteLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow pt-24">
      {children}
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  const [user, setUser] = React.useState<AdminUser | null>(null);

  React.useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role as UserRole,
          branchId: userData.branchId,
          avatar: userData.avatar
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes - No Site Header/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<ProtectedAdminRoute user={user} setUser={setUser} />} />

        {/* Public Routes - Wrapped in SiteLayout */}
        <Route
          path="*"
          element={
            <SiteLayout>
              <Routes>
                <Route path="/" element={<MainHome />} />
                <Route path="/hakkimizda" element={<AboutPage />} />
                <Route path="/egitmenler" element={<TeachersPage />} />
                <Route path="/iletisim" element={<ContactPage />} />
                <Route path="/basari-merkezleri" element={<BranchesFeaturePage />} />
                <Route path="/dijital-platform" element={<DigitalPlatformPage />} />
                <Route path="/yurtdisi-egitim" element={<InternationalPage />} />
                <Route path="/video-kutuphanesi" element={<VideoLibraryPage />} />
                <Route path="/rehberlik" element={<GuidancePage />} />
                <Route path="/haberler" element={<NewsList />} />
                <Route path="/haberler/:id" element={<NewsDetail />} />
                <Route path="/subeler" element={<BranchList />} />
                <Route path="/subeler/:slug" element={<BranchWrapper />} />
                <Route path="/subeler/:slug/basarilar" element={<BranchSuccessPage />} />
                <Route path="/basarilarimiz" element={<SuccessPage />} />
                <Route path="/franchise" element={<FranchisePage />} />
                <Route path="/videolar" element={<VideoGallery />} />
                <Route path="/paketler" element={<PackagesPage />} />
                <Route path="/hesaplama" element={<CalculatorPage />} />
                <Route path="/:slug" element={<BranchWrapper />} />
              </Routes>
            </SiteLayout>
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default App;
