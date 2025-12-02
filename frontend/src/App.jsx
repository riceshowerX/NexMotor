import React, { useState, useMemo } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Layout, Button, Avatar, Dropdown, Spin } from 'antd';
import { 
  User, LogOut, Home, Package, Search, Settings, 
  Menu as MenuIcon, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { useTranslation } from './hooks/useTranslation';

// 页面组件（新增这一行！）
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ProductEditPage from './pages/ProductEditPage';  // ← 新增导入

// 组件
import LanguageSwitch from './components/ui/LanguageSwitch';

const { Header, Content, Footer } = Layout;

// 导航配置（不变）
const NAV_LINKS = [
  { id: 'home', to: '/', icon: Home, textKey: 'nav.home' },
  { id: 'products', to: '/products', icon: Package, textKey: 'nav.products' },
  { id: 'quick-select', to: '/products', icon: Search, textKey: 'nav.quick-select' },
  { id: 'admin', to: '/admin', icon: Settings, textKey: 'nav.admin', auth: true },
];

// 保护路由（不变）
const RequireAuth = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Spin size="large" tip="认证中..." />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

function App() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // 用户下拉菜单（不变）
  const userMenu = useMemo(() => ({
    items: [
      {
        key: 'profile',
        label: '个人中心',
        icon: <User size={16} />,
      },
      { type: 'divider' },
      {
        key: 'logout',
        label: '退出登录',
        icon: <LogOut size={16} />,
        danger: true,
        onClick: logout,
      },
    ],
  }), [logout]);

  // Logo 组件（不变）
  const Logo = () => (
    <Link to="/" className="flex items-center gap-3 group">
      <motion.div 
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
        className="w-10 h-10"
      >
        <img 
          src="/src/assets/logo/logo透明底蓝色1.png" 
          alt="电机选型系统 Logo" 
          className="w-full h-full object-contain drop-shadow-md"
        />
      </motion.div>
      <motion.h1 
        className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        whileHover={{ scale: 1.05 }}
      >
        电机选型系统
      </motion.h1>
    </Link>
  );

  // 移动端菜单（不变）
  const MobileMenu = () => (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-gray-200 md:hidden"
        >
          <div className="p-4 space-y-1">
            {NAV_LINKS.filter(link => !link.auth || isAuthenticated).map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.id}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium shadow-sm' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span>{t(link.textKey)}</span>
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <LanguageProvider>
      <Layout className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        {/* Header（完全不变） */}
        <Header className="fixed top-0 left-0 right-0 z-50 h-16 px-4 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
            <Logo />

            {/* 桌面导航 */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.filter(link => !link.auth || isAuthenticated).map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.id}
                    to={link.to}
                    className={`flex items-center gap-2 font-medium transition-all duration-300 ${
                      isActive 
                        ? 'text-indigo-600' 
                        : 'text-gray-600 hover:text-indigo-600'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{t(link.textKey)}</span>
                  </Link>
                );
              })}
            </nav>

            {/* 右侧用户区域 */}
            <div className="flex items-center gap-4">
              {/* 语言切换按钮 */}
              <LanguageSwitch />
              
              {isAuthenticated ? (
                <Dropdown menu={userMenu} trigger={['click']} placement="bottomRight">
                  <Button type="text" className="flex items-center gap-3 h-12 px-4 rounded-xl hover:bg-gray-100 transition-all">
                    <Avatar 
                      size={36} 
                      icon={<User size={18} />} 
                      className="bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md"
                    />
                    <div className="text-left hidden xl:block">
                      <div className="text-sm font-medium text-gray-900">{user?.username || '管理员'}</div>
                      <div className="text-xs text-gray-500">{user?.role || 'Admin'}</div>
                    </div>
                  </Button>
                </Dropdown>
              ) : (
                <Link to="/login">
                  <Button type="primary" size="large" className="h-12 px-8 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">
                    登录后台
                  </Button>
                </Link>
              )}

              {/* 移动端菜单按钮 */}
              <Button
                type="text"
                className="lg:hidden"
                icon={mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
                onClick={() => setMobileMenuOpen(v => !v)}
              />
            </div>
          </div>

          {/* 移动端菜单 */}
          <MobileMenu />
        </Header>

        {/* 主内容区 */}
        <Content className="pt-20">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              {/* 管理员页面 */}
              <Route 
                path="/admin" 
                element={
                  <RequireAuth>
                    <AdminPage />
                  </RequireAuth>
                } 
              />

              {/* ★★★★★★ 新增的产品新增与编辑页面（已受管理员权限保护） ★★★★★★ */}
              <Route 
                path="/product/add" 
                element={
                  <RequireAuth>
                    <ProductEditPage />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/product/edit/:id" 
                element={
                  <RequireAuth>
                    <ProductEditPage />
                  </RequireAuth>
                } 
              />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
        </Content>

        {/* Footer（不变） */}
        <Footer className="bg-gray-900 text-white py-12 text-center border-t-0">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-gray-400 text-sm">
              {t('footer', { year: new Date().getFullYear() })}
            </p>
          </div>
        </Footer>
      </Layout>
    </LanguageProvider>
  );
}

export default App;