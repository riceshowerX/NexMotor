'use client';

import { Award, Globe, Heart, Target, Users, Zap, ArrowRight, CheckCircle, Clock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const milestones = [
    { year: '2015', title: '公司成立', description: 'NexMotor 正式成立，专注于电机研发与制造' },
    { year: '2017', title: '技术突破', description: '自主研发的高效电机技术获得国家专利' },
    { year: '2020', title: '市场扩张', description: '产品远销海外，服务客户超过500家' },
    { year: '2023', title: '智能化升级', description: '推出新一代在线选型平台，实现智能化服务' },
  ];

  const values = [
    {
      icon: Heart,
      title: '客户至上',
      description: '始终将客户需求放在首位，提供最优质的产品和服务',
    },
    {
      icon: Target,
      title: '追求卓越',
      description: '不断创新和改进，追求产品性能和品质的极致',
    },
    {
      icon: Shield,
      title: '诚信经营',
      description: '坚持诚信为本，与客户建立长期稳定的合作关系',
    },
    {
      icon: Zap,
      title: '持续创新',
      description: '保持技术领先，持续投入研发，推动行业进步',
    },
  ];

  const features = [
    { icon: Award, text: 'ISO9001 质量认证' },
    { icon: Globe, text: '国际标准生产' },
    { icon: Shield, text: '18个月质保期' },
    { icon: Users, text: '专业技术团队' },
    { icon: Clock, text: '7×24小时服务' },
    { icon: CheckCircle, text: '快速响应交付' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <Badge variant="secondary" className="mb-4">关于我们</Badge>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          关于 NexMotor
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          专注于高品质电机的研发、制造与服务，致力于成为行业领先的电机解决方案提供商
        </p>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-16"
      >
        <Card className="border-2 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardContent className="p-8 md:p-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">公司简介</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  NexMotor 成立于2015年，是一家专注于高品质三相异步电机的研发、制造与销售的高新技术企业。公司总部位于中国，拥有现代化的生产基地和先进的研发中心。
                </p>
                <p>
                  多年来，我们始终坚持技术创新和品质至上的理念，自主研发的高效电机技术获得多项国家专利。我们的产品广泛应用于工业自动化、机械装备、汽车制造、新能源等多个领域。
                </p>
                <p>
                  2023年，我们推出了新一代在线电机选型平台，实现了从传统销售模式向智能化服务的转型，为客户提供更加便捷、高效的选型体验。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Core Values */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">核心价值观</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className="h-full text-center border-2 hover:border-primary transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 border-none">
          <CardContent className="p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-8 text-white text-center">我们的优势</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4"
                  >
                    <Icon className="h-6 w-6 text-white flex-shrink-0" />
                    <span className="text-white font-medium">{feature.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Milestones */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-16"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">发展历程</h2>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-cyan-500" />

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} md:pr-8`}>
                  <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit mb-2">{milestone.year}</Badge>
                      <CardTitle className="text-xl">{milestone.title}</CardTitle>
                      <CardContent className="pt-2">
                        <p className="text-muted-foreground">{milestone.description}</p>
                      </CardContent>
                    </CardHeader>
                  </Card>
                </div>
                <div className="absolute left-8 md:left-1/2 w-4 h-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full -translate-x-1/2 border-4 border-background" />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <Card className="border-2">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">携手合作，共创未来</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              如果您对我们的产品或服务感兴趣，欢迎随时联系我们，我们将竭诚为您提供最优质的服务
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" className="gap-2">
                  联系我们
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="gap-2">
                  浏览产品
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
