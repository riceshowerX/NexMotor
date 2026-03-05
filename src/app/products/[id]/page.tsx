'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Package, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import Motor3DViewer from '@/components/3d/Motor3DViewer';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToCompare, isComparing } = useCompare();
  const [motor, setMotor] = useState<Motor | null>(null);
  const [loading, setLoading] = useState(true);

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
    { key: 'model', label: t('admin.form.model') },
    { key: 'frameSize', label: t('admin.form.frameSize') },
    { key: 'power', label: t('admin.form.power') + ' (kW)' },
    { key: 'voltage', label: t('admin.form.voltage') + ' (V)' },
    { key: 'current', label: t('admin.form.current') + ' (A)' },
    { key: 'rpm', label: t('admin.form.rpm') },
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{motor.model}</h1>
            <p className="text-muted-foreground">{motor.frameSize} 机座号</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => isFavorite(motor.id) ? removeFavorite(motor.id) : addFavorite(motor)}
          >
            {isFavorite(motor.id) ? '已收藏' : '收藏'}
          </Button>
          <Button
            variant="outline"
            onClick={() => addToCompare(motor)}
            disabled={isComparing(motor.id)}
          >
            {isComparing(motor.id) ? '已添加到对比' : '加入对比'}
          </Button>
          {isAuthenticated && (
            <>
              <Link href={`/admin/edit/${motor.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                {t('detail.actions.edit')}
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  {t('detail.actions.delete')}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('detail.actions.delete')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('admin.delete_confirm')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    {t('common.confirm')}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 3D Viewer */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {t('detail.3d_view')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square rounded-lg bg-muted">
              <Motor3DViewer motor={motor} className="h-full" />
            </div>
          </CardContent>
        </Card>

        {/* Technical Parameters */}
        <Card>
          <CardHeader>
            <CardTitle>{t('detail.params')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field) => {
                const value = (motor as any)[field.key];
                if (value === undefined || value === null) return null;
                return (
                  <div key={field.key} className="flex justify-between border-b pb-2">
                    <span className="text-muted-foreground">{field.label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {motor.description && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>{t('detail.description')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{motor.description}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
