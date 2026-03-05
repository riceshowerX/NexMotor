'use client';

import Link from 'next/link';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFavorites } from '@/context/FavoritesContext';
import { useTranslation } from '@/context/LanguageContext';

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites();
  const { t } = useTranslation();

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{t('favorites.title')}</h1>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="py-12 text-center">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">{t('favorites.empty')}</h3>
            <p className="mt-2 text-muted-foreground">收藏感兴趣的产品，方便后续查看</p>
            <Link href="/products" className="mt-6 inline-block">
              <Button>浏览产品</Button>
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
            <h1 className="text-3xl font-bold">{t('favorites.title')}</h1>
            <p className="mt-2 text-muted-foreground">共 {favorites.length} 个收藏</p>
          </div>
        </div>
        <Button
          variant="destructive"
          onClick={clearFavorites}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          {t('favorites.clear_all')}
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map(favorite => (
          <Card key={favorite.id} className="group">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{favorite.motor.model}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFavorite(favorite.motorId)}
                  className="text-destructive hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4 fill-current" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">机座号:</span>
                  <span className="font-medium">{favorite.motor.frameSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">功率:</span>
                  <span className="font-medium">{favorite.motor.power} kW</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">电压:</span>
                  <span className="font-medium">{favorite.motor.voltage} V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">转速:</span>
                  <span className="font-medium">{favorite.motor.rpm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">效率:</span>
                  <span className="font-medium">{favorite.motor.efficiency}%</span>
                </div>
              </div>
              <Link href={`/products/${favorite.motorId}`} className="mt-4 block">
                <Button variant="outline" className="w-full">
                  查看详情
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
