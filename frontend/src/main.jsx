/**
 * main.jsx
 * 入口：ConfigProvider(antd zhCN/enUS 随语言) + AntdApp(message 上下文)
 *      + I18nProvider + AuthProvider + BrowserRouter + App
 */
import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import i18n from './i18n';
import { AuthProvider } from './context/AuthContext';
import App from './App';
import './index.css';

function Root() {
  const [antdLocale, setAntdLocale] = useState(
    i18n.language === 'en' ? enUS : zhCN
  );

  // antd 组件语言随 i18n 语言切换同步
  useEffect(() => {
    const handler = (lng) => {
      setAntdLocale(lng === 'en' ? enUS : zhCN);
      document.documentElement.lang = lng === 'zh' ? 'zh-CN' : 'en';
    };
    i18n.on('languageChanged', handler);
    return () => {
      i18n.off('languageChanged', handler);
    };
  }, []);

  return (
    <ConfigProvider
      locale={antdLocale}
      theme={{
        token: {
          colorPrimary: '#2563eb',
          borderRadius: 8,
        },
      }}
    >
      <AntdApp>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </AntdApp>
    </ConfigProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
