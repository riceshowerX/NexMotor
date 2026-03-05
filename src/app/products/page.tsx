'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, SlidersHorizontal, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useTranslation } from '@/context/LanguageContext';
import type { Motor, MotorFilters } from '@/types/motor';
import { motion } from 'framer-motion';

export default function ProductsPage() {
  const { t } = useTranslation();
  const [motors, setMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MotorFilters>({});
  const [showFilters, setShowFilters] = useState(false);

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
          className="mb-6 rounded-lg border bg-card p-6"
        >
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <Label>{t('products.fields.power')}</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.power_min || ''}
                  onChange={(e) => handleFilterChange('power_min', e.target.value ? Number(e.target.value) : undefined)}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.power_max || ''}
                  onChange={(e) => handleFilterChange('power_max', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>

            <div>
              <Label>{t('products.fields.voltage')}</Label>
              <Select
                value={filters.voltage?.toString() || ''}
                onValueChange={(value) => handleFilterChange('voltage', value ? Number(value) : undefined)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t('common.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('common.all')}</SelectItem>
                  <SelectItem value="380">380V</SelectItem>
                  <SelectItem value="220">220V</SelectItem>
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
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.rpm_max || ''}
                  onChange={(e) => handleFilterChange('rpm_max', e.target.value ? Number(e.target.value) : undefined)}
                />
              </div>
            </div>

            <div>
              <Label>{t('products.fields.frameSize')}</Label>
              <Input
                placeholder="e.g., 90S"
                value={filters.frameSize || ''}
                onChange={(e) => handleFilterChange('frameSize', e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label>{t('products.fields.poles')}</Label>
              <Select
                value={filters.poles?.toString() || ''}
                onValueChange={(value) => handleFilterChange('poles', value ? Number(value) : undefined)}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder={t('common.all')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">{t('common.all')}</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={resetFilters}>
              {t('products.reset')}
            </Button>
            <Button onClick={() => setShowFilters(false)}>
              {t('common.submit')}
            </Button>
          </div>
        </motion.div>
      )}

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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {motors.map((motor, index) => (
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
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      {t('detail.title')}
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
