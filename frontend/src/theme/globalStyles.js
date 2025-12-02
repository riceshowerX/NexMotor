import { createGlobalStyle, css } from 'styled-components';
import { theme } from './variables';

const GlobalStyles = createGlobalStyle`
  /* =========================================
     1. 全局重置 (Reset & Normalization)
     ========================================= */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    /* 优化: 使用百分比而非固定px，尊重用户浏览器默认字号设置 */
    font-size: 100%; 
    /* 优化: 仅在用户未设置减弱动态效果时启用平滑滚动 */
    @media (prefers-reduced-motion: no-preference) {
      scroll-behavior: smooth;
    }
  }

  body {
    font-family: ${theme.typography.fontFamily.sans};
    font-size: ${theme.typography.fontSize.base};
    line-height: ${theme.typography.lineHeight.normal};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.secondary};
    
    /* 优化: 字体渲染增强 */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    -webkit-text-size-adjust: 100%;
  }

  /* =========================================
     2. 基础排版 (Typography)
     ========================================= */
  /* 链接 */
  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: color ${theme.transition.fast};
    cursor: pointer;

    &:hover {
      color: ${theme.colors.primaryHover};
    }
    
    /* 优化: 键盘聚焦时的可见性 */
    &:focus-visible {
      outline: 2px solid ${theme.colors.primary};
      outline-offset: 2px;
      border-radius: 2px;
    }
  }

  /* 标题共享样式 */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${theme.typography.fontWeight.semibold};
    line-height: ${theme.typography.lineHeight.tight};
    color: ${theme.colors.text.primary};
    margin-bottom: ${theme.spacing[2]}; /* 给标题默认加一点下边距 */
  }

  h1 { font-size: ${theme.typography.fontSize['4xl']}; }
  h2 { font-size: ${theme.typography.fontSize['3xl']}; }
  h3 { font-size: ${theme.typography.fontSize['2xl']}; }
  h4 { font-size: ${theme.typography.fontSize.xl}; }
  h5 { font-size: ${theme.typography.fontSize.lg}; }
  h6 { font-size: ${theme.typography.fontSize.base}; }

  p {
    margin-bottom: ${theme.spacing[4]};
    color: ${theme.colors.text.secondary};
    line-height: ${theme.typography.lineHeight.relaxed}; /* 正文行高稍微宽松一点易读 */
  }

  /* =========================================
     3. 表单与交互元素 (UI Elements)
     ========================================= */
  button, input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }

  button {
    cursor: pointer;
    border: none;
    background: transparent;
    transition: all ${theme.transition.fast};
    
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* 优化: 图片防止溢出并消除底部留白 */
  img, video {
    max-width: 100%;
    height: auto;
    display: block;
    vertical-align: middle;
  }

  /* 优化: 选中文本样式 */
  ::selection {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
    text-shadow: none;
  }

  /* =========================================
     4. 滚动条样式 (Scrollbar)
     ========================================= */
  /* Firefox 支持 */
  * {
    scrollbar-width: thin;
    scrollbar-color: ${theme.colors.gray[400]} ${theme.colors.background.tertiary};
  }

  /* Webkit (Chrome/Safari/Edge) 支持 */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.background.tertiary};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${theme.colors.gray[400]};
    border-radius: ${theme.borderRadius.full};
    border: 2px solid ${theme.colors.background.tertiary};
    
    &:hover {
      background-color: ${theme.colors.gray[500]};
    }
  }

  /* =========================================
     5. 工具类 (Utility Classes)
     注意: 在 Styled-Components 中通常建议封装成组件，
     但保留这些以便快速排版。
     ========================================= */
  
  /* 布局与对齐 */
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-center { justify-content: center; }
  .justify-between { justify-content: space-between; }
  .flex-wrap { flex-wrap: wrap; }
  
  /* 文本对齐 */
  .text-center { text-align: center; }
  .text-left { text-align: left; }
  .text-right { text-align: right; }

  /* 间距 (使用 css helper 可以在 IDE 中折叠代码块) */
  ${css`
    .gap-2 { gap: ${theme.spacing[2]}; }
    .gap-4 { gap: ${theme.spacing[4]}; }
    .gap-6 { gap: ${theme.spacing[6]}; }

    .mb-4 { margin-bottom: ${theme.spacing[4]}; }
    .mb-6 { margin-bottom: ${theme.spacing[6]}; }
    .mt-4 { margin-top: ${theme.spacing[4]}; }
    .mt-6 { margin-top: ${theme.spacing[6]}; }
  `}

  /* 响应式显示控制 */
  @media (max-width: ${theme.breakpoints.sm}) {
    .sm\\:hidden { display: none !important; }
    .sm\\:block { display: block !important; }
    .sm\\:flex { display: flex !important; }
  }

  @media (max-width: ${theme.breakpoints.md}) {
    .md\\:hidden { display: none !important; }
    .md\\:block { display: block !important; }
    .md\\:flex { display: flex !important; }
  }

  /* =========================================
     6. 动画 (Animations)
     ========================================= */
  .fade-in { animation: fadeIn ${theme.transition.slow} ease-in-out; }
  .slide-up { animation: slideUp ${theme.transition.slow} ease-out; }
  .scale-in { animation: scaleIn ${theme.transition.fast} ease-out; }
  
  /* 旋转加载动画 */
  .loader {
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 3px solid ${theme.colors.gray[200]};
    border-radius: 50%;
    border-top-color: ${theme.colors.primary};
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

export default GlobalStyles;