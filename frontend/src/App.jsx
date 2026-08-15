/**
 * App.jsx
 * 路由表：/、/catalog、/motors/:id、/viewer/:id、/login、/admin、/about、* 404
 */
import { Routes, Route, Link } from 'react-router-dom';
import { Button, Result } from 'antd';
import { useTranslation } from 'react-i18next';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import MotorDetail from './pages/MotorDetail';
import Viewer3D from './components/viewer3d/Viewer3D';
import Login from './pages/Login';
import Admin from './pages/Admin';
import About from './pages/About';

function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Result
        status="404"
        title="404"
        subTitle={t('common.notFound')}
        extra={
          <Link to="/">
            <Button type="primary">{t('common.backHome')}</Button>
          </Link>
        }
      />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/motors/:id" element={<MotorDetail />} />
        <Route path="/about" element={<About />} />
      </Route>
      <Route path="/viewer/:id" element={<Viewer3D />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
