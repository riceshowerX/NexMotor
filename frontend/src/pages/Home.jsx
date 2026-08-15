/**
 * pages/Home.jsx
 * 首页：Hero + 核心特性 + 快速入口
 */
import { Link } from 'react-router-dom';
import { Button, Card, Row, Col, Statistic } from 'antd';
import {
  FilterOutlined,
  EyeOutlined,
  GlobalOutlined,
  SafetyOutlined,
  ArrowRightOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const FEATURES = [
  { key: 'filter', icon: <FilterOutlined />, color: '#2563eb' },
  { key: 'view3d', icon: <EyeOutlined />, color: '#7c3aed' },
  { key: 'i18n', icon: <GlobalOutlined />, color: '#059669' },
  { key: 'admin', icon: <SafetyOutlined />, color: '#ea580c' },
];

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-blue-800 py-20 md:py-28">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 text-center md:px-8">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur animate-scale-in">
            <ThunderboltFilled className="text-3xl text-yellow-300" />
          </div>
          <h1 className="mx-auto max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl animate-slide-up">
            {t('home.hero.title')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-blue-100 md:text-lg animate-fade-in">
            {t('home.hero.subtitle')}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 animate-fade-in">
            <Link to="/catalog">
              <Button type="primary" size="large" className="!bg-white !text-primary-700 hover:!bg-blue-50" icon={<ArrowRightOutlined />}>
                {t('home.hero.cta.catalog')}
              </Button>
            </Link>
            <Link to="/about">
              <Button size="large" ghost>
                {t('home.hero.cta.about')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 特性 */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 className="mb-10 text-center text-2xl font-bold text-gray-900 md:text-3xl">
          {t('home.features.title')}
        </h2>
        <Row gutter={[24, 24]}>
          {FEATURES.map((feature) => (
            <Col xs={24} sm={12} lg={6} key={feature.key}>
              <Card hoverable className="h-full !rounded-2xl text-center shadow-sm transition-shadow hover:shadow-md">
                <div
                  className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl text-white"
                  style={{ backgroundColor: feature.color }}
                >
                  {feature.icon}
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {t(`home.features.${feature.key}.title`)}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">
                  {t(`home.features.${feature.key}.desc`)}
                </p>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 数据统计 */}
        <Row gutter={[16, 16]} className="mt-14">
          <Col xs={12} md={6}>
            <Card className="!rounded-2xl text-center">
              <Statistic title={t('home.stats.motors')} value={16} suffix="+" />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card className="!rounded-2xl text-center">
              <Statistic title={t('home.stats.filters')} value={16} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card className="!rounded-2xl text-center">
              <Statistic title={t('home.stats.view3d')} value={1} />
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card className="!rounded-2xl text-center">
              <Statistic title={t('home.stats.languages')} value={2} />
            </Card>
          </Col>
        </Row>
      </section>
    </div>
  );
}
