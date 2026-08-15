/**
 * i18n/index.js
 * i18next 初始化：语言持久化（localStorage）+ 浏览器语言探测 + fallback zh
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { STORAGE_KEYS } from '../utils/constants';
import zh from './locales/zh';
import en from './locales/en';

const savedLang = localStorage.getItem(STORAGE_KEYS.lang);
const browserLang = typeof navigator !== 'undefined' && navigator.language
  ? navigator.language.toLowerCase().startsWith('zh') ? 'zh' : 'en'
  : 'zh';

const initialLang = savedLang || browserLang || 'zh';

i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en },
  },
  lng: initialLang,
  fallbackLng: 'zh',
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
  react: {
    useSuspense: false,
  },
});

// 同步 document 语言属性
document.documentElement.lang = initialLang === 'zh' ? 'zh-CN' : 'en';

export default i18n;
