'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  ArrowLeft,
  Package,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function AdminAddProductPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    model: '',
    frameSize: '',
    power: '',
    voltage: '380',
    current: '',
    rpm: '',
    efficiency: '',
    powerFactor: '',
    frequency: '50',
    poles: '2',
    ip: 'IP54',
    insulation: 'F',
    mounting: 'B3',
    weight: '',
    connection: 'Y',
    lockedRotorTorque: '',
    maxTorque: '',
    startingCurrent: '',
    noise: '',
    description: '',
    imageUrl: '',
  });

  if (!isAuthenticated || user?.role !== 'admin') {
    router.push('/login');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/motors', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: formData.model,
          frameSize: formData.frameSize,
          power: parseFloat(formData.power) || 0,
          voltage: parseInt(formData.voltage) || 380,
          current: parseFloat(formData.current) || 0,
          rpm: parseInt(formData.rpm) || 0,
          efficiency: parseFloat(formData.efficiency) || 0,
          powerFactor: parseFloat(formData.powerFactor) || 0,
          frequency: parseInt(formData.frequency) || 50,
          poles: parseInt(formData.poles) || 2,
          ip: formData.ip,
          insulation: formData.insulation,
          mounting: formData.mounting,
          weight: parseFloat(formData.weight) || 0,
          connection: formData.connection,
          lockedRotorTorque: parseFloat(formData.lockedRotorTorque) || 0,
          maxTorque: parseFloat(formData.maxTorque) || 0,
          startingCurrent: parseFloat(formData.startingCurrent) || 0,
          noise: parseFloat(formData.noise) || 0,
          description: formData.description,
          imageUrl: formData.imageUrl || null,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('产品添加成功');
        router.push('/admin/products');
      } else {
        toast.error(data.message || '添加失败');
      }
    } catch (error) {
      console.error('添加产品失败:', error);
      toast.error('添加失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              添加产品
            </h1>
          </div>
          <p className="text-muted-foreground">添加新的电机产品</p>
        </div>
      </div>

      <Card className="border-2 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            产品信息
          </CardTitle>
          <CardDescription>填写产品详细信息</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">基本信息</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="model">
                    型号 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    placeholder="如: Y2-90S-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="frameSize">
                    机座号 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="frameSize"
                    name="frameSize"
                    value={formData.frameSize}
                    onChange={handleChange}
                    required
                    placeholder="如: 90S"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">产品描述</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="描述产品特点和应用场景"
                />
              </div>
            </div>

            {/* 性能参数 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">性能参数</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="power">
                    功率 (kW) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="power"
                    name="power"
                    type="number"
                    step="0.1"
                    value={formData.power}
                    onChange={handleChange}
                    required
                    placeholder="如: 1.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="voltage">电压 (V)</Label>
                  <Input
                    id="voltage"
                    name="voltage"
                    type="number"
                    value={formData.voltage}
                    onChange={handleChange}
                    placeholder="如: 380"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current">电流 (A)</Label>
                  <Input
                    id="current"
                    name="current"
                    type="number"
                    step="0.1"
                    value={formData.current}
                    onChange={handleChange}
                    placeholder="如: 3.4"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rpm">转速 (rpm)</Label>
                  <Input
                    id="rpm"
                    name="rpm"
                    type="number"
                    value={formData.rpm}
                    onChange={handleChange}
                    placeholder="如: 2840"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="efficiency">效率 (%)</Label>
                  <Input
                    id="efficiency"
                    name="efficiency"
                    type="number"
                    step="0.1"
                    value={formData.efficiency}
                    onChange={handleChange}
                    placeholder="如: 82.5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="powerFactor">功率因数</Label>
                  <Input
                    id="powerFactor"
                    name="powerFactor"
                    type="number"
                    step="0.01"
                    value={formData.powerFactor}
                    onChange={handleChange}
                    placeholder="如: 0.85"
                  />
                </div>
              </div>
            </div>

            {/* 其他参数 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">其他参数</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">频率 (Hz)</Label>
                  <Input
                    id="frequency"
                    name="frequency"
                    type="number"
                    value={formData.frequency}
                    onChange={handleChange}
                    placeholder="50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poles">极数</Label>
                  <Input
                    id="poles"
                    name="poles"
                    type="number"
                    value={formData.poles}
                    onChange={handleChange}
                    placeholder="2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ip">防护等级</Label>
                  <Input
                    id="ip"
                    name="ip"
                    value={formData.ip}
                    onChange={handleChange}
                    placeholder="IP54"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insulation">绝缘等级</Label>
                  <Input
                    id="insulation"
                    name="insulation"
                    value={formData.insulation}
                    onChange={handleChange}
                    placeholder="F"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mounting">安装方式</Label>
                  <Input
                    id="mounting"
                    name="mounting"
                    value={formData.mounting}
                    onChange={handleChange}
                    placeholder="B3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">重量 (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="22"
                  />
                </div>
              </div>
            </div>

            {/* 扭矩参数 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">扭矩参数</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lockedRotorTorque">堵转转矩倍数</Label>
                  <Input
                    id="lockedRotorTorque"
                    name="lockedRotorTorque"
                    type="number"
                    step="0.1"
                    value={formData.lockedRotorTorque}
                    onChange={handleChange}
                    placeholder="2.2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTorque">最大转矩倍数</Label>
                  <Input
                    id="maxTorque"
                    name="maxTorque"
                    type="number"
                    step="0.1"
                    value={formData.maxTorque}
                    onChange={handleChange}
                    placeholder="2.3"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startingCurrent">启动电流倍数</Label>
                  <Input
                    id="startingCurrent"
                    name="startingCurrent"
                    type="number"
                    step="0.1"
                    value={formData.startingCurrent}
                    onChange={handleChange}
                    placeholder="7"
                  />
                </div>
              </div>
            </div>

            {/* 其他 */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="noise">噪声 (dB)</Label>
                <Input
                  id="noise"
                  name="noise"
                  type="number"
                  value={formData.noise}
                  onChange={handleChange}
                  placeholder="68"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="connection">接法</Label>
                <Input
                  id="connection"
                  name="connection"
                  value={formData.connection}
                  onChange={handleChange}
                  placeholder="Y"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">图片 URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600">
                <Save className="h-4 w-4" />
                {loading ? '保存中...' : '保存产品'}
              </Button>
              <Link href="/admin">
                <Button type="button" variant="outline">
                  取消
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
