'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Settings, LogOut, Package, Heart, Scale, Clock, Shield, Bell, ChevronRight, Award, MapPin, Mail, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useCompare } from '@/context/CompareContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { favorites } = useFavorites();
  const { compareList } = useCompare();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'compare' | 'settings'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: '',
    company: '',
    address: '',
    bio: '',
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <User className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>请先登录</CardTitle>
            <CardDescription>您需要登录才能访问个人中心</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">立即登录</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSave = () => {
    toast.success('个人信息已更新');
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    toast.success('已退出登录');
    router.push('/');
  };

  const menuItems = [
    { id: 'overview', icon: User, label: '个人信息', count: 0 },
    { id: 'favorites', icon: Heart, label: '我的收藏', count: favorites.length },
    { id: 'compare', icon: Scale, label: '对比列表', count: compareList.length },
    { id: 'settings', icon: Settings, label: '账户设置', count: 0 },
  ];

  const activities = [
    {
      id: 1,
      type: 'favorite',
      message: '收藏了产品 YE3-160M-4',
      time: '2小时前',
    },
    {
      id: 2,
      type: 'compare',
      message: '添加了2个产品到对比列表',
      time: '5小时前',
    },
    {
      id: 3,
      type: 'view',
      message: '查看了产品 YE3-180M-4',
      time: '1天前',
    },
  ];

  const notifications = [
    {
      id: 1,
      title: '系统通知',
      content: '您的密码将于30天后过期，请及时修改',
      time: '3天前',
      read: false,
    },
    {
      id: 2,
      title: '产品更新',
      content: '您收藏的产品 YE3-160M-4 已更新',
      time: '1周前',
      read: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          个人中心
        </h1>
        <p className="text-muted-foreground">管理您的个人信息、收藏和设置</p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="border-2 sticky top-20">
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 bg-gradient-to-br from-blue-500 to-cyan-600 text-white text-xl">
                  <AvatarFallback>{user?.username?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{user?.username}</CardTitle>
                  <CardDescription className="text-sm">{user?.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`flex items-center justify-between px-6 py-4 text-left transition-colors hover:bg-accent ${
                        activeTab === item.id ? 'bg-accent border-l-4 border-primary' : 'border-l-4 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${activeTab === item.id ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`font-medium ${activeTab === item.id ? 'text-primary' : 'text-foreground'}`}>
                          {item.label}
                        </span>
                      </div>
                      {item.count > 0 && (
                        <Badge variant="secondary">{item.count}</Badge>
                      )}
                    </button>
                  );
                })}
                <Separator />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-6 py-4 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">退出登录</span>
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                  <CardHeader className="pb-3">
                    <CardDescription>收藏产品</CardDescription>
                    <CardTitle className="text-3xl text-primary">{favorites.length}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="border-2 bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/20 dark:to-sky-950/20">
                  <CardHeader className="pb-3">
                    <CardDescription>对比列表</CardDescription>
                    <CardTitle className="text-3xl text-cyan-600">{compareList.length}</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="border-2 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20">
                  <CardHeader className="pb-3">
                    <CardDescription>账户等级</CardDescription>
                    <CardTitle className="text-3xl text-sky-600 flex items-center gap-2">
                      <Award className="h-8 w-8" />
                      VIP
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>

              {/* Profile Info */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>个人信息</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="gap-2"
                    >
                      {isEditing ? <XCircle className="h-4 w-4" /> : <Settings className="h-4 w-4" />}
                      {isEditing ? '取消' : '编辑'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label>用户名</Label>
                      <Input
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 bg-background"
                      />
                    </div>
                    <div>
                      <Label>邮箱</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="mt-2 bg-background"
                      />
                    </div>
                    <div>
                      <Label>联系电话</Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        placeholder="请输入联系电话"
                        className="mt-2 bg-background"
                      />
                    </div>
                    <div>
                      <Label>公司名称</Label>
                      <Input
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        disabled={!isEditing}
                        placeholder="请输入公司名称"
                        className="mt-2 bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>地址</Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                      placeholder="请输入地址"
                      className="mt-2 bg-background"
                    />
                  </div>
                  <div>
                    <Label>个人简介</Label>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      placeholder="请输入个人简介"
                      rows={3}
                      className="mt-2 bg-background"
                    />
                  </div>
                  {isEditing && (
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        取消
                      </Button>
                      <Button onClick={handleSave} className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600">
                        <CheckCircle className="h-4 w-4" />
                        保存
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Activities */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    最近活动
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                          {activity.type === 'favorite' && <Heart className="h-5 w-5 text-white" />}
                          {activity.type === 'compare' && <Scale className="h-5 w-5 text-white" />}
                          {activity.type === 'view' && <Package className="h-5 w-5 text-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-primary" />
                      我的收藏
                    </CardTitle>
                    <Link href="/favorites">
                      <Button variant="outline" size="sm" className="gap-2">
                        查看全部
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {favorites.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>还没有收藏任何产品</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {favorites.slice(0, 3).map((favorite) => (
                        <Link key={favorite.id} href={`/products/${favorite.motorId}`}>
                          <Card className="border hover:border-primary transition-all hover:shadow-md">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold">{favorite.motor.model}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {favorite.motor.power}kW · {favorite.motor.rpm}rpm · {favorite.motor.voltage}V
                                  </p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'compare' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="h-5 w-5 text-primary" />
                      对比列表
                    </CardTitle>
                    <Link href="/compare">
                      <Button variant="outline" size="sm" className="gap-2">
                        查看全部
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {compareList.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>对比列表为空</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {compareList.slice(0, 3).map((item) => (
                        <Link key={item.id} href={`/products/${item.motorId}`}>
                          <Card className="border hover:border-primary transition-all hover:shadow-md">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold">{item.motor.model}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {item.motor.power}kW · {item.motor.rpm}rpm · {item.motor.voltage}V
                                  </p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    账户安全
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">修改密码</h3>
                      <p className="text-sm text-muted-foreground">定期修改密码，保护账户安全</p>
                    </div>
                    <Button variant="outline" size="sm">
                      修改
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">绑定手机</h3>
                      <p className="text-sm text-muted-foreground">绑定手机号码，方便找回密码</p>
                    </div>
                    <Button variant="outline" size="sm">
                      绑定
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    消息通知
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`p-4 border rounded-lg ${notification.read ? 'opacity-60' : 'bg-blue-50 dark:bg-blue-950/20'}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold">{notification.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{notification.content}</p>
                          </div>
                          {!notification.read && (
                            <Badge variant="secondary">新消息</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
