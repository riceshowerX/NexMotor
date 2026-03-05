// 电机类型定义
export interface Motor {
  id: number;
  model: string;
  frameSize: string;
  power: number;
  voltage: number;
  current: number;
  rpm: number;
  efficiency: number | null;
  powerFactor: number | null;
  frequency: number | null;
  poles: number | null;
  ip: string | null;
  insulation: string | null;
  mounting: string | null;
  weight: number | null;
  connection: string | null;
  lockedRotorTorque: number | null;
  maxTorque: number | null;
  startingCurrent: number | null;
  noise: number | null;
  description: string | null;
  imageUrl: string | null;
}

// 电机筛选条件
export interface MotorFilters {
  model?: string;
  frameSize?: string;
  power_min?: number;
  power_max?: number;
  voltage?: number;
  rpm_min?: number;
  rpm_max?: number;
  efficiency_min?: number;
  efficiency_max?: number;
  poles?: number;
  ip?: string;
  insulation?: string;
  frequency?: number;
  description?: string;
  sortBy?: 'power_asc' | 'power_desc' | 'rpm_asc' | 'rpm_desc' | 'efficiency_desc';
}
