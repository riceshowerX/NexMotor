// src/locales/zh-CN.js
// 中文翻译配置

export default {
  // 导航菜单
  nav: {
    home: '首页',
    products: '产品中心',
    'quick-select': '快速选型',
    admin: '后台管理'
  },

  // 首页
  home: {
    title: '精准匹配理想电机',
    subtitle: '基于先进算法的智能选型引擎，提供从参数匹配到性能对比的一站式解决方案。',
    'search-title': '工业级智能选型平台 V2.0',
    'basic-search': '快速匹配',
    'advanced-search': '高级选型',
    'search-btn': '立即匹配',
    'reset-btn': '重置条件',
    'hot-search': '热门搜索',
    'stats': {
      'models': '在库型号',
      'accuracy': '匹配精度',
      'time': '平均耗时',
      'years': '服务年限'
    },
    'features': {
      'admin': {
        title: '后台管理',
        desc: '专业的数据维护中心，支持实时更新',
        'btn-text': '进入后台'
      },
      'products': {
        title: '产品浏览',
        desc: '多维度筛选目录，快速定位目标型号',
        'btn-text': '浏览目录'
      },
      'advantages': {
        title: '核心优势',
        desc: '高效节能的三相异步电动机，广泛应用于各类机械设备，稳定可靠',
        'tags': ['一级能效', '低噪音', 'IP55']
      }
    }
  },

  // 产品列表页
  products: {
    title: '产品中心',
    'search-result': '搜索结果',
    'total': '共 {total} 条记录',
    'sort': '排序方式',
    'power-asc': '功率从小到大',
    'power-desc': '功率从大到小',
    'efficiency-desc': '效率从高到低',
    'view-details': '查看详情',
    'no-data': '暂无数据',
    'filter': '筛选',
    'reset': '重置',
    'catalog': 'Product Catalog',
    'all-series': '全系列电机列表',
    'total-products': '共 {total} 款产品',
    'total-quantity': '总数量',
    'avg-efficiency': '平均效率',
    'reset-filter': '重置筛选',
    'view-mode': '视图模式',
    'card-view': '卡片视图',
    'table-view': '表格视图',
    'list': '列表',
    'card': '卡片',
    'clear-all': '清除全部',
    'loading': '正在加载...',
    'no-product': '未找到产品',
    'clear-filter': '清除筛选',
    'model': '型号',
    'frame-size': '机座号',
    'power': '功率',
    'voltage': '电压',
    'rpm': '转速',
    'efficiency': '效率',
    'view-detail': '查看详情'
  },

  // 产品详情页
  'product-detail': {
    title: '产品详情',
    'basic-info': '基本信息',
    'technical-params': '技术参数',
    'application': '应用场景',
    'back': '返回列表',
    'edit': '编辑产品',
    'delete': '删除产品',
    'confirm-delete': '确定要删除该产品吗？',
    'delete-success': '删除成功',
    'delete-failed': '删除失败',
    'back-btn': '返回',
    'share': '分享',
    'favorite': '收藏',
    'inquire': '立即询价',
    'basic-electrical': '基本电气参数',
    'mechanical-protection': '机械与防护参数',
    'performance': '性能特性',
    'product-desc': '产品描述',
    '3d-viewer': '3D 模型查看',
    'download-docs': '下载技术资料',
    'motor-type': '高效率三相异步电机',
    'motor-model': '电机型号',
    'rated-power': '额定功率',
    'rated-voltage': '额定电压',
    'rated-speed': '额定转速',
    'rated-current': '额定电流',
    'efficiency': '效率',
    'power-factor': '功率因数',
    'poles': '极数',
    'frequency': '频率',
    'protection-class': '防护等级',
    'insulation-class': '绝缘等级',
    'mounting-type': '安装方式',
    'weight': '重量',
    'connection-type': '接法',
    'locked-rotor-torque': '堵转转矩倍数',
    'max-torque': '最大转矩倍数',
    'starting-current': '启动电流倍数',
    'noise': '噪声'
  },

  // 产品编辑页
  'product-edit': {
    'edit': '编辑产品',
    'add': '新增产品',
    'save': '保存更改',
    'create': '立即创建',
    'cancel': '取消',
    'image-url': '产品图片链接（推荐使用免费图床）',
    'image-placeholder': 'https://example.com/motor-photo.jpg',
    'model': '电机型号',
    'frame-size': '机座号',
    'power': '额定功率 (kW)',
    'voltage': '额定电压 (V)',
    'current': '额定电流 (A)',
    'rpm': '额定转速 (r/min)',
    'efficiency': '效率 (%)',
    'power-factor': '功率因数 (cos φ)',
    'frequency': '频率 (Hz)',
    'poles': '极数',
    'ip': '防护等级',
    'insulation': '绝缘等级',
    'mounting': '安装方式',
    'weight': '重量 (kg)',
    'connection': '接法',
    'locked-rotor-torque': '堵转转矩倍数',
    'max-torque': '最大转矩倍数',
    'starting-current': '启动电流倍数',
    'noise': '噪声 dB(A)',
    'description': '详细描述 / 应用场景',
    'success': {
      'update': '更新成功！',
      'create': '创建成功！'
    },
    'error': {
      'update': '更新失败',
      'create': '创建失败'
    }
  },

  // 登录页
  login: {
    title: '登录后台',
    'username': '用户名',
    'password': '密码',
    'login-btn': '登录',
    'forgot-password': '忘记密码？',
    'register': '注册新账号',
    'error': '用户名或密码错误',
    'system-name': '电机智能管理系统',
    'welcome-back': '欢迎回来',
    'login-console': '请登录管理员控制台',
    'login-now': '立即登录控制台',
    'login-loading': '登录中...',
    'dev-account': '开发环境专用账号',
    'auto-fill': '点击一键填充测试账号',
    'copyright': '© 2025 电机智能管理系统 · 内部管理平台',
    'security-auth': '安全认证',
    'real-time-monitor': '实时监控',
    'permission-mgmt': '权限管理',
    'security-desc': '企业级安全标准，HTTPS + AES-256 加密传输',
    'monitor-desc': '完整操作日志，数据实时同步更新',
    'permission-desc': '精细化角色权限，多部门多级别控制'
  },

  // 后台管理页
  admin: {
    title: '后台管理',
    'products': '产品管理',
    'users': '用户管理',
    'dashboard': '仪表盘',
    'add-product': '新增产品',
    'search': '搜索',
    'action': '操作',
    'edit': '编辑',
    'delete': '删除',
    'view': '查看',
    'total-products': '产品总数',
    'active-users': '活跃用户',
    'today-visits': '今日访问',
    'month-sales': '本月销量',
    'dashboard-title': '控制台仪表盘',
    'welcome-back': '欢迎回来，这里是电机产品数据的核心管理区域',
    'logout': '退出登录',
    'in-stock': '在库产品',
    'avg-eff': '平均能效',
    'total-power': '总功率储备',
    'product-list': '产品列表',
    'search-model': '搜索型号、机座号...',
    'confirm-delete': '确认永久删除 {model} 吗？',
    'product-info': '产品信息',
    'core-params': '核心参数'
  },

  // 表单字段
  form: {
    model: '电机型号',
    'frame-size': '机座号',
    power: '功率 (kW)',
    voltage: '电压 (V)',
    rpm: '转速 (r/min)',
    'power-min': '最小功率',
    'power-max': '最大功率',
    'rpm-min': '最小转速',
    'rpm-max': '最大转速',
    'efficiency-min': '最小效率 (%)',
    'description': '描述关键词',
    'sort-by': '排序方式',
    'image-url': '图片 URL（必填）'
  },

  // 通用
  common: {
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    view: '查看',
    add: '新增',
    search: '搜索',
    reset: '重置',
    confirm: '确定',
    cancel: '取消',
    'no-data': '暂无数据',
    'loading': '加载中...',
    'success': '操作成功',
    'error': '操作失败',
    'required': '此项为必填项',
    'url-invalid': '请输入有效的URL地址',
    'login-success': '登录成功',
    'logout-success': '已退出登录',
    'password-change': '修改密码',
    'old-password': '旧密码',
    'new-password': '新密码',
    'confirm-password': '确认密码',
    'password-change-success': '密码修改成功',
    'password-change-failed': '密码修改失败',
    'password-invalid': '旧密码错误',
    'password-too-short': '新密码长度不能少于6位'
  },

  // 页脚
  footer: '© {year} 电机选型系统 · 专为工业应用设计'
};
