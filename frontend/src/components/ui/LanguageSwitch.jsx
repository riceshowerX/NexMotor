// src/components/ui/LanguageSwitch.jsx
// 语言切换组件

import React from 'react';
import { Button, Dropdown, Space } from 'antd';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const LanguageSwitch = () => {
  const { language, changeLanguage, availableLanguages } = useLanguage();

  // 获取当前语言配置
  const currentLanguage = availableLanguages.find(lang => lang.value === language);

  // 语言切换菜单
  const languageMenu = {
    items: availableLanguages.map(lang => ({
      key: lang.value,
      label: (
        <div 
          className={`flex items-center gap-2 cursor-pointer ${language === lang.value ? 'font-medium text-indigo-600' : 'text-gray-600'}`}
          onClick={() => changeLanguage(lang.value)}
        >
          <span>{lang.label}</span>
        </div>
      ),
      onClick: () => changeLanguage(lang.value)
    }))
  };

  return (
    <Dropdown menu={languageMenu} trigger={['click']} placement="bottomRight">
      <Button
        type="text"
        className="flex items-center gap-2 h-12 px-4 rounded-xl hover:bg-gray-100 transition-all"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 5
          }}
        >
          <Globe size={20} className="text-gray-600" />
        </motion.div>
        <span className="hidden md:inline font-medium text-gray-700">
          {currentLanguage?.label}
        </span>
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitch;
