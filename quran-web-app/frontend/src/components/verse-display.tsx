'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bookmark, Copy, Ellipsis, Link2, Pause, Play, Share2, Building2, Landmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/context/theme-context';
import type { ChapterDetail, FontSettings } from '@/types/quran';

const ARABIC_FONTS: Record<FontSettings['arabicFont'], string> = {
  kfgq: '"Noto Naskh Arabic", "Amiri Quran", "Amiri", serif',
  amiri: '"Amiri Quran", "Amiri", "Noto Naskh Arabic", serif',
  scheherazade: '"Scheherazade New", "Scheherazade", serif'
};

interface VerseDisplayProps {
  chapter: ChapterDetail;
  fontSettings: FontSettings;
  onToggleAudio: (verse: number) => void;
  activeVerseNumber?: number | null;
  isActiveVersePaused?: boolean;
  focusVerseNumber?: number | null;
  hasPreviousChapter?: boolean;
  hasNextChapter?: boolean;
  onPreviousChapter?: () => void;
  onNextChapter?: () => void;
}

export function VerseDisplay({
  chapter,
  fontSettings,
  onToggleAudio,
  activeVerseNumber,
  isActiveVersePaused,
  focusVerseNumber,
  hasPreviousChapter,
  hasNextChapter,
  onPreviousChapter,
  onNextChapter
}: VerseDisplayProps) {
  const { effectiveTheme } = useTheme();
  const [openMenuVerse, setOpenMenuVerse] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const shareBaseUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}/reader?chapter=${chapter.number}`;
  }, [chapter.number]);

  React.useEffect(() => {
    if (!focusVerseNumber) return;

    const target = document.getElementById(`verse-${focusVerseNumber}`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [focusVerseNumber, chapter.id]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuVerse(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  const handleCopyAyah = async (verseNumber: number, verseText: string) => {
    await navigator.clipboard.writeText(`${chapter.number}:${verseNumber} ${verseText}`);
    setOpenMenuVerse(null);
  };

  const handleCopyLink = async (verseNumber: number) => {
    await navigator.clipboard.writeText(`${shareBaseUrl}&verse=${verseNumber}`);
    setOpenMenuVerse(null);
  };

  const handleShareAyah = async (verseNumber: number, verseText: string) => {
    const shareData = {
      title: `${chapter.name} ${chapter.number}:${verseNumber}`,
      text: `${chapter.number}:${verseNumber} ${verseText}`,
      url: `${shareBaseUrl}&verse=${verseNumber}`
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
    }

    setOpenMenuVerse(null);
  };

  const getThemeStyles = () => {
    switch (effectiveTheme) {
      case 'light':
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-900',
          secondary: 'text-gray-700',
          headerBg: 'bg-gradient-to-b from-green-50 to-white border-b-2 border-green-200',
          headerBorder: 'border-green-200',
          verseBg: 'bg-white border-l-4 border-green-400 hover:shadow-md',
          verseNumber: 'text-green-600 font-bold',
          button: 'bg-green-500 text-white hover:bg-green-600'
        };
      case 'sepia':
        return {
          bg: 'bg-[#faf6f0]',
          text: 'text-[#3e2723]',
          secondary: 'text-[#4e342e]',
          headerBg: 'bg-gradient-to-b from-[#e1c4aa] to-[#f1e4d4] border-b-2 border-[#c97c44]',
          headerBorder: 'border-[#c97c44]',
          verseBg: 'bg-[#f5ede0] border-l-4 border-[#c97c44] hover:shadow-md',
          verseNumber: 'text-[#c97c44] font-bold',
          button: 'bg-[#c97c44] text-white hover:bg-[#b8703b]'
        };
      case 'dark':
      default:
        return {
          bg: 'bg-slate-900',
          text: 'text-slate-50',
          secondary: 'text-slate-200',
          headerBg: 'bg-gradient-to-b from-emerald-900/40 to-slate-900 border-b-2 border-emerald-500',
          headerBorder: 'border-emerald-500',
          verseBg: 'bg-slate-800 border-l-4 border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/20',
          verseNumber: 'text-emerald-400 font-bold',
          button: 'bg-emerald-600 text-white hover:bg-emerald-500'
        };
    }
  };

  const styles = getThemeStyles();
  const locationLabel = chapter.type === 'medinan' ? 'Madinah' : 'Makkah';
  const arabicFontFamily = ARABIC_FONTS[fontSettings.arabicFont];

  return (
    <div className={`flex h-full flex-1 flex-col overflow-y-auto ${styles.bg}`}>
      <div className={`border-b px-6 py-8 backdrop-blur-sm lg:px-8 ${styles.headerBg}`}>
        <div className={`mx-auto flex w-full max-w-[1120px] items-center gap-6 ${
          chapter.number === 1 ? 'justify-center' : 'justify-between'
        }`}>
          {chapter.number !== 1 && (
            <div className={`hidden h-24 w-40 items-end justify-center rounded-xl lg:flex ${
              effectiveTheme === 'dark' ? 'text-slate-600' : effectiveTheme === 'sepia' ? 'text-[#bfae98]' : 'text-[#d4d8d0]'
            }`}>
              {chapter.type === 'medinan' ? (
                <Landmark className="h-16 w-16" strokeWidth={1.4} />
              ) : (
                <Building2 className="h-16 w-16" strokeWidth={1.4} />
              )}
            </div>
          )}

          <div className="text-center">
            <h1 className={`font-display text-[30px] font-bold tracking-[-0.02em] ${styles.text}`}>Surah {chapter.name}</h1>
            <p className={`mt-2 text-sm font-semibold ${styles.text}`} style={{opacity: 0.7}}>{chapter.name_arabic}</p>
            <p className={`mt-1 text-sm ${styles.secondary}`}>{chapter.verses_count} Ayah, {locationLabel}</p>
          </div>

          {chapter.number !== 1 && (
            <div
              className={`hidden min-w-[290px] text-right text-[44px] leading-none lg:block ${
                effectiveTheme === 'dark' ? 'text-slate-300' : effectiveTheme === 'sepia' ? 'text-[#74685b]' : 'text-[#8e8f90]'
              }`}
              style={{ fontFamily: '"Amiri Quran", "Amiri", serif' }}
              aria-label="Bismillah"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          )}
        </div>
      </div>

      <div className={`px-5 py-0 lg:px-10 ${styles.bg}`}>
        <div className="mx-auto max-w-[1040px]">
          {chapter.verses.length === 0 ? (
            <div className={`flex h-full items-center justify-center ${styles.text}`}>
              <p>No verses found</p>
            </div>
          ) : (
            chapter.verses.map((verse, index) => {
              const verseNumber = verse.number ?? index + 1;

              return (
              <div
                key={verseNumber}
                id={`verse-${verseNumber}`}
                className={`grid grid-cols-[76px_minmax(0,1fr)] gap-5 border-t py-8 first:border-t-0 ${
                  effectiveTheme === 'dark' ? 'border-slate-700' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8]' : 'border-[#f0f0f0]'
                }`}
            >
              <div
                ref={openMenuVerse === verseNumber ? menuRef : undefined}
                className={`relative flex flex-col items-center gap-3 pt-2 ${
                  effectiveTheme === 'dark' ? 'text-emerald-400' : effectiveTheme === 'sepia' ? 'text-[#c97c44]' : 'text-[#4a8b3a]'
                }`}
              >
                <span className="text-[18px] font-semibold text-center">{chapter.number}:{verseNumber}</span>
                <div className="flex flex-col gap-3 items-center">
                  <button
                    type="button"
                    onClick={() => onToggleAudio(verseNumber)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                      effectiveTheme === 'dark' ? 'border-slate-600 text-slate-400 hover:border-emerald-500 hover:text-emerald-400' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] text-[#8d6e63] hover:border-[#c97c44] hover:text-[#c97c44]' : 'border-[#e6ebe1] text-[#6b7280] hover:border-[#4a8b3a] hover:text-[#4a8b3a]'
                    }`}
                    aria-label="Play verse audio"
                  >
                    {activeVerseNumber === verseNumber && !isActiveVersePaused ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                  </button>
                  <button type="button" className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                    effectiveTheme === 'dark' ? 'border-slate-600 text-slate-400 hover:border-emerald-500 hover:text-emerald-400' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] text-[#8d6e63] hover:border-[#c97c44] hover:text-[#c97c44]' : 'border-[#e6ebe1] text-[#6b7280] hover:border-[#4a8b3a] hover:text-[#4a8b3a]'
                  }`} aria-label="Bookmark verse">
                    <Bookmark className="h-3.5 w-3.5" />
                  </button>
                  <div className="relative" ref={openMenuVerse === verseNumber ? menuRef : undefined}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenuVerse(current => (current === verseNumber ? null : verseNumber));
                      }}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors ${
                        effectiveTheme === 'dark' ? 'border-slate-600 text-slate-400 hover:border-emerald-500 hover:text-emerald-400' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] text-[#8d6e63] hover:border-[#c97c44] hover:text-[#c97c44]' : 'border-[#e6ebe1] text-[#6b7280] hover:border-[#4a8b3a] hover:text-[#4a8b3a]'
                      }`}
                      aria-label="More actions"
                      aria-expanded={openMenuVerse === verseNumber}
                    >
                      <Ellipsis className="h-3.5 w-3.5" />
                    </button>

                    {openMenuVerse === verseNumber && (
                      <div className={`absolute left-11 top-0 z-30 w-48 rounded-2xl border p-2 shadow-[0_12px_35px_rgba(15,23,42,0.12)] ${
                        effectiveTheme === 'dark' ? 'border-slate-600 bg-slate-800' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] bg-[#f1e4d4]' : 'border-[#e9ece2] bg-white'
                      }`}>
                        <button
                          type="button"
                          onClick={() => handleCopyAyah(verseNumber, verse.text)}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                            effectiveTheme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : effectiveTheme === 'sepia' ? 'text-[#3e2723] hover:bg-[#ede6da]' : 'text-slate-700 hover:bg-[#f5f7f1]'
                          }`}
                        >
                          <Copy className={`h-4 w-4 ${
                            effectiveTheme === 'dark' ? 'text-slate-400' : effectiveTheme === 'sepia' ? 'text-[#8d6e63]' : 'text-slate-500'
                          }`} />
                          Ayah Copy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(verseNumber)}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                            effectiveTheme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : effectiveTheme === 'sepia' ? 'text-[#3e2723] hover:bg-[#ede6da]' : 'text-slate-700 hover:bg-[#f5f7f1]'
                          }`}
                        >
                          <Link2 className={`h-4 w-4 ${
                            effectiveTheme === 'dark' ? 'text-slate-400' : effectiveTheme === 'sepia' ? 'text-[#8d6e63]' : 'text-slate-500'
                          }`} />
                          Copy Link
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShareAyah(verseNumber, verse.text)}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                            effectiveTheme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : effectiveTheme === 'sepia' ? 'text-[#3e2723] hover:bg-[#ede6da]' : 'text-slate-700 hover:bg-[#f5f7f1]'
                          }`}
                        >
                          <Share2 className={`h-4 w-4 ${
                            effectiveTheme === 'dark' ? 'text-slate-400' : effectiveTheme === 'sepia' ? 'text-[#8d6e63]' : 'text-slate-500'
                          }`} />
                          Ayah Share
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="min-w-0">
                <div
                  className={`text-right leading-[2.08] font-semibold ${
                    effectiveTheme === 'dark' ? 'text-slate-100' : effectiveTheme === 'sepia' ? 'text-[#3e2723]' : 'text-slate-900'
                  }`}
                  style={{
                    fontFamily: arabicFontFamily,
                    fontSize: `${fontSettings.arabicFontSize}px`,
                    lineHeight: fontSettings.lineHeight
                  }}
                >
                  {verse.text}
                </div>

                <div className="mt-5 text-left">
                  <p className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                    effectiveTheme === 'dark' ? 'text-slate-400' : effectiveTheme === 'sepia' ? 'text-[#8d6e63]' : 'text-[#7c8a7b]'
                  }`}>
                    Saheeh International
                  </p>
                  <p
                    className={`mt-3 text-[15px] leading-8 ${styles.secondary}`}
                    style={{
                      fontSize: `${fontSettings.translationFontSize}px`,
                      lineHeight: fontSettings.lineHeight
                    }}
                  >
                    {verse.translation}
                  </p>
                </div>
              </div>
            </div>
              );
            })
          )}

          <div className="flex items-center justify-center py-8">
            <div className={`inline-flex items-center rounded-full p-1 ${
              effectiveTheme === 'dark' ? 'bg-slate-800' : effectiveTheme === 'sepia' ? 'bg-[#ece3d8]' : 'bg-[#f1f2ee]'
            }`}>
              <button
                type="button"
                onClick={onPreviousChapter}
                disabled={!hasPreviousChapter}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  hasPreviousChapter
                    ? effectiveTheme === 'dark' ? 'text-slate-300 hover:bg-slate-700' : effectiveTheme === 'sepia' ? 'text-[#74685b] hover:bg-[#e3d7c8]' : 'text-slate-500 hover:bg-white'
                    : 'cursor-not-allowed text-slate-400/60'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>
              <div className={`mx-1 h-5 w-px ${
                effectiveTheme === 'dark' ? 'bg-slate-700' : effectiveTheme === 'sepia' ? 'bg-[#d7ccc8]' : 'bg-[#dfe3dc]'
              }`} />
              <button
                type="button"
                onClick={onNextChapter}
                disabled={!hasNextChapter}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                  hasNextChapter
                    ? effectiveTheme === 'dark' ? 'text-emerald-300 hover:bg-slate-700' : effectiveTheme === 'sepia' ? 'text-[#3e2723] hover:bg-[#e3d7c8]' : 'text-slate-700 hover:bg-white'
                    : 'cursor-not-allowed text-slate-400/60'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
