/**
 * pages/Admin.jsx
 * 管理后台：antd Tabs = 电机列表(MotorTable CRUD) / 修改密码
 * （路由层面已由 ProtectedRoute 保护）
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Tabs, Button, Space, Avatar, Form, Input, Card } from 'antd';
import { UserOutlined, LogoutOutlined, LockOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { App as AntdApp } from 'antd';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import MotorTable from '../components/motor/MotorTable';

const { Title } = Typography;

/** 修改密码表单 */
function ChangePasswordForm() {
  const { t } = useTranslation();
  const { message } = AntdApp.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await client.post('/auth/change-password', {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success(t('auth.changePassword.success'));
      form.resetFields();
    } catch (e) {
      message.error(e.message || t('auth.changePassword.failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md !rounded-2xl">
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="oldPassword"
          label={t('auth.changePassword.old')}
          rules={[{ required: true, message: t('auth.required.password') }]}
        >
          <Input.Password prefix={<LockOutlined />} autoComplete="current-password" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          label={t('auth.changePassword.new')}
          rules={[
            { required: true, message: t('auth.required.password') },
            { min: 6, message: t('auth.changePassword.minLength') },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label={t('auth.changePassword.confirm')}
          dependencies={['newPassword']}
          rules={[
            { required: true, message: t('auth.required.password') },
            ({ getFieldValue }) => ({
              validator: (_, value) =>
                !value || getFieldValue('newPassword') === value
                  ? Promise.resolve()
                  : Promise.reject(new Error(t('auth.changePassword.mismatch'))),
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
        </Form.Item>
        <Form.Item className="!mb-0">
          <Button type="primary" htmlType="submit" loading={loading}>
            {t('auth.changePassword.submit')}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default function Admin() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();

  const handleLogout = async () => {
    await logout();
    message.success(t('auth.logoutSuccess'));
    navigate('/login', { replace: true });
  };

  const items = [
    {
      key: 'list',
      label: t('admin.tabs.list'),
      children: <MotorTable />,
    },
    {
      key: 'password',
      label: t('admin.tabs.changePassword'),
      children: <ChangePasswordForm />,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Title level={2} className="!mb-0">{t('admin.title')}</Title>
        <Space size="middle">
          <Space>
            <Avatar icon={<UserOutlined />} className="!bg-primary-500" />
            <span className="text-gray-700">{t('admin.welcome', { name: user ? user.username : '' })}</span>
          </Space>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            {t('common.nav.logout')}
          </Button>
        </Space>
      </div>

      <Tabs items={items} />
    </div>
  );
}
