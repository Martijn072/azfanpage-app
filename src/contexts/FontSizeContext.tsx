import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FontSize = 'small' | 'medium' | 'large';

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider = ({ children }: { children: ReactNode }) => {
  const [fontSize, setFontSize] = useState<FontSize>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fontSize') as FontSize;
      if (saved && ['small', 'medium', 'large'].includes(saved)) {
        return saved;
      }
    }
    return 'medium';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all font size classes
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    
    // Add current font size class
    root.classList.add(`font-size-${fontSize}`);
    
    // Persist to localStorage
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
};

export const useFontSize = () => {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error('useFontSize must be used within a FontSizeProvider');
  }
  return context;
};
