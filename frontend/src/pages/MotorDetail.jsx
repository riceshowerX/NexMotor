/**
 * pages/MotorDetail.jsx
 * 详情页：参数表 + 图片 + 3D 入口按钮
 */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, Card, Button, Tag, Spin, Alert, Typography, Empty } from 'antd';
import {
  ArrowLeftOutlined,
  EyeOutlined,
  ProductOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getMotor } from '../api/motors';
import SpecTable from '../components/motor/SpecTable';
import { formatMotorField } from '../utils/format';

const { Title, Paragraph } = Typography;

export default function MotorDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  const [motor, setMotor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getMotor(id);
        if (mounted && res && res.success) setMotor(res.data);
        else if (mounted) setError(t('detail.notFound'));
      } catch (e) {
        if (mounted) setError(e.message || t('errors.loadFailed'));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [id, t]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spin size="large" tip={t('common.loading')} />
      </div>
    );
  }

  if (error || !motor) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Alert type="error" showIcon message={t('detail.notFound')} description={error} />
        <div className="mt-6 text-center">
          <Link to="/catalog">
            <Button icon={<ArrowLeftOutlined />}>{t('detail.back')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/catalog">
          <Button icon={<ArrowLeftOutlined />}>{t('detail.back')}</Button>
        </Link>
        <Link to={`/viewer/${motor.id}`}>
          <Button type="primary" size="large" icon={<EyeOutlined />}>
            {t('detail.view3d')}
          </Button>
        </Link>
      </div>

      <Row gutter={[24, 24]}>
        {/* 图片 / 占位 */}
        <Col xs={24} lg={9}>
          <Card className="!rounded-2xl" styles={{ body: { padding: 16 } }}>
            {motor.imageUrl && !imgError ? (
              <img
                src={motor.imageUrl}
                alt={t('detail.imageAlt')}
                className="h-64 w-full rounded-xl object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex h-64 w-full flex-col items-center justify-center rounded-xl bg-gray-100 text-gray-400">
                <ProductOutlined className="text-6xl" />
                <span className="mt-3 text-sm">{t('detail.demoModel')}</span>
              </div>
            )}
          </Card>
        </Col>

        {/* 概览 */}
        <Col xs={24} lg={15}>
          <Card className="!rounded-2xl" styles={{ body: { padding: 24 } }}>
            <div className="flex flex-wrap items-center gap-3">
              <ThunderboltFilled className="text-3xl text-primary-600" />
              <Title level={2} className="!mb-0">{motor.model}</Title>
              <Tag color="blue" className="!text-sm">{motor.frameSize}</Tag>
            </div>
            <Paragraph type="secondary" className="mt-3">
              {motor.description || t('detail.demoModel')}
            </Paragraph>
            <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl bg-primary-50 p-4">
                <div className="text-xs text-gray-500">{t('detail.field.power')}</div>
                <div className="mt-1 text-lg font-semibold text-primary-700">{formatMotorField(motor, 'power')}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-xs text-gray-500">{t('detail.field.rpm')}</div>
                <div className="mt-1 text-lg font-semibold text-gray-800">{formatMotorField(motor, 'rpm')}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-xs text-gray-500">{t('detail.field.voltage')}</div>
                <div className="mt-1 text-lg font-semibold text-gray-800">{formatMotorField(motor, 'voltage')}</div>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <div className="text-xs text-gray-500">{t('detail.field.efficiency')}</div>
                <div className="mt-1 text-lg font-semibold text-gray-800">{formatMotorField(motor, 'efficiency')}</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 规格表 */}
      <Card
        className="mt-6 !rounded-2xl"
        title={<Title level={4} className="!mb-0">{t('detail.specTitle')}</Title>}
        styles={{ body: { padding: 24 } }}
      >
        <SpecTable motor={motor} />
      </Card>
    </div>
  );
}
