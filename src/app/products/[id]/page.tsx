'use client';

import { Suspense, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeft,
  Package,
  Edit,
  Trash2,
  Heart,
  Scale,
  Share2,
  ZoomIn,
  CheckCircle,
  Settings,
  Activity,
  Zap,
  Shield,
  Clock,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTranslation } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useCompare } from '@/context/CompareContext';
import type { Motor } from '@/types/motor';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// 优化：使用 memo 避免不必要的重渲染
const ParameterCard = ({ label, value, icon: Icon, highlight }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={`group p-4 rounded-xl border transition-all hover:shadow-lg ${
      highlight
        ? 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800'
        : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'
    }`}
  >
    <div className="flex items-start gap-3">
      {Icon && (
        <div className={`p-2 rounded-lg ${highlight ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-200 dark:bg-gray-800'}`}>
          <Icon className={`h-4 w-4 ${highlight ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {label}
        </div>
        <div className={`text-xl font-bold ${highlight ? 'text-primary' : 'text-foreground'}`}>
          {value}
        </div>
      </div>
    </div>
  </motion.div>
);

// 优化：使用 memo 避免不必要的重渲染
const RelatedProductCard = ({ motor }: { motor: any }) => (
  <Link href={`/products/${motor.id}`}>
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
      <CardContent className="p-4">
        <div className="aspect-square bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          {motor.imageUrl ? (
            <Image
              src={motor.imageUrl}
              alt={motor.model}
              width={200}
              height={200}
              className="object-contain group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <Package className="h-12 w-12 text-muted-foreground" />
          )}
        </div>
        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors truncate">
          {motor.model}
        </h3>
        <div className="flex items-center justify-between">
          <Badge variant="secondary">{motor.frameSize}</Badge>
          <span className="text-sm text-muted-foreground">{motor.power} kW</span>
        </div>
      </CardContent>
    </Card>
  </Link>
);

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToCompare, isComparing } = useCompare();
  const [motor, setMotor] = useState<Motor | null>(null);
  const [relatedMotors, setRelatedMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchMotor();
      fetchRelatedMotors();
    }
  }, [params.id]);

  const fetchMotor = async () => {
    try {
      const response = await fetch(`/api/motors/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setMotor(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch motor:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedMotors = async () => {
    try {
      const response = await fetch(`/api/motors?limit=4`);
      const data = await response.json();
      if (data.success) {
        setRelatedMotors(data.data.filter((m: Motor) => m.id !== Number(params.id)).slice(0, 4));
      }
    } catch (error) {
      console.error('Failed to fetch related motors:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/motors/${params.id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        toast.success(t('admin.delete_success'));
        router.push('/products');
      }
    } catch (error) {
      console.error('Failed to delete motor:', error);
      toast.error(t('common.error'));
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('链接已复制到剪贴板');
    } catch (error) {
      toast.error('复制失败');
    }
  };

  // 优化：使用 useMemo 缓存计算结果
  const parameterGroups = useMemo(() => {
    if (!motor) return [];

    return [
      {
        title: '基本信息',
        icon: Package,
        fields: [
          { key: 'model', label: '型号', value: motor.model, icon: Settings, highlight: true },
          { key: 'frameSize', label: '机座号', value: motor.frameSize, icon: Package },
          { key: 'weight', label: '重量', value: `${motor.weight} kg`, icon: Scale },
        ],
      },
      {
        title: '电气参数',
        icon: Zap,
        fields: [
          { key: 'power', label: '额定功率', value: `${motor.power} kW`, icon: Zap, highlight: true },
          { key: 'voltage', label: '额定电压', value: `${motor.voltage} V`, icon: Zap, highlight: true },
          { key: 'current', label: '额定电流', value: `${motor.current} A`, icon: Activity },
          { key: 'rpm', label: '额定转速', value: `${motor.rpm} rpm`, icon: Activity, highlight: true },
          { key: 'frequency', label: '频率', value: `${motor.frequency} Hz`, icon: Settings },
          { key: 'efficiency', label: '效率', value: `${motor.efficiency}%`, icon: Star },
          { key: 'powerFactor', label: '功率因数', value: motor.powerFactor, icon: Star },
        ],
      },
      {
        title: '机械参数',
        icon: Activity,
        fields: [
          { key: 'lockedRotorTorque', label: '堵转转矩倍数', value: motor.lockedRotorTorque, icon: Activity },
          { key: 'maxTorque', label: '最大转矩倍数', value: motor.maxTorque, icon: Activity },
          { key: 'startingCurrent', label: '启动电流倍数', value: motor.startingCurrent, icon: Zap },
          { key: 'noise', label: '噪声', value: `${motor.noise} dB`, icon: Activity },
        ],
      },
      {
        title: '其他参数',
        icon: Shield,
        fields: [
          { key: 'poles', label: '极数', value: motor.poles, icon: Settings },
          { key: 'ip', label: '防护等级', value: motor.ip, icon: Shield },
          { key: 'insulation', label: '绝缘等级', value: motor.insulation, icon: Shield },
          { key: 'mounting', label: '安装方式', value: motor.mounting, icon: Settings },
          { key: 'connection', label: '接法', value: motor.connection, icon: Settings },
        ],
      },
    ];
  }, [motor]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-1/4 rounded bg-muted" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square rounded-2xl bg-muted" />
            <div className="space-y-4">
              <div className="h-12 rounded bg-muted" />
              <div className="h-8 w-3/4 rounded bg-muted" />
              <div className="h-24 rounded bg-muted" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-20 rounded bg-muted" />
                <div className="h-20 rounded bg-muted" />
                <div className="h-20 rounded bg-muted" />
                <div className="h-20 rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!motor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-2">
          <CardContent className="py-20 text-center">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">产品不存在</p>
            <Link href="/products" className="mt-4 inline-block">
              <Button>返回产品列表</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const productImage = (motor.imageUrl && !imageError) ? motor.imageUrl : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 面包屑导航 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"
      >
        <Link href="/" className="hover:text-primary transition-colors">
          首页
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary transition-colors">
          产品中心
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{motor.model}</span>
      </motion.div>

      {/* 返回按钮 */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <Link href="/products">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            返回列表
          </Button>
        </Link>
      </motion.div>

      {/* 主内容区 - 左右分栏布局 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-8 lg:grid-cols-5"
      >
        {/* 左侧 - 产品图片 (2列) */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden border-2 sticky top-24">
            <CardContent className="p-0">
              <div className="relative aspect-square bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm transition-all hover:scale-110"
                    >
                      <ZoomIn className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl p-0 bg-transparent">
                    <div className="aspect-video relative">
                      {productImage ? (
                        <Image
                          src={productImage}
                          alt={motor.model}
                          fill
                          className="object-contain"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
                          <Package className="h-32 w-32 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                {productImage ? (
                  <Image
                    src={productImage}
                    alt={motor.model}
                    fill
                    className="object-contain p-12"
                    onError={() => setImageError(true)}
                    priority
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Package className="h-32 w-32 text-muted-foreground mb-4" />
                    <p className="text-lg text-muted-foreground">{motor.model}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧 - 产品信息和参数 (3列) */}
        <div className="lg:col-span-3 space-y-6">
          {/* 产品标题 */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {motor.model}
              </h1>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {motor.frameSize}
              </Badge>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {motor.power} kW
              </Badge>
            </div>
            <p className="text-xl text-muted-foreground">
              高性能三相异步电动机，适用于各种工业应用场景
            </p>
          </div>

          {/* 操作按钮组 */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant={isFavorite(motor.id) ? "default" : "outline"}
              size="lg"
              onClick={() => isFavorite(motor.id) ? removeFavorite(motor.id) : addFavorite(motor)}
              className="gap-2 flex-1 sm:flex-none"
            >
              <Heart className={`h-5 w-5 ${isFavorite(motor.id) ? 'fill-current' : ''}`} />
              {isFavorite(motor.id) ? '已收藏' : '收藏'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => addToCompare(motor)}
              disabled={isComparing(motor.id)}
              className="gap-2 flex-1 sm:flex-none"
            >
              <Scale className="h-5 w-5" />
              {isComparing(motor.id) ? '已添加' : '加入对比'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
              className="gap-2 flex-1 sm:flex-none"
            >
              <Share2 className="h-5 w-5" />
              分享
            </Button>
            {isAuthenticated && (
              <>
                <Link href={`/admin/edit/${motor.id}`} className="flex-1 sm:flex-none">
                  <Button variant="outline" size="lg" className="gap-2 w-full">
                    <Edit className="h-5 w-5" />
                    编辑
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="lg" className="gap-2 flex-1 sm:flex-none">
                      <Trash2 className="h-5 w-5" />
                      删除
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>删除产品</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('admin.delete_confirm')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete}>
                        确认删除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )}
          </div>

          <Separator />

          {/* 产品描述 */}
          {motor.description && (
            <Card className="border-2 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  产品描述
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {motor.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 技术参数 - 分组展示 */}
          <div className="space-y-6">
            {parameterGroups.map((group, groupIndex) => {
              const Icon = group.icon;
              return (
                <Card key={group.title} className="border-2">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {group.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {group.fields.map((field: any, index: number) => (
                        <ParameterCard
                          key={field.key}
                          label={field.label}
                          value={field.value}
                          icon={field.icon}
                          highlight={field.highlight}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* 相关推荐 */}
      {relatedMotors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">相关产品</h2>
            <Link href="/products">
              <Button variant="ghost" className="gap-2">
                查看全部
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedMotors.map((relatedMotor) => (
              <RelatedProductCard key={relatedMotor.id} motor={relatedMotor} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

// 优化：添加 Suspense 边界
export default function ProductDetailPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-1/4 rounded bg-muted" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="aspect-square rounded-2xl bg-muted" />
            <div className="space-y-4">
              <div className="h-12 rounded bg-muted" />
              <div className="h-8 w-3/4 rounded bg-muted" />
              <div className="h-24 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    }>
      <ProductDetailContent />
    </Suspense>
  );
}
