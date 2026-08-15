/**
 * components/common/LanguageSwitch.jsx
 * 中/英切换：changeLanguage + localStorage 持久化 + document.documentElement.lang 同步
 * （antd ConfigProvider locale 同步由 main.jsx 监听 languageChanged 事件处理）
 */
import { useState } from 'react';
import { Button, Tooltip } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { STORAGE_KEYS } from '../../utils/constants';

export default function LanguageSwitch({ light = false }) {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language === 'en' ? 'en' : 'zh');

  const toggle = () => {
    const next = lang === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(next);
    localStorage.setItem(STORAGE_KEYS.lang, next);
    document.documentElement.lang = next === 'zh' ? 'zh-CN' : 'en';
    setLang(next);
  };

  return (
    <Tooltip title={lang === 'zh' ? 'Switch to English' : '切换到中文'}>
      <Button
        type="text"
        icon={<GlobalOutlined />}
        onClick={toggle}
        aria-label="language-switch"
        className={light ? '!text-white hover:!text-white' : ''}
      >
        {lang === 'zh' ? 'EN' : '中文'}
      </Button>
    </Tooltip>
  );
}
