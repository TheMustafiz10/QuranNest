export interface Chapter {
  id: number;
  number: number;
  name: string;
  name_arabic: string;
  meaning_en: string;
  type?: 'meccan' | 'medinan';
  verses_count: number;
  link?: string;
}



export interface Verse {
  id?: number;
  number: number;
  text: string;
  transliteration?: string;
  translation: string;
  translation_text?: string;
}


export interface ChapterDetail {
  id: number;
  number: number;
  name: string;
  name_arabic: string;
  meaning_en: string;
  type?: 'meccan' | 'medinan';
  verses_count: number;
  verses: Verse[];
  audioUrls?: Record<number, string>;
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


export interface AudioReciter {
  id: string;
  name: string;
  folder: string;
}


export interface FontSettings {
  arabicFont: 'kfgq' | 'amiri' | 'scheherazade';
  arabicFontSize: number;
  translationFontSize: number;
  lineHeight: number;
}
