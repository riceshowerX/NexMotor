import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Table, Button, Typography, Spin, Tag, Row, Col, 
  Tooltip, Alert, Pagination, Segmented, Dropdown, Menu 
} from 'antd';
import { ArrowLeft, Eye, Zap, LayoutGrid, List, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernCard from '../components/ui/ModernCard';
import GradientButton from '../components/ui/GradientButton';
import { motorAPI } from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Paragraph } = Typography;

// 样式修复（零警告）
const GlobalFixStyles = () => (
  <style>{`
    .custom-table .ant-table-thead > tr > th {
      background: #f8fafc !important;
      color: #1f2937 !important;
      font-weight: 600 !important;
    }
    .custom-table .ant-table-thead > tr > th .ant-table-column-title {
      color: #1f2937 !important;
    }
    .custom-table .ant-table-column-sorter {
      color: #94a3b8 !important;
    }
    .custom-table .ant-table-row:hover > td {
      background: #f1f5f9 !important;
    }
    .active-filter-tag {
      background: #f5f5f5 !important;
      border: 1px solid #d9d9d9 !important;
      color: #262626 !important;
    }
    .active-filter-tag .ant-tag-close-icon {
      color: #8c8c8c !important;
    }
    .mobile-table-wrapper::-webkit-scrollbar {
      height: 6px;
    }
    .mobile-table-wrapper::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
  `}</style>
);

function ProductListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [motors, setMotors] = useState([]); // ← 永远是数组
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('card');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 12, total: 0 });

  const isMobile = window.innerWidth < 768;

  // 关键修复：安全分页计算
  const paginatedMotors = useMemo(() => {
    if (viewMode === 'table') return motors;
    if (!Array.isArray(motors)) return [];

    const start = (pagination.current - 1) * pagination.pageSize;
    return motors.slice(start, start + pagination.pageSize);
  }, [motors, pagination.current, pagination.pageSize, viewMode]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const filters = Object.fromEntries(params.entries());

    const fetchMotors = async () => {
      setLoading(true);
      try {
        const response = await motorAPI.getMotors(filters);
        // 关键修复：兼容后端返回 { data: [...] } 或直接数组
        const motorsData = Array.isArray(response) 
          ? response 
          : response?.data 
            ? response.data 
            : response?.motors 
              ? response.motors 
              : [];
        
        setMotors(motorsData);
        setPagination(prev => ({ ...prev, current: 1, total: motorsData.length }));
      } catch (err) {
        console.error('加载失败:', err);
        setError('数据加载失败，请检查网络连接');
        setMotors([]); // 防止崩溃
      } finally {
        setLoading(false);
      }
    };
    
    fetchMotors();
  }, [location.search]);

  // 移动端精简表格列
  const mobileColumns = [
    {
      title: `${t('products.model')} / ${t('products.specs')}`,
      key: 'info',
      render: (_, r) => (
        <div className="py-3">
          <div className="font-bold text-blue-600 text-base">{r.model || '未知型号'}</div>
          <div className="text-xs text-gray-500 mt-1">{r.frameSize || '-'}</div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Tag color="blue" className="m-0 text-xs">{r.power || 0} kW</Tag>
            <Tag color="cyan" className="m-0 text-xs">{r.voltage || 0} V</Tag>
            <Tag color="purple" className="m-0 text-xs">{r.rpm || 0} r/min</Tag>
          </div>
          {r.efficiency && (
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs text-gray-500">{t('products.efficiency')}</span>
              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden max-w-24">
                <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: `${r.efficiency}%` }} />
              </div>
              <span className="text-xs font-medium text-green-600">{r.efficiency}%</span>
            </div>
          )}
        </div>
      )
    },
    {
      title: t('common.action'),
      key: 'action',
      width: 80,
      render: (_, r) => (
        <Button type="text" icon={<Eye size={18} className="text-blue-500" />} onClick={() => navigate(`/product/${r.id}`)} />
      )
    }
  ];

  const removeFilter = (key) => {
    const params = new URLSearchParams(location.search);
    params.delete(key);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => navigate('/product-list');

  const filterLabelMap = {
    power: t('products.power'),
    voltage: t('products.voltage'),
    rpm: t('products.rpm'),
    efficiency: t('products.efficiency'),
    frameSize: t('products.frame-size'),
    search: t('common.search'),
  };

  // PC 端完整表格列
  const desktopColumns = [
    { title: t('products.model'), dataIndex: 'model', key: 'model', sorter: (a, b) => (a.model || '').localeCompare(b.model || ''),
      render: text => <span className="font-bold text-blue-600">{text || '-'}</span> },
    { title: t('products.power'), dataIndex: 'power', key: 'power', sorter: (a, b) => (a.power || 0) - (b.power || 0),
      render: val => <Tag color="blue" className="border-0 bg-blue-50 text-blue-700">{val || 0} kW</Tag> },
    { title: t('products.voltage'), dataIndex: 'voltage', key: 'voltage',
      render: val => <Tag color="cyan" className="border-0 bg-cyan-50 text-cyan-700">{val || 0} V</Tag> },
    { title: t('products.rpm'), dataIndex: 'rpm', key: 'rpm',
      render: val => <Tag color="purple" className="border-0 bg-purple-50 text-purple-700">{val || 0} r/min</Tag> },
    { title: t('products.frame-size'), dataIndex: 'frameSize', key: 'frameSize',
      render: val => <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded text-xs">{val || '-'}</span> },
    { title: t('products.efficiency'), dataIndex: 'efficiency', key: 'efficiency', sorter: (a, b) => (a.efficiency || 0) - (b.efficiency || 0),
      render: val => val ? (
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: `${val}%` }} />
          </div>
          <span className="text-xs font-medium text-gray-600">{val}%</span>
        </div>
      ) : <span className="text-gray-300">-</span>
    },
    { title: t('common.action'), key: 'action', width: 100,
      render: (_, r) => (
        <Tooltip title={t('products.view-detail')}>
          <Button type="text" shape="circle" icon={<Eye size={16} className="text-blue-500" />} onClick={() => navigate(`/product/${r.id}`)} />
        </Tooltip>
      )
    }
  ];

  const columns = isMobile ? mobileColumns : desktopColumns;

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <GlobalFixStyles />

      <div className="absolute top-0 left-0 right-0 h-80 bg-gradient-to-b from-blue-50/80 to-transparent -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-8">
        {/* 标题区 */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 text-blue-600 mb-3">
            <Zap size={20} />
            <span className="font-bold text-sm uppercase tracking-wider">{t('products.catalog')}</span>
          </div>
          <Title level={3} className="!mb-2 !mt-0 text-gray-900">
            {t('products.all-series')}
          </Title>
          <Paragraph className="text-gray-500 text-sm">
            {t('products.total-products', { total: Array.isArray(motors) ? motors.length : 0 })}
          </Paragraph>
        </motion.div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur rounded-2xl p-5 text-center shadow-sm">
            <div className="text-xs text-gray-400 font-bold uppercase">{t('products.total-quantity')}</div>
            <div className="text-3xl font-bold text-gray-800 mt-1">{Array.isArray(motors) ? motors.length : 0}</div>
          </div>
          <div className="bg-white/80 backdrop-blur rounded-2xl p-5 text-center shadow-sm">
            <div className="text-xs text-gray-400 font-bold uppercase">{t('products.avg-efficiency')}</div>
            <div className="text-3xl font-bold text-green-600 mt-1">
              {Array.isArray(motors) && motors.length > 0 
                ? (motors.reduce((a, b) => a + (Number(b.efficiency) || 0), 0) / motors.length).toFixed(1)
                : 0}%
            </div>
          </div>
        </div>

        <ModernCard className="border-0 shadow-xl bg-white/80 backdrop-blur-md overflow-hidden">
          {/* 工具栏 */}
          <div className="p-4 border-b border-gray-100 bg-white/50">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <GradientButton 
                gradient="blue" 
                size={isMobile ? "small" : "middle"}
                icon={<ArrowLeft size={isMobile ? 14 : 16} />} 
                onClick={() => navigate('/')}
                className="shadow-sm"
              >
                {t('products.reset-filter')}
              </GradientButton>

              {isMobile ? (
                <Dropdown 
                  menu={
                    <Menu 
                      onClick={(e) => setViewMode(e.key)}
                      selectedKeys={[viewMode]}
                      items={[
                        { key: 'card', label: t('products.card-view'), icon: <LayoutGrid size={16} /> },
                        { key: 'table', label: t('products.table-view'), icon: <List size={16} /> },
                      ]}
                    />
                  }
                  trigger={['click']}
                >
                  <Button icon={viewMode === 'card' ? <LayoutGrid size={18} /> : <List size={18} />} />
                </Dropdown>
              ) : (
                <Segmented
                  options={[
                    { value: 'table', icon: <List size={16} />, label: t('products.list') },
                    { value: 'card', icon: <LayoutGrid size={16} />, label: t('products.card') },
                  ]}
                  value={viewMode}
                  onChange={setViewMode}
                  className="bg-gray-100"
                />
              )}
            </div>

            {/* 当前筛选标签 */}
            {location.search && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-xs text-gray-500 font-medium">{t('products.filter')}：</span>
                {Array.from(new URLSearchParams(location.search).entries()).map(([key, value]) => (
                  <Tag
                    key={`${key}-${value}`}
                    closable
                    onClose={() => removeFilter(key)}
                    className="active-filter-tag m-0 py-1 text-xs"
                  >
                    {filterLabelMap[key] || key}：{value}
                  </Tag>
                ))}
                <Button type="text" size="small" onClick={clearAllFilters} className="text-xs text-gray-500">
                  {t('products.clear-all')}
                </Button>
              </div>
            )}
          </div>

          {/* 数据区 */}
          <div className="p-4 lg:pb-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Spin size="large" />
                <p className="mt-4 text-gray-400 text-sm">{t('products.loading')}</p>
              </div>
            ) : !Array.isArray(motors) || motors.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={40} className="text-gray-300" />
                </div>
                <Title level={4} className="text-gray-500">{t('products.no-product')}</Title>
                <Button onClick={() => navigate('/')}>{t('products.clear-filter')}</Button>
              </div>
            ) : (
              <>
                {/* 表格模式 */}
                {viewMode === 'table' && (
                  <div className="overflow-x-auto mobile-table-wrapper -mx-4 px-4">
                    <Table
                      columns={columns}
                      dataSource={motors}
                      rowKey="id"
                      pagination={false}
                      className="custom-table"
                      scroll={{ x: 800 }}
                    />
                    {isMobile && (
                      <div className="text-center text-xs text-gray-400 py-2">
                        ← 左右滑动查看更多 →
                      </div>
                    )}
                  </div>
                )}

                {/* 卡片模式 */}
                {viewMode === 'card' && (
                  <Row gutter={[16, 16]}>
                    {paginatedMotors.map((motor) => (
                      <Col xs={24} sm={12} lg={8} xl={6} key={motor.id}>
                        <motion.div
                          layout
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ModernCard 
                            className="h-full border border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group"
                            onClick={() => navigate(`/product/${motor.id}`)}
                          >
                            <div className="p-5">
                              <div className="flex justify-between items-start mb-4">
                                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                  <Zap size={20} />
                                </div>
                                <Tag className="bg-gray-50 text-gray-500 text-xs">{motor.frameSize || '-'}</Tag>
                              </div>
                              <h3 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                                {motor.model || '未知型号'}
                              </h3>
                              <div className="mt-4 space-y-3 text-sm">
                                <div className="flex justify-between"><span className="text-gray-500">{t('products.power')}</span><span className="font-medium">{motor.power || 0} kW</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">{t('products.voltage')}</span><span className="font-medium">{motor.voltage || 0} V</span></div>
                                <div className="flex justify-between"><span className="text-gray-500">{t('products.rpm')}</span><span className="font-medium">{motor.rpm || 0} r/min</span></div>
                                {motor.efficiency && (
                                  <div className="flex items-center gap-3">
                                    <span className="text-gray-500 text-xs">{t('products.efficiency')}</span>
                                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-green-500" style={{ width: `${motor.efficiency}%` }} />
                                    </div>
                                    <span className="text-xs font-medium text-green-600">{motor.efficiency}%</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </ModernCard>
                        </motion.div>
                      </Col>
                    ))}
                  </Row>
                )}

                {/* 卡片模式分页 */}
                {viewMode === 'card' && Array.isArray(motors) && motors.length > pagination.pageSize && (
                  <div className="mt-8 flex justify-center">
                    <Pagination
                      current={pagination.current}
                      pageSize={pagination.pageSize}
                      total={motors.length}
                      onChange={(page, size) => setPagination({ ...pagination, current: page, pageSize: size || 12 })}
                      showSizeChanger={false}
                      responsive
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </ModernCard>
      </div>
    </div>
  );
}

export default ProductListPage;