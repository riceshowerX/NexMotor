// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import App from './App.jsx';
import './index.css';

// ★★★★★★ 关键导入：解决 message/Modal/notification 警告 ★★★★★★
import { App as AntdApp } from 'antd';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 保持你原来的 AuthProvider 最外层结构 */}
    <AuthProvider>
      {/* 这一层是 Ant Design 官方推荐的“全局上下文修复层” */}
      <AntdApp>
        {/* 语言提供者，包含 ConfigProvider 功能 */}
        <LanguageProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LanguageProvider>
      </AntdApp>
    </AuthProvider>
  </React.StrictMode>
);