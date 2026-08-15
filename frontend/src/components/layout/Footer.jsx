/**
 * components/layout/Footer.jsx
 * 页脚
 */
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { useTranslation } from 'react-i18next';

const { Footer: AntFooter } = Layout;

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <AntFooter className="!bg-gray-900 !px-4 !py-8 md:!px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-gray-400 md:flex-row">
        <div className="text-center md:text-left">
          <div className="text-base font-semibold text-white">{t('common.appName')}</div>
          <div className="mt-1 text-sm">© {year} NexMotor. All rights reserved.</div>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm">
          <Link to="/" className="hover:text-white">{t('common.nav.home')}</Link>
          <Link to="/catalog" className="hover:text-white">{t('common.nav.catalog')}</Link>
          <Link to="/about" className="hover:text-white">{t('common.nav.about')}</Link>
          <Link to="/admin" className="hover:text-white">{t('common.nav.admin')}</Link>
        </nav>
      </div>
    </AntFooter>
  );
}
