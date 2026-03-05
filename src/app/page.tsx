'use client';

import Link from 'next/link';
import { ArrowRight, Search, Filter, Globe, Smartphone, Package, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/context/LanguageContext';
import { motion } from 'framer-motion';

export default function HomePage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Filter,
      titleKey: 'home.features.smart_filter.title',
      descKey: 'home.features.smart_filter.desc',
    },
    {
      icon: Package,
      titleKey: 'home.features.3d_viewer.title',
      descKey: 'home.features.3d_viewer.desc',
    },
    {
      icon: Globe,
      titleKey: 'home.features.i18n.title',
      descKey: 'home.features.i18n.desc',
    },
    {
      icon: Smartphone,
      titleKey: 'home.features.responsive.title',
      descKey: 'home.features.responsive.desc',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('home.title')}
                </span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground md:text-xl">
                {t('home.subtitle')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  {t('home.cta.explore')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="gap-2">
                  <Search className="h-4 w-4" />
                  {t('home.cta.quick_select')}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-400/20 to-transparent blur-3xl rounded-full" />
          <div className="absolute right-1/4 bottom-0 w-[400px] h-[400px] bg-gradient-to-t from-purple-400/20 to-transparent blur-3xl rounded-full" />
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center sm:text-4xl">
            核心功能
          </h2>
          <p className="mt-4 text-center text-muted-foreground">
            专业的电机选型工具，提供全方位的服务
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle>{t(feature.titleKey)}</CardTitle>
                    <CardDescription>{t(feature.descKey)}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t(feature.descKey)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                立即开始选型
              </h2>
              <p className="mt-4 text-blue-100">
                智能筛选系统，快速找到最适合您的电机产品
              </p>
              <div className="mt-8">
                <Link href="/products">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Zap className="h-5 w-5" />
                    开始选型
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
