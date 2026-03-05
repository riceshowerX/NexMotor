'use client';

import Link from 'next/link';
import { ArrowLeft, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCompare } from '@/context/CompareContext';
import { useTranslation } from '@/context/LanguageContext';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { t } = useTranslation();

  const compareFields = [
    { key: 'model', label: '型号' },
    { key: 'frameSize', label: '机座号' },
    { key: 'power', label: '功率 (kW)' },
    { key: 'voltage', label: '电压 (V)' },
    { key: 'current', label: '电流 (A)' },
    { key: 'rpm', label: '转速 (rpm)' },
    { key: 'efficiency', label: '效率 (%)' },
    { key: 'powerFactor', label: '功率因数' },
    { key: 'frequency', label: '频率 (Hz)' },
    { key: 'poles', label: '极数' },
    { key: 'ip', label: '防护等级' },
    { key: 'insulation', label: '绝缘等级' },
    { key: 'weight', label: '重量 (kg)' },
  ];

  if (compareList.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{t('compare.title')}</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12 text-center">
            <Package className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">{t('compare.empty')}</h3>
            <p className="mt-2 text-muted-foreground">选择产品后可以在这里对比参数</p>
            <Link href="/products" className="mt-6 inline-block">
              <Button>{t('compare.add_more')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold">{t('compare.title')}</h1>
            <p className="mt-2 text-muted-foreground">对比 {compareList.length} 个产品</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/products">
            <Button variant="outline">{t('compare.add_more')}</Button>
          </Link>
          <Button variant="destructive" onClick={clearCompare} className="gap-2">
            <Trash2 className="h-4 w-4" />
            {t('compare.clear_all')}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="sticky left-0 bg-background p-4 text-left font-semibold min-w-[150px]">
                参数
              </th>
              {compareList.map(item => (
                <th key={item.motorId} className="p-4 min-w-[200px]">
                  <div className="text-center">
                    <div className="text-lg font-bold">{item.motor.model}</div>
                    <div className="text-sm text-muted-foreground">{item.motor.frameSize}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCompare(item.motorId)}
                      className="mt-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareFields.map((field, index) => (
              <tr key={field.key} className={`border-b ${index % 2 === 0 ? 'bg-muted/50' : ''}`}>
                <td className="sticky left-0 bg-background p-4 font-medium">
                  {field.label}
                </td>
                {compareList.map(item => (
                  <td key={`${item.motorId}-${field.key}`} className="p-4 text-center">
                    {item.motor[field.key] !== undefined && item.motor[field.key] !== null ? (
                      <span className="font-medium">{item.motor[field.key]}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-b">
              <td className="sticky left-0 bg-background p-4 font-medium">
                操作
              </td>
              {compareList.map(item => (
                <td key={`action-${item.motorId}`} className="p-4 text-center">
                  <Link href={`/products/${item.motorId}`}>
                    <Button variant="outline" size="sm">
                      查看详情
                    </Button>
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
