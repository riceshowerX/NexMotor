// 国际化 Context
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import zhCN from '@/locales/zh-CN.json';
import enUS from '@/locales/en-US.json';

type Locale = 'zh-CN' | 'en-US';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Locale, any> = {
  'zh-CN': zhCN,
  'en-US': enUS
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh-CN');

  useEffect(() => {
    // 从 localStorage 读取语言设置
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale && (savedLocale === 'zh-CN' || savedLocale === 'en-US')) {
      setLocaleState(savedLocale);
    } else {
      // 根据浏览器语言自动选择
      const browserLang = navigator.language;
      if (browserLang.startsWith('en')) {
        setLocaleState('en-US');
      }
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value !== 'string') {
      return key;
    }

    // 替换参数
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match: string, paramKey: string) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
