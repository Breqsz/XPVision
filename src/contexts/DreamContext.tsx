import React, { createContext, useState, ReactNode } from 'react';

export interface Dream {
  id: string;
  title: string;
  targetValue: number;
  currentSaved: number;
  targetDate?: string;
}

interface DreamContextValue {
  dreams: Dream[];
  addDream: (dream: Dream) => void;
  updateDream: (id: string, changes: Partial<Dream>) => void;
}

export const DreamContext = createContext<DreamContextValue>({
  dreams: [],
  addDream: () => {},
  updateDream: () => {},
});

export const DreamProvider = ({ children }: { children: ReactNode }) => {
  const [dreams, setDreams] = useState<Dream[]>([]);

  const addDream = (dream: Dream) => {
    setDreams((prev) => [...prev, dream]);
  };

  const updateDream = (id: string, changes: Partial<Dream>) => {
    setDreams((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...changes } : d))
    );
  };

  return (
    <DreamContext.Provider value={{ dreams, addDream, updateDream }}>
      {children}
    </DreamContext.Provider>
  );
};