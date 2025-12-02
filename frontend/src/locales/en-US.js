// src/locales/en-US.js
// English translation configuration

export default {
  // Navigation menu
  nav: {
    home: 'Home',
    products: 'Products',
    'quick-select': 'Quick Select',
    admin: 'Admin'
  },

  // Home page
  home: {
    title: 'Find Your Ideal Motor',
    subtitle: 'Advanced algorithm-based intelligent selection engine, providing one-stop solutions from parameter matching to performance comparison.',
    'search-title': 'Industrial Intelligent Selection Platform V2.0',
    'basic-search': 'Basic Search',
    'advanced-search': 'Advanced Search',
    'search-btn': 'Search Now',
    'reset-btn': 'Reset',
    'hot-search': 'Hot Search',
    'stats': {
      'models': 'Available Models',
      'accuracy': 'Matching Accuracy',
      'time': 'Average Time',
      'years': 'Service Years'
    },
    'features': {
      'admin': {
        title: 'Admin Management',
        desc: 'Professional data maintenance center, supporting real-time updates',
        'btn-text': 'Enter Admin'
      },
      'products': {
        title: 'Product Browsing',
        desc: 'Multi-dimensional filtering directory, quickly locate target models',
        'btn-text': 'Browse Products'
      },
      'advantages': {
        title: 'Core Advantages',
        desc: 'High-efficiency and energy-saving three-phase asynchronous motors, widely used in various mechanical equipment, stable and reliable',
        'tags': ['Level 1 Efficiency', 'Low Noise', 'IP55']
      }
    }
  },

  // Product list page
  products: {
    title: 'Products',
    'search-result': 'Search Results',
    'total': 'Total {total} records',
    'sort': 'Sort By',
    'power-asc': 'Power from low to high',
    'power-desc': 'Power from high to low',
    'efficiency-desc': 'Efficiency from high to low',
    'view-details': 'View Details',
    'no-data': 'No data available',
    'filter': 'Filter',
    'reset': 'Reset',
    'catalog': 'Product Catalog',
    'all-series': 'Full Series Motor List',
    'total-products': 'Total {total} products',
    'total-quantity': 'Total Quantity',
    'avg-efficiency': 'Average Efficiency',
    'reset-filter': 'Reset Filter',
    'view-mode': 'View Mode',
    'card-view': 'Card View',
    'table-view': 'Table View',
    'list': 'List',
    'card': 'Card',
    'clear-all': 'Clear All',
    'loading': 'Loading...',
    'no-product': 'No Product Found',
    'clear-filter': 'Clear Filter',
    'model': 'Model',
    'frame-size': 'Frame Size',
    'power': 'Power',
    'voltage': 'Voltage',
    'rpm': 'RPM',
    'efficiency': 'Efficiency',
    'view-detail': 'View Detail'
  },

  // Product detail page
  'product-detail': {
    title: 'Product Details',
    'basic-info': 'Basic Information',
    'technical-params': 'Technical Parameters',
    'application': 'Application Scenarios',
    'back': 'Back to List',
    'edit': 'Edit Product',
    'delete': 'Delete Product',
    'confirm-delete': 'Are you sure you want to delete this product?',
    'delete-success': 'Delete Success',
    'delete-failed': 'Delete Failed',
    'back-btn': 'Back',
    'share': 'Share',
    'favorite': 'Favorite',
    'inquire': 'Inquire Now',
    'basic-electrical': 'Basic Electrical Parameters',
    'mechanical-protection': 'Mechanical & Protection Parameters',
    'performance': 'Performance Characteristics',
    'product-desc': 'Product Description',
    '3d-viewer': '3D Model Viewer',
    'download-docs': 'Download Technical Docs',
    'motor-type': 'High Efficiency Three-Phase Asynchronous Motor',
    'motor-model': 'Motor Model',
    'rated-power': 'Rated Power',
    'rated-voltage': 'Rated Voltage',
    'rated-speed': 'Rated Speed',
    'rated-current': 'Rated Current',
    'efficiency': 'Efficiency',
    'power-factor': 'Power Factor',
    'poles': 'Number of Poles',
    'frequency': 'Frequency',
    'protection-class': 'Protection Class',
    'insulation-class': 'Insulation Class',
    'mounting-type': 'Mounting Type',
    'weight': 'Weight',
    'connection-type': 'Connection Type',
    'locked-rotor-torque': 'Locked Rotor Torque Ratio',
    'max-torque': 'Maximum Torque Ratio',
    'starting-current': 'Starting Current Ratio',
    'noise': 'Noise'
  },

  // Product edit page
  'product-edit': {
    'edit': 'Edit Product',
    'add': 'Add Product',
    'save': 'Save Changes',
    'create': 'Create Now',
    'cancel': 'Cancel',
    'image-url': 'Product Image URL (Recommended to use free image hosting)',
    'image-placeholder': 'https://example.com/motor-photo.jpg',
    'model': 'Motor Model',
    'frame-size': 'Frame Size',
    'power': 'Rated Power (kW)',
    'voltage': 'Rated Voltage (V)',
    'current': 'Rated Current (A)',
    'rpm': 'Rated Speed (r/min)',
    'efficiency': 'Efficiency (%)',
    'power-factor': 'Power Factor (cos φ)',
    'frequency': 'Frequency (Hz)',
    'poles': 'Number of Poles',
    'ip': 'Protection Class',
    'insulation': 'Insulation Class',
    'mounting': 'Mounting Type',
    'weight': 'Weight (kg)',
    'connection': 'Connection Type',
    'locked-rotor-torque': 'Locked Rotor Torque Ratio',
    'max-torque': 'Maximum Torque Ratio',
    'starting-current': 'Starting Current Ratio',
    'noise': 'Noise dB(A)',
    'description': 'Detailed Description / Application Scenarios',
    'success': {
      'update': 'Update Success!',
      'create': 'Create Success!'
    },
    'error': {
      'update': 'Update Failed',
      'create': 'Create Failed'
    }
  },

  // Login page
  login: {
    title: 'Login to Admin',
    'username': 'Username',
    'password': 'Password',
    'login-btn': 'Login',
    'forgot-password': 'Forgot Password?',
    'register': 'Register New Account',
    'error': 'Invalid username or password',
    'system-name': 'Motor Intelligent Management System',
    'welcome-back': 'Welcome Back',
    'login-console': 'Please login to admin console',
    'login-now': 'Login to Console Now',
    'login-loading': 'Logging in...',
    'dev-account': 'Development Environment Account',
    'auto-fill': 'Click to auto-fill test account',
    'copyright': '© 2025 Motor Management System · Internal Management Platform',
    'security-auth': 'Security Authentication',
    'real-time-monitor': 'Real-time Monitoring',
    'permission-mgmt': 'Permission Management',
    'security-desc': 'Enterprise-level security standards, HTTPS + AES-256 encrypted transmission',
    'monitor-desc': 'Complete operation logs, real-time data synchronization',
    'permission-desc': 'Refined role permissions, multi-department and multi-level control'
  },

  // Admin page
  admin: {
    title: 'Admin Management',
    'products': 'Product Management',
    'users': 'User Management',
    'dashboard': 'Dashboard',
    'add-product': 'Add Product',
    'search': 'Search',
    'action': 'Action',
    'edit': 'Edit',
    'delete': 'Delete',
    'view': 'View',
    'total-products': 'Total Products',
    'active-users': 'Active Users',
    'today-visits': 'Today\'s Visits',
    'month-sales': 'Monthly Sales',
    'dashboard-title': 'Console Dashboard',
    'welcome-back': 'Welcome back, this is the core management area for motor product data',
    'logout': 'Logout',
    'in-stock': 'In Stock Products',
    'avg-eff': 'Average Efficiency',
    'total-power': 'Total Power Reserve',
    'product-list': 'Product List',
    'search-model': 'Search model, frame size...',
    'confirm-delete': 'Confirm permanent deletion of {model}?',
    'product-info': 'Product Information',
    'core-params': 'Core Parameters'
  },

  // Form fields
  form: {
    model: 'Motor Model',
    'frame-size': 'Frame Size',
    power: 'Power (kW)',
    voltage: 'Voltage (V)',
    rpm: 'Speed (r/min)',
    'power-min': 'Minimum Power',
    'power-max': 'Maximum Power',
    'rpm-min': 'Minimum Speed',
    'rpm-max': 'Maximum Speed',
    'efficiency-min': 'Minimum Efficiency (%)',
    'description': 'Description Keywords',
    'sort-by': 'Sort By',
    'image-url': 'Image URL (Required)'
  },

  // Common
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    add: 'Add',
    search: 'Search',
    reset: 'Reset',
    confirm: 'Confirm',
    cancel: 'Cancel',
    'no-data': 'No data available',
    'loading': 'Loading...',
    'success': 'Operation Success',
    'error': 'Operation Failed',
    'required': 'This field is required',
    'url-invalid': 'Please enter a valid URL',
    'login-success': 'Login Success',
    'logout-success': 'Logout Success',
    'password-change': 'Change Password',
    'old-password': 'Old Password',
    'new-password': 'New Password',
    'confirm-password': 'Confirm Password',
    'password-change-success': 'Password Change Success',
    'password-change-failed': 'Password Change Failed',
    'password-invalid': 'Invalid Old Password',
    'password-too-short': 'New Password must be at least 6 characters'
  },

  // Footer
  footer: '© {year} Motor Selection System · Designed for Industrial Applications'
};
