'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, Search, Settings, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from '@/context/LanguageContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { id: 'home', href: '/', icon: Home, textKey: 'nav.home' },
  { id: 'products', href: '/products', icon: Package, textKey: 'nav.products' },
  { id: 'admin', href: '/admin', icon: Settings, textKey: 'nav.admin', auth: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { t, locale, setLocale } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="flex items-center space-x-2"
            >
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NexMotor
              </span>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks
              .filter(link => !link.auth || isAuthenticated)
              .map(link => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    className={`flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary ${
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{t(link.textKey)}</span>
                  </Link>
                );
              })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  {locale === 'zh-CN' ? '中文' : 'EN'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setLocale('zh-CN')}>
                  中文
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale('en-US')}>
                  English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {user?.username?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline">{user?.username || 'User'}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <User className="mr-2 h-4 w-4" />
                    {user?.username || 'User'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('auth.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button>{t('auth.login')}</Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t py-4"
            >
              <div className="flex flex-col space-y-4">
                {navLinks
                  .filter(link => !link.auth || isAuthenticated)
                  .map(link => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.id}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{t(link.textKey)}</span>
                      </Link>
                    );
                  })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
