import React, { forwardRef } from 'react';
import { Button } from 'antd';
import { motion } from 'framer-motion';

const GradientButton = forwardRef(({ 
  children, 
  type = 'primary',
  gradient = 'blue',
  size = 'middle',
  className = '',
  ...props 
}, ref) => {
  const gradients = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
    green: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
    orange: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
    red: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
  };

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        type={type}
        size={size}
        className={`
          ${type === 'primary' ? gradients[gradient] || gradients.blue : ''}
          border-0
          shadow-lg
          transform transition-all duration-300
          ${className}
        `}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  ); 
});

export default GradientButton;