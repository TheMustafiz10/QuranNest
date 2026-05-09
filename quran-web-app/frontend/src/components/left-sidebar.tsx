'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/theme-context';


interface Chapter {
  id: number;
  number: number;
  name: string;
  name_arabic: string;
  meaning_en: string;
  verses_count: number;
  type?: 'meccan' | 'medinan';
}

interface LeftSidebarProps {
  chapters: Chapter[];
  selectedChapterId: number | null;
  onSelectChapter: (id: number) => void;
}

export function LeftSidebar({
  chapters,
  selectedChapterId,
  onSelectChapter
}: LeftSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'surah' | 'juz' | 'page'>('surah');
  const { effectiveTheme } = useTheme();

  const filteredChapters = useMemo(() => {
    if (!searchQuery.trim()) return chapters;

    const query = searchQuery.toLowerCase();
    return chapters.filter(
      ch =>
        ch.name.toLowerCase().includes(query) ||
        ch.meaning_en.toLowerCase().includes(query) ||
        ch.number.toString().includes(query)
    );
  }, [searchQuery, chapters]);

  const getThemeStyles = () => {
    switch (effectiveTheme) {
      case 'light':
        return {
          container: 'bg-transparent',
          input: 'bg-white border border-[#e4eadf] text-gray-900 placeholder-gray-500 focus:border-[#4a8b3a]',
          itemBg: 'bg-white/90 hover:bg-[#f6faf3] border border-[#e3eadb] hover:border-[#bfd7b0] hover:shadow-[0_8px_24px_rgba(74,139,58,0.08)]',
          itemActiveBg: 'bg-white/90 border border-[#bfd7b0] shadow-[0_10px_30px_rgba(74,139,58,0.06)]',
          itemText: 'text-gray-900 font-semibold',
          itemSecondary: 'text-gray-600 font-medium',
          number: 'bg-[#4a8b3a] text-white font-bold',
          numberInactive: 'bg-[#f3f4f1] text-[#9aa19a] font-bold'
        };
      case 'sepia':
        return {
          container: 'bg-transparent',
          input: 'bg-[#f5ede0] border border-[#d7ccc8] text-[#3e2723] placeholder-[#8d6e63] focus:border-[#b8703b]',
          itemBg: 'bg-[#f5ede0] hover:bg-[#efe2d4] border border-[#d7ccc8] hover:border-[#cbb9a3] hover:shadow-[0_8px_20px_rgba(201,124,68,0.08)]',
          itemActiveBg: 'bg-[#f5ede0] border border-[#c97c44] shadow-md',
          itemText: 'text-[#3e2723] font-semibold',
          itemSecondary: 'text-[#5d4037] font-medium',
          number: 'bg-[#c97c44] text-white font-bold',
          numberInactive: 'bg-[#efe2d4] text-[#a08f81] font-bold'
        };
      case 'dark':
      default:
        return {
          container: 'bg-slate-900/95',
          input: 'bg-slate-800 border border-emerald-500 text-slate-100 placeholder-slate-400 focus:border-emerald-400',
          itemBg: 'bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-700 hover:shadow-lg hover:shadow-emerald-900/20',
          itemActiveBg: 'bg-slate-800 border border-emerald-500 shadow-lg shadow-emerald-500/20',
          itemText: 'text-slate-100 font-semibold',
          itemSecondary: 'text-slate-300 font-medium',
          number: 'bg-emerald-600 text-white font-bold',
          numberInactive: 'bg-slate-700 text-slate-300 font-bold'
        };
    }
  };


  const styles = getThemeStyles();
  const tabs = [
    { id: 'surah' as const, label: 'Surah' },
    { id: 'juz' as const, label: 'Juz' },
    { id: 'page' as const, label: 'Page' }
  ];

  const logoIcon = (
    <svg viewBox="0 0 36 36" className="h-5 w-5" aria-hidden="true">
      <path
        d="M6.99183 0H29.0082C32.8696 0 36 3.13043 36 6.99183V29.0082C36 32.8696 32.8696 36 29.0082 36H6.99183C3.13043 36 0 32.8696 0 29.0082V6.99183C0 3.13043 3.13043 0 6.99183 0Z"
        fill="currentColor"
      />
      <path d="M18 9L9 13V24L18 28L27 24V13L18 9Z" fill="white" fillOpacity="0.75" />
      <path d="M18 12V25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11.5 15.5L18 19L24.5 15.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div className={`flex h-full w-full flex-col xl:w-[320px] ${styles.container}`}>
      <div className="py-1" />

      <div className={`border-b px-4 py-3 ${
        effectiveTheme === 'dark' ? 'border-slate-700' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8]' : 'border-[#ece8de]'
      }`}>
        <div className={`mb-4 inline-flex rounded-full p-1 text-sm font-semibold shadow-sm ${
          effectiveTheme === 'dark' ? 'bg-slate-800 text-slate-400' : effectiveTheme === 'sepia' ? 'bg-[#ede6da] text-[#8d6e63]' : 'bg-[#f1f2ee] text-slate-600'
        }`}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-5 py-2 transition-colors ${
                activeTab === tab.id
                  ? effectiveTheme === 'dark' ? 'bg-slate-900 text-emerald-400 shadow-sm' : effectiveTheme === 'sepia' ? 'bg-[#f5ede0] text-[#c97c44] shadow-sm' : 'bg-white text-[#4a8b3a] shadow-sm'
                  : effectiveTheme === 'dark' ? 'text-slate-500' : effectiveTheme === 'sepia' ? 'text-[#8d6e63]' : 'text-slate-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>


        <div className="relative">
          <Search className={`pointer-events-none absolute left-4 top-3.5 h-4 w-4 ${
            effectiveTheme === 'dark' ? 'text-slate-500' : effectiveTheme === 'sepia' ? 'text-[#8d6e63]' : 'text-slate-400'
          }`} />
          <input
            type="text"
            placeholder="Search Surah"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={`w-full rounded-full py-3 pl-11 pr-4 text-sm shadow-sm outline-none transition ${styles.input}`}
          />
        </div>

      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        {filteredChapters.length === 0 ? (
          <div className={`p-4 text-center text-sm font-semibold ${styles.itemSecondary}`}>
            No Surahs found
          </div>
        ) : (
          <div className="space-y-3">
            {filteredChapters.map(chapter => (
              <button
                key={chapter.id}
                onClick={() => onSelectChapter(chapter.id)}
                className={`group w-full rounded-[18px] border px-3 py-3 text-left transition-all duration-200 ${
                  selectedChapterId === chapter.id
                    ? styles.itemActiveBg
                    : styles.itemBg
                } hover:shadow-sm`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl shadow-sm">
                    <div
                      className={`flex h-10 w-10 rotate-45 items-center justify-center rounded-2xl ${
                        selectedChapterId === chapter.id ? styles.number : styles.numberInactive
                      }`}
                    >
                      <span className="-rotate-45 text-sm font-bold">{chapter.number}</span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className={`truncate text-[15px] font-semibold ${styles.itemText}`}>
                          {chapter.name}
                        </div>
                        <div className={`truncate text-[13px] ${styles.itemSecondary}`}>
                          {chapter.meaning_en}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col items-end">
                          <div className={`whitespace-nowrap text-[18px] font-semibold ${styles.itemSecondary}`}>
                            {chapter.name_arabic}
                          </div>
                          {chapter.type && (
                            <div className={`flex items-center gap-1 text-[10px] font-semibold ${
                              effectiveTheme === 'dark'
                                ? chapter.type === 'medinan' ? 'text-emerald-400' : 'text-orange-400'
                                : effectiveTheme === 'sepia'
                                  ? chapter.type === 'medinan' ? 'text-[#c97c44]' : 'text-[#a08f81]'
                                  : chapter.type === 'medinan' ? 'text-emerald-600' : 'text-orange-600'
                            }`}>
                              <MapPin className="h-3 w-3" />
                              {chapter.type === 'medinan' ? 'Madinah' : 'Makkah'}
                            </div>
                          )}
                        </div>
                        <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold transition-opacity ${
                          selectedChapterId === chapter.id
                            ? effectiveTheme === 'dark' ? 'bg-emerald-900/30 text-emerald-400 opacity-100' : effectiveTheme === 'sepia' ? 'bg-[#c97c44]/10 text-[#c97c44] opacity-100' : 'bg-[#4a8b3a]/10 text-[#4a8b3a] opacity-100'
                            : effectiveTheme === 'dark' ? 'bg-slate-700 text-slate-500 opacity-0 group-hover:opacity-100' : effectiveTheme === 'sepia' ? 'bg-[#ede6da] text-[#a08f81] opacity-0 group-hover:opacity-100' : 'bg-[#f4f6f2] text-[#8b9488] opacity-0 group-hover:opacity-100'
                        }`}>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
