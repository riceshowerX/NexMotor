'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import type { Motor } from '@/types/motor';
import { toast } from 'sonner';

export default function MotorEditPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Motor>>({
    model: '',
    frameSize: '',
    power: 0,
    voltage: 380,
    current: 0,
    rpm: 0,
    efficiency: 0,
    powerFactor: 0,
    frequency: 50,
    poles: 2,
    ip: 'IP54',
    insulation: 'F',
    mounting: 'B3',
    weight: 0,
    connection: 'Y',
    lockedRotorTorque: 0,
    maxTorque: 0,
    startingCurrent: 0,
    noise: 0,
    description: '',
    imageUrl: '',
  });

  const isEdit = params.id !== 'new';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isEdit && params.id) {
      fetchMotor();
    }
  }, [isAuthenticated, isEdit, params.id]);

  const fetchMotor = async () => {
    setFetchLoading(true);
    try {
      const response = await fetch(`/api/motors/${params.id}`);
      const data = await response.json();
      if (data.success) {
        setFormData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch motor:', error);
      toast.error('加载失败');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = isEdit ? `/api/motors/${params.id}` : '/api/motors';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(t('common.success'));
        router.push('/admin');
      } else {
        toast.error(data.message || t('common.error'));
      }
    } catch (error) {
      console.error('Failed to save motor:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof Motor, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (fetchLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">{t('common.loading')}</div>
        </div>
      </div>
    );
  }

  const formFields = [
    { key: 'model', label: t('admin.form.model'), type: 'text', required: true },
    { key: 'frameSize', label: t('admin.form.frameSize'), type: 'text', required: true },
    { key: 'power', label: t('admin.form.power'), type: 'number', required: true },
    { key: 'voltage', label: t('admin.form.voltage'), type: 'number', required: true },
    { key: 'current', label: t('admin.form.current'), type: 'number' },
    { key: 'rpm', label: t('admin.form.rpm'), type: 'number', required: true },
    { key: 'efficiency', label: t('admin.form.efficiency'), type: 'number' },
    { key: 'powerFactor', label: t('admin.form.powerFactor'), type: 'number' },
    { key: 'frequency', label: t('admin.form.frequency'), type: 'number' },
    { key: 'poles', label: t('admin.form.poles'), type: 'number' },
    { key: 'ip', label: t('admin.form.ip'), type: 'text' },
    { key: 'insulation', label: t('admin.form.insulation'), type: 'text' },
    { key: 'mounting', label: t('admin.form.mounting'), type: 'text' },
    { key: 'weight', label: t('admin.form.weight'), type: 'number' },
    { key: 'connection', label: t('admin.form.connection'), type: 'text' },
    { key: 'lockedRotorTorque', label: t('admin.form.lockedRotorTorque'), type: 'number' },
    { key: 'maxTorque', label: t('admin.form.maxTorque'), type: 'number' },
    { key: 'startingCurrent', label: t('admin.form.startingCurrent'), type: 'number' },
    { key: 'noise', label: t('admin.form.noise'), type: 'number' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">
              {isEdit ? t('admin.edit') : t('admin.add')}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {isEdit ? '编辑产品信息' : '添加新产品'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>基本信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {formFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <Input
                    id={field.key}
                    type={field.type}
                    value={(formData as any)[field.key] || ''}
                    onChange={(e) =>
                      handleChange(
                        field.key as keyof Motor,
                        field.type === 'number'
                          ? e.target.value
                            ? Number(e.target.value)
                            : undefined
                          : e.target.value
                      )
                    }
                    required={field.required}
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="description">{t('admin.form.description')}</Label>
              <textarea
                id="description"
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
              />
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="imageUrl">{t('admin.form.imageUrl')}</Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl || ''}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-2">
          <Link href="/admin">
            <Button type="button" variant="outline" className="gap-2">
              <X className="h-4 w-4" />
              {t('common.cancel')}
            </Button>
          </Link>
          <Button type="submit" disabled={loading} className="gap-2">
            <Save className="h-4 w-4" />
            {loading ? t('common.loading') : t('common.submit')}
          </Button>
        </div>
      </form>
    </div>
  );
}
