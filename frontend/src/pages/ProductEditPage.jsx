// src/pages/ProductEditPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Form, Input, InputNumber, Row, Col, Button, Typography, message, Spin, Space, Result 
} from 'antd';
import { Link, Package, X, ArrowLeft, Save, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import GradientButton from '../components/ui/GradientButton';
import ModernCard from '../components/ui/ModernCard';
import { motorAPI } from '../services/api';
import AntdImage from 'antd/es/image';

const { Title } = Typography;

function ProductEditPage() {
  const { id } = useParams(); // 如果有 id 就是编辑，没有就是新增
  const navigate = useNavigate();
  const isEdit = !!id;

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const imageUrl = Form.useWatch('imageUrl', form) || '';

  // 编辑模式下加载数据
  useEffect(() => {
    if (isEdit) {
      fetchMotor();
    } else {
      form.resetFields();
      setLoading(false);
    }
  }, [id]);

  const fetchMotor = async () => {
    try {
      const res = await motorAPI.getMotorById(id);
      const data = res?.data || res;
      if (data.imageUrl) {
        data.imageUrl = `${data.imageUrl}?t=${Date.now()}`;
      }
      form.setFieldsValue(data);
    } catch (err) {
      message.error('加载产品信息失败');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      if (isEdit) {
        await motorAPI.updateMotor(id, values);
        message.success('更新成功！');
      } else {
        await motorAPI.addMotor(values);
        message.success('创建成功！');
      }
      navigate('/admin');
    } catch (err) {
      message.error(isEdit ? '更新失败' : '创建失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* 固定顶部栏 */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Space size="middle">
            <Button type="text" icon={<ArrowLeft size={20} />} onClick={() => navigate('/admin')} />
            <Title level={3} className="!mb-0 flex items-center gap-3">
              {isEdit ? <Save size={28} className="text-green-600" /> : <Plus size={28} className="text-blue-600" />}
              {isEdit ? '编辑产品' : '新增产品'}
            </Title>
          </Space>
          <Space>
            <Button onClick={() => navigate('/admin')}>取消</Button>
            <GradientButton gradient={isEdit ? "green" : "blue"} size="large" htmlType="submit" loading={saving} onClick={() => form.submit()}>
              {isEdit ? '保存更改' : '立即创建'}
            </GradientButton>
          </Space>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <ModernCard className="border-0 shadow-xl">
            <div className="p-8">
              <Form form={form} layout="vertical" onFinish={handleSubmit}>
                {/* ========= 图片链接输入区 ========= */}
                <div className="mb-10 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border-2 border-dashed border-blue-300">
                  <Title level={4} className="mb-6 flex items-center gap-3 text-blue-800">
                    <Link size={28} />
                    产品图片链接（推荐使用免费图床）
                  </Title>

                  <Row gutter={32}>
                    <Col xs={24} lg={12}>
                      <Form.Item 
                        name="imageUrl" 
                        label="图片 URL（必填）"
                        rules={[
                          { required: true, message: '请填写图片链接' },
                          { type: 'url', message: '请输入有效的URL地址' }
                        ]}
                      >
                        <Input 
                          size="large" 
                          placeholder="https://example.com/motor-photo.jpg"
                          prefix={<Link size={18} className="text-blue-500" />}
                          className="h-14 text-lg"
                        />
                      </Form.Item>

                      <div className="text-sm text-gray-600 space-y-1 mt-4 bg-white/80 p-4 rounded-xl">
                        <p className="font-medium text-blue-700">推荐免费图床：</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li><a href="https://imgse.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">imgse.com</a> - 国内最快</li>
                          <li><a href="https://sm.ms" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">sm.ms</a> - 稳定永久</li>
                          <li><a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">postimages.org</a> - 国际访问快</li>
                        </ul>
                        <p className="text-xs text-gray-500 mt-3">使用方法：上传图片 → 复制“直接链接” → 粘贴到上面输入框</p>
                      </div>
                    </Col>

                    <Col xs={24} lg={12}>
                      <div className="border-2 border-gray-300 border-dashed rounded-2xl h-96 bg-gray-50 flex items-center justify-center overflow-hidden">
                        {imageUrl ? (
                          <div className="relative group">
                            <AntdImage 
                              src={imageUrl} 
                              alt="产品预览" 
                              className="max-h-96 max-w-full object-contain rounded-xl"
                              preview={false}
                              fallback="/placeholder-motor.jpg"
                            />
                            <Button
                              type="primary"
                              danger
                              shape="circle"
                              icon={<X size={20} />}
                              size="large"
                              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              onClick={() => form.setFieldsValue({ imageUrl: '' })}
                            />
                          </div>
                        ) : (
                          <div className="text-center text-gray-400">
                            <Package size={80} className="mx-auto mb-4" />
                            <p className="text-xl font-medium">输入链接后显示预览</p>
                            <p className="text-sm mt-2">支持 JPG/PNG/WEBP/GIF</p>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* ========= 所有参数表单（和你原来完全一致） ========= */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Form.Item name="model" label="电机型号" rules={[{ required: true }]}>
                    <Input size="large" placeholder="YE3-132S-4" />
                  </Form.Item>
                  <Form.Item name="frameSize" label="机座号" rules={[{ required: true }]}>
                    <Input size="large" placeholder="132S" />
                  </Form.Item>
                  <Form.Item name="power" label="额定功率 (kW)" rules={[{ required: true }]}>
                    <InputNumber className="w-full" size="large" step={0.1} precision={2} />
                  </Form.Item>
                  <Form.Item name="voltage" label="额定电压 (V)" rules={[{ required: true }]}>
                    <InputNumber className="w-full" size="large" step={10} />
                  </Form.Item>
                  <Form.Item name="current" label="额定电流 (A)">
                    <InputNumber className="w-full" size="large" step={0.1} precision={2} />
                  </Form.Item>
                  <Form.Item name="rpm" label="额定转速 (r/min)" rules={[{ required: true }]}>
                    <InputNumber className="w-full" size="large" step={50} />
                  </Form.Item>
                  <Form.Item name="efficiency" label="效率 (%)">
                    <InputNumber className="w-full" size="large" min={0} max={100} step={0.1} precision={2} />
                  </Form.Item>
                  <Form.Item name="powerFactor" label="功率因数 (cos φ)">
                    <InputNumber className="w-full" size="large" min={0} max={1} step={0.01} precision={3} />
                  </Form.Item>
                  <Form.Item name="frequency" label="频率 (Hz)">
                    <InputNumber className="w-full" size="large" placeholder="50" />
                  </Form.Item>
                  <Form.Item name="poles" label="极数">
                    <InputNumber className="w-full" size="large" min={2} max={12} step={2} />
                  </Form.Item>
                  <Form.Item name="ip" label="防护等级">
                    <Input size="large" placeholder="IP55" />
                  </Form.Item>
                  <Form.Item name="insulation" label="绝缘等级">
                    <Input size="large" placeholder="F" />
                  </Form.Item>
                  <Form.Item name="mounting" label="安装方式">
                    <Input size="large" placeholder="IM B3" />
                  </Form.Item>
                  <Form.Item name="weight" label="重量 (kg)">
                    <InputNumber className="w-full" size="large" step={1} />
                  </Form.Item>
                  <Form.Item name="connection" label="接法">
                    <Input size="large" placeholder="Y" />
                  </Form.Item>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
                  <Form.Item name="lockedRotorTorque" label="堵转转矩倍数">
                    <InputNumber className="w-full" size="large" step={0.1} precision={2} />
                  </Form.Item>
                  <Form.Item name="maxTorque" label="最大转矩倍数">
                    <InputNumber className="w-full" size="large" step={0.1} precision={2} />
                  </Form.Item>
                  <Form.Item name="startingCurrent" label="启动电流倍数">
                    <InputNumber className="w-full" size="large" step={0.1} precision={2} />
                  </Form.Item>
                  <Form.Item name="noise" label="噪声 dB(A)">
                    <InputNumber className="w-full" size="large" step={1} />
                  </Form.Item>
                </div>

                <Form.Item name="description" label="详细描述 / 应用场景" className="mt-6">
                  <Input.TextArea rows={4} placeholder="适用于风机、水泵、压缩机等通用机械..." />
                </Form.Item>
              </Form>
            </div>
          </ModernCard>
        </motion.div>
      </div>
    </div>
  );
}

export default ProductEditPage;