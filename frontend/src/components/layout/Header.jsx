/**
 * components/layout/Header.jsx
 * 顶部导航：Logo + 导航菜单 + 语言切换 + 登录态
 */
import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Space, Dropdown, Avatar } from 'antd';
import {
  HomeOutlined,
  AppstoreOutlined,
  InfoCircleOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import LanguageSwitch from '../common/LanguageSwitch';
import { App as AntdApp } from 'antd';

const { Header: AntHeader } = Layout;

export default function Header() {
  const { t } = useTranslation();
  const { user, token, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const items = useMemo(
    () => [
      { key: '/', icon: <HomeOutlined />, label: <Link to="/">{t('common.nav.home')}</Link> },
      { key: '/catalog', icon: <AppstoreOutlined />, label: <Link to="/catalog">{t('common.nav.catalog')}</Link> },
      { key: '/about', icon: <InfoCircleOutlined />, label: <Link to="/about">{t('common.nav.about')}</Link> },
    ],
    [t]
  );

  const handleLogout = async () => {
    await logout();
    message.success(t('auth.logoutSuccess'));
    navigate('/');
  };

  const userMenu = {
    items: [
      { key: 'admin', icon: <SettingOutlined />, label: <Link to="/admin">{t('common.nav.admin')}</Link> },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: t('common.nav.logout'), onClick: handleLogout },
    ],
  };

  return (
    <AntHeader className="sticky top-0 z-50 flex h-16 items-center justify-between !bg-white px-4 shadow-sm md:px-8">
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
            <ThunderboltFilled className="text-lg" />
          </span>
          <span className="hidden text-lg font-bold text-gray-800 sm:inline">{t('common.appName')}</span>
        </Link>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={items}
          className="!border-none !bg-transparent"
          style={{ minWidth: 0, flex: 'auto' }}
        />
      </div>

      <Space size="middle">
        <LanguageSwitch />
        {token && user ? (
          <Dropdown menu={userMenu} placement="bottomRight">
            <Space className="cursor-pointer">
              <Avatar size="small" icon={<UserOutlined />} className="!bg-primary-500" />
              <span className="hidden text-gray-700 md:inline">{user.username}</span>
            </Space>
          </Dropdown>
        ) : (
          <Button type="primary" icon={<UserOutlined />} onClick={() => navigate('/login')}>
            {t('common.nav.login')}
          </Button>
        )}
      </Space>
    </AntHeader>
  );
}
