/**
 * pages/Login.jsx
 * 登录页：antd Form，登录成功跳 /admin，失败 message.error
 * （登录前旧 token 清除已在 AuthContext.login 中处理）
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined, ThunderboltFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { App as AntdApp } from 'antd';
import { useAuth } from '../context/AuthContext';
import LanguageSwitch from '../components/common/LanguageSwitch';

const { Title, Paragraph } = Typography;

export default function Login() {
  const { t } = useTranslation();
  const { message } = AntdApp.useApp();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.username.trim(), values.password);
      message.success(t('auth.loginSuccess'));
      navigate('/admin', { replace: true });
    } catch (e) {
      message.error(e.message || t('auth.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-700 via-primary-600 to-blue-800 px-4 py-10">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />

      <div className="absolute right-4 top-4">
        <LanguageSwitch light />
      </div>

      <Card className="w-full max-w-md !rounded-2xl shadow-2xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-600 text-white">
            <ThunderboltFilled className="text-2xl" />
          </div>
          <Title level={3} className="!mb-1">{t('auth.login.title')}</Title>
          <Paragraph type="secondary" className="!mb-0">{t('auth.login.subtitle')}</Paragraph>
        </div>

        <Form name="login" size="large" onFinish={onFinish}>
          <Form.Item name="username" rules={[{ required: true, message: t('auth.required.username') }]}>
            <Input prefix={<UserOutlined />} placeholder={t('auth.username')} autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: t('auth.required.password') }]}>
            <Input.Password prefix={<LockOutlined />} placeholder={t('auth.password')} autoComplete="current-password" />
          </Form.Item>
          <Form.Item className="!mb-0">
            <Button type="primary" htmlType="submit" block loading={loading}>
              {t('auth.loginButton')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
