'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  Eye,
  EyeOff,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useTranslation } from '@/context/LanguageContext';

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
  is_active: number;
  priority: number;
  created_at: string;
}

export default function AdminAnnouncementsPage() {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchAnnouncements();
  }, [isAuthenticated, user]);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/announcements', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setAnnouncements(data.data || []);
      }
    } catch (error) {
      console.error('获取公告失败:', error);
      toast.error('获取公告失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: Partial<Announcement>) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title || '',
          content: formData.content || '',
          type: formData.type || 'info',
          isActive: !!formData.is_active,
          priority: formData.priority || 0,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('创建成功');
        setEditingAnnouncement(null);
        fetchAnnouncements();
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

  const handleUpdate = async (formData: Partial<Announcement>) => {
    if (!editingAnnouncement) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/announcements', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingAnnouncement.id,
          title: formData.title || '',
          content: formData.content || '',
          type: formData.type || 'info',
          isActive: !!formData.is_active,
          priority: formData.priority || 0,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(t('announcements.update_success'));
        setEditingAnnouncement(null);
        fetchAnnouncements();
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
    if (!confirm(t('announcements.delete_confirm'))) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/announcements?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success(t('admin.delete_success'));
        fetchAnnouncements();
      } else {
        toast.error(data.message || t('admin.update_failed'));
      }
    } catch (error) {
      console.error('删除失败:', error);
      toast.error('删除失败');
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
              公告管理
            </h1>
          </div>
          <p className="text-muted-foreground">管理网站公告信息</p>
        </div>
        <Button onClick={() => setEditingAnnouncement({} as Announcement)} className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600">
          <Plus className="h-4 w-4" />
          添加公告
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Announcements List */}
          {announcements.length === 0 ? (
            <Card className="border-2">
              <CardContent className="py-12 text-center">
                <Megaphone className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg text-muted-foreground">暂无公告</p>
              </CardContent>
            </Card>
          ) : (
            announcements.map((announcement) => (
              <Card key={announcement.id} className="border-2 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold">{announcement.title}</h3>
                        <Badge
                          variant={
                            announcement.type === 'info'
                              ? 'default'
                              : announcement.type === 'warning'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {announcement.type === 'info' ? '信息' : announcement.type === 'warning' ? '警告' : '紧急'}
                        </Badge>
                        {announcement.is_active ? (
                          <Badge variant="outline" className="gap-1">
                            <Eye className="h-3 w-3" />
                            已发布
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="gap-1">
                            <EyeOff className="h-3 w-3" />
                            未发布
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground whitespace-pre-wrap">{announcement.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">
                      优先级: {announcement.priority} · 创建于 {new Date(announcement.created_at).toLocaleDateString()}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingAnnouncement(announcement)}
                        className="gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        编辑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(announcement.id)}
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        删除
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Edit/Create Dialog */}
      {editingAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                {editingAnnouncement.id ? '编辑公告' : '添加公告'}
              </CardTitle>
              <CardDescription>
                {editingAnnouncement.id ? '编辑公告信息' : '填写公告信息'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  editingAnnouncement.id ? handleUpdate(editingAnnouncement) : handleCreate(editingAnnouncement);
                }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="title">
                    标题 <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={editingAnnouncement.title || ''}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                    placeholder="输入公告标题"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">
                    内容 <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="content"
                    value={editingAnnouncement.content || ''}
                    onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, content: e.target.value })}
                    rows={6}
                    placeholder="输入公告内容"
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">类型</Label>
                    <Select
                      value={editingAnnouncement.type || 'info'}
                      onValueChange={(value) => setEditingAnnouncement({ ...editingAnnouncement, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">信息</SelectItem>
                        <SelectItem value="warning">警告</SelectItem>
                        <SelectItem value="urgent">紧急</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">优先级</Label>
                    <Input
                      id="priority"
                      type="number"
                      value={editingAnnouncement.priority || 0}
                      onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, priority: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={!!editingAnnouncement.is_active}
                    onCheckedChange={(checked) => setEditingAnnouncement({ ...editingAnnouncement, is_active: checked ? 1 : 0 })}
                  />
                  <Label htmlFor="is_active">立即发布</Label>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? '保存中...' : editingAnnouncement.id ? '更新' : '创建'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingAnnouncement(null)}
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
