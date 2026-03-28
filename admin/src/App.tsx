import { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, Users, FileText, CheckSquare, LogOut, Menu, X } from 'lucide-react';
import { adminApi, getAdminRole, clearAdminToken } from './services/api';
import LoginPage from './pages/LoginPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import RequirementsPage from './pages/RequirementsPage';

type Page = 'dashboard' | 'users' | 'requirements';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const role = getAdminRole();
      console.log('Initial role check:', role);
      if (role === 'admin') {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setError('初始化失败：' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = useCallback(async (email: string, password: string) => {
    await adminApi.login(email, password);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    clearAdminToken();
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'users':
        return <UsersPage />;
      case 'requirements':
        return <RequirementsPage onLogout={handleLogout} />;
      default:
        return <DashboardPage />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-surface">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-on-surface">加载中...</p>
          {error && <p className="text-error mt-2">{error}</p>}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => window.location.href = '/register'}
            className="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-sm hover:bg-surface-container-highest transition-colors"
          >
            创建管理员账号
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-container transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-outline-variant">
          <h1 className="text-xl font-headline font-bold text-primary">学领航 · 管理后台</h1>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem icon={LayoutDashboard} label="数据概览" active={currentPage === 'dashboard'} onClick={() => { setCurrentPage('dashboard'); setSidebarOpen(false); }} />
          <NavItem icon={Users} label="用户管理" active={currentPage === 'users'} onClick={() => { setCurrentPage('users'); setSidebarOpen(false); }} />
          <NavItem icon={FileText} label="需求审批" active={currentPage === 'requirements'} onClick={() => { setCurrentPage('requirements'); setSidebarOpen(false); }} />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-outline-variant">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-surface-container-high transition-colors">
            <LogOut className="w-5 h-5" />
            <span>退出登录</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 bg-surface-container/80 backdrop-blur-lg border-b border-outline-variant">
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-surface-container-high">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold">
              {currentPage === 'dashboard' && '数据概览'}
              {currentPage === 'users' && '用户管理'}
              {currentPage === 'requirements' && '需求审批'}
            </h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-on-surface-variant">管理员</span>
            </div>
          </div>
        </header>

        <div className="p-6">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
        active ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
}

export default App;