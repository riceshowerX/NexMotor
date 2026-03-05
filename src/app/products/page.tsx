'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, SlidersHorizontal, Package, Heart, Scale, X, Check, Zap, Award, ArrowUpDown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/context/LanguageContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useCompare } from '@/context/CompareContext';
import type { Motor, MotorFilters } from '@/types/motor';
import { motion, AnimatePresence } from 'framer-motion';

// 优化：使用 memo 避免不必要的重渲染
const ProductCard = ({ motor, isFavorite, isComparing, onFavorite, onCompare }: any) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/products/${motor.id}`}>
        <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-2 hover:border-primary/50 overflow-hidden">
          {/* 产品图片区域 */}
          <div className="relative aspect-square bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-8">
            {motor.imageUrl && !imageError ? (
              <Image
                src={motor.imageUrl}
                alt={motor.model}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-500"
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-20 w-20 text-muted-foreground group-hover:scale-110 transition-transform duration-500" />
              </div>
            )}
            <Badge className="absolute top-4 right-4 bg-blue-600 text-white">
              {motor.frameSize}
            </Badge>
          </div>

          {/* 产品信息 */}
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center justify-between group-hover:text-primary transition-colors">
              {motor.model}
              {motor.efficiency >= 85 && (
                <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                  <Star className="h-3 w-3 fill-current" />
                  高效
                </Badge>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="pb-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-xs text-muted-foreground">功率</p>
                  <p className="font-semibold">{motor.power} kW</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-cyan-500" />
                <div>
                  <p className="text-xs text-muted-foreground">转速</p>
                  <p className="font-semibold">{motor.rpm} rpm</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-purple-500" />
                <div>
                  <p className="text-xs text-muted-foreground">电压</p>
                  <p className="font-semibold">{motor.voltage} V</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-500" />
                <div>
                  <p className="text-xs text-muted-foreground">效率</p>
                  <p className="font-semibold">{motor.efficiency}%</p>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-0">
            <div className="flex gap-2 w-full">
              <Button
                variant={isFavorite(motor.id) ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  onFavorite(motor, e);
                }}
              >
                <Heart className={`h-4 w-4 ${isFavorite(motor.id) ? 'fill-current' : ''}`} />
                {isFavorite(motor.id) ? '已收藏' : '收藏'}
              </Button>
              <Button
                variant={isComparing(motor.id) ? "default" : "outline"}
                size="sm"
                className="flex-1 gap-1"
                onClick={(e) => {
                  e.preventDefault();
                  onCompare(motor, e);
                }}
                disabled={isComparing(motor.id)}
              >
                <Scale className="h-4 w-4" />
                {isComparing(motor.id) ? '已添加' : '对比'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default function ProductsPage() {
  const { t } = useTranslation();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToCompare, isComparing } = useCompare();
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MotorFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<string>('default');
  const itemsPerPage = 12;

  useEffect(() => {
    fetchMotors();
  }, [filters, sortOrder]);

  const fetchMotors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });

      const response = await fetch(`/api/motors?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setMotors(data.data || []);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Failed to fetch motors:', error);
    } finally {
      setLoading(false);
    }
  };

  // 优化：使用 useMemo 缓存排序和分页结果
  const processedMotors = useMemo(() => {
    let result = [...motors];

    // 排序
    switch (sortOrder) {
      case 'power_asc':
        result.sort((a, b) => a.power - b.power);
        break;
      case 'power_desc':
        result.sort((a, b) => b.power - a.power);
        break;
      case 'rpm_asc':
        result.sort((a, b) => a.rpm - b.rpm);
        break;
      case 'rpm_desc':
        result.sort((a, b) => b.rpm - a.rpm);
        break;
      case 'efficiency_desc':
        result.sort((a, b) => (b.efficiency || 0) - (a.efficiency || 0));
        break;
    }

    return result;
  }, [motors, sortOrder]);

  const totalPages = Math.ceil(processedMotors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMotors = processedMotors.slice(startIndex, endIndex);

  const handleFilterChange = (key: keyof MotorFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
    setSortOrder('default');
  };

  const handleFavorite = (motor: Motor, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(motor.id)) {
      removeFavorite(motor.id);
    } else {
      addFavorite(motor);
    }
  };

  const handleCompare = (motor: Motor, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCompare(motor);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 页面标题 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {t('products.title')}
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              共找到 <span className="font-semibold text-primary">{processedMotors.length}</span> 款产品
            </p>
          </div>
        </div>
      </motion.div>

      {/* 搜索和筛选栏 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="搜索产品型号..."
                  value={filters.model || ''}
                  onChange={(e) => handleFilterChange('model', e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowFilters(!showFilters)}
                className={`gap-2 ${showFilters ? 'bg-primary/10' : ''}`}
              >
                <SlidersHorizontal className="h-5 w-5" />
                {showFilters ? '收起筛选' : '高级筛选'}
              </Button>
              <Select
                value={sortOrder}
                onValueChange={setSortOrder}
              >
                <SelectTrigger className="w-[200px] h-12">
                  <ArrowUpDown className="h-4 w-4 mr-2 text-muted-foreground" />
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">默认排序</SelectItem>
                  <SelectItem value="power_asc">功率从小到大</SelectItem>
                  <SelectItem value="power_desc">功率从大到小</SelectItem>
                  <SelectItem value="rpm_asc">转速从小到大</SelectItem>
                  <SelectItem value="rpm_desc">转速从大到小</SelectItem>
                  <SelectItem value="efficiency_desc">效率从高到低</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 高级筛选面板 */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
              <CardContent className="p-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <Label>功率范围 (kW)</Label>
                    <div className="mt-2 flex gap-2">
                      <Input
                        type="number"
                        placeholder="最小"
                        value={filters.power_min || ''}
                        onChange={(e) => handleFilterChange('power_min', e.target.value ? Number(e.target.value) : undefined)}
                      />
                      <span className="flex items-center text-muted-foreground">-</span>
                      <Input
                        type="number"
                        placeholder="最大"
                        value={filters.power_max || ''}
                        onChange={(e) => handleFilterChange('power_max', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>额定电压 (V)</Label>
                    <Select
                      value={filters.voltage?.toString() || ''}
                      onValueChange={(value) => handleFilterChange('voltage', value ? Number(value) : undefined)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="全部" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部</SelectItem>
                        <SelectItem value="380">380V</SelectItem>
                        <SelectItem value="220">220V</SelectItem>
                        <SelectItem value="660">660V</SelectItem>
                        <SelectItem value="690">690V</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>防护等级</Label>
                    <Select
                      value={filters.ip || ''}
                      onValueChange={(value) => handleFilterChange('ip', value || undefined)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="全部" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部</SelectItem>
                        <SelectItem value="IP54">IP54</SelectItem>
                        <SelectItem value="IP55">IP55</SelectItem>
                        <SelectItem value="IP56">IP56</SelectItem>
                        <SelectItem value="IP65">IP65</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>绝缘等级</Label>
                    <Select
                      value={filters.insulation || ''}
                      onValueChange={(value) => handleFilterChange('insulation', value || undefined)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="全部" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">全部</SelectItem>
                        <SelectItem value="B">B级</SelectItem>
                        <SelectItem value="F">F级</SelectItem>
                        <SelectItem value="H">H级</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3 justify-end">
                  <Button variant="outline" onClick={resetFilters} className="gap-2">
                    <X className="h-4 w-4" />
                    重置筛选
                  </Button>
                  <Button onClick={() => setShowFilters(false)} className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Check className="h-4 w-4" />
                    应用筛选
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 快速筛选标签 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6 flex flex-wrap gap-2"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ poles: 4 })}
          className="gap-2 hover:border-primary hover:bg-primary/5 transition-all"
        >
          <Zap className="h-3 w-3" />
          4极电机
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ voltage: 380 })}
          className="gap-2 hover:border-primary hover:bg-primary/5 transition-all"
        >
          <Zap className="h-3 w-3" />
          380V
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ frameSize: '90S' })}
          className="gap-2 hover:border-primary hover:bg-primary/5 transition-all"
        >
          <Zap className="h-3 w-3" />
          90S机座
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ efficiency_min: 90 })}
          className="gap-2 hover:border-primary hover:bg-primary/5 transition-all"
        >
          <Award className="h-3 w-3" />
          高效率≥90%
        </Button>
      </motion.div>

      {/* 产品网格 */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-muted" />
              <CardHeader>
                <div className="h-6 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 w-full rounded bg-muted" />
                  <div className="h-4 w-2/3 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : processedMotors.length === 0 ? (
        <Card className="border-2">
          <CardContent className="py-20 text-center">
            <Package className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground mb-4">{t('products.no_results')}</p>
            <Button onClick={resetFilters} variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              清除筛选条件
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {currentMotors.map((motor) => (
              <ProductCard
                key={motor.id}
                motor={motor}
                isFavorite={isFavorite}
                isComparing={isComparing}
                onFavorite={handleFavorite}
                onCompare={handleCompare}
              />
            ))}
          </motion.div>

          {/* 分页 */}
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-12 flex items-center justify-center gap-2"
            >
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                size="lg"
              >
                上一页
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  const isCurrentPage = page === currentPage;

                  // 优化：只显示部分页码
                  let showPage = true;
                  if (totalPages > 7) {
                    if (page === 1 || page === totalPages) {
                      showPage = true;
                    } else if (page >= currentPage - 1 && page <= currentPage + 1) {
                      showPage = true;
                    } else {
                      showPage = false;
                    }
                  }

                  if (!showPage && (page === 2 || page === totalPages - 1)) {
                    return <span key={i} className="px-2">...</span>;
                  }

                  if (!showPage) return null;

                  return (
                    <Button
                      key={page}
                      variant={isCurrentPage ? "default" : "outline"}
                      size="lg"
                      onClick={() => setCurrentPage(page)}
                      className="min-w-[48px]"
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                size="lg"
              >
                下一页
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
