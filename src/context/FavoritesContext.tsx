// 收藏夹 Context
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Favorite } from '@/types/extra';

interface FavoritesContextType {
  favorites: Favorite[];
  addFavorite: (motor: any) => void;
  removeFavorite: (motorId: number) => void;
  clearFavorites: () => void;
  isFavorite: (motorId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([]);

  useEffect(() => {
    // 从 localStorage 加载收藏夹
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const addFavorite = (motor: any) => {
    const newFavorite: Favorite = {
      id: Date.now(),
      motorId: motor.id,
      motor,
      createdAt: new Date().toISOString(),
    };

    setFavorites(prev => {
      const updated = [...prev, newFavorite];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const removeFavorite = (motorId: number) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.motorId !== motorId);
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
  };

  const isFavorite = (motorId: number): boolean => {
    return favorites.some(f => f.motorId === motorId);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, clearFavorites, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
