'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sliders, Search, X, Zap, RotateCw, Shield, Package, ArrowRight, Plus, Minus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectionCriteria {
  powerMin: string;
  powerMax: string;
  voltage: string[];
  frequency: string[];
  poles: string[];
  ipRating: string[];
  insulation: string[];
  mounting: string[];
  rpmMin: string;
  rpmMax: string;
  customVoltage: string;
  customFrequency: string;
}

interface Motor {
  id: number;
  model: string;
  frameSize: string;
  power: number;
  voltage: number;
  current: number;
  rpm: number;
  efficiency: number;
  powerFactor: number;
  frequency: number;
  poles: number;
  ip: string;
  insulation: string;
  mounting: string;
  weight: number;
  description: string;
  imageUrl: string | null;
}

const VOLTAGE_OPTIONS = [
  { label: '220V', value: '220' },
  { label: '380V', value: '380' },
  { label: '440V', value: '440' },
  { label: '660V', value: '660' },
  { label: '自定义...', value: 'custom' },
];

const FREQUENCY_OPTIONS = [
  { label: '50Hz', value: '50' },
  { label: '60Hz', value: '60' },
  { label: '自定义...', value: 'custom' },
];

const POLES_OPTIONS = [
  { label: '2极 (约3000rpm)', value: '2' },
  { label: '4极 (约1500rpm)', value: '4' },
  { label: '6极 (约1000rpm)', value: '6' },
  { label: '8极 (约750rpm)', value: '8' },
];

const IP_RATING_OPTIONS = [
  { label: 'IP23', value: 'IP23' },
  { label: 'IP44', value: 'IP44' },
  { label: 'IP54', value: 'IP54' },
  { label: 'IP55', value: 'IP55' },
  { label: 'IP56', value: 'IP56' },
  { label: 'IP65', value: 'IP65' },
];

const INSULATION_OPTIONS = [
  { label: 'B级', value: 'B' },
  { label: 'F级', value: 'F' },
  { label: 'H级', value: 'H' },
];

const MOUNTING_OPTIONS = [
  { label: 'B3 (底脚安装)', value: 'B3' },
  { label: 'B5 (法兰安装)', value: 'B5' },
  { label: 'B14 (小法兰安装)', value: 'B14' },
  { label: 'B35 (底脚+法兰)', value: 'B35' },
  { label: 'V1 (法兰向下)', value: 'V1' },
];

export default function SelectionPage() {
  const [criteria, setCriteria] = useState<SelectionCriteria>({
    powerMin: '',
    powerMax: '',
    voltage: [],
    frequency: [],
    poles: [],
    ipRating: [],
    insulation: [],
    mounting: [],
    rpmMin: '',
    rpmMax: '',
    customVoltage: '',
    customFrequency: '',
  });

  const [motors, setMotors] = useState<Motor[]>([]);
  const [filteredMotors, setFilteredMotors] = useState<Motor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  // 获取所有电机数据
  useEffect(() => {
    fetchMotors();
  }, []);

  // 根据筛选条件过滤电机
  useEffect(() => {
    if (motors.length > 0) {
      filterMotors();
    }
  }, [criteria, motors]);

  const fetchMotors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/selection');
      const data = await response.json();
      if (data.success) {
        setMotors(data.data);
        setFilteredMotors(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch motors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMotors = useCallback(() => {
    let filtered = motors.filter(motor => {
      // 功率范围筛选
      if (criteria.powerMin && motor.power < parseFloat(criteria.powerMin)) {
        return false;
      }
      if (criteria.powerMax && motor.power > parseFloat(criteria.powerMax)) {
        return false;
      }

      // 电压筛选
      if (criteria.voltage.length > 0) {
        const voltages = criteria.voltage.includes('custom')
          ? [...criteria.voltage.filter(v => v !== 'custom'), criteria.customVoltage].filter(Boolean)
          : criteria.voltage;
        if (!voltages.includes(motor.voltage.toString())) {
          return false;
        }
      }

      // 频率筛选
      if (criteria.frequency.length > 0) {
        const frequencies = criteria.frequency.includes('custom')
          ? [...criteria.frequency.filter(f => f !== 'custom'), criteria.customFrequency].filter(Boolean)
          : criteria.frequency;
        if (!frequencies.includes(motor.frequency.toString())) {
          return false;
        }
      }

      // 极数筛选
      if (criteria.poles.length > 0 && !criteria.poles.includes(motor.poles.toString())) {
        return false;
      }

      // 防护等级筛选
      if (criteria.ipRating.length > 0 && !criteria.ipRating.includes(motor.ip)) {
        return false;
      }

      // 绝缘等级筛选
      if (criteria.insulation.length > 0 && !criteria.insulation.includes(motor.insulation)) {
        return false;
      }

      // 安装方式筛选
      if (criteria.mounting.length > 0 && !criteria.mounting.includes(motor.mounting)) {
        return false;
      }

      // 转速范围筛选
      if (criteria.rpmMin && motor.rpm < parseFloat(criteria.rpmMin)) {
        return false;
      }
      if (criteria.rpmMax && motor.rpm > parseFloat(criteria.rpmMax)) {
        return false;
      }

      return true;
    });

    setFilteredMotors(filtered);
  }, [criteria, motors]);

  const handleCheckboxChange = (field: keyof SelectionCriteria, value: string) => {
    setCriteria(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return { ...prev, [field]: newArray };
    });
  };

  const handleInputChange = (field: keyof SelectionCriteria, value: string) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setCriteria({
      powerMin: '',
      powerMax: '',
      voltage: [],
      frequency: [],
      poles: [],
      ipRating: [],
      insulation: [],
      mounting: [],
      rpmMin: '',
      rpmMax: '',
      customVoltage: '',
      customFrequency: '',
    });
  };

  const hasActiveFilters = () => {
    return (
      criteria.powerMin !== '' ||
      criteria.powerMax !== '' ||
      criteria.voltage.length > 0 ||
      criteria.frequency.length > 0 ||
      criteria.poles.length > 0 ||
      criteria.ipRating.length > 0 ||
      criteria.insulation.length > 0 ||
      criteria.mounting.length > 0 ||
      criteria.rpmMin !== '' ||
      criteria.rpmMax !== ''
    );
  };

  const handleQuickSelect = (power: number, rpm: number, voltage: number) => {
    setCriteria(prev => ({
      ...prev,
      powerMin: (power - 0.5).toString(),
      powerMax: (power + 0.5).toString(),
      rpmMin: (rpm - 200).toString(),
      rpmMax: (rpm + 200).toString(),
      voltage: [voltage.toString()],
    }));
  };

  const popularRequirements = [
    { name: '小功率水泵', power: 1.5, rpm: 2840, voltage: 380 },
    { name: '中型风机', power: 7.5, rpm: 1450, voltage: 380 },
    { name: '大型压缩机', power: 45, rpm: 1480, voltage: 380 },
    { name: '低速传动', power: 15, rpm: 730, voltage: 380 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  返回首页
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">电机智能选型</h1>
                <p className="text-sm text-muted-foreground">输入精确参数，快速匹配最佳电机</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Sliders className="h-4 w-4" />
              {showFilters ? '隐藏筛选' : '显示筛选'}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="lg:w-80 flex-shrink-0"
              >
                <Card className="sticky top-24">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        精确筛选
                      </CardTitle>
                      {hasActiveFilters() && (
                        <Button variant="ghost" size="sm" onClick={handleReset}>
                          <X className="h-4 w-4 mr-1" />
                          清除
                        </Button>
                      )}
                    </div>
                    <CardDescription>
                      输入精确参数进行筛选
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    {/* Power Range */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        功率范围 (kW)
                      </Label>
                      <div className="flex gap-2 items-center">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="最小"
                            value={criteria.powerMin}
                            onChange={(e) => handleInputChange('powerMin', e.target.value)}
                            min="0"
                            step="0.1"
                          />
                        </div>
                        <span className="text-muted-foreground">-</span>
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="最大"
                            value={criteria.powerMax}
                            onChange={(e) => handleInputChange('powerMax', e.target.value)}
                            min="0"
                            step="0.1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* RPM Range */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <RotateCw className="h-4 w-4" />
                        转速范围 (rpm)
                      </Label>
                      <div className="flex gap-2 items-center">
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="最小"
                            value={criteria.rpmMin}
                            onChange={(e) => handleInputChange('rpmMin', e.target.value)}
                            min="0"
                            step="100"
                          />
                        </div>
                        <span className="text-muted-foreground">-</span>
                        <div className="flex-1">
                          <Input
                            type="number"
                            placeholder="最大"
                            value={criteria.rpmMax}
                            onChange={(e) => handleInputChange('rpmMax', e.target.value)}
                            min="0"
                            step="100"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Voltage */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        电压等级 (V)
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {VOLTAGE_OPTIONS.map(opt => {
                          if (opt.value === 'custom') {
                            return (
                              <div key={opt.value} className="col-span-2 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="voltage-custom"
                                    checked={criteria.voltage.includes('custom')}
                                    onCheckedChange={() => handleCheckboxChange('voltage', 'custom')}
                                  />
                                  <Label
                                    htmlFor="voltage-custom"
                                    className="text-sm font-normal cursor-pointer flex-1"
                                  >
                                    自定义电压
                                  </Label>
                                </div>
                                {criteria.voltage.includes('custom') && (
                                  <Input
                                    type="number"
                                    placeholder="输入电压值"
                                    value={criteria.customVoltage}
                                    onChange={(e) => handleInputChange('customVoltage', e.target.value)}
                                    min="0"
                                    className="ml-6"
                                  />
                                )}
                              </div>
                            );
                          }
                          return (
                            <div key={opt.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`voltage-${opt.value}`}
                                checked={criteria.voltage.includes(opt.value)}
                                onCheckedChange={() => handleCheckboxChange('voltage', opt.value)}
                              />
                              <Label
                                htmlFor={`voltage-${opt.value}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {opt.label}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Frequency */}
                    <div className="space-y-3">
                      <Label>频率 (Hz)</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {FREQUENCY_OPTIONS.map(opt => {
                          if (opt.value === 'custom') {
                            return (
                              <div key={opt.value} className="col-span-2 space-y-2">
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="frequency-custom"
                                    checked={criteria.frequency.includes('custom')}
                                    onCheckedChange={() => handleCheckboxChange('frequency', 'custom')}
                                  />
                                  <Label
                                    htmlFor="frequency-custom"
                                    className="text-sm font-normal cursor-pointer flex-1"
                                  >
                                    自定义频率
                                  </Label>
                                </div>
                                {criteria.frequency.includes('custom') && (
                                  <Input
                                    type="number"
                                    placeholder="输入频率值"
                                    value={criteria.customFrequency}
                                    onChange={(e) => handleInputChange('customFrequency', e.target.value)}
                                    min="0"
                                    className="ml-6"
                                  />
                                )}
                              </div>
                            );
                          }
                          return (
                            <div key={opt.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`freq-${opt.value}`}
                                checked={criteria.frequency.includes(opt.value)}
                                onCheckedChange={() => handleCheckboxChange('frequency', opt.value)}
                              />
                              <Label
                                htmlFor={`freq-${opt.value}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {opt.label}
                              </Label>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Poles */}
                    <div className="space-y-3">
                      <Label>极数</Label>
                      <div className="space-y-2">
                        {POLES_OPTIONS.map(opt => (
                          <div key={opt.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`poles-${opt.value}`}
                              checked={criteria.poles.includes(opt.value)}
                              onCheckedChange={() => handleCheckboxChange('poles', opt.value)}
                            />
                            <Label
                              htmlFor={`poles-${opt.value}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {opt.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* IP Rating */}
                    <div className="space-y-3">
                      <Label className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        防护等级
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        {IP_RATING_OPTIONS.map(opt => (
                          <div key={opt.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`ip-${opt.value}`}
                              checked={criteria.ipRating.includes(opt.value)}
                              onCheckedChange={() => handleCheckboxChange('ipRating', opt.value)}
                            />
                            <Label
                              htmlFor={`ip-${opt.value}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {opt.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Insulation */}
                    <div className="space-y-3">
                      <Label>绝缘等级</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {INSULATION_OPTIONS.map(opt => (
                          <div key={opt.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`insulation-${opt.value}`}
                              checked={criteria.insulation.includes(opt.value)}
                              onCheckedChange={() => handleCheckboxChange('insulation', opt.value)}
                            />
                            <Label
                              htmlFor={`insulation-${opt.value}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {opt.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mounting */}
                    <div className="space-y-3">
                      <Label>安装方式</Label>
                      <div className="space-y-2">
                        {MOUNTING_OPTIONS.map(opt => (
                          <div key={opt.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`mounting-${opt.value}`}
                              checked={criteria.mounting.includes(opt.value)}
                              onCheckedChange={() => handleCheckboxChange('mounting', opt.value)}
                            />
                            <Label
                              htmlFor={`mounting-${opt.value}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {opt.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Reset Button */}
                    {hasActiveFilters() && (
                      <Button onClick={handleReset} variant="outline" className="w-full gap-2">
                        <RefreshCw className="h-4 w-4" />
                        清除所有筛选
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Panel */}
          <div className="flex-1">
            {/* Quick Select */}
            {!showFilters && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">常用场景快速选型</CardTitle>
                  <CardDescription>点击下方场景快速筛选</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {popularRequirements.map((req, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleQuickSelect(req.power, req.rpm, req.voltage)}
                        className="h-auto py-4 flex flex-col gap-1"
                      >
                        <Package className="h-5 w-5" />
                        <span className="text-sm font-semibold">{req.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {req.power}kW · {req.rpm}rpm · {req.voltage}V
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">选型结果</h2>
                <p className="text-sm text-muted-foreground">
                  找到 {filteredMotors.length} 款匹配的电机
                </p>
              </div>
              {hasActiveFilters() && (
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <X className="h-4 w-4 mr-2" />
                  清除筛选
                </Button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-20">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
                <p className="mt-4 text-muted-foreground">加载中...</p>
              </div>
            ) : filteredMotors.length === 0 ? (
              <Card>
                <CardContent className="py-20 text-center">
                  <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">未找到匹配的电机</h3>
                  <p className="text-muted-foreground mb-6">
                    请调整筛选条件或清除所有筛选重新搜索
                  </p>
                  <Button onClick={handleReset}>
                    清除筛选条件
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredMotors.map((motor, index) => (
                  <motion.div
                    key={motor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl">{motor.model}</CardTitle>
                          <Badge variant="secondary">{motor.frameSize}</Badge>
                        </div>
                        <CardDescription>{motor.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 p-3 rounded-lg border">
                            <div className="text-muted-foreground text-xs mb-1">功率</div>
                            <div className="font-bold text-lg text-primary">{motor.power} kW</div>
                          </div>
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-3 rounded-lg border">
                            <div className="text-muted-foreground text-xs mb-1">电压</div>
                            <div className="font-bold text-lg">{motor.voltage}V</div>
                          </div>
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 p-3 rounded-lg border">
                            <div className="text-muted-foreground text-xs mb-1">转速</div>
                            <div className="font-bold text-lg">{motor.rpm} rpm</div>
                          </div>
                          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 p-3 rounded-lg border">
                            <div className="text-muted-foreground text-xs mb-1">极数</div>
                            <div className="font-bold text-lg">{motor.poles}极</div>
                          </div>
                          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950 dark:to-blue-950 p-3 rounded-lg border">
                            <div className="text-muted-foreground text-xs mb-1">效率</div>
                            <div className="font-bold text-lg">{motor.efficiency}%</div>
                          </div>
                          <div className="bg-gradient-to-br from-rose-50 to-red-50 dark:from-rose-950 dark:to-red-950 p-3 rounded-lg border">
                            <div className="text-muted-foreground text-xs mb-1">防护</div>
                            <div className="font-bold text-lg">{motor.ip}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{motor.frequency}Hz</Badge>
                          <Badge variant="outline">{motor.insulation}级绝缘</Badge>
                          <Badge variant="outline">{motor.mounting}</Badge>
                        </div>

                        <Link href={`/products/${motor.id}`} className="block">
                          <Button className="w-full gap-2">
                            查看详情
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
