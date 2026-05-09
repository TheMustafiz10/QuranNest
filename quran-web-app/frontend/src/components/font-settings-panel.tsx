'use client';

import { X } from 'lucide-react';
import type { FontSettings } from '@/types/quran';

interface FontSettingsPanelProps {
  settings: FontSettings;
  onUpdateSettings: (settings: Partial<FontSettings>) => void;
  onClose: () => void;
}

const ARABIC_FONTS = [
  { id: 'kfgq', name: 'KFGQ' },
  { id: 'amiri', name: 'Amiri' },
  { id: 'scheherazade', name: 'Scheherazade' }
] as const;


export function FontSettingsPanel({
  settings,
  onUpdateSettings,
  onClose
}: FontSettingsPanelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Font Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Arabic Font
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ARABIC_FONTS.map((font) => (
                <button
                  key={font.id}
                  onClick={() =>
                    onUpdateSettings({
                      arabicFont: font.id as FontSettings['arabicFont']
                    })
                  }
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition ${
                    settings.arabicFont === font.id
                      ? 'bg-sand-500 text-white'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>



          {/* Arabic Font Size */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-300">
                Arabic Font Size
              </label>
              <span className="text-sm text-sand-400 font-semibold">
                {settings.arabicFontSize}px
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="40"
              value={settings.arabicFontSize}
              onChange={(e) =>
                onUpdateSettings({ arabicFontSize: Number(e.target.value) })
              }
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sand-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>20px</span>
              <span>40px</span>
            </div>
          </div>



          {/* Translation Font Size */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-300">
                Translation Font Size
              </label>
              <span className="text-sm text-sand-400 font-semibold">
                {settings.translationFontSize}px
              </span>
            </div>
            <input
              type="range"
              min="12"
              max="24"
              value={settings.translationFontSize}
              onChange={(e) =>
                onUpdateSettings({ translationFontSize: Number(e.target.value) })
              }
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sand-500"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>12px</span>
              <span>24px</span>
            </div>
          </div>
          

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-lg bg-sand-500 text-white font-medium hover:bg-sand-600 transition mt-8"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
