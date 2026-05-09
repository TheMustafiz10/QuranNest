'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, Search, ChevronDown } from 'lucide-react';
import { useTheme } from '@/context/theme-context';
import { useVerseSearch } from '@/hooks/useQuran';
import type { Chapter, VerseSearchResult } from '@/types/quran';


type SearchModalItem = {
  chapterId: number;
  chapterNumber: number;
  chapterName: string;
  chapterArabicName: string;
  verseNumber: number | null;
  verseText: string;
  translation: string;
};

interface SearchModalProps {
  chapters: Chapter[];
  onSelectResult: (chapterId: number, verseNumber?: number | null) => void;
  onClose: () => void;
}



export function SearchModal({ chapters, onSelectResult, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [searchSource, setSearchSource] = useState('Quran');
  const { effectiveTheme } = useTheme();
  const { results, loading } = useVerseSearch(query);
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const sourceMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleOutside = (e: PointerEvent) => {
      if (showSourceMenu && sourceMenuRef.current && !sourceMenuRef.current.contains(e.target as Node)) {
        setShowSourceMenu(false);
      }
    };

    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [showSourceMenu]);

  const chapterResults = useMemo<SearchModalItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return chapters.slice(0, 10).map(chapter => ({
        chapterId: chapter.id,
        chapterNumber: chapter.number,
        chapterName: chapter.name,
        chapterArabicName: chapter.name_arabic,
        verseNumber: null,
        verseText: '',
        translation: chapter.meaning_en
      }));
    }


    return results;
  }, [query, chapters, results]);

  const getThemeStyles = () => {
    switch (effectiveTheme) {
      case 'light':
        return {
          overlay: 'bg-black/20',
          modal: 'bg-white',
          input: 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500',
          result: 'hover:bg-gray-100 text-gray-900',
          resultSecondary: 'text-gray-600'
        };
      case 'sepia':
        return {
          overlay: 'bg-black/40',
          modal: 'bg-[#f5ede0]',
          input: 'bg-[#ede6da] border-[#d7ccc8] text-[#3e2723] placeholder-[#8d6e63]',
          result: 'hover:bg-[#ede6da] text-[#3e2723]',
          resultSecondary: 'text-[#5d4037]'
        };
      case 'dark':
      default:
        return {
          overlay: 'bg-black/50',
          modal: 'bg-slate-900',
          input: 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500',
          result: 'hover:bg-slate-800 text-slate-100',
          resultSecondary: 'text-slate-400'
        };
    }
  };


  const styles = getThemeStyles();

  return (
    <div
      className={`fixed inset-0 ${styles.overlay} flex items-start justify-center pt-20 z-50`}
      onClick={onClose}
    >
      <div
        className={`${styles.modal} rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[70vh] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >

        <div className="p-6 border-b flex items-center justify-between"
          style={{borderColor: effectiveTheme === 'light' ? '#e5e7eb' : effectiveTheme === 'sepia' ? '#d7ccc8' : '#334155'}}>
          <h2 className="text-lg font-semibold">Find wisdom in the Quran</h2>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-70 transition-opacity"
          >
            <X className="w-5 h-5" />
          </button>
        </div>


        <div className="p-6 border-b space-y-4"
          style={{borderColor: effectiveTheme === 'light' ? '#e5e7eb' : effectiveTheme === 'sepia' ? '#d7ccc8' : '#334155'}}>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4" 
                style={{color: effectiveTheme === 'light' ? '#9ca3af' : effectiveTheme === 'sepia' ? '#8d6e63' : '#64748b'}} />
              <input
                autoFocus
                type="text"
                placeholder="Find wisdom in the Quran"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded border ${styles.input} focus:outline-none focus:ring-2 focus:ring-emerald-500`}
              />
            </div>

            
            {/* Quran / Google Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSourceMenu(s => !s);
                }}
                className={`px-4 py-2 rounded border flex items-center gap-2 ${styles.input} hover:opacity-80 transition-opacity`}
                aria-haspopup="menu"
                aria-expanded={showSourceMenu}
              >
                {searchSource}
                <ChevronDown className="w-4 h-4" />
              </button>

              {showSourceMenu && (
                <div
                  ref={sourceMenuRef}
                  className={`absolute right-0 mt-2 w-36 rounded-md shadow-lg z-50 ${effectiveTheme === 'dark' ? 'bg-slate-800' : effectiveTheme === 'sepia' ? 'bg-white' : 'bg-white'}`}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => { setSearchSource('Quran'); setShowSourceMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-sm ${searchSource === 'Quran' ? 'font-semibold' : ''}`}
                  >
                    Quran
                  </button>
                  <button
                    onClick={() => { setSearchSource('Google'); setShowSourceMenu(false); }}
                    className={`w-full text-left px-3 py-2 text-sm ${searchSource === 'Google' ? 'font-semibold' : ''}`}
                  >
                    Google
                  </button>
                </div>
              )}
            </div>
          </div>

   
   
          <div>
            <p className="text-sm mb-3" style={{color: effectiveTheme === 'light' ? '#6b7280' : effectiveTheme === 'sepia' ? '#5d4037' : '#64748b'}}>
              Try to navigate
            </p>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 rounded-full border"
                style={{
                  borderColor: effectiveTheme === 'light' ? '#d1d5db' : effectiveTheme === 'sepia' ? '#d7ccc8' : '#475569',
                  color: effectiveTheme === 'light' ? '#6b7280' : effectiveTheme === 'sepia' ? '#5d4037' : '#64748b',
                }}
                onClick={() => {
                  const chapter1 = chapters.find(c => c.number === 1);
                  if (chapter1) onSelectResult(chapter1.id);
                  onClose();
                }}>
                Al-Fatiha
              </button>
              <button className="px-4 py-2 rounded-full border"
                style={{
                  borderColor: effectiveTheme === 'light' ? '#d1d5db' : effectiveTheme === 'sepia' ? '#d7ccc8' : '#475569',
                  color: effectiveTheme === 'light' ? '#6b7280' : effectiveTheme === 'sepia' ? '#5d4037' : '#64748b',
                }}
                onClick={() => {
                  const chapter30 = chapters.find(c => c.number === 30);
                  if (chapter30) onSelectResult(chapter30.id);
                  onClose();
                }}>
                Juz 30
              </button>
              <button className="px-4 py-2 rounded-full border"
                style={{
                  borderColor: effectiveTheme === 'light' ? '#d1d5db' : effectiveTheme === 'sepia' ? '#d7ccc8' : '#475569',
                  color: effectiveTheme === 'light' ? '#6b7280' : effectiveTheme === 'sepia' ? '#5d4037' : '#64748b',
                }}
                onClick={() => {
                  const chapter36 = chapters.find(c => c.number === 36);
                  if (chapter36) onSelectResult(chapter36.id);
                  onClose();
                }}>
                Surah Yasin
              </button>
              <button className="px-4 py-2 rounded-full border"
                style={{
                  borderColor: effectiveTheme === 'light' ? '#d1d5db' : effectiveTheme === 'sepia' ? '#d7ccc8' : '#475569',
                  color: effectiveTheme === 'light' ? '#6b7280' : effectiveTheme === 'sepia' ? '#5d4037' : '#64748b',
                }}
                onClick={() => {
                  const chapter1 = chapters.find(c => c.number === 1);
                  if (chapter1) onSelectResult(chapter1.id);
                  onClose();
                }}>
                Page 1
              </button>
            </div>
          </div>
        </div>



        {/* Results or Recent Navigation */}
        <div className="flex-1 overflow-y-auto">
          {query.trim() ? (
            <>
              {!loading && chapterResults.length === 0 ? (
                <div className="p-6 text-center" style={{color: effectiveTheme === 'light' ? '#9ca3af' : effectiveTheme === 'sepia' ? '#8d6e63' : '#64748b'}}>
                  No verses found matching "{query}"
                </div>
              ) : (
                <div className="divide-y"
                  style={{borderColor: effectiveTheme === 'light' ? '#e5e7eb' : effectiveTheme === 'sepia' ? '#d7ccc8' : '#334155'}}>
                  {chapterResults.map(result => (
                    <button
                      key={`${result.chapterId}-${result.verseNumber ?? 'chapter'}`}
                      onClick={() => {
                        onSelectResult(result.chapterId, result.verseNumber);
                        onClose();
                      }}
                      className={`w-full text-left px-4 py-4 transition-colors ${styles.result}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="font-semibold">{result.chapterName}</div>
                          <div className={`text-sm ${styles.resultSecondary}`}>
                            {result.chapterArabicName}
                            {result.verseNumber ? ` · Ayah ${result.verseNumber}` : ''}
                          </div>
                          {result.translation ? (
                            <div className={`mt-2 text-sm ${styles.resultSecondary}`}>
                              {result.translation}
                            </div>
                          ) : null}
                        </div>
                        {result.verseNumber ? (
                          <div className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                            {result.verseNumber}
                          </div>
                        ) : null}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="p-6">
              <h3 className="font-semibold mb-3" style={{color: effectiveTheme === 'light' ? '#1f2937' : effectiveTheme === 'sepia' ? '#3e2723' : '#e2e8f0'}}>
                Recent Navigation
              </h3>
              <p style={{color: effectiveTheme === 'light' ? '#9ca3af' : effectiveTheme === 'sepia' ? '#8d6e63' : '#64748b'}}>
                No recent navigation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
