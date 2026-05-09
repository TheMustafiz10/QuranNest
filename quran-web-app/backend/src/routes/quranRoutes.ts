import { Router } from 'express';
import {
  getHealth,
  getChapters,
  getChapterById,
  getVerseAudio,
  getAvailableReciters,
  searchVerses
} from '../controllers/quranController.js';

export const apiRouter = Router();

apiRouter.get('/health', getHealth);
apiRouter.get('/chapters', getChapters);
apiRouter.get('/chapters/:id', getChapterById);
apiRouter.get('/search', searchVerses);
apiRouter.get('/verse/:chapter/:verse/audio', getVerseAudio);
apiRouter.get('/reciters', getAvailableReciters);