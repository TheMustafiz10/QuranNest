'use client';

import { X, Search } from 'lucide-react';
import { useState } from 'react';
import type { Chapter } from '@/types/quran';

interface SearchPanelProps {
  chapters: Chapter[];
  onSelectChapter: (id: number) => void;
  onClose: () => void;
}

export function SearchPanel({
  chapters,
  onSelectChapter,
  onClose
}: SearchPanelProps) {
  const [query, setQuery] = useState('');

  const filtered = chapters.filter((chapter) =>
    chapter.name.toLowerCase().includes(query.toLowerCase()) ||
    chapter.name_arabic.toLowerCase().includes(query.toLowerCase()) ||
    chapter.meaning_en.toLowerCase().includes(query.toLowerCase()) ||
    chapter.number.toString().includes(query)
  );

  const handleSelect = (id: number) => {
    onSelectChapter(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-20">
      <div className="w-full max-w-2xl rounded-2xl bg-slate-900 shadow-2xl overflow-hidden">
        <div className="border-b border-white/10 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search chapters..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-800 text-white placeholder-slate-500 rounded-lg pl-10 pr-10 py-2 outline-none focus:ring-2 focus:ring-sand-500"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>



        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {filtered.length > 0 ? (
            <div className="divide-y divide-white/10">
              {filtered.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => handleSelect(chapter.id)}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">
                        {chapter.name}
                      </p>
                      <p className="text-sm text-slate-400">
                        {chapter.meaning_en}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sand-400 font-bold">{chapter.number}</p>
                      <p className="text-xs text-slate-500">
                        {chapter.verses_count} verses
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400">
              No chapters found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
