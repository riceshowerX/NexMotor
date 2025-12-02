import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, Button, Row, Col, Tag, Spin, Alert, Space, Image, message, Divider, Tooltip, Modal, Grid
} from 'antd';
import { 
  ArrowLeft, Zap, Settings, TrendingUp, Package, Award, 
  Share2, Heart, Download, X, Box, Shield, Thermometer, Weight, 
  Cable, Gauge, Activity, FileText, Layers, Ruler, Wind, 
  Droplet, Radio, Wrench, Plug, Cpu, BatteryCharging
} from 'lucide-react';
import { motion } from 'framer-motion';
import ModernCard from '../components/ui/ModernCard';
import GradientButton from '../components/ui/GradientButton';
import { motorAPI } from '../services/api';
import Motor3DViewer from '../components/3d/Motor3DViewer';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

// --- 专业参数项组件 ---
const SpecItem = ({ label, value, unit = '', icon: Icon, color = 'blue', tooltip }) => (
  <Tooltip title={tooltip}>
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group flex items-center justify-between p-4 bg-gray-50/70 rounded-2xl hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-200 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${color}-50 text-${color}-600 group-hover:scale-110 transition-transform`}>
          <Icon size={22} />
        </div>
        <div>
          <div className="text-gray-500 text-sm font-medium">{label}</div>
          {tooltip && <div className="text-xs text-gray-400">({tooltip})</div>}
        </div>
      </div>
      <div className="text-right">
        <span className="text-xl font-bold text-gray-900">
          {value !== undefined && value !== null && value !== '' ? value : '-'}
        </span>
        {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
      </div>
    </motion.div>
  </Tooltip>
);

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const screens = useBreakpoint();
  const isMobile = screens.xs || (screens.sm && !screens.md);

  const [motor, setMotor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);

  useEffect(() => {
    const fetchMotorDetail = async () => {
      if (!id || isNaN(id)) {
        setError('无效的电机ID');
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await motorAPI.getMotorById(id);

        // 兼容后端返回 { data: {...} } 或直接对象
        const motorData = response?.data || response || null;

        if (!motorData || !motorData.id) {
          setError('电机不存在或已被删除');
          setMotor(null);
        } else {
          // 关键修复：防止图片缓存
          if (motorData.imageUrl) {
            motorData.imageUrl = `${motorData.imageUrl}?t=${Date.now()}`;
          }
          setMotor(motorData);
        }
      } catch (err) {
        console.error('获取详情失败:', err);
        setError('加载失败，请检查网络或稍后重试');
        setMotor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMotorDetail();
  }, [id]);

  const handleShare = async () => {
    try {
      if (navigator.share && motor) {
        await navigator.share({ title: motor.model, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        message.success('链接已复制');
      }
    } catch (err) {}
  };

  const basicSpecs = useMemo(() => motor ? [
    { label: t('product-detail.motor-model'), value: motor.model, icon: FileText, color: 'blue' },
    { label: t('products.frame-size'), value: motor.frameSize, icon: Ruler, color: 'orange' },
    { label: t('product-detail.rated-power'), value: motor.power, unit: 'kW', icon: Zap, color: 'yellow' },
    { label: t('product-detail.rated-voltage'), value: motor.voltage, unit: 'V', icon: BatteryCharging, color: 'green' },
    { label: t('product-detail.rated-speed'), value: motor.rpm, unit: 'r/min', icon: Settings, color: 'purple' },
    { label: t('product-detail.rated-current'), value: motor.current, unit: 'A', icon: Activity, color: 'cyan' },
    { label: t('product-detail.efficiency'), value: motor.efficiency, unit: '%', icon: Award, color: 'emerald' },
    { label: t('product-detail.power-factor'), value: motor.powerFactor, unit: 'cos φ', icon: Gauge, color: 'indigo' },
  ] : [], [motor, t]);

  const mechanicalSpecs = useMemo(() => motor ? [
    { label: t('product-detail.poles'), value: motor.poles, icon: Cable, color: 'pink' },
    { label: t('product-detail.frequency'), value: motor.frequency || 50, unit: 'Hz', icon: Wind, color: 'teal' },
    { label: t('product-detail.protection-class'), value: motor.ip || 'IP55', icon: Shield, color: 'red' },
    { label: t('product-detail.insulation-class'), value: motor.insulation || 'F', icon: Thermometer, color: 'rose' },
    { label: t('product-detail.mounting-type'), value: motor.mounting || 'IM B3', icon: Wrench, color: 'violet' },
    { label: t('product-detail.weight'), value: motor.weight, unit: 'kg', icon: Weight, color: 'amber' },
    { label: t('product-detail.connection-type'), value: motor.connection || 'Y', icon: Plug, color: 'lime' },
  ] : [], [motor, t]);

  const performanceSpecs = useMemo(() => {
    if (!motor) return [];
    const specs = [];
    if (motor.lockedRotorTorque) specs.push({ label: t('product-detail.locked-rotor-torque'), value: motor.lockedRotorTorque, tooltip: 'Tst/Tn', icon: Gauge, color: 'emerald' });
    if (motor.maxTorque) specs.push({ label: t('product-detail.max-torque'), value: motor.maxTorque, tooltip: 'Tm/Tn', icon: TrendingUp, color: 'green' });
    if (motor.startingCurrent) specs.push({ label: t('product-detail.starting-current'), value: motor.startingCurrent, tooltip: 'Ist/In', icon: Zap, color: 'yellow' });
    if (motor.noise) specs.push({ label: t('product-detail.noise'), value: motor.noise, unit: 'dB(A)', icon: Activity, color: 'gray' });
    return specs;
  }, [motor, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !motor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Alert
          message={t('common.error')}
          description={error || t('product-detail.not-exist')}
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/product-list')}>
              {t('product-detail.back')}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 顶部导航 */}
      <motion.div className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button type="text" icon={<ArrowLeft size={20} />} onClick={() => navigate(-1)} />
            <div>
              <Title level={4} className="!mb-0">{motor.model}</Title>
              <Text type="secondary" className="text-sm">{t('product-detail.motor-type')}</Text>
            </div>
          </div>
          <Space>
            <Tooltip title={t('product-detail.share')}>
              <Button shape="circle" icon={<Share2 size={18} />} onClick={handleShare} />
            </Tooltip>
            <Tooltip title={t('product-detail.favorite')}>
              <Button 
                shape="circle" 
                icon={<Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : ""} />} 
                onClick={() => setIsFavorite(v => !v)} 
              />
            </Tooltip>
            <GradientButton gradient="blue">{t('product-detail.inquire')}</GradientButton>
          </Space>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Row gutter={[24, 24]}>
          {/* 左侧：图片 */}
          <Col xs={24} lg={10}>
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
              <ModernCard className="overflow-hidden mb-6">
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                  {motor.imageUrl ? (
                    <Image 
                      src={motor.imageUrl} 
                      alt={motor.model} 
                      className="max-h-full object-contain" 
                      preview={false}
                      fallback="/placeholder-motor.jpg" // 可选：加载失败显示占位图
                    />
                  ) : (
                    <Package size={120} className="text-gray-300" />
                  )}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {motor.efficiency && (
                      <Tag color="green" className="text-lg font-bold px-4 py-1">
                        IE{motor.efficiency >= 96 ? '5' : motor.efficiency >= 94 ? '4' : '3'}
                      </Tag>
                    )}
                    <Tag color="blue" className="text-sm">{t('product-detail.industrial-grade')}</Tag>
                  </div>
                  <Tooltip title={t('product-detail.3d-viewer')}>
                    <Button 
                      size="large" shape="circle" 
                      className="absolute bottom-4 right-4 shadow-2xl bg-white"
                      icon={<Box size={28} />}
                      onClick={() => setIs3DModalOpen(true)}
                    />
                  </Tooltip>
                </div>
              </ModernCard>

              <div className="grid grid-cols-2 gap-4">
                <Button block size="large" icon={<Box size={18} />} onClick={() => setIs3DModalOpen(true)}>
                  {t('product-detail.3d-viewer')}
                </Button>
                <Button block size="large" icon={<Download size={18} />}>
                  {t('product-detail.download-docs')}
                </Button>
              </div>
            </motion.div>
          </Col>

          {/* 右侧：参数区 */}
          <Col xs={24} lg={14}>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <ModernCard className="mb-6">
                <Title level={4} className="mb-6 flex items-center gap-3">
                  <Zap className="text-yellow-500" /> {t('product-detail.basic-electrical')}
                </Title>
                <Row gutter={[16, 16]}>
                  {basicSpecs.map((spec, i) => (
                    <Col xs={24} sm={12} key={i}>
                      <SpecItem {...spec} />
                    </Col>
                  ))}
                </Row>
              </ModernCard>

              <ModernCard className="mb-6">
                <Title level={4} className="mb-6 flex items-center gap-3">
                  <Settings className="text-purple-500" /> {t('product-detail.mechanical-protection')}
                </Title>
                <Row gutter={[16, 16]}>
                  {mechanicalSpecs.map((spec, i) => (
                    <Col xs={24} sm={12} lg={12} key={i}>
                      <SpecItem {...spec} />
                    </Col>
                  ))}
                </Row>
              </ModernCard>

              {performanceSpecs.length > 0 && (
                <ModernCard className="mb-6">
                  <Title level={4} className="mb-6 flex items-center gap-3">
                    <TrendingUp className="text-green-500" /> {t('product-detail.performance')}
                  </Title>
                  <Row gutter={[16, 16]}>
                    {performanceSpecs.map((spec, i) => (
                      <Col xs={24} sm={12} lg={12} key={i}>
                        <SpecItem {...spec} />
                      </Col>
                    ))}
                  </Row>
                </ModernCard>
              )}

              <ModernCard>
                <Title level={4} className="mb-4 flex items-center gap-2">
                  <FileText className="text-blue-500" /> {t('product-detail.product-desc')}
                </Title>
                <Paragraph className="text-gray-600 leading-relaxed text-base">
                  {motor.description || '该系列电机采用高强度铸铁机座、优化电磁设计，具备高效率、低噪声、长寿命等特点，适用于风机、水泵、压缩机、机床等通用工业领域。'}
                </Paragraph>
              </ModernCard>
            </motion.div>
          </Col>
        </Row>
      </div>

      {/* 3D 模态框 */}
      <Modal
        open={is3DModalOpen}
        onCancel={() => setIs3DModalOpen(false)}
        footer={null}
        width={isMobile ? "100vw" : "90vw"}
        style={{ top: 20, paddingBottom: 0 }}
        destroyOnHidden={true}
        styles={{ body: { padding: 0, height: isMobile ? '80vh' : '85vh' } }}
        closeIcon={
          <Button shape="circle" size="large" icon={<X size={24} />} className="absolute top-4 right-4 z-10 bg-white/80 shadow-lg" />
        }
      >
        <Motor3DViewer modelId={motor?.model || 'default'} />
      </Modal>
    </div>
  );
}

export default ProductDetailPage;