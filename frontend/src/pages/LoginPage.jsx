import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Alert, Typography, Divider, message } from 'antd';
import { Lock, User, Shield, KeyRound, Eye, EyeOff, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModernCard from '../components/ui/ModernCard';
import GradientButton from '../components/ui/GradientButton';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../hooks/useTranslation';

const { Title, Paragraph, Text } = Typography;

// 特性配置（保持原风格，但颜色更统一为蓝系）
function LoginPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  // 特性配置（保持原风格，但颜色更统一为蓝系）
  const FEATURES = [
    { title: t('login.security-auth'), desc: t('login.security-desc'), icon: KeyRound, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: t('login.real-time-monitor'), desc: t('login.monitor-desc'), icon: Shield, color: 'text-indigo-600', bg: 'bg-indigo-100' },
    { title: t('login.permission-mgmt'), desc: t('login.permission-desc'), icon: Lock, color: 'text-blue-700', bg: 'bg-blue-100' }
  ];

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(values);
      login(response);
      message.success('登录成功，正在进入控制台...');
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || '登录失败，请检查用户名和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoFill = () => {
    form.setFieldsValue({ username: 'admin', password: 'admin123' });
    message.success('已自动填充测试账号');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 柔和背景光斑（保留原风格） */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-200/10 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-6xl relative z-10"
      >
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* 左侧信息栏 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="text-center lg:text-left">
              {/* Logo 动画增强 */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="w-24 h-24 mx-auto lg:mx-0 mb-8 bg-white rounded-3xl shadow-xl p-4 flex items-center justify-center"
              >
                <img 
                  src="/src/assets/logo/logo透明底蓝色1.png" 
                  alt="System Logo" 
                  className="w-full h-full object-contain"
                />
              </motion.div>

              <Title level={1} className="!text-5xl !font-bold !mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                {t('login.system-name')}
              </Title>

              <Paragraph className="!text-xl !text-gray-600 !mb-10 leading-relaxed max-w-lg">
                专业的电机全生命周期管理平台 · 支持产品数据库实时维护与多端同步
              </Paragraph>

              {/* 特性列表 */}
              <div className="space-y-6">
                {FEATURES.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.15 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className={`w-12 h-12 ${feature.bg} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon size={24} className={feature.color} />
                    </div>
                    <div>
                      <Title level={4} className="!text-lg !font-semibold !text-gray-800 !m-0">{feature.title}</Title>
                      <Text className="text-gray-600 text-base">{feature.desc}</Text>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 右侧登录卡片 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <ModernCard className="p-8 lg:p-10 shadow-2xl border-0 backdrop-blur-xl bg-white/95">
              {/* 卡片内 Logo + 标题 */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="w-18 h-18 mx-auto mb-5 bg-white rounded-2xl shadow-lg p-3"
                >
                  <img 
                    src="/src/assets/logo/logo透明底蓝色1.png" 
                    alt="Logo" 
                    className="w-full h-full object-contain"
                  />
                </motion.div>
                <Title level={2} className="!text-3xl !font-bold !text-gray-800 !mb-2">{t('login.welcome-back')}</Title>
                <Text type="secondary" className="text-lg">{t('login.login-console')}</Text>
              </div>

              {/* 错误提示 */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert
                      message={error}
                      type="error"
                      showIcon
                      closable
                      onClose={() => setError(null)}
                      className="mb-6 border-red-200 bg-red-50"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 登录表单 */}
              <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: t('common.required') }]}
                >
                  <Input
                    prefix={<User size={18} className="text-gray-400" />}
                    placeholder={`${t('login.username')} / admin`}
                    className="h-12 rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: t('common.required') }]}
                >
                  <Input.Password
                    prefix={<Lock size={18} className="text-gray-400" />}
                    placeholder={`${t('login.password')} / admin123`}
                    className="h-12 rounded-xl"
                    iconRender={(visible) => visible ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
                    visibilityToggle={{ visible: passwordVisible, onVisibleChange: setPasswordVisible }}
                  />
                </Form.Item>

                <Form.Item className="mb-6">
                  <GradientButton
                    htmlType="submit"
                    loading={loading}
                    block
                    size="large"
                    className="h-13 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                    icon={loading ? null : <LogIn size={20} className="mr-2" />}
                  >
                    {loading ? t('login.login-loading') : t('login.login-now')}
                  </GradientButton>
                </Form.Item>
              </Form>

              <Divider>
                <Text type="secondary" className="text-sm">{t('login.dev-account')}</Text>
              </Divider>

              {/* 测试账号卡片（可点击一键填充） */}
              <div
                onClick={handleAutoFill}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center mr-3 group-hover:bg-blue-300 transition-colors">
                    <KeyRound size={20} className="text-blue-700" />
                  </div>
                  <Text strong className="text-blue-800">{t('login.auto-fill')}</Text>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between bg-white/70 rounded-lg px-4 py-2.5">
                    <span className="text-gray-600">{t('login.username')}</span>
                    <code className="font-medium text-blue-700">admin</code>
                  </div>
                  <div className="flex justify-between bg-white/70 rounded-lg px-4 py-2.5">
                    <span className="text-gray-600">{t('login.password')}</span>
                    <code className="font-medium text-blue-700">admin123</code>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Text type="secondary" className="text-xs">
                  {t('login.copyright')}
                </Text>
              </div>
            </ModernCard>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default LoginPage;