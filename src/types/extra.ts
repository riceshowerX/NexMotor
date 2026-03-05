// 收藏夹类型定义
export interface Favorite {
  id: number;
  motorId: number;
  motor: {
    id: number;
    model: string;
    power: number;
    rpm: number;
    voltage: number;
    frameSize: string;
    [key: string]: any;
  };
  createdAt: string;
}

// 产品分类
export interface Category {
  id: string;
  name: string;
  nameEn: string;
  icon?: string;
}

// 产品对比
export interface CompareItem {
  id: number;
  motorId: number;
  motor: {
    id: number;
    model: string;
    power: number;
    rpm: number;
    voltage: number;
    frameSize: string;
    [key: string]: any;
  };
}

// 搜索历史
export interface SearchHistory {
  id: string;
  query: string;
  timestamp: string;
}
