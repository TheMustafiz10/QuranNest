import type { Request, Response } from 'express';
import {
  fetchChapters,
  fetchChapter,
  generateAudioUrl,
  generateChapterAudioUrls,
  getReciterById,
  AVAILABLE_RECITERS,
  searchVerseTranslations
} from '../index.js';

export function getHealth(_request: Request, response: Response) {
  response.json({
    status: 'ok',
    service: 'quran-web-app-backend'
  });
}

export async function getChapters(_request: Request, response: Response) {
  try {
    const chapters = await fetchChapters();
    response.json({
      count: chapters.length,
      data: chapters
    });
  } catch (error) {
    console.error('Error fetching chapters:', error);
    response.status(500).json({
      message: 'Failed to fetch chapters',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function getChapterById(request: Request, response: Response) {
  try {
    const chapterId = Number(request.params.id);

    if (isNaN(chapterId) || chapterId < 1 || chapterId > 114) {
      response.status(400).json({
        message: 'Invalid chapter ID. Must be between 1 and 114.'
      });
      return;
    }

    const chapterDetail = await fetchChapter(chapterId);
    const audioUrls = generateChapterAudioUrls(
      chapterId,
      chapterDetail.verses_count
    );

    response.json({
      data: {
        ...chapterDetail,
        audioUrls
      }
    });
  } catch (error) {
    console.error(`Error fetching chapter:`, error);
    response.status(404).json({
      message: 'Chapter not found',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function searchVerses(request: Request, response: Response) {
  try {
    const query = String(request.query.q ?? '').trim();

    if (!query) {
      response.json({ data: [] });
      return;
    }

    const results = await searchVerseTranslations(query);
    response.json({
      query,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error searching verses:', error);
    response.status(500).json({
      message: 'Failed to search verses',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function getVerseAudio(request: Request, response: Response) {
  try {
    const chapter = Number(request.params.chapter);
    const verse = Number(request.params.verse);
    const reciterId = (request.query.reciter as string) || 'abdul_samad';

    if (isNaN(chapter) || chapter < 1 || chapter > 114) {
      response.status(400).json({
        message: 'Invalid chapter number. Must be between 1 and 114.'
      });
      return;
    }

    if (isNaN(verse) || verse < 1) {
      response.status(400).json({
        message: 'Invalid verse number. Must be positive.'
      });
      return;
    }

    const audioUrl = generateAudioUrl(chapter, verse, reciterId);
    const reciter = getReciterById(reciterId);

    response.json({
      data: {
        chapter,
        verse,
        audioUrl,
        reciter
      }
    });
  } catch (error) {
    console.error('Error generating audio URL:', error);
    response.json({
      message: 'Failed to generate audio URL',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export function getAvailableReciters(_request: Request, response: Response) {
  response.json({
    data: AVAILABLE_RECITERS
  });
}