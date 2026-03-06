'use client';

import Link from 'next/link';
import { ArrowRight, Search, Filter, Globe, Smartphone, Package, Zap, Users, Award, Shield, Check, TrendingUp, MessageSquare, PlayCircle, BarChart3, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  const advantages = [
    {
      icon: Award,
      title: '品质保证',
      description: '严格的品控体系，确保每一台电机都符合国际标准',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Shield,
      title: '技术领先',
      description: '采用先进的制造工艺和设计理念，性能卓越',
      color: 'from-cyan-500 to-sky-500',
    },
    {
      icon: TrendingUp,
      title: '持续创新',
      description: '持续投入研发，不断推出高性能电机产品',
      color: 'from-sky-500 to-blue-500',
    },
    {
      icon: Users,
      title: '专业服务',
      description: '专业团队提供全方位的技术支持和售后服务',
      color: 'from-blue-600 to-cyan-600',
    },
  ];

  const stats = [
    { value: '10+', label: '年行业经验', icon: BarChart3 },
    { value: '500+', label: '产品型号', icon: Package },
    { value: '50+', label: '合作客户', icon: Users },
    { value: '98%', label: '客户满意度', icon: Star },
  ];

  const testimonials = [
    {
      name: '张工',
      company: '某汽车制造企业',
      content: 'NexMotor 选型平台非常专业，帮助我们快速找到了最适合的电机型号，节省了大量时间。',
      rating: 5,
    },
    {
      name: '李经理',
      company: '某机械装备公司',
      content: '产品质量非常好，技术支持也很到位，是我们的首选合作伙伴。',
      rating: 5,
    },
    {
      name: '王总',
      company: '某自动化设备厂商',
      content: '平台功能完善，选型准确，售后服务及时，非常推荐。',
      rating: 5,
    },
  ];

  const faqs = [
    {
      question: '如何快速找到合适的电机？',
      answer: '您可以使用我们的智能筛选功能，根据功率、转速、电压等参数快速筛选出符合需求的电机产品。也可以通过产品分类浏览。',
    },
    {
      question: '是否支持定制化需求？',
      answer: '是的，我们支持根据客户的特殊需求进行定制化生产。请联系我们的客服团队获取更多信息。',
    },
    {
      question: '产品的质保期是多长时间？',
      answer: '标准产品质保期为18个月，特殊产品质保期可能会有所不同，具体请参考产品说明书。',
    },
    {
      question: '如何获取技术支持？',
      answer: '您可以通过在线客服、电话或邮件联系我们，我们的技术团队会第一时间为您提供支持。',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-4">
                新一代电机选型平台
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
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
              <Link href="/selection">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600">
                  <Filter className="h-4 w-4" />
                  开始选型
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="gap-2">
                  <Package className="h-4 w-4" />
                  浏览产品
                </Button>
              </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex flex-col items-center p-4">
                    <Icon className="h-8 w-8 text-primary mb-2" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Decorative background elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-400/20 to-transparent blur-3xl rounded-full" />
          <div className="absolute right-1/4 bottom-0 w-[400px] h-[400px] bg-gradient-to-t from-cyan-400/20 to-transparent blur-3xl rounded-full" />
        </div>
      </section>

      {/* Advantages Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            为什么选择我们
          </h2>
          <p className="mt-4 text-muted-foreground">
            专业、可靠、创新，为您提供最优质的电机产品
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((advantage, index) => {
            const Icon = advantage.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-primary transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className={`mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br ${advantage.color}`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl">{advantage.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {advantage.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
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
                  <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle>{t(feature.titleKey)}</CardTitle>
                      <CardDescription>{t(feature.descKey)}</CardDescription>
                    </CardHeader>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            客户评价
          </h2>
          <p className="mt-4 text-muted-foreground">
            听听客户对我们的评价
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.company}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">
              常见问题
            </h2>
            <p className="mt-4 text-muted-foreground">
              快速了解我们的服务
            </p>
          </motion.div>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-start gap-3">
                      <MessageSquare className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed pl-8">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-16">
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
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
                <Link href="/products">
                  <Button size="lg" variant="secondary" className="gap-2">
                    <Zap className="h-5 w-5" />
                    开始选型
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 gap-2">
                    了解更多
                    <ChevronRight className="h-4 w-4" />
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
