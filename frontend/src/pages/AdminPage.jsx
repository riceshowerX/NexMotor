// src/pages/AdminPage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, Button, Input, Popconfirm, message, Typography, Space, Row, Col, Statistic, Tag, Tooltip, Avatar, Badge
} from 'antd';
import { 
  Plus, Delete, Search, LogOut, Zap, TrendingUp, 
  Database, Activity, LayoutDashboard, Edit
} from 'lucide-react';
import { motion } from 'framer-motion';

// 关键修复：去掉多余的 “Card”
import ModernCard from '../components/ui/ModernCard';
import GradientButton from '../components/ui/GradientButton';
import { motorAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

const { Title } = Typography;

// ========= 表格样式修复（零警告）=========
const AdminTableFixStyles = () => (
  <style>{`
    .custom-admin-table .ant-table-thead > tr > th {
      background: #fafafa !important;
      color: #1f2937 !important;
      font-weight: 600 !important;
      border-bottom: 1px solid #e5e7eb !important;
    }
    .custom-admin-table .ant-table-thead > tr > th .ant-table-column-title,
    .custom-admin-table .ant-table-column-sorter {
      color: #1f2937 !important;
    }
    .custom-admin-table .ant-table-column-sorter {
      color: #94a3b8 !important;
    }
    .custom-admin-table .ant-table-row:hover > td {
      background: #f8fafc !important;
    }
  `}</style>
);

// 统计卡片（保持不变）
const StatCard = ({ title, value, suffix, icon: Icon, color, trend }) => (
  <ModernCard className="h-full border-0 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-50 rounded-full -mr-12 -mt-12 opacity-50`} />
    <div className="relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
          <Icon size={24} />
        </div>
        {trend && <Badge count={trend} style={{ backgroundColor: '#e6f7ff', color: '#1890ff', fontWeight: 'bold' }} />}
      </div>
      <Statistic 
        title={<span className="text-gray-500 font-medium">{title}</span>}
        value={value}
        suffix={<span className="text-sm text-gray-400 ml-1">{suffix}</span>}
        valueStyle={{ fontWeight: 700, fontSize: '1.75rem', color: '#1f2937' }}
      />
    </div>
  </ModernCard>
);

function AdminPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [motors, setMotors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');

  const fetchMotors = useCallback(async () => {
    setLoading(true);
    try {
      const data = await motorAPI.getMotors();
      const motorsData = Array.isArray(data) ? data : data?.data || [];
      setMotors(motorsData);
    } catch (error) {
      message.error('数据加载失败');
      setMotors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMotors();
  }, [fetchMotors]);

  const stats = useMemo(() => {
    if (!Array.isArray(motors) || motors.length === 0) {
      return { total: 0, avgEff: '0.0', totalPower: '0' };
    }
    const total = motors.length;
    const sumEff = motors.reduce((sum, m) => sum + (parseFloat(m.efficiency) || 0), 0);
    const avgEff = (sumEff / total).toFixed(1);
    const totalPower = motors.reduce((sum, m) => sum + (parseFloat(m.power) || 0), 0).toFixed(0);
    return { total, avgEff, totalPower };
  }, [motors]);

  const filteredMotors = useMemo(() => {
    if (!Array.isArray(motors)) return [];
    if (!searchText) return motors;
    const lower = searchText.toLowerCase();
    return motors.filter(m => 
      m && (
        (m.model && m.model.toLowerCase().includes(lower)) ||
        (m.frameSize && m.frameSize.toLowerCase().includes(lower))
      )
    );
  }, [motors, searchText]);

  const handleDelete = async (id) => {
    try {
      await motorAPI.deleteMotor(id);
      message.success('删除成功');
      fetchMotors();
    } catch (e) {
      message.error('删除失败');
    }
  };

  const columns = [
    {
      title: t('admin.product-info'),
      dataIndex: 'model',
      key: 'model',
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <Avatar shape="square" size={40} className="bg-blue-50 text-blue-600 font-bold border border-blue-100">
            {text?.substring(0, 2) || 'M'}
          </Avatar>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">{text || '未知型号'}</span>
            <span className="text-xs text-gray-400">ID: {record.id}</span>
          </div>
        </div>
      )
    },
    {
      title: t('products.frame-size'),
      dataIndex: 'frameSize',
      key: 'frameSize',
      render: text => <Tag color="default" className="text-gray-600 bg-gray-50 border-gray-200">{text || '-'}</Tag>
    },
    {
      title: t('admin.core-params'),
      key: 'specs',
      render: (_, r) => (
        <Space size="small" wrap>
          <Tag color="blue" className="border-0 bg-blue-50 text-blue-700">{r.power || 0} kW</Tag>
          <Tag color="cyan" className="border-0 bg-cyan-50 text-cyan-700">{r.rpm || 0} r/min</Tag>
        </Space>
      )
    },
    {
      title: t('products.efficiency'),
      dataIndex: 'efficiency',
      key: 'efficiency',
      sorter: (a, b) => (a.efficiency || 0) - (b.efficiency || 0),
      render: (val) => val ? (
        <div className="w-24">
          <div className="flex justify-between text-xs mb-1 text-gray-500">
            <span>{val}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500" style={{ width: `${val}%` }} />
          </div>
        </div>
      ) : <span className="text-gray-300">-</span>
    },
    {
      title: t('common.action'),
      key: 'action',
      width: 120,
      align: 'right',
      render: (_, record) => (
        <div className="flex justify-end gap-2">
          <Tooltip title={t('common.edit')}>
            <Button 
              type="text" 
              shape="circle" 
              icon={<Edit size={16} className="text-gray-500 hover:text-blue-600" />} 
              onClick={() => navigate(`/product/edit/${record.id}`)}
            />
          </Tooltip>
          <Popconfirm 
            title={t('admin.confirm-delete', { model: record.model })}
            onConfirm={() => handleDelete(record.id)} 
            okText={t('common.delete')} 
            cancelText={t('common.cancel')} 
            okButtonProps={{ danger: true }}
          >
            <Tooltip title={t('common.delete')}>
              <Button 
                type="text" 
                shape="circle" 
                icon={<Delete size={16} className="text-gray-500 hover:text-red-600" />} 
              />
            </Tooltip>
          </Popconfirm>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <AdminTableFixStyles />

      {/* 头部 */}
      <div className="bg-white border-b border-gray-100 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <LayoutDashboard className="text-blue-600" />
                {t('admin.dashboard-title')}
              </h1>
              <p className="text-gray-500 mt-1 text-sm">{t('admin.welcome-back')}</p>
            </div>
            <div className="flex items-center gap-3">
              <Button icon={<LogOut size={16} />} onClick={() => logout()} className="hover:bg-red-50 hover:text-red-600 hover:border-red-100">
                {t('admin.logout')}
              </Button>
              <GradientButton 
                gradient="blue" 
                icon={<Plus size={16} />} 
                onClick={() => navigate('/product/add')}
              >
                {t('admin.add-product')}
              </GradientButton>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Row gutter={[20, 20]} className="mb-8">
          <Col xs={24} sm={12} lg={8}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <StatCard title={t('admin.in-stock')} value={stats.total} suffix="个" icon={Database} color="blue" trend="+12" />
            </motion.div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <StatCard title={t('admin.avg-eff')} value={stats.avgEff} suffix="%" icon={Activity} color="green" />
            </motion.div>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <StatCard title={t('admin.total-power')} value={stats.totalPower} suffix="kW" icon={Zap} color="purple" />
            </motion.div>
          </Col>
        </Row>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <ModernCard className="border-0 shadow-lg overflow-hidden">
            <div className="p-5 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800 text-lg">{t('admin.product-list')}</h3>
                <Tag className="bg-blue-50 text-blue-600 border-0 rounded-full px-3">{filteredMotors.length} {t('common.records')}</Tag>
              </div>
              <Input 
                prefix={<Search size={16} className="text-gray-400" />}
                placeholder={t('admin.search-model')} 
                className="max-w-sm rounded-full bg-gray-50 border-transparent hover:bg-white hover:border-blue-200 transition-all"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                allowClear
              />
            </div>
            
            <Table 
              columns={columns} 
              dataSource={filteredMotors} 
              rowKey="id" 
              loading={loading} 
              pagination={{ pageSize: 8, showTotal: (total) => `${t('common.total')} ${total} ${t('common.records')}`, className: "px-6 py-4" }} 
              scroll={{ x: 1000 }}
              className="custom-admin-table"
              rowClassName="hover:bg-gray-50 transition-colors"
            />
          </ModernCard>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminPage;