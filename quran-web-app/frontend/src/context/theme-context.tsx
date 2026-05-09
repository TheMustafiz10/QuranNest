'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'sepia' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: 'light' | 'dark' | 'sepia';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark' | 'sepia'>('dark');
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    const saved = localStorage.getItem('quran-theme') as Theme | null;
    if (saved) {
      setTheme(saved);
    } else {
      setTheme('system');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let actualTheme: 'light' | 'dark' | 'sepia' = 'dark';

    if (theme === 'system') {
      actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else if (theme === 'light' || theme === 'dark' || theme === 'sepia') {
      actualTheme = theme;
    }

    setEffectiveTheme(actualTheme);


    
    const html = document.documentElement;
    html.setAttribute('data-theme', actualTheme);

    if (actualTheme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }

    if (theme !== 'system') {
      localStorage.setItem('quran-theme', theme);
    }
  }, [theme, mounted]);


  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    if (newTheme !== 'system') {
      localStorage.setItem('quran-theme', newTheme);
    } else {
      localStorage.removeItem('quran-theme');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}



export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
