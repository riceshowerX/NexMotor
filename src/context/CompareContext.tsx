// 产品对比 Context
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { CompareItem } from '@/types/extra';
import { toast } from 'sonner';

interface CompareContextType {
  compareList: CompareItem[];
  addToCompare: (motor: any) => void;
  removeFromCompare: (motorId: number) => void;
  clearCompare: () => void;
  isComparing: (motorId: number) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<CompareItem[]>([]);

  useEffect(() => {
    // 从 localStorage 加载对比列表
    const saved = localStorage.getItem('compareList');
    if (saved) {
      setCompareList(JSON.parse(saved));
    }
  }, []);

  const addToCompare = (motor: any) => {
    if (compareList.length >= 4) {
      toast.error('最多只能对比 4 个产品');
      return;
    }

    if (compareList.some(item => item.motor.id === motor.id)) {
      toast.info('该产品已在对比列表中');
      return;
    }

    const newItem: CompareItem = {
      id: Date.now(),
      motorId: motor.id,
      motor,
    };

    setCompareList(prev => {
      const updated = [...prev, newItem];
      localStorage.setItem('compareList', JSON.stringify(updated));
      toast.success('已添加到对比列表');
      return updated;
    });
  };

  const removeFromCompare = (motorId: number) => {
    setCompareList(prev => {
      const updated = prev.filter(item => item.motorId !== motorId);
      localStorage.setItem('compareList', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCompare = () => {
    setCompareList([]);
    localStorage.removeItem('compareList');
  };

  const isComparing = (motorId: number): boolean => {
    return compareList.some(item => item.motorId === motorId);
  };

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isComparing }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
