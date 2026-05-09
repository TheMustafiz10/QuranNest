export interface Chapter {
  id: number;
  number: number;
  name: string;
  name_arabic: string;
  meaning_en: string;
  type: 'meccan' | 'medinan';
  verses_count: number;
  link?: string;
}



export interface ChapterDetail {
  id: number;
  number: number;
  name: string;
  name_arabic: string;
  meaning_en: string;
  type: 'meccan' | 'medinan';
  verses_count: number;
  verses: Array<{
    number: number;
    text: string;
    transliteration?: string;
    translation: string;
  }>;
}




export interface VerseSearchResult {
  chapterId: number;
  chapterNumber: number;
  chapterName: string;
  chapterArabicName: string;
  verseNumber: number;
  verseText: string;
  translation: string;
}


const QURAN_JSON_CDN = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist';
const chapterCache = new Map<number, ChapterDetail>();


function normalizeChapter(chapter: {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'meccan' | 'medinan';
  total_verses: number;
  link?: string;
}): Chapter {
  return {
    id: chapter.id,
    number: chapter.id,
    name: chapter.transliteration,
    name_arabic: chapter.name,
    meaning_en: chapter.translation,
    type: chapter.type,
    verses_count: chapter.total_verses,
    link: chapter.link
  };
}




function normalizeChapterDetail(chapter: {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'meccan' | 'medinan';
  total_verses: number;
  verses: Array<{
    number: number;
    text: string;
    transliteration?: string;
    translation?: string;
  }>;
}): ChapterDetail {
  return {
    id: chapter.id,
    number: chapter.id,
    name: chapter.transliteration,
    name_arabic: chapter.name,
    meaning_en: chapter.translation,
    type: chapter.type,
    verses_count: chapter.total_verses,
    verses: chapter.verses.map(verse => ({
      number: verse.number,
      text: verse.text,
      transliteration: verse.transliteration,
      translation: verse.translation ?? ''
    }))
  };
}






export async function fetchChapters(): Promise<Chapter[]> {
  try {
    const response = await fetch(`${QURAN_JSON_CDN}/chapters/en/index.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chapters: ${response.statusText}`);
    }
    const data = (await response.json()) as Array<{
      id: number;
      name: string;
      transliteration: string;
      translation: string;
      type: 'meccan' | 'medinan';
      total_verses: number;
      link?: string;
    }>;

    return data.map(normalizeChapter);
  } catch (error) {
    console.error('Error fetching chapters from quran-json:', error);
    throw error;
  }
}





export async function fetchChapter(chapterId: number): Promise<ChapterDetail> {
  try {
    const response = await fetch(`${QURAN_JSON_CDN}/chapters/en/${chapterId}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch chapter ${chapterId}`);
    }
    const data = (await response.json()) as {
      id: number;
      name: string;
      transliteration: string;
      translation: string;
      type: 'meccan' | 'medinan';
      total_verses: number;
      verses: Array<{
        number: number;
        text: string;
        transliteration?: string;
        translation?: string;
      }>;
    };

    const normalized = normalizeChapterDetail(data);
    chapterCache.set(chapterId, normalized);
    return normalized;
  } catch (error) {
    console.error(`Error fetching chapter ${chapterId} from quran-json:`, error);
    throw error;
  }
}





export async function fetchVerse(verseNumber: number) {
  try {
    const response = await fetch(`${QURAN_JSON_CDN}/verses/${verseNumber}.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch verse ${verseNumber}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching verse ${verseNumber} from quran-json:`, error);
    throw error;
  }
}

async function fetchChapterCached(chapterId: number): Promise<ChapterDetail> {
  const cached = chapterCache.get(chapterId);
  if (cached) {
    return cached;
  }

  return fetchChapter(chapterId);
}





export async function searchVerseTranslations(query: string): Promise<VerseSearchResult[]> {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const chapters = await fetchChapters();
  const results: VerseSearchResult[] = [];

  for (const chapter of chapters) {
    const detail = await fetchChapterCached(chapter.id);

    for (const verse of detail.verses) {
      const translation = verse.translation.toLowerCase();
      if (translation.includes(normalizedQuery)) {
        results.push({
          chapterId: detail.id,
          chapterNumber: detail.number,
          chapterName: detail.name,
          chapterArabicName: detail.name_arabic,
          verseNumber: verse.number,
          verseText: verse.text,
          translation: verse.translation
        });
      }
    }
  }

  return results.slice(0, 50);
}
