/**
 * pages/Catalog.jsx
 * 选型列表页：FilterPanel + 结果网格 + 加载/空/错误状态
 */
import { Row, Col, Alert, Empty, Spin, Typography, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import useMotors from '../hooks/useMotors';
import FilterPanel from '../components/motor/FilterPanel';
import MotorCard from '../components/motor/MotorCard';

const { Title, Paragraph } = Typography;

export default function Catalog() {
  const { t } = useTranslation();
  const {
    filters,
    updateFilter,
    resetFilters,
    sortBy,
    setSortBy,
    data,
    total,
    loading,
    error,
    reload,
  } = useMotors();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6">
        <Title level={2} className="!mb-1">{t('catalog.title')}</Title>
        <Paragraph type="secondary" className="!mb-0">{t('catalog.subtitle')}</Paragraph>
      </div>

      <FilterPanel
        filters={filters}
        updateFilter={updateFilter}
        resetFilters={resetFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      <div className="mt-6 flex items-center justify-between">
        <span className="text-sm text-gray-500">{t('catalog.resultCount', { count: total })}</span>
      </div>

      {error && (
        <Alert
          type="error"
          showIcon
          className="mt-4"
          message={t('errors.loadFailed')}
          description={error}
          action={
            <Button size="small" icon={<ReloadOutlined />} onClick={reload}>
              {t('common.buttons.reset')}
            </Button>
          }
        />
      )}

      <div className="relative mt-4 min-h-[200px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
            <Spin size="large" tip={t('common.loading')} />
          </div>
        )}

        {!loading && !error && data.length === 0 ? (
          <Empty description={t('catalog.empty')} className="py-20" />
        ) : (
          <Row gutter={[20, 20]}>
            {data.map((motor) => (
              <Col xs={24} sm={12} lg={8} xl={6} key={motor.id}>
                <MotorCard motor={motor} />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}
