'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Package, Heart, Scale, X, Check, Zap, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pagination } from '@/components/ui/pagination';
import { useTranslation } from '@/context/LanguageContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useCompare } from '@/context/CompareContext';
import type { Motor, MotorFilters } from '@/types/motor';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  const { t } = useTranslation();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToCompare, isComparing } = useCompare();
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MotorFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    fetchMotors();
  }, [filters]);

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

  const handleFilterChange = (key: keyof MotorFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  const totalPages = Math.ceil(motors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMotors = motors.slice(startIndex, endIndex);

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
    if (isComparing(motor.id)) {
      // 已经在对比列表中，不做任何操作
    } else {
      addToCompare(motor);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('products.title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('products.results', { count: motors.length })}
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('products.search')}
            value={filters.model || ''}
            onChange={(e) => handleFilterChange('model', e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          {t('products.filter')}
        </Button>
        <Select
          value={filters.sortBy || 'default'}
          onValueChange={(value) => handleFilterChange('sortBy', value === 'default' ? undefined : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('products.sort')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">{t('products.sort_options.default')}</SelectItem>
            <SelectItem value="power_asc">{t('products.sort_options.power_asc')}</SelectItem>
            <SelectItem value="power_desc">{t('products.sort_options.power_desc')}</SelectItem>
            <SelectItem value="rpm_asc">{t('products.sort_options.rpm_asc')}</SelectItem>
            <SelectItem value="rpm_desc">{t('products.sort_options.rpm_desc')}</SelectItem>
            <SelectItem value="efficiency_desc">{t('products.sort_options.efficiency_desc')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 rounded-lg border-2 border-primary/20 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 p-6"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <div>
              <Label>{t('products.fields.power')} (kW)</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.power_min || ''}
                  onChange={(e) => handleFilterChange('power_min', e.target.value ? Number(e.target.value) : undefined)}
                  className="bg-background"
                />
                <span className="flex items-center text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.power_max || ''}
                  onChange={(e) => handleFilterChange('power_max', e.target.value ? Number(e.target.value) : undefined)}
                  className="bg-background"
                />
              </div>
            </div>

            <div>
              <Label>{t('products.fields.voltage')} (V)</Label>
              <Select
                value={filters.voltage?.toString() || ''}
                onValueChange={(value) => handleFilterChange('voltage', value ? Number(value) : undefined)}
              >
                <SelectTrigger className="mt-2 bg-background">
                  <SelectValue placeholder={t('common.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('common.all')}</SelectItem>
                  <SelectItem value="380">380V</SelectItem>
                  <SelectItem value="220">220V</SelectItem>
                  <SelectItem value="660">660V</SelectItem>
                  <SelectItem value="690">690V</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('products.fields.rpm')}</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.rpm_min || ''}
                  onChange={(e) => handleFilterChange('rpm_min', e.target.value ? Number(e.target.value) : undefined)}
                  className="bg-background"
                />
                <span className="flex items-center text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.rpm_max || ''}
                  onChange={(e) => handleFilterChange('rpm_max', e.target.value ? Number(e.target.value) : undefined)}
                  className="bg-background"
                />
              </div>
            </div>

            <div>
              <Label>{t('products.fields.efficiency')} (%)</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.efficiency_min || ''}
                  onChange={(e) => handleFilterChange('efficiency_min', e.target.value ? Number(e.target.value) : undefined)}
                  className="bg-background"
                />
                <span className="flex items-center text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.efficiency_max || ''}
                  onChange={(e) => handleFilterChange('efficiency_max', e.target.value ? Number(e.target.value) : undefined)}
                  className="bg-background"
                />
              </div>
            </div>

            <div>
              <Label>{t('products.fields.frameSize')}</Label>
              <Input
                placeholder="e.g., 90S"
                value={filters.frameSize || ''}
                onChange={(e) => handleFilterChange('frameSize', e.target.value)}
                className="mt-2 bg-background"
              />
            </div>

            <div>
              <Label>{t('products.fields.poles')}</Label>
              <Select
                value={filters.poles?.toString() || ''}
                onValueChange={(value) => handleFilterChange('poles', value ? Number(value) : undefined)}
              >
                <SelectTrigger className="mt-2 bg-background">
                  <SelectValue placeholder={t('common.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('common.all')}</SelectItem>
                  <SelectItem value="2">2极</SelectItem>
                  <SelectItem value="4">4极</SelectItem>
                  <SelectItem value="6">6极</SelectItem>
                  <SelectItem value="8">8极</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('products.fields.ip')}</Label>
              <Select
                value={filters.ip || ''}
                onValueChange={(value) => handleFilterChange('ip', value || undefined)}
              >
                <SelectTrigger className="mt-2 bg-background">
                  <SelectValue placeholder={t('common.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('common.all')}</SelectItem>
                  <SelectItem value="IP54">IP54</SelectItem>
                  <SelectItem value="IP55">IP55</SelectItem>
                  <SelectItem value="IP56">IP56</SelectItem>
                  <SelectItem value="IP65">IP65</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>{t('products.fields.insulation')}</Label>
              <Select
                value={filters.insulation || ''}
                onValueChange={(value) => handleFilterChange('insulation', value || undefined)}
              >
                <SelectTrigger className="mt-2 bg-background">
                  <SelectValue placeholder={t('common.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('common.all')}</SelectItem>
                  <SelectItem value="B">B级</SelectItem>
                  <SelectItem value="F">F级</SelectItem>
                  <SelectItem value="H">H级</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 justify-end">
            <Button variant="outline" onClick={resetFilters} className="gap-2">
              <X className="h-4 w-4" />
              {t('products.reset')}
            </Button>
            <Button onClick={() => setShowFilters(false)} className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
              <Check className="h-4 w-4" />
              {t('common.submit')}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Quick Filter Tags */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ poles: 4 })}
          className="gap-2 hover:border-primary"
        >
          <Zap className="h-3 w-3" />
          4极电机
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ voltage: 380 })}
          className="gap-2 hover:border-primary"
        >
          <Zap className="h-3 w-3" />
          380V
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ frameSize: '90S' })}
          className="gap-2 hover:border-primary"
        >
          <Zap className="h-3 w-3" />
          90S机座
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFilters({ efficiency_min: 90 })}
          className="gap-2 hover:border-primary"
        >
          <Award className="h-3 w-3" />
          高效率≥90%
        </Button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 w-full rounded bg-muted" />
                  <div className="h-3 w-2/3 rounded bg-muted" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : motors.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">{t('products.no_results')}</p>
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {currentMotors.map((motor, index) => (
              <motion.div
                key={motor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/products/${motor.id}`}>
                  <Card className="h-full transition-all hover:shadow-lg cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        {motor.model}
                      </CardTitle>
                      <CardDescription>{motor.frameSize} 机座号</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">{t('products.fields.power')}:</span>
                          <span className="ml-1 font-medium">{motor.power} kW</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('products.fields.rpm')}:</span>
                          <span className="ml-1 font-medium">{motor.rpm}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('products.fields.voltage')}:</span>
                          <span className="ml-1 font-medium">{motor.voltage} V</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{t('products.fields.efficiency')}:</span>
                          <span className="ml-1 font-medium">{motor.efficiency}%</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => handleFavorite(motor, e)}
                      >
                        <Heart className={`h-4 w-4 mr-1 ${isFavorite(motor.id) ? 'fill-current text-red-500' : ''}`} />
                        {isFavorite(motor.id) ? '已收藏' : '收藏'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => handleCompare(motor, e)}
                      >
                        <Scale className={`h-4 w-4 mr-1 ${isComparing(motor.id) ? 'text-blue-500' : ''}`} />
                        {isComparing(motor.id) ? '已添加' : '对比'}
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </Button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
