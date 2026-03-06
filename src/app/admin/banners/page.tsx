'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslation } from '@/context/LanguageContext';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  order_num: number;
  is_active: number;
}

export default function AdminBannersPage() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchBanners();
  }, [isAuthenticated, user]);

  const fetchBanners = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/banners', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setBanners(data.data || []);
      }
    } catch (error) {
      console.error('获取轮播图失败:', error);
      toast.error('获取轮播图失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: Partial<Banner>) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/banners', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title || '',
          subtitle: formData.subtitle || '',
          imageUrl: formData.image_url || '',
          linkUrl: formData.link_url || '',
          orderNum: formData.order_num || 0,
          isActive: !!formData.is_active,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('创建成功');
        setEditingBanner(null);
        fetchBanners();
      } else {
        toast.error(data.message || '创建失败');
      }
    } catch (error) {
      console.error('创建失败:', error);
      toast.error('创建失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (formData: Partial<Banner>) => {
    if (!editingBanner) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/banners', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingBanner.id,
          title: formData.title || '',
          subtitle: formData.subtitle || '',
          imageUrl: formData.image_url || '',
          linkUrl: formData.link_url || '',
          orderNum: formData.order_num || 0,
          isActive: !!formData.is_active,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(t('banners.update_success'));
        setEditingBanner(null);
        fetchBanners();
      } else {
        toast.error(data.message || t('admin.update_failed'));
      }
    } catch (error) {
      console.error('更新失败:', error);
      toast.error(t('admin.update_failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t('banners.delete_confirm'))) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/banners?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success(t('admin.delete_success'));
        fetchBanners();
      } else {
        toast.error(data.message || t('admin.update_failed'));
      }
    } catch (error) {
      console.error('删除失败:', error);
      toast.error(t('admin.update_failed'));
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
              轮播图管理
            </h1>
          </div>
          <p className="text-muted-foreground">管理首页轮播图</p>
        </div>
        <Button onClick={() => setEditingBanner({} as Banner)} className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600">
          <Plus className="h-4 w-4" />
          添加轮播图
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Banners List */}
          <div className="grid gap-4 md:grid-cols-2">
            {banners.length === 0 ? (
              <Card className="border-2 md:col-span-2">
                <CardContent className="py-12 text-center">
                  <Layers className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-lg text-muted-foreground">暂无轮播图</p>
                </CardContent>
              </Card>
            ) : (
              banners.map((banner) => (
                <Card key={banner.id} className="border-2 hover:shadow-lg transition-all">
                  <CardContent className="p-0">
                    {banner.image_url && (
                      <div className="aspect-video bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold">{banner.title}</h3>
                          {banner.subtitle && (
                            <p className="text-sm text-muted-foreground mt-1">{banner.subtitle}</p>
                          )}
                        </div>
                        <Badge variant={banner.is_active ? 'default' : 'secondary'}>
                          {banner.is_active ? '已激活' : '已停用'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingBanner(banner)}
                            className="gap-2"
                          >
                            <Edit className="h-4 w-4" />
                            编辑
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(banner.id)}
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            删除
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit/Create Dialog */}
      {editingBanner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-primary" />
                {editingBanner.id ? '编辑轮播图' : '添加轮播图'}
              </CardTitle>
              <CardDescription>
                {editingBanner.id ? '编辑轮播图信息' : '填写轮播图信息'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  editingBanner.id ? handleUpdate(editingBanner) : handleCreate(editingBanner);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="title">标题</Label>
                  <Input
                    id="title"
                    value={editingBanner.title || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                    placeholder="输入标题"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle">副标题</Label>
                  <Input
                    id="subtitle"
                    value={editingBanner.subtitle || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                    placeholder="输入副标题"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">图片 URL</Label>
                  <Input
                    id="image_url"
                    value={editingBanner.image_url || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, image_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link_url">链接 URL</Label>
                  <Input
                    id="link_url"
                    value={editingBanner.link_url || ''}
                    onChange={(e) => setEditingBanner({ ...editingBanner, link_url: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order_num">排序</Label>
                  <Input
                    id="order_num"
                    type="number"
                    value={editingBanner.order_num || 0}
                    onChange={(e) => setEditingBanner({ ...editingBanner, order_num: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={!!editingBanner.is_active}
                    onCheckedChange={(checked) => setEditingBanner({ ...editingBanner, is_active: checked ? 1 : 0 })}
                  />
                  <Label htmlFor="is_active">启用</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? '保存中...' : editingBanner.id ? '更新' : '创建'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingBanner(null)}
                    className="flex-1"
                  >
                    取消
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
