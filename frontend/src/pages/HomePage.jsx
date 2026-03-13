import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, Input, InputNumber, Select, Button, Row, Col, Typography,
  Space, Divider, Tooltip
} from 'antd';
import { 
  Search, Settings, Package, Zap, CheckCircle, Info, 
  Layers, LayoutGrid, ArrowRight, Cpu, Database, Globe,
  Activity, Flame // 新增图标
} from 'lucide-react';
import { motion } from 'framer-motion';
import ModernCard from '../components/ui/ModernCard';
import GradientButton from '../components/ui/GradientButton';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Paragraph } = Typography;
const { Option } = Select;

// --- 新增：悬浮装饰组件 ---
const FloatingElement = ({ children, delay = 0, x = 0, y = 0 }) => (
  <motion.div
    animate={{ 
      y: [0, -15, 0],
      rotate: [0, 5, -5, 0]
    }}
    transition={{ 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut",
      delay: delay 
    }}
    className="absolute z-0 hidden lg:flex items-center justify-center pointer-events-none"
    style={{ left: x, top: y }}
  >
    {children}
  </motion.div>
);

// --- 新增：品牌滚动条组件 ---
const LogoTicker = () => {
  const brands = [
    { name: "motor", icon: Globe },
    { name: "motor", icon: Zap },
    { name: "motor", icon: Cpu },
    { name: "motor", icon: Activity },
    { name: "motor", icon: Database },
    { name: "motor", icon: Settings },
  ];

  return (
    <div className="w-full overflow-hidden py-10 border-t border-b border-gray-100 bg-white/50 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 mb-6 text-center">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Trusted By Industry Leaders</span>
      </div>
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
          {[...brands, ...brands, ...brands].map((brand, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-400 font-semibold text-lg grayscale hover:grayscale-0 hover:text-blue-600 transition-all duration-300 cursor-default">
              <brand.icon size={24} />
              <span>{brand.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* CSS for Marquee included inline for simplicity, ideally in global css */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

// --- 样式组件：带颜色图标的 Label ---
const FormLabel = ({ icon: Icon, label, color = "text-gray-500", tooltip }) => (
  <span className="flex items-center gap-2 text-gray-600 font-medium">
    <Icon size={16} className={color} />
    {label}
    {tooltip && (
      <Tooltip title={tooltip}>
        <Info size={14} className="text-gray-400 cursor-pointer hover:text-gray-600" />
      </Tooltip>
    )}
  </span>
);

// ... BasicSearchForm 和 AdvancedSearchForm 代码保持不变 ...
const BasicSearchForm = () => (
  <Row gutter={[20, 20]}>
    <Col xs={24} md={12} lg={6}>
      <Form.Item name="model" label={<FormLabel icon={Search} label="电机型号" color="text-blue-500" />}>
        <Input placeholder="输入型号" allowClear size="large" prefix={<Search size={16} className="text-gray-300" />} />
      </Form.Item>
    </Col>
    <Col xs={24} md={12} lg={6}>
      <Form.Item name="power" label={<FormLabel icon={Zap} label="功率 (kW)" color="text-yellow-500" />}>
        <InputNumber style={{ width: '100%' }} placeholder="输入功率" min={0} step={0.1} size="large" prefix={<Zap size={16} className="text-gray-300" />} />
      </Form.Item>
    </Col>
    <Col xs={24} md={12} lg={6}>
      <Form.Item name="voltage" label={<FormLabel icon={Settings} label="电压 (V)" color="text-blue-500" />}>
        <InputNumber style={{ width: '100%' }} placeholder="输入电压" min={0} step={10} size="large" prefix={<Settings size={16} className="text-gray-300" />} />
      </Form.Item>
    </Col>
    <Col xs={24} md={12} lg={6}>
      <Form.Item name="rpm" label={<FormLabel icon={Package} label="转速 (r/min)" color="text-green-500" />}>
        <InputNumber style={{ width: '100%' }} placeholder="输入转速" min={0} step={10} size="large" prefix={<Package size={16} className="text-gray-300" />} />
      </Form.Item>
    </Col>
  </Row>
);

const AdvancedSearchForm = () => (
  <>
    <Row gutter={[20, 20]}>
      <Col xs={24} md={8}>
        <Form.Item name="model" label={<FormLabel icon={Search} label="电机型号" color="text-blue-500" tooltip="支持模糊搜索" />}>
          <Input placeholder="输入型号" allowClear size="large" prefix={<Search size={16} className="text-gray-300" />} />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item name="description" label={<FormLabel icon={Info} label="描述关键词" color="text-purple-500" />}>
          <Input placeholder="输入关键词" allowClear size="large" prefix={<Info size={16} className="text-gray-300" />} />
        </Form.Item>
      </Col>
      <Col xs={24} md={8}>
        <Form.Item name="frameSize" label={<FormLabel icon={LayoutGrid} label="机座号" color="text-orange-500" />}>
          <Input placeholder="如：132M" allowClear size="large" prefix={<LayoutGrid size={16} className="text-gray-300" />} />
        </Form.Item>
      </Col>
    </Row>
    <Divider orientation="left" className="!my-6 border-gray-200"><span className="text-gray-400 text-xs uppercase tracking-wider">参数范围筛选</span></Divider>
    <Row gutter={[20, 20]}>
      <Col xs={12} md={6}><Form.Item name="power_min" label={<FormLabel icon={Zap} label="最小功率" color="text-yellow-500" />}><InputNumber style={{ width: '100%' }} placeholder="Min" size="large" /></Form.Item></Col>
      <Col xs={12} md={6}><Form.Item name="power_max" label={<FormLabel icon={Zap} label="最大功率" color="text-yellow-500" />}><InputNumber style={{ width: '100%' }} placeholder="Max" size="large" /></Form.Item></Col>
      <Col xs={12} md={6}><Form.Item name="rpm_min" label={<FormLabel icon={Package} label="最小转速" color="text-green-500" />}><InputNumber style={{ width: '100%' }} placeholder="Min" size="large" /></Form.Item></Col>
      <Col xs={12} md={6}><Form.Item name="rpm_max" label={<FormLabel icon={Package} label="最大转速" color="text-green-500" />}><InputNumber style={{ width: '100%' }} placeholder="Max" size="large" /></Form.Item></Col>
      <Col xs={24} md={8}><Form.Item name="voltage" label={<FormLabel icon={Settings} label="电压 (V)" color="text-blue-500" />}><InputNumber style={{ width: '100%' }} placeholder="输入电压" size="large" /></Form.Item></Col>
      <Col xs={24} md={8}><Form.Item name="efficiency_min" label={<FormLabel icon={CheckCircle} label="最小效率 (%)" color="text-green-500" />}><InputNumber style={{ width: '100%' }} placeholder="Min %" max={100} size="large" /></Form.Item></Col>
      <Col xs={24} md={8}>
        <Form.Item name="sortBy" label={<FormLabel icon={LayoutGrid} label="排序方式" color="text-purple-500" />}>
          <Select placeholder="选择排序" allowClear size="large">
            <Option value="power_asc">功率从小到大</Option>
            <Option value="power_desc">功率从大到小</Option>
            <Option value="efficiency_desc">效率从高到低</Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>
  </>
);

const STATS_DATA = [
  { title: '在库型号', value: 1500, suffix: '+', color: '#3b82f6' },
  { title: '匹配精度', value: 98.5, suffix: '%', color: '#10b981' },
  { title: '平均耗时', value: 2, suffix: '秒', color: '#8b5cf6' },
  { title: '服务年限', value: 5, suffix: '年', color: '#f59e0b' },
];

const FEATURES_DATA = [
  {
    title: '后台管理',
    desc: '专业的数据维护中心，支持实时更新',
    icon: Layers,
    color: 'blue',
    link: '/login',
    btnText: '进入后台'
  },
  {
    title: '产品浏览',
    desc: '多维度筛选目录，快速定位目标型号',
    icon: Package,
    color: 'green',
    link: '/products',
    btnText: '浏览目录'
  },
  {
    title: '核心优势',
    desc: '高效节能的三相异步电动机，广泛应用于各类机械设备，稳定可靠',
    icon: Zap,
    color: 'purple',
    tags: ['一级能效', '低噪音', 'IP55']
  }
];

function HomePage() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('basic');

  const handleSubmit = (values) => {
    const cleanValues = Object.fromEntries(Object.entries(values).filter(([_, v]) => v != null && v !== ''));
    const searchParams = new URLSearchParams(cleanValues);
    navigate(`/products?${searchParams.toString()}`);
  };

  // 热门搜索标签点击
  const handleTagClick = (model) => {
    form.setFieldsValue({ model });
    handleSubmit({ model });
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-x-hidden">
      {/* 1. 背景升级：添加了动态呼吸光斑 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        {/* 蓝色光斑 */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-200/30 rounded-full blur-3xl -z-10"
        />
        {/* 紫色光斑 - 增加色彩层次 */}
        <motion.div 
          animate={{ scale: [1, 1.1, 1], x: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-purple-200/20 rounded-full blur-3xl -z-10"
        />
      </div>

      {/* 2. 悬浮装饰元素：增加空间的立体感 */}
      <FloatingElement x="10%" y="15%" delay={0}>
        <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center border border-gray-100">
          <Settings className="text-blue-500" size={32} />
        </div>
      </FloatingElement>
      <FloatingElement x="85%" y="20%" delay={2}>
        <div className="w-20 h-20 bg-white rounded-full shadow-xl flex items-center justify-center border border-gray-100">
          <Zap className="text-yellow-500" size={36} />
        </div>
      </FloatingElement>

      {/* 主要内容 */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 relative z-20"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 text-blue-700 text-sm font-bold shadow-sm cursor-default"
          >
            🚀 {t('home.search-title')}
          </motion.div>
          <Title level={1} className="!text-5xl md:!text-6xl !font-extrabold tracking-tight !mb-6 text-gray-900">
            {t('home.title')}
          </Title>
          <Paragraph className="!text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {t('home.subtitle')}
          </Paragraph>
        </motion.div>

        {/* 搜索卡片 (视觉核心) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto relative z-10"
        >
          {/* 添加外发光效果 */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur opacity-20 -z-10"></div>
          
          <ModernCard className="p-1 md:p-2 shadow-2xl shadow-blue-900/10 border-white/60 backdrop-blur-md bg-white/90">
            <div className="bg-white/80 rounded-2xl p-6 md:p-10 border border-gray-100/50">
              
              {/* Tab 切换 */}
              <div className="flex justify-center mb-10">
                <div className="bg-gray-100/80 p-1.5 rounded-full flex relative shadow-inner">
                  {['basic', 'advanced'].map((type) => {
                    const isActive = searchType === type;
                    return (
                      <button
                        key={type}
                        onClick={() => setSearchType(type)}
                        className={`
                          relative z-10 px-8 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300
                          ${isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}
                        `}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-white rounded-full shadow-sm border border-gray-200/50"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                        <span className="relative z-20 flex items-center gap-2">
                          {type === 'basic' ? <Zap size={16} /> : <Layers size={16} />}
                          {type === 'basic' ? t('home.basic-search') : t('home.advanced-search')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 表单 */}
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <motion.div
                  key={searchType}
                  initial={{ opacity: 0, x: searchType === 'basic' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                  className="min-h-[120px]"
                >
                  {searchType === 'basic' ? <BasicSearchForm /> : <AdvancedSearchForm />}
                </motion.div>

                <div className="mt-8 flex flex-col items-center gap-6">
                  <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <GradientButton 
                      htmlType="submit" 
                      size="large" 
                      gradient="blue"
                      className="px-12 h-14 text-lg font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex-1 sm:flex-none"
                    >
                      <Search size={20} className="mr-2" /> {t('home.search-btn')}
                    </GradientButton>
                    <Button 
                      size="large" 
                      onClick={() => form.resetFields()}
                      className="h-14 px-8 text-gray-500 hover:text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    >
                      {t('home.reset-btn')}
                    </Button>
                  </div>

                  {/* 3. 新增：热门搜索标签 (填充视觉空白) */}
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 justify-center">
                    <Flame size={14} className="text-red-500" />
                    <span>{t('home.hot-search')}：</span>
                    {['YE3', 'YE4', '30kW', '132M', '1500转'].map(tag => (
                      <span 
                        key={tag} 
                        onClick={() => handleTagClick(tag)}
                        className="cursor-pointer hover:text-blue-600 hover:bg-blue-50 px-2 py-0.5 rounded transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Form>
            </div>
          </ModernCard>

          {/* 统计数据 (无边框风格) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 pt-8 border-t border-gray-200/50">
            {[
              { title: t('home.stats.models'), value: 1500, suffix: '+', color: '#3b82f6' },
              { title: t('home.stats.accuracy'), value: 98.5, suffix: '%', color: '#10b981' },
              { title: t('home.stats.time'), value: 2, suffix: t('home.stats.time-suffix', '秒'), color: '#8b5cf6' },
              { title: t('home.stats.years'), value: 5, suffix: t('home.stats.years-suffix', '年'), color: '#f59e0b' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1 font-mono" style={{ color: stat.color }}>
                  {stat.value}<span className="text-lg ml-1">{stat.suffix}</span>
                </div>
                <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">{stat.title}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 4. 新增：品牌滚动条 (增加信任感) */}
      <LogoTicker />

      {/* 功能特色区域 */}
      <div className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">{t('home.features.title', '全场景解决方案')}</h2>
            <p className="text-gray-500 mt-4">{t('home.features.subtitle', '从选型到维护，提供全生命周期的技术支持')}</p>
          </div>

          <Row gutter={[32, 32]}>
            {[
              {
                title: t('home.features.admin.title'),
                desc: t('home.features.admin.desc'),
                icon: Layers,
                color: 'blue',
                link: '/login',
                btnText: t('home.features.admin.btn-text')
              },
              {
                title: t('home.features.products.title'),
                desc: t('home.features.products.desc'),
                icon: Package,
                color: 'green',
                link: '/products',
                btnText: t('home.features.products.btn-text')
              },
              {
                title: t('home.features.advantages.title'),
                desc: t('home.features.advantages.desc'),
                icon: Zap,
                color: 'purple',
                tags: ['一级能效', '低噪音', 'IP55'] // 直接使用数组，避免翻译问题
              }
            ].map((feature, index) => (
              <Col xs={24} md={8} key={index}>
                <motion.div 
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="h-full"
                >
                  <ModernCard className={`h-full p-8 border border-gray-100 hover:border-${feature.color}-100 hover:shadow-xl transition-all group`}>
                    <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon size={28} className={`text-${feature.color}-600`} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                      {feature.desc}
                    </p>
                    
                    {feature.link ? (
                      <div 
                        className={`flex items-center font-semibold text-${feature.color}-600 cursor-pointer hover:gap-2 transition-all`}
                        onClick={() => navigate(feature.link)}
                      >
                        {feature.btnText} <ArrowRight size={16} className="ml-2" />
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {feature.tags.map(tag => (
                          <span key={tag} className={`px-3 py-1 rounded-full text-xs font-medium bg-${feature.color}-50 text-${feature.color}-700`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </ModernCard>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
}

export default HomePage;