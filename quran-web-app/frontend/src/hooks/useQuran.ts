import { useState, useEffect } from 'react';
import type { Chapter, ChapterDetail, FontSettings, VerseSearchResult } from '@/types/quran';



const API_BASE_CANDIDATES = [
  process.env.NEXT_PUBLIC_API_URL,
  ...(process.env.NODE_ENV === 'production'
    ? []
    : [
        ...Array.from({ length: 11 }, (_value, index) => `http://localhost:${5000 + index}/api`),
        'http://localhost:4000/api'
      ])
].filter((value): value is string => Boolean(value));



export async function resolveApiBase(): Promise<string | null> {
  for (const candidate of API_BASE_CANDIDATES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const [chaptersResponse, chapterResponse] = await Promise.all([
        fetch(`${candidate}/chapters`, { signal: controller.signal }),
        fetch(`${candidate}/chapters/1`, { signal: controller.signal })
      ]);
      
      clearTimeout(timeoutId);

      if (chaptersResponse.ok && chapterResponse.ok) {
        return candidate;
      }
    } catch (error) {
      console.debug(`API candidate ${candidate} failed:`, error);
    }
  }

  return null;
}



const DEFAULT_FONT_SETTINGS: FontSettings = {
  arabicFont: 'kfgq',
  arabicFontSize: 28,
  translationFontSize: 16,
  lineHeight: 1.8
};


export function useFontSettings() {
  const [settings, setSettings] = useState<FontSettings>(DEFAULT_FONT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('quran-font-settings');
    if (stored) {
      try {
        setSettings(JSON.parse(stored));
      } catch {
        setSettings(DEFAULT_FONT_SETTINGS);
      }
    }
  }, []);


  const updateSettings = (newSettings: Partial<FontSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('quran-font-settings', JSON.stringify(updated));
  };

  return { settings, updateSettings, mounted };
}


export function useChapters() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiBase, setApiBase] = useState<string | null>(null);

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const resolvedApiBase = apiBase ?? await resolveApiBase();

        if (!resolvedApiBase) {
          throw new Error('Unable to connect to the Quran API');
        }

        setApiBase(resolvedApiBase);

        const response = await fetch(`${resolvedApiBase}/chapters`);
        if (!response.ok) throw new Error('Failed to fetch chapters');
        const data = await response.json();
        setChapters(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, []);

  return { chapters, loading, error };
}


export function useChapterDetail(chapterId: number | null) {
  const [detail, setDetail] = useState<ChapterDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiBase, setApiBase] = useState<string | null>(null);

  useEffect(() => {
    if (!chapterId) return;

    const fetchChapter = async () => {
      setLoading(true);
      try {
        const resolvedApiBase = apiBase ?? await resolveApiBase();

        if (!resolvedApiBase) {
          throw new Error('Unable to connect to the Quran API');
        }

        setApiBase(resolvedApiBase);

        const response = await fetch(`${resolvedApiBase}/chapters/${chapterId}`);
        if (!response.ok) throw new Error('Failed to fetch chapter');
        const data = await response.json();
        setDetail(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId]);

  return { detail, loading, error };
}



export function useVerseSearch(query: string) {
  const [results, setResults] = useState<VerseSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setLoading(false);
      setError(null);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setLoading(true);
      try {
        const apiBase = await resolveApiBase();

        if (!apiBase) {
          throw new Error('Unable to connect to the Quran API');
        }

        const response = await fetch(`${apiBase}/search?q=${encodeURIComponent(trimmed)}`);
        if (!response.ok) {
          throw new Error('Failed to search verses');
        }

        const data = await response.json();
        if (active) {
          setResults(data.data ?? []);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setResults([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  return { results, loading, error };
}
