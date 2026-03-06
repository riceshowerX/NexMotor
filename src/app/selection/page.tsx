'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Sliders, Search, X, Zap, RotateCw, Shield, Package, ArrowRight, RefreshCw, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectionCriteria {
  powerMin: string;
  powerMax: string;
  voltage: string;
  frequency: string;
  poles: string;
  ipRating: string;
  insulation: string;
  mounting: string;
  rpmMin: string;
  rpmMax: string;
  currentMin: string;
  currentMax: string;
  efficiencyMin: string;
  efficiencyMax: string;
  powerFactorMin: string;
  powerFactorMax: string;
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

const POLES_OPTIONS = ['2', '4', '6', '8'];

const IP_RATING_OPTIONS = ['IP23', 'IP44', 'IP54', 'IP55', 'IP56', 'IP65'];

const INSULATION_OPTIONS = ['B', 'F', 'H'];

const MOUNTING_OPTIONS = ['B3', 'B5', 'B14', 'B35', 'V1'];

export default function SelectionPage() {
  const [criteria, setCriteria] = useState<SelectionCriteria>({
    powerMin: '',
    powerMax: '',
    voltage: '',
    frequency: '',
    poles: '',
    ipRating: '',
    insulation: '',
    mounting: '',
    rpmMin: '',
    rpmMax: '',
    currentMin: '',
    currentMax: '',
    efficiencyMin: '',
    efficiencyMax: '',
    powerFactorMin: '',
    powerFactorMax: '',
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
      if (criteria.voltage && motor.voltage !== parseFloat(criteria.voltage)) {
        return false;
      }

      // 频率筛选
      if (criteria.frequency && motor.frequency !== parseFloat(criteria.frequency)) {
        return false;
      }

      // 极数筛选
      if (criteria.poles && motor.poles !== parseInt(criteria.poles)) {
        return false;
      }

      // 防护等级筛选
      if (criteria.ipRating && motor.ip !== criteria.ipRating) {
        return false;
      }

      // 绝缘等级筛选
      if (criteria.insulation && motor.insulation !== criteria.insulation) {
        return false;
      }

      // 安装方式筛选
      if (criteria.mounting && motor.mounting !== criteria.mounting) {
        return false;
      }

      // 转速范围筛选
      if (criteria.rpmMin && motor.rpm < parseFloat(criteria.rpmMin)) {
        return false;
      }
      if (criteria.rpmMax && motor.rpm > parseFloat(criteria.rpmMax)) {
        return false;
      }

      // 电流范围筛选
      if (criteria.currentMin && motor.current < parseFloat(criteria.currentMin)) {
        return false;
      }
      if (criteria.currentMax && motor.current > parseFloat(criteria.currentMax)) {
        return false;
      }

      // 效率范围筛选
      if (criteria.efficiencyMin && motor.efficiency < parseFloat(criteria.efficiencyMin)) {
        return false;
      }
      if (criteria.efficiencyMax && motor.efficiency > parseFloat(criteria.efficiencyMax)) {
        return false;
      }

      // 功率因数范围筛选
      if (criteria.powerFactorMin && motor.powerFactor < parseFloat(criteria.powerFactorMin)) {
        return false;
      }
      if (criteria.powerFactorMax && motor.powerFactor > parseFloat(criteria.powerFactorMax)) {
        return false;
      }

      return true;
    });

    setFilteredMotors(filtered);
  }, [criteria, motors]);

  const handleInputChange = (field: keyof SelectionCriteria, value: string) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setCriteria({
      powerMin: '',
      powerMax: '',
      voltage: '',
      frequency: '',
      poles: '',
      ipRating: '',
      insulation: '',
      mounting: '',
      rpmMin: '',
      rpmMax: '',
      currentMin: '',
      currentMax: '',
      efficiencyMin: '',
      efficiencyMax: '',
      powerFactorMin: '',
      powerFactorMax: '',
    });
  };

  const hasActiveFilters = () => {
    return Object.values(criteria).some(value => value !== '');
  };

  const popularRequirements = [
    { name: '小功率水泵', power: '1.5', rpm: '2840', voltage: '380' },
    { name: '中型风机', power: '7.5', rpm: '1450', voltage: '380' },
    { name: '大型压缩机', power: '45', rpm: '1480', voltage: '380' },
    { name: '低速传动', power: '15', rpm: '730', voltage: '380' },
  ];

  const handleQuickSelect = (req: typeof popularRequirements[0]) => {
    setCriteria(prev => ({
      ...prev,
      powerMin: (parseFloat(req.power) - 0.5).toString(),
      powerMax: (parseFloat(req.power) + 0.5).toString(),
      rpmMin: (parseInt(req.rpm) - 200).toString(),
      rpmMax: (parseInt(req.rpm) + 200).toString(),
      voltage: req.voltage,
    }));
  };

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
                  <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pb-20">
                    {/* Basic Parameters */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm text-muted-foreground">基本参数</h3>

                      {/* Power Range */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm">
                          <Zap className="h-4 w-4" />
                          功率范围 (kW)
                        </Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            placeholder="最小"
                            value={criteria.powerMin}
                            onChange={(e) => handleInputChange('powerMin', e.target.value)}
                            min="0"
                            step="0.1"
                          />
                          <span className="text-muted-foreground text-xs">-</span>
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

                      {/* RPM Range */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm">
                          <RotateCw className="h-4 w-4" />
                          转速范围 (rpm)
                        </Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            placeholder="最小"
                            value={criteria.rpmMin}
                            onChange={(e) => handleInputChange('rpmMin', e.target.value)}
                            min="0"
                            step="100"
                          />
                          <span className="text-muted-foreground text-xs">-</span>
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

                      {/* Current Range */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm">
                          <Zap className="h-4 w-4" />
                          电流范围 (A)
                        </Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            placeholder="最小"
                            value={criteria.currentMin}
                            onChange={(e) => handleInputChange('currentMin', e.target.value)}
                            min="0"
                            step="0.1"
                          />
                          <span className="text-muted-foreground text-xs">-</span>
                          <Input
                            type="number"
                            placeholder="最大"
                            value={criteria.currentMax}
                            onChange={(e) => handleInputChange('currentMax', e.target.value)}
                            min="0"
                            step="0.1"
                          />
                        </div>
                      </div>

                      {/* Voltage */}
                      <div className="space-y-2">
                        <Label className="text-sm">电压 (V)</Label>
                        <Input
                          type="number"
                          placeholder="例如：380"
                          value={criteria.voltage}
                          onChange={(e) => handleInputChange('voltage', e.target.value)}
                          min="0"
                        />
                      </div>

                      {/* Frequency */}
                      <div className="space-y-2">
                        <Label className="text-sm">频率 (Hz)</Label>
                        <Input
                          type="number"
                          placeholder="例如：50"
                          value={criteria.frequency}
                          onChange={(e) => handleInputChange('frequency', e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Performance Parameters */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm text-muted-foreground">性能参数</h3>

                      {/* Efficiency Range */}
                      <div className="space-y-2">
                        <Label className="text-sm">效率范围 (%)</Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            placeholder="最小"
                            value={criteria.efficiencyMin}
                            onChange={(e) => handleInputChange('efficiencyMin', e.target.value)}
                            min="0"
                            max="100"
                            step="0.1"
                          />
                          <span className="text-muted-foreground text-xs">-</span>
                          <Input
                            type="number"
                            placeholder="最大"
                            value={criteria.efficiencyMax}
                            onChange={(e) => handleInputChange('efficiencyMax', e.target.value)}
                            min="0"
                            max="100"
                            step="0.1"
                          />
                        </div>
                      </div>

                      {/* Power Factor Range */}
                      <div className="space-y-2">
                        <Label className="text-sm">功率因数范围</Label>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            placeholder="最小"
                            value={criteria.powerFactorMin}
                            onChange={(e) => handleInputChange('powerFactorMin', e.target.value)}
                            min="0"
                            max="1"
                            step="0.01"
                          />
                          <span className="text-muted-foreground text-xs">-</span>
                          <Input
                            type="number"
                            placeholder="最大"
                            value={criteria.powerFactorMax}
                            onChange={(e) => handleInputChange('powerFactorMax', e.target.value)}
                            min="0"
                            max="1"
                            step="0.01"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Mechanical Parameters */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm text-muted-foreground">机械参数</h3>

                      {/* Poles */}
                      <div className="space-y-2">
                        <Label className="text-sm">极数</Label>
                        <Input
                          type="number"
                          placeholder="例如：4"
                          value={criteria.poles}
                          onChange={(e) => handleInputChange('poles', e.target.value)}
                          min="1"
                          max="12"
                        />
                        <div className="flex flex-wrap gap-2 mt-2">
                          {POLES_OPTIONS.map(pole => (
                            <Button
                              key={pole}
                              variant={criteria.poles === pole ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleInputChange('poles', pole)}
                              className="h-7 text-xs"
                            >
                              {pole}极
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* IP Rating */}
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2 text-sm">
                          <Shield className="h-4 w-4" />
                          防护等级
                        </Label>
                        <Input
                          placeholder="例如：IP54"
                          value={criteria.ipRating}
                          onChange={(e) => handleInputChange('ipRating', e.target.value.toUpperCase())}
                        />
                        <div className="grid grid-cols-3 gap-1 mt-2">
                          {IP_RATING_OPTIONS.map(ip => (
                            <Button
                              key={ip}
                              variant={criteria.ipRating === ip ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleInputChange('ipRating', ip)}
                              className="h-7 text-xs"
                            >
                              {ip}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Insulation */}
                      <div className="space-y-2">
                        <Label className="text-sm">绝缘等级</Label>
                        <Input
                          placeholder="例如：F"
                          value={criteria.insulation}
                          onChange={(e) => handleInputChange('insulation', e.target.value.toUpperCase())}
                          maxLength={1}
                        />
                        <div className="flex gap-2 mt-2">
                          {INSULATION_OPTIONS.map(ins => (
                            <Button
                              key={ins}
                              variant={criteria.insulation === ins ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleInputChange('insulation', ins)}
                              className="h-7 text-xs flex-1"
                            >
                              {ins}级
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Mounting */}
                      <div className="space-y-2">
                        <Label className="text-sm">安装方式</Label>
                        <Input
                          placeholder="例如：B3"
                          value={criteria.mounting}
                          onChange={(e) => handleInputChange('mounting', e.target.value.toUpperCase())}
                        />
                        <div className="grid grid-cols-3 gap-1 mt-2">
                          {MOUNTING_OPTIONS.map(mount => (
                            <Button
                              key={mount}
                              variant={criteria.mounting === mount ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleInputChange('mounting', mount)}
                              className="h-7 text-xs"
                            >
                              {mount}
                            </Button>
                          ))}
                        </div>
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
                        onClick={() => handleQuickSelect(req)}
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
                            <div className="text-muted-foreground text-xs mb-1">电流</div>
                            <div className="font-bold text-lg">{motor.current} A</div>
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
                          <Badge variant="outline">{motor.poles}极</Badge>
                          <Badge variant="outline">{motor.insulation}级绝缘</Badge>
                          <Badge variant="outline">{motor.mounting}</Badge>
                          <Badge variant="outline">功率因数 {motor.powerFactor}</Badge>
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
