export * from './variables';

/**
 * CSS 样式透传工具
 * 优化：如果传入的是函数，执行它并返回结果；否则直接返回样式
 */
export const css = (styles, ...args) => {
  if (typeof styles === 'function') {
    return styles(...args);
  }
  return styles;
};

/**
 * 增强版类名生成工具 (零依赖实现类似 clsx 的功能)
 * 支持: 字符串、数组、对象条件
 * 示例: cn('btn', ['active'], { disabled: isPending })
 */
export const cn = (...args) => {
  const classes = [];

  args.forEach(arg => {
    if (!arg) return;

    if (typeof arg === 'string' || typeof arg === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = cn(...arg);
        if (inner) classes.push(inner);
      }
    } else if (typeof arg === 'object') {
      Object.keys(arg).forEach(key => {
        if (arg[key]) classes.push(key);
      });
    }
  });

  return classes.join(' ');
};

/**
 * 响应式辅助函数
 * 优化：增加空值检查，防止 undefined 报错
 */
export const responsive = (breakpoint, styles) => {
  if (!breakpoint || !styles) return {};
  // 支持传入数字 (自动补充 px)
  const bpValue = typeof breakpoint === 'number' ? `${breakpoint}px` : breakpoint;
  
  return {
    [`@media (min-width: ${bpValue})`]: styles
  };
};