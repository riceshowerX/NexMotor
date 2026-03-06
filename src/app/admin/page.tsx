'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  MessageSquare,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Settings,
  Layers,
  Megaphone,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/login');
      return;
    }
    fetchStats();
  }, [isAuthenticated, user]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      } else if (data.message === '需要管理员权限') {
        // Token无效，需要重新登录
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      }
    } catch (error) {
      console.error('获取统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    trend,
  }: {
    title: string;
    value: number | string;
    icon: any;
    color: string;
    trend?: number;
  }) => (
    <Card className="border-2 hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {trend !== undefined && (
          <p className={`text-xs flex items-center gap-1 mt-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {Math.abs(trend)}% 较上周
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            管理后台
          </h1>
          <p className="text-muted-foreground mt-2">欢迎回来，{user?.username}</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/messages">
            <Button variant="outline" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              留言管理
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              系统设置
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Check if all stats are 0 - indicates token issue */}
          {stats?.products?.total === 0 && stats?.messages?.total === 0 && stats?.users?.total === 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>数据加载失败</AlertTitle>
              <AlertDescription>
                无法加载统计数据，可能是登录凭证已过期。请
                <Link href="/login" className="font-semibold underline ml-1">
                  重新登录
                </Link>
                后再试。
              </AlertDescription>
            </Alert>
          )}

          {/* Stats Overview */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="产品总数"
              value={stats?.products?.total || 0}
              icon={Package}
              color="from-blue-500 to-cyan-500"
              trend={5.2}
            />
            <StatCard
              title="留言总数"
              value={stats?.messages?.total || 0}
              icon={MessageSquare}
              color="from-cyan-500 to-sky-500"
              trend={12.5}
            />
            <StatCard
              title="未读留言"
              value={stats?.messages?.unread || 0}
              icon={AlertCircle}
              color="from-sky-500 to-blue-500"
            />
            <StatCard
              title="用户总数"
              value={stats?.users?.total || 0}
              icon={Users}
              color="from-blue-600 to-cyan-600"
              trend={8.3}
            />
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  留言管理
                </CardTitle>
                <CardDescription>查看和回复用户留言</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{stats?.messages?.total || 0}</p>
                    <p className="text-sm text-muted-foreground">总留言数</p>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {stats?.messages?.unread || 0} 未读
                  </Badge>
                </div>
                <Link href="/admin/messages" className="block">
                  <Button className="w-full gap-2 bg-gradient-to-r from-blue-600 to-cyan-600">
                    查看留言
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/20 dark:to-sky-950/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  产品管理
                </CardTitle>
                <CardDescription>管理和编辑产品信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 mb-4">
                  <p className="text-2xl font-bold">{stats?.products?.total || 0}</p>
                  <p className="text-sm text-muted-foreground">产品总数</p>
                </div>
                <div className="space-y-2">
                  <Link href="/admin/products" className="block">
                    <Button variant="outline" className="w-full gap-2">
                      <Eye className="h-4 w-4" />
                      查看产品
                    </Button>
                  </Link>
                  <Link href="/admin/add" className="block">
                    <Button variant="outline" className="w-full gap-2">
                      <Package className="h-4 w-4" />
                      添加产品
                    </Button>
                  </Link>
                  <Link href="/admin/import" className="block">
                    <Button variant="outline" className="w-full gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-primary/50">
                      <Upload className="h-4 w-4" />
                      批量导入
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  系统设置
                </CardTitle>
                <CardDescription>配置网站参数和信息</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/admin/settings" className="block">
                    <Button variant="outline" className="w-full gap-2 mb-2">
                      <Settings className="h-4 w-4" />
                      基本设置
                    </Button>
                  </Link>
                  <Link href="/admin/banners" className="block">
                    <Button variant="outline" className="w-full gap-2 mb-2">
                      <Layers className="h-4 w-4" />
                      轮播图管理
                    </Button>
                  </Link>
                  <Link href="/admin/announcements" className="block">
                    <Button variant="outline" className="w-full gap-2">
                      <Megaphone className="h-4 w-4" />
                      公告管理
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Messages */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  最近留言
                </CardTitle>
                <Link href="/admin/messages">
                  <Button variant="ghost" size="sm" className="gap-2">
                    查看全部
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.messages?.recent?.map((msg: any) => (
                  <div key={msg.id} className="flex items-start gap-4 p-4 border rounded-lg hover:border-primary transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                        {msg.name?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold truncate">{msg.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={msg.status === 'unread' ? 'default' : 'secondary'}>
                            {msg.status === 'unread' ? '未读' : msg.status === 'read' ? '已读' : '已回复'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-primary mb-1">{msg.subject}</p>
                      <p className="text-sm text-muted-foreground truncate">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {(!stats?.messages?.recent || stats.messages.recent.length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>暂无留言</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
