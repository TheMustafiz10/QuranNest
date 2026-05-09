'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Cloud, Heart, Monitor, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from '@/context/theme-context';

interface TopHeaderProps {
  onSearchClick: () => void;
}

export function TopHeader({ onSearchClick }: TopHeaderProps) {
  const { theme, setTheme, effectiveTheme } = useTheme();
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setShowThemeMenu(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const themeOptions = [
    { id: 'light' as const, label: 'Light', icon: Sun },
    { id: 'dark' as const, label: 'Dark', icon: Moon },
    { id: 'sepia' as const, label: 'Sepia', icon: Cloud },
    { id: 'system' as const, label: 'System', icon: Monitor }
  ];

  const ThemeIcon =
    theme === 'light' ? Sun : theme === 'dark' ? Moon : theme === 'sepia' ? Cloud : Monitor;

  const styles =
    effectiveTheme === 'dark'
      ? {
          header: 'bg-slate-950/95 border-slate-800',
          title: 'text-slate-100',
          subtitle: 'text-slate-400',
          iconButton: 'border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800',
          support: 'bg-[#4a8b3a] text-white hover:bg-[#3f7631]',
          dropdown: 'bg-slate-900 border-slate-700 shadow-lg',
          dropdownItem: 'text-slate-100 hover:bg-slate-800'
        }
      : effectiveTheme === 'sepia'
        ? {
              header: 'bg-[#fbf7f0] border-[#e5dccf]',
              title: 'text-[#1f2937]',
              subtitle: 'text-[#8d6e63]',
              iconButton: 'border-[#e2d7c7] bg-white text-[#4b5563] hover:bg-[#f6f1e8]',
              support: 'bg-[#4a8b3a] text-white hover:bg-[#3f7631]',
              dropdown: 'bg-white border-[#d7ccc8] shadow-lg',
              dropdownItem: 'text-[#3e2723] hover:bg-[#f1e4d4]'
            }
        : {
            header: 'bg-white/90 border-[#ece8de] backdrop-blur-sm',
            title: 'text-slate-900',
            subtitle: 'text-slate-500',
            iconButton: 'border-[#dfe6d5] bg-[#f7f8f4] text-[#5a6760] hover:bg-white',
            support: 'bg-[#4a8b3a] text-white hover:bg-[#3f7631]',
            dropdown: 'bg-white border-[#e1d7cc] shadow-lg',
            dropdownItem: 'text-slate-900 hover:bg-[#f5ede0]'
          };



  return (
    <header className={`sticky top-0 z-40 border-b xl:pl-[62px] ${styles.header}`}>
      <div className="flex h-[72px] w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="leading-tight">
            <h1 className={`text-[22px] font-bold tracking-[-0.02em] ${styles.title}`}>Quran Mazid</h1>
            <p className={`text-[11px] ${styles.subtitle}`}>Read, Study, and Learn The Quran</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSearchClick}
            className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${styles.iconButton}`}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </button>

          <div ref={themeMenuRef} className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              className={`flex h-11 w-11 items-center justify-center rounded-full border transition-colors ${styles.iconButton}`}
              aria-label="Change theme"
              title={`Theme: ${theme}`}
            >
              <ThemeIcon className="h-4 w-4" />
            </button>

            {showThemeMenu && (
              <div className={`absolute right-0 mt-2 w-40 rounded-lg border ${styles.dropdown} z-50`}>
                {themeOptions.map((option) => {
                  const OptionIcon = option.icon;
                  const isActive = theme === option.id;
                  return (
                    <button
                      key={option.id}
                      onClick={() => {
                        setTheme(option.id);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors first:rounded-t-md last:rounded-b-md ${
                        isActive ? 'bg-[#4a8b3a] text-white' : styles.dropdownItem
                      }`}
                    >
                      <OptionIcon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          

          <button className={`hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-bold shadow-sm transition-colors sm:flex ${
            effectiveTheme === 'dark' ? 'bg-emerald-600 text-white hover:bg-emerald-500' : effectiveTheme === 'sepia' ? 'bg-[#c97c44] text-white hover:bg-[#b8703b]' : 'bg-[#4a8b3a] text-white hover:bg-[#3f7631]'
          }`}>
            <span>Support Us</span>
            <Heart className="h-4 w-4 fill-current" />
          </button>
        </div>
      </div>
    </header>
  );
}
