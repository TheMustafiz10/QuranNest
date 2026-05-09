'use client';

import { cn } from '@/utils/cn';
import type { Chapter } from '@/types/quran';

interface SurahSidebarProps {
  chapters: Chapter[];
  selectedChapterId: number | null;
  onSelectChapter: (id: number) => void;
}

export function SurahSidebar({
  chapters,
  selectedChapterId,
  onSelectChapter
}: SurahSidebarProps) {
  return (
    <div className="flex h-screen flex-col border-r border-white/10 bg-slate-900/50 w-64 lg:w-72">
      <div className="border-b border-white/10 px-4 py-6">
        <h2 className="text-lg font-semibold text-white">القرآن الكريم</h2>
        <p className="text-xs text-slate-400 mt-1">Quran Majeed</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {chapters.map((chapter) => (
            <button
              key={chapter.id}
              onClick={() => onSelectChapter(chapter.id)}
              className={cn(
                'w-full text-left rounded-lg px-3 py-3 transition-colors duration-200',
                selectedChapterId === chapter.id
                  ? 'bg-sand-500/30 text-sand-200'
                  : 'text-slate-300 hover:bg-white/5'
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-right leading-tight">
                    {chapter.name}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                      {chapter.meaning_en}
                  </p>
                </div>
                <span className="text-xs font-semibold text-sand-400 flex-shrink-0">
                    {chapter.number}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
