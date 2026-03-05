'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Edit, Trash2, Heart, Scale, Share2, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToCompare, isComparing } = useCompare();
  const [motor, setMotor] = useState<Motor | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    fetchMotor();
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-1/4 rounded bg-muted mb-8" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-96 rounded-lg bg-muted" />
            <div className="space-y-4">
              <div className="h-12 rounded bg-muted" />
              <div className="h-8 w-3/4 rounded bg-muted" />
              <div className="h-24 rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!motor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">产品不存在</p>
        </div>
      </div>
    );
  }

  const fields = [
    { key: 'model', label: t('admin.form.model'), highlight: true },
    { key: 'frameSize', label: t('admin.form.frameSize') },
    { key: 'power', label: t('admin.form.power') + ' (kW)', highlight: true },
    { key: 'voltage', label: t('admin.form.voltage') + ' (V)', highlight: true },
    { key: 'current', label: t('admin.form.current') + ' (A)' },
    { key: 'rpm', label: t('admin.form.rpm'), highlight: true },
    { key: 'efficiency', label: t('admin.form.efficiency') + ' (%)' },
    { key: 'powerFactor', label: t('admin.form.powerFactor') },
    { key: 'frequency', label: t('admin.form.frequency') + ' (Hz)' },
    { key: 'poles', label: t('admin.form.poles') },
    { key: 'ip', label: t('admin.form.ip') },
    { key: 'insulation', label: t('admin.form.insulation') },
    { key: 'mounting', label: t('admin.form.mounting') },
    { key: 'weight', label: t('admin.form.weight') + ' (kg)' },
    { key: 'connection', label: t('admin.form.connection') },
    { key: 'lockedRotorTorque', label: t('admin.form.lockedRotorTorque') + ' (Nm)' },
    { key: 'maxTorque', label: t('admin.form.maxTorque') + ' (Nm)' },
    { key: 'startingCurrent', label: t('admin.form.startingCurrent') + ' (A)' },
    { key: 'noise', label: t('admin.form.noise') + ' (dB)' },
  ];

  // 生成占位图URL（如果没有图片）
  const placeholderImage = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f1f5f9'/%3E%3Ctext x='400' y='300' font-family='Arial' font-size='48' fill='%2394a3b8' text-anchor='middle'%3E${motor.model}%3C/text%3E%3Ctext x='400' y='360' font-family='Arial' font-size='24' fill='%2364748b' text-anchor='middle'%3E暂无图片%3C/text%3E%3C/svg%3E`;

  const productImage = (motor.imageUrl && !imageError) ? motor.imageUrl : placeholderImage;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 面包屑导航 */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/products" className="hover:text-primary">
          产品中心
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">{motor.model}</span>
      </div>

      {/* 返回按钮 */}
      <Link href="/products">
        <Button variant="ghost" className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          返回列表
        </Button>
      </Link>

      {/* 产品标题和操作按钮 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {motor.model}
              </h1>
              <Badge variant="secondary" className="text-sm">
                {motor.frameSize}
              </Badge>
            </div>
            <p className="text-muted-foreground text-lg">
              高性能三相异步电动机
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={isFavorite(motor.id) ? "default" : "outline"}
              onClick={() => isFavorite(motor.id) ? removeFavorite(motor.id) : addFavorite(motor)}
              className="gap-2"
            >
              <Heart className={`h-4 w-4 ${isFavorite(motor.id) ? 'fill-current' : ''}`} />
              {isFavorite(motor.id) ? '已收藏' : '收藏'}
            </Button>
            <Button
              variant="outline"
              onClick={() => addToCompare(motor)}
              disabled={isComparing(motor.id)}
              className="gap-2"
            >
              <Scale className="h-4 w-4" />
              {isComparing(motor.id) ? '已添加' : '加入对比'}
            </Button>
            <Button variant="outline" onClick={handleShare} className="gap-2">
              <Share2 className="h-4 w-4" />
              分享
            </Button>
            {isAuthenticated && (
              <>
                <Link href={`/admin/edit/${motor.id}`}>
                  <Button variant="outline" size="default" className="gap-2">
                    <Edit className="h-4 w-4" />
                    编辑
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="default" className="gap-2">
                      <Trash2 className="h-4 w-4" />
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
        </div>
      </motion.div>

      {/* 产品图片 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <Card className="overflow-hidden border-2">
          <CardContent className="p-0">
            <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl p-0">
                  <img
                    src={productImage}
                    alt={motor.model}
                    className="w-full h-auto object-contain"
                    onError={() => setImageError(true)}
                  />
                </DialogContent>
              </Dialog>
              <img
                src={productImage}
                alt={motor.model}
                className="w-full h-full object-contain p-8"
                onError={() => setImageError(true)}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 产品描述 */}
      {motor.description && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="border-2 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
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
        </motion.div>
      )}

      {/* 技术参数 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-2">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5" />
              技术参数
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {fields.map((field, index) => {
                const value = (motor as any)[field.key];
                if (value === undefined || value === null) return null;

                return (
                  <motion.div
                    key={field.key}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className={`p-4 rounded-lg border ${
                      field.highlight
                        ? 'bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-blue-200 dark:border-blue-800'
                        : 'bg-muted/30'
                    }`}
                  >
                    <div className="text-sm text-muted-foreground mb-1">
                      {field.label}
                    </div>
                    <div className={`text-lg font-semibold ${field.highlight ? 'text-primary' : ''}`}>
                      {value}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 相关推荐 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8"
      >
        <Card className="border-2">
          <CardHeader>
            <CardTitle>相关产品</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Package className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>更多相关产品即将上线</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
