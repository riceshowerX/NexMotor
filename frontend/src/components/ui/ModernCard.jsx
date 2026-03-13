import React, { forwardRef } from 'react';
import { Card } from 'antd';
import { motion } from 'framer-motion';

const ModernCard = forwardRef(({ 
  children, 
  className = '', 
  hoverable = true,
  shadow = 'md',
  bordered = false, // 默认无边框，或者根据您的设计需求改为 true
  variant,          // 允许外部直接传 variant
  onClick, 
  ...props 
}, ref) => {
  
  // 1. 阴影映射表
  const shadowMap = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  };

  // 2. 修复 Ant Design 警告：将 bordered 转换为 variant
  // 如果外部传了 variant，优先使用；否则根据 bordered 计算
  // bordered=true -> 'outlined' (有边框)
  // bordered=false -> 'borderless' (无边框)
  const cardVariant = variant || (bordered ? 'outlined' : 'borderless');

  return (
    // 3. 关键修复：这里必须是 motion.div，绝对不能是 motion.button
    <motion.div
      ref={ref}
      whileHover={hoverable ? { y: -4 } : {}}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      // 如果有点击事件，添加手型光标；group 用于可能的子元素悬停效果
      className={`${onClick ? 'cursor-pointer' : ''} group h-full`}
    >
      <Card
        // 使用新的 variant 属性替代 bordered
        variant={cardVariant}
        className={`
          ${shadowMap[shadow] || shadowMap.md}
          ${hoverable ? 'hover:shadow-xl transition-shadow duration-300' : ''}
          ${className}
        `}
        // 确保 Card 占满高度
        style={{ height: '100%', ...props.style }}
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
});

ModernCard.displayName = 'ModernCard';

export default ModernCard;