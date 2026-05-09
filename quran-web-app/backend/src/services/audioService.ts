export interface AudioReciter {
  id: string;
  name: string;
  folder: string;
}

export const AVAILABLE_RECITERS: AudioReciter[] = [
  {
    id: 'abdul_samad',
    name: 'Abdul Basit Abdul Samad (64kbps)',
    folder: 'AbdulSamad_64kbps_QuranExplorer.Com'
  },
  {
    id: 'abdul_samad_128',
    name: 'Abdul Basit Abdul Samad (128kbps)',
    folder: 'AbdulSamad_128kbps'
  }
];

const EVERYAYAH_BASE_URL = 'https://everyayah.com/data';


export function generateAudioUrl(
  chapter: number,
  verse: number,
  reciterId: string = 'abdul_samad'
): string {
  const reciter = AVAILABLE_RECITERS.find((r) => r.id === reciterId);
  if (!reciter) {
    throw new Error(`Reciter not found: ${reciterId}`);
  }


  
  const chapterStr = String(chapter).padStart(3, '0');
  const verseStr = String(verse).padStart(3, '0');

  return `${EVERYAYAH_BASE_URL}/${reciter.folder}/${chapterStr}${verseStr}.mp3`;
}




export function generateChapterAudioUrls(
  chapter: number,
  totalVerses: number,
  reciterId: string = 'abdul_samad'
): Record<number, string> {
  const urls: Record<number, string> = {};

  for (let verse = 1; verse <= totalVerses; verse++) {
    urls[verse] = generateAudioUrl(chapter, verse, reciterId);
  }

  return urls;
}


export function getReciterById(reciterId: string): AudioReciter | undefined {
  return AVAILABLE_RECITERS.find((r) => r.id === reciterId);
}
