// src/hooks/useTranslation.js
// 翻译钩子函数，提供简洁的翻译API

import { useLanguage } from '../context/LanguageContext';

/**
 * 翻译钩子函数
 * @returns {Object} 包含翻译函数t
 */
export const useTranslation = () => {
  const { t } = useLanguage();
  return { t };
};
