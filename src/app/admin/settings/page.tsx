'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Save,
  RefreshCw,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Link as LinkIcon,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SystemConfig {
  site_name: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  working_hours: string;
  website_url: string;
  linkedin_url: string;
  twitter_url: string;
  facebook_url: string;
  instagram_url: string;
}

const defaultConfig: SystemConfig = {
  site_name: 'NexMotor',
  site_description: '专业的电机选型平台',
  contact_email: 'info@nexmotor.com',
  contact_phone: '+86 400-888-8888',
  address: '上海市浦东新区张江高科技园区',
  working_hours: '周一至周五 9:00-18:00',
  website_url: 'https://nexmotor.com',
  linkedin_url: '',
  twitter_url: '',
  facebook_url: '',
  instagram_url: '',
};

export default function AdminSettingsPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [config, setConfig] = useState<SystemConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchConfig();
  }, [isAuthenticated, user]);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/config', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success && data.data) {
        setConfig({
          ...defaultConfig,
          ...data.data,
        });
      }
    } catch (error) {
      console.error('获取配置失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('设置保存成功');
      } else {
        toast.error(data.message || '保存失败');
      }
    } catch (error) {
      console.error('保存配置失败:', error);
      toast.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

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
              系统设置
            </h1>
          </div>
          <p className="text-muted-foreground">配置网站参数和信息</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchConfig} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            <Save className="h-4 w-4" />
            {saving ? '保存中...' : '保存设置'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <Tabs defaultValue="basic" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="basic">基本信息</TabsTrigger>
            <TabsTrigger value="contact">联系方式</TabsTrigger>
            <TabsTrigger value="social">社交媒体</TabsTrigger>
            <TabsTrigger value="advanced">高级设置</TabsTrigger>
          </TabsList>

          {/* Basic Info */}
          <TabsContent value="basic">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  基本信息设置
                </CardTitle>
                <CardDescription>配置网站的基本信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="site_name">网站名称</Label>
                  <Input
                    id="site_name"
                    value={config.site_name}
                    onChange={(e) => setConfig({ ...config, site_name: e.target.value })}
                    placeholder="输入网站名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site_description">网站描述</Label>
                  <Textarea
                    id="site_description"
                    value={config.site_description}
                    onChange={(e) => setConfig({ ...config, site_description: e.target.value })}
                    placeholder="输入网站描述"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Info */}
          <TabsContent value="contact">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  联系方式设置
                </CardTitle>
                <CardDescription>配置网站的联系方式</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    联系邮箱
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={config.contact_email}
                    onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
                    placeholder="输入联系邮箱"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact_phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    联系电话
                  </Label>
                  <Input
                    id="contact_phone"
                    value={config.contact_phone}
                    onChange={(e) => setConfig({ ...config, contact_phone: e.target.value })}
                    placeholder="输入联系电话"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    公司地址
                  </Label>
                  <Textarea
                    id="address"
                    value={config.address}
                    onChange={(e) => setConfig({ ...config, address: e.target.value })}
                    placeholder="输入公司地址"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="working_hours" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    工作时间
                  </Label>
                  <Input
                    id="working_hours"
                    value={config.working_hours}
                    onChange={(e) => setConfig({ ...config, working_hours: e.target.value })}
                    placeholder="输入工作时间"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media */}
          <TabsContent value="social">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  社交媒体设置
                </CardTitle>
                <CardDescription>配置社交媒体链接</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="website_url" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    官方网站
                  </Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={config.website_url}
                    onChange={(e) => setConfig({ ...config, website_url: e.target.value })}
                    placeholder="输入官方网站链接"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin_url" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-blue-600" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin_url"
                    type="url"
                    value={config.linkedin_url}
                    onChange={(e) => setConfig({ ...config, linkedin_url: e.target.value })}
                    placeholder="输入 LinkedIn 链接"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter_url" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-sky-500" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter_url"
                    type="url"
                    value={config.twitter_url}
                    onChange={(e) => setConfig({ ...config, twitter_url: e.target.value })}
                    placeholder="输入 Twitter 链接"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook_url" className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </Label>
                  <Input
                    id="facebook_url"
                    type="url"
                    value={config.facebook_url}
                    onChange={(e) => setConfig({ ...config, facebook_url: e.target.value })}
                    placeholder="输入 Facebook 链接"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="instagram_url" className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram_url"
                    type="url"
                    value={config.instagram_url}
                    onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
                    placeholder="输入 Instagram 链接"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  高级设置
                </CardTitle>
                <CardDescription>配置系统高级选项</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-muted rounded-lg text-center">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">高级设置功能即将推出</p>
                  <p className="text-sm text-muted-foreground">敬请期待更多系统配置选项</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
