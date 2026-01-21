
import React from 'react';
import { HashRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
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
const ProtectedAdminRoute = ({ user }: { user: AdminUser | null }) => {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
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
  const [user] = React.useState<AdminUser | null>({
    id: '1',
    name: 'Admin User',
    email: 'admin@hocalarageldik.com',
    role: UserRole.SUPER_ADMIN,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  });

  return (
    <HashRouter>
      <Routes>
        {/* Admin Routes - No Site Header/Footer */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<ProtectedAdminRoute user={user} />} />

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
