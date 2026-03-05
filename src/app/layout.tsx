import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { CompareProvider } from '@/context/CompareContext';
import Navbar from '@/components/layout/Navbar';
import { initializeDatabase } from '@/lib/db';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'NexMotor - 新一代在线电机选型平台',
    template: '%s | NexMotor',
  },
  description: '智能筛选 · 3D 可视化 · 中英文切换 · 全平台响应式',
  keywords: ['电机选型', '电机', 'NexMotor', '3D可视化', '智能筛选'],
};

// 初始化数据库
initializeDatabase();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.NODE_ENV === 'development';

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        {isDev && <Inspector />}
        <LanguageProvider>
          <AuthProvider>
            <FavoritesProvider>
              <CompareProvider>
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1">{children}</main>
                </div>
                <Toaster />
              </CompareProvider>
            </FavoritesProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
