// src/context/LanguageContext.jsx
// 语言上下文管理

import React, { createContext, useState, useEffect, useCallback } from 'react';
import zhCN from '../locales/zh-CN';
import enUS from '../locales/en-US';
import { ConfigProvider } from 'antd';
import antdZhCN from 'antd/locale/zh_CN';
import antdEnUS from 'antd/locale/en_US';

// 创建上下文
export const LanguageContext = createContext();

// 语言配置映射
const languageMap = {
  'zh-CN': {
    label: '中文',
    value: 'zh-CN',
    translation: zhCN,
    antdLocale: antdZhCN
  },
  'en-US': {
    label: 'English',
    value: 'en-US',
    translation: enUS,
    antdLocale: antdEnUS
  }
};

// 语言提供者组件
export const LanguageProvider = ({ children }) => {
  // 从localStorage获取语言偏好，默认中文
  const getInitialLanguage = () => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage && languageMap[savedLanguage] ? savedLanguage : 'zh-CN';
  };

  // 状态管理
  const [language, setLanguage] = useState(getInitialLanguage());
  const [translation, setTranslation] = useState(languageMap[getInitialLanguage()].translation);
  const [antdLocale, setAntdLocale] = useState(languageMap[getInitialLanguage()].antdLocale);

  // 语言切换方法
  const changeLanguage = useCallback((lang) => {
    if (languageMap[lang]) {
      setLanguage(lang);
      setTranslation(languageMap[lang].translation);
      setAntdLocale(languageMap[lang].antdLocale);
      localStorage.setItem('language', lang);
    }
  }, []);

  // 翻译函数
  const t = useCallback((key, defaultValue = key, params = {}) => {
    // 支持嵌套键，如 'nav.home'
    const keys = key.split('.');
    let value = translation;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }
    
    // 支持参数替换，如 '共 {total} 条记录'
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return Object.entries(params).reduce((result, [paramKey, paramValue]) => {
        return result.replace(new RegExp(`\\{${paramKey}\\}`), paramValue);
      }, value);
    }
    
    return value || defaultValue;
  }, [translation]);

  // 当语言变化时更新状态
  useEffect(() => {
    const langConfig = languageMap[language];
    if (langConfig) {
      setTranslation(langConfig.translation);
      setAntdLocale(langConfig.antdLocale);
    }
  }, [language]);

  // 上下文值
  const contextValue = {
    language,
    changeLanguage,
    t,
    availableLanguages: Object.values(languageMap),
    antdLocale
  };

  // 使用ConfigProvider包裹子组件，提供Ant Design国际化支持
  return (
    <LanguageContext.Provider value={contextValue}>
      <ConfigProvider locale={antdLocale}>
        {children}
      </ConfigProvider>
    </LanguageContext.Provider>
  );
};

// 自定义钩子，方便组件使用
export const useLanguage = () => {
  const context = React.useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
