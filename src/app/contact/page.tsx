'use client';

import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { useTranslation } from '@/context/LanguageContext';

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/public/config');
      const data = await response.json();
      if (data.success) {
        setConfig(data.data);
      }
    } catch (error) {
      console.error('获取配置失败:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || '您的留言已提交，我们会尽快回复您！');

        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
        });
      } else {
        toast.error(data.message || '提交失败，请稍后重试');
      }
    } catch (error) {
      console.error('提交留言失败:', error);
      toast.error('提交失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: '公司地址',
      content: config?.address || '上海市浦东新区张江高科技园区XX路XX号',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Phone,
      title: '联系电话',
      content: config?.contact_phone || '+86 021-12345678',
      color: 'from-cyan-500 to-sky-500',
    },
    {
      icon: Mail,
      title: '电子邮箱',
      content: config?.contact_email || 'contact@nexmotor.com',
      color: 'from-sky-500 to-blue-500',
    },
    {
      icon: Clock,
      title: '工作时间',
      content: config?.working_hours || '周一至周五 9:00 - 18:00',
      color: 'from-blue-600 to-cyan-600',
    },
  ];

  const faqs = [
    {
      question: '如何获取产品报价？',
      answer: '您可以通过在线留言、电话或邮件联系我们，我们的销售团队会尽快为您提供详细的产品报价。',
    },
    {
      question: '支持哪些付款方式？',
      answer: '我们支持银行转账、支付宝、微信支付等多种付款方式，具体可联系销售人员了解详情。',
    },
    {
      question: '产品如何发货？',
      answer: '我们与多家物流公司合作，可根据您的需求选择合适的发货方式，部分地区支持送货上门。',
    },
    {
      question: '如何进行售后服务？',
      answer: '产品质保期内出现质量问题，可联系我们申请售后服务。我们提供专业的技术支持和维修服务。',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <Badge variant="secondary" className="mb-4">联系我们</Badge>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
          联系我们
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          如果您有任何问题或需求，请随时联系我们，我们将竭诚为您服务
        </p>
      </motion.div>

      {/* Contact Info Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-16"
      >
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full border-2 hover:border-primary transition-all hover:shadow-lg">
                  <CardHeader>
                    <div className={`mb-4 h-14 w-14 rounded-full bg-gradient-to-br ${info.color} flex items-center justify-center`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-lg">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{info.content}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-16"
      >
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  {t('contact.title') || '在线留言'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">
                        {t('contact.name')} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={t('contact.name')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">
                        {t('contact.email')} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={t('contact.email')}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('contact.phone')}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t('contact.phone')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">{t('contact.company')}</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder={t('contact.company')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      {t('contact.subject')} <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.subject')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">
                      {t('contact.content')} <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="请详细描述您的需求或问题"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gap-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        提交中...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        提交留言
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Map placeholder */}
          <div className="lg:col-span-1">
            <Card className="h-full border-2">
              <CardHeader>
                <CardTitle>公司位置</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">地图加载中...</p>
                    <p className="text-sm text-muted-foreground mt-2">上海市浦东新区</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mb-16"
      >
        <Card className="border-2 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
          <CardHeader>
            <CardTitle className="text-2xl">常见问题</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b last:border-b-0 pb-6 last:pb-0">
                  <h3 className="font-semibold mb-2 flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground pl-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
