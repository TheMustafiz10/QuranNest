'use client';

import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { useTheme } from '@/context/theme-context';
import type { FontSettings } from '@/types/quran';

interface RightSidebarProps {
  fontSettings: FontSettings;
  onUpdateSettings: (settings: Partial<FontSettings>) => void;
}

export function RightSidebar({ fontSettings, onUpdateSettings }: RightSidebarProps) {
  const [activeTab, setActiveTab] = useState<'reading' | 'translation'>('translation');
  const [fontOpen, setFontOpen] = useState(true);
  const { effectiveTheme } = useTheme();
  const arabicFonts: Array<{ id: FontSettings['arabicFont']; label: string }> = [
    { id: 'kfgq', label: 'KFGQ' },
    { id: 'amiri', label: 'Amiri Quran' },
    { id: 'scheherazade', label: 'Scheherazade' }
  ];

  const getThemeStyles = () => {
    switch (effectiveTheme) {
      case 'light':
        return {
          container: 'bg-gray-50 border-l-2 border-green-300',
          tab: 'text-gray-600 border-gray-200 hover:text-gray-900',
          tabActive: 'text-gray-900 border-green-500 bg-green-50 font-bold',
          content: 'text-gray-900',
          label: 'text-gray-800 font-bold',
          slider: 'accent-green-500',
          tabBorder: 'border-b-2 border-gray-200'
        };
      case 'sepia':
        return {
          container: 'bg-[#faf6f0] border-l-2 border-[#c97c44]',
          tab: 'text-[#8d6e63] border-[#d7ccc8] hover:text-[#5d4037]',
          tabActive: 'text-[#3e2723] border-[#c97c44] bg-[#e1c4aa]/40 font-bold',
          content: 'text-[#3e2723]',
          label: 'text-[#3e2723] font-bold',
          slider: 'accent-[#c97c44]',
          tabBorder: 'border-b-2 border-[#d7ccc8]'
        };
      case 'dark':
      default:
        return {
          container: 'bg-slate-900 border-l-2 border-emerald-500',
          tab: 'text-slate-400 border-slate-700 hover:text-slate-200',
          tabActive: 'text-slate-100 border-emerald-500 bg-emerald-900/40 font-bold',
          content: 'text-slate-100',
          label: 'text-slate-100 font-bold',
          slider: 'accent-emerald-500',
          tabBorder: 'border-b-2 border-slate-700'
        };
    }
  };

  const styles = getThemeStyles();

  const tabs = [
    { id: 'translation' as const, label: 'Translation' },
    { id: 'reading' as const, label: 'Reading' }
  ];



  const arabicMin = 16;
  const arabicMax = 100;
  const translationMin = 12;
  const translationMax = 44;
  const arabicProgress = ((fontSettings.arabicFontSize - arabicMin) / (arabicMax - arabicMin)) * 100;
  const translationProgress = ((fontSettings.translationFontSize - translationMin) / (translationMax - translationMin)) * 100;
  const activeTrackColor =
    effectiveTheme === 'dark' ? '#10b981' : effectiveTheme === 'sepia' ? '#c97c44' : '#4a8b3a';
  const inactiveTrackColor =
    effectiveTheme === 'dark' ? '#334155' : effectiveTheme === 'sepia' ? '#d7ccc8' : '#e5e7eb';



  return (
    <div className={`flex h-full w-full flex-col border-l xl:w-[320px] ${styles.container}`}>
      <div className={`border-b p-4 ${
        effectiveTheme === 'dark' ? 'border-slate-700' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8]' : 'border-[#edf0eb]'
      }`}>
        <div className={`inline-flex w-full rounded-full p-1 text-sm font-semibold shadow-sm ${
          effectiveTheme === 'dark' ? 'bg-slate-800 text-slate-400' : effectiveTheme === 'sepia' ? 'bg-[#ede6da] text-[#8d6e63]' : 'bg-[#f3f4f1] text-slate-600'
        }`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 rounded-full px-4 py-2 transition-colors ${
                activeTab === tab.id
                  ? effectiveTheme === 'dark' ? 'bg-slate-900 text-emerald-400 shadow-sm' : effectiveTheme === 'sepia' ? 'bg-[#f1e4d4] text-[#c97c44] shadow-sm' : 'bg-white text-[#4a8b3a] shadow-sm'
                  : effectiveTheme === 'dark' ? 'text-slate-400' : effectiveTheme === 'sepia' ? 'text-[#8d6e63]' : 'text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>


      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="space-y-3">
          <button className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left shadow-sm ${
            effectiveTheme === 'dark' ? 'border-slate-700 bg-slate-800' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] bg-[#f1e4d4]' : 'border-[#edf0eb] bg-white'
          }`}>
            <span className={`flex items-center gap-3 text-[15px] font-semibold ${
              effectiveTheme === 'dark' ? 'text-slate-100' : effectiveTheme === 'sepia' ? 'text-[#3e2723]' : 'text-slate-700'
            }`}>
              <BookOpen className={`h-4 w-4 ${
                effectiveTheme === 'dark' ? 'text-slate-400' : effectiveTheme === 'sepia' ? 'text-[#8d6e63]' : 'text-slate-500'
              }`} />
              Reading Settings
            </span>
            <ChevronDown className={`h-4 w-4 ${
              effectiveTheme === 'dark' ? 'text-slate-400' : effectiveTheme === 'sepia' ? 'text-[#8d6e63]' : 'text-slate-500'
            }`} />
          </button>

          <div className={`rounded-2xl border px-4 py-4 shadow-sm ${
            effectiveTheme === 'dark' ? 'border-slate-700 bg-slate-800' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] bg-[#f1e4d4]' : 'border-[#edf0eb] bg-white'
          }`}>
            <button
              onClick={() => setFontOpen(open => !open)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className={`flex items-center gap-3 text-[15px] font-semibold ${
                effectiveTheme === 'dark' ? 'text-emerald-600' : effectiveTheme === 'sepia' ? 'text-[#c97c44]' : 'text-[#4a8b3a]'
              }`}>
                <span className={`inline-flex h-5 w-5 items-center justify-center rounded-full ${
                  effectiveTheme === 'dark' ? 'bg-emerald-600 text-white' : effectiveTheme === 'sepia' ? 'bg-[#c97c44] text-white' : 'bg-[#4a8b3a] text-white'
                }`}>
                  <Settings className="h-3.5 w-3.5" />
                </span>
                Font Settings
              </span>
              {fontOpen
                ? <ChevronUp className={`h-4 w-4 ${
                  effectiveTheme === 'dark' ? 'text-emerald-600' : effectiveTheme === 'sepia' ? 'text-[#c97c44]' : 'text-[#4a8b3a]'
                }`} />
                : <ChevronDown className={`h-4 w-4 ${
                  effectiveTheme === 'dark' ? 'text-slate-400' : effectiveTheme === 'sepia' ? 'text-[#8d6e63]' : 'text-slate-500'
                }`} />
              }
            </button>

            {fontOpen && (
              <div className="mt-5 space-y-6">
                <div>
                  <div className={`mb-3 flex items-center justify-between text-[14px] font-medium ${
                    effectiveTheme === 'dark' ? 'text-slate-300' : effectiveTheme === 'sepia' ? 'text-[#5d4037]' : 'text-slate-700'
                  }`}>
                    <span>Arabic Font Size</span>
                    <span className={`min-w-[34px] text-right font-semibold ${effectiveTheme === 'dark' ? 'text-emerald-600' : effectiveTheme === 'sepia' ? 'text-[#c97c44]' : 'text-[#4a8b3a]'}`}>{fontSettings.arabicFontSize}</span>
                  </div>
                  <input
                    type="range"
                    min={arabicMin}
                    max={arabicMax}
                    value={fontSettings.arabicFontSize}
                    onChange={e =>
                      onUpdateSettings({
                        ...fontSettings,
                        arabicFontSize: parseInt(e.target.value)
                      })
                    }
                    style={{
                      background: `linear-gradient(to right, ${activeTrackColor} 0%, ${activeTrackColor} ${arabicProgress}%, ${inactiveTrackColor} ${arabicProgress}%, ${inactiveTrackColor} 100%)`
                    }}
                    className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${styles.slider}`}
                  />
                </div>

                <div>
                  <div className={`mb-3 flex items-center justify-between text-[14px] font-medium ${
                    effectiveTheme === 'dark' ? 'text-slate-300' : effectiveTheme === 'sepia' ? 'text-[#5d4037]' : 'text-slate-700'
                  }`}>
                    <span>Translation Font Size</span>
                    <span className={`min-w-[34px] text-right font-semibold ${effectiveTheme === 'dark' ? 'text-emerald-600' : effectiveTheme === 'sepia' ? 'text-[#c97c44]' : 'text-[#4a8b3a]'}`}>{fontSettings.translationFontSize}</span>
                  </div>
                  <input
                    type="range"
                    min={translationMin}
                    max={translationMax}
                    value={fontSettings.translationFontSize}
                    onChange={e =>
                      onUpdateSettings({
                        ...fontSettings,
                        translationFontSize: parseInt(e.target.value)
                      })
                    }
                    style={{
                      background: `linear-gradient(to right, ${activeTrackColor} 0%, ${activeTrackColor} ${translationProgress}%, ${inactiveTrackColor} ${translationProgress}%, ${inactiveTrackColor} 100%)`
                    }}
                    className={`w-full h-1.5 rounded-full appearance-none cursor-pointer ${styles.slider}`}
                  />
                </div>

                <div>
                  <div className={`mb-3 text-[14px] font-medium ${
                    effectiveTheme === 'dark' ? 'text-slate-300' : effectiveTheme === 'sepia' ? 'text-[#5d4037]' : 'text-slate-700'
                  }`}>Arabic Font Face</div>
                  <div className="space-y-2">
                    {arabicFonts.map(font => (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => onUpdateSettings({ arabicFont: font.id })}
                        className={`flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-[14px] transition-colors ${
                          fontSettings.arabicFont === font.id
                            ? effectiveTheme === 'dark' ? 'border-emerald-500 bg-emerald-900/30 text-emerald-300' : effectiveTheme === 'sepia' ? 'border-[#c97c44] bg-[#ede6da] text-[#c97c44]' : 'border-[#4a8b3a] bg-[#eff7eb] text-[#4a8b3a]'
                            : effectiveTheme === 'dark' ? 'border-slate-600 bg-slate-700 text-slate-300 hover:border-slate-500' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] bg-[#ede6da] text-[#5d4037] hover:border-[#cbb9a3]' : 'border-[#edf0eb] bg-[#f7f7f5] text-slate-600 hover:border-[#dfe6d5]'
                        }`}
                      >
                        <span>{font.label}</span>
                        {fontSettings.arabicFont === font.id ? (
                          <span className="text-[16px]">✓</span>
                        ) : (
                          <span className={`text-[16px] opacity-0 group-hover:opacity-100 ${
                            effectiveTheme === 'dark' ? 'text-slate-400' : effectiveTheme === 'sepia' ? 'text-[#8d6e63]' : 'text-slate-400'
                          }`}>
                            {'>'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`rounded-2xl border p-4 ${
            effectiveTheme === 'dark' ? 'border-slate-700 bg-slate-800' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] bg-[#f1e4d4]' : 'border-[#d9e7d4] bg-[#e6eee7]'
          }`}>
            <p className={`text-[16px] font-bold ${
              effectiveTheme === 'dark' ? 'text-slate-100' : effectiveTheme === 'sepia' ? 'text-[#3e2723]' : 'text-slate-800'
            }`}>Help spread the knowledge of Islam</p>
            <p className={`mt-3 text-[13px] leading-6 ${
              effectiveTheme === 'dark' ? 'text-slate-400' : effectiveTheme === 'sepia' ? 'text-[#5d4037]' : 'text-[#62736b]'
            }`}>
              Your regular support helps us reach our religious brothers and sisters with the message of Islam. Join our mission and be part of the big change.
            </p>
            <button className={`mt-4 w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-sm ${
              effectiveTheme === 'dark' ? 'bg-emerald-600 text-white hover:bg-emerald-500' : effectiveTheme === 'sepia' ? 'bg-[#c97c44] text-white hover:bg-[#b8703b]' : 'bg-[#4a8b3a] text-white hover:bg-[#3f7631]'
            }`}>
              Support Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
