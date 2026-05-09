'use client';

import { useEffect, useRef, useState } from 'react';
import { House, Grid2x2, Send, Bookmark, LayoutGrid, Pause, Play, SkipBack, SkipForward, X, Ellipsis } from 'lucide-react';
import { TopHeader } from '@/components/top-header';
import { LeftSidebar } from '@/components/left-sidebar';
import { VerseDisplay } from '@/components/verse-display';
import { RightSidebar } from '@/components/right-sidebar';
import { SearchModal } from '@/components/search-modal';
import { useChapters, useChapterDetail, useFontSettings } from '@/hooks/useQuran';
import { useTheme } from '@/context/theme-context';


export default function ReaderPage() {
  const { effectiveTheme } = useTheme();
  const { chapters, loading: chaptersLoading } = useChapters();
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(1);
  const [selectedVerseNumber, setSelectedVerseNumber] = useState<number | null>(null);
  const { detail: chapterDetail, loading: detailLoading } =
    useChapterDetail(selectedChapterId);
  const { settings, updateSettings, mounted } = useFontSettings();
  const [showSearch, setShowSearch] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<'chapters' | 'settings' | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingVerse, setPlayingVerse] = useState<{ chapterId: number; verse: number } | null>(null);
  const [isAudioPaused, setIsAudioPaused] = useState(true);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [pendingPlayback, setPendingPlayback] = useState<{ chapterId: number; verse: number } | null>(null);

  const handleSelectChapter = (chapterId: number, verseNumber?: number | null) => {
    setSelectedChapterId(chapterId);
    setSelectedVerseNumber(verseNumber ?? null);
    setShowSearch(false);
    setMobilePanel(null);
  };

  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audio.crossOrigin = 'anonymous';

    const handleEnded = () => {
      console.log('Audio ended');
      audio.currentTime = 0;
      setPlayingVerse(null);
      setIsAudioPaused(true);
      setAudioCurrentTime(0);
    };
    const handleError = () => {
      console.error('Audio error:', audio.error);
      setPlayingVerse(null);
      setIsAudioPaused(true);
    };
    const handleTimeUpdate = () => setAudioCurrentTime(audio.currentTime || 0);
    const handleLoadedMetadata = () => setAudioDuration(audio.duration || 0);
    const handlePause = () => setIsAudioPaused(true);
    const handlePlay = () => setIsAudioPaused(false);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    audioRef.current?.pause();
    setPlayingVerse(null);
    setIsAudioPaused(true);
    setAudioCurrentTime(0);
    setAudioDuration(0);
  }, [selectedChapterId]);

  const playVerse = (verse: number, restartFromBeginning = true) => {
    if (!chapterDetail?.audioUrls) return;

    const audioUrl = chapterDetail.audioUrls[verse];
    const audio = audioRef.current;

    if (!audio || !audioUrl) return;

    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
      audio.load();
    }

    if (restartFromBeginning) {
      audio.currentTime = 0;
    }

    audio
      .play()
      .then(() => {
        setPlayingVerse({ chapterId: chapterDetail.id, verse });
        setIsAudioPaused(false);
      })
      .catch((err) => {
        console.error('Play error:', err);
        setPlayingVerse(null);
        setIsAudioPaused(true);
      });
  };

  useEffect(() => {
    if (!pendingPlayback || !chapterDetail) return;

    if (chapterDetail.id === pendingPlayback.chapterId) {
      playVerse(pendingPlayback.verse, true);
      setPendingPlayback(null);
    }
  }, [pendingPlayback, chapterDetail]);

  const handleToggleAudio = (verse: number) => {
    const audio = audioRef.current;
    if (!audio || !chapterDetail) return;

    const isSameVerse =
      playingVerse?.chapterId === chapterDetail.id && playingVerse.verse === verse;

    if (isSameVerse) {
      if (audio.paused) {
        void audio.play();
        setIsAudioPaused(false);
      } else {
        audio.pause();
        setIsAudioPaused(true);
      }
      return;
    }

    playVerse(verse, true);
  };

  const formatTime = (seconds: number) => {
    const safe = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
    const minutes = Math.floor(safe / 60);
    const remainingSeconds = safe % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const nowPlayingChapter = chapterDetail && playingVerse?.chapterId === chapterDetail.id ? chapterDetail : null;
  const nowPlayingVerse = playingVerse?.verse ?? null;

  const handleSeekAudio = (nextSeconds: number) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(nextSeconds)) return;
    
    audio.currentTime = Math.max(0, Math.min(nextSeconds, audio.duration || 0));
    setAudioCurrentTime(audio.currentTime);
  };

  const handlePlayPrevious = () => {
    if (!chapters.length) return;

    if (nowPlayingChapter && nowPlayingVerse) {
      if (nowPlayingVerse > 1) {
        playVerse(nowPlayingVerse - 1, true);
        return;
      }

      const currentIndex = chapters.findIndex(ch => ch.id === nowPlayingChapter.id);
      if (currentIndex > 0) {
        const previousChapter = chapters[currentIndex - 1];
        setPendingPlayback({ chapterId: previousChapter.id, verse: previousChapter.verses_count });
        handleSelectChapter(previousChapter.id, previousChapter.verses_count);
      }
      return;
    }

    if (chapterDetail) {
      const currentIndex = chapters.findIndex(ch => ch.id === chapterDetail.id);
      if (currentIndex > 0) {
        const previousChapter = chapters[currentIndex - 1];
        handleSelectChapter(previousChapter.id);
      }
    }
  };

  const handlePlayNext = () => {
    if (!chapters.length) return;

    if (nowPlayingChapter && nowPlayingVerse) {
      if (nowPlayingVerse < nowPlayingChapter.verses_count) {
        playVerse(nowPlayingVerse + 1, true);
        return;
      }

      const currentIndex = chapters.findIndex(ch => ch.id === nowPlayingChapter.id);
      if (currentIndex >= 0 && currentIndex < chapters.length - 1) {
        const nextChapter = chapters[currentIndex + 1];
        setPendingPlayback({ chapterId: nextChapter.id, verse: 1 });
        handleSelectChapter(nextChapter.id, 1);
      }
      return;
    }

    if (chapterDetail) {
      const currentIndex = chapters.findIndex(ch => ch.id === chapterDetail.id);
      if (currentIndex >= 0 && currentIndex < chapters.length - 1) {
        const nextChapter = chapters[currentIndex + 1];
        handleSelectChapter(nextChapter.id);
      }
    }
  };

  const closePlayer = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setAudioCurrentTime(0);
    setAudioDuration(0);
    setPlayingVerse(null);
    setIsAudioPaused(true);
  };

  if (!mounted || chaptersLoading) {
    return (
      <div className={`flex h-screen items-center justify-center ${
        effectiveTheme === 'dark' ? 'bg-[#070a0f]' : effectiveTheme === 'sepia' ? 'bg-[#f5ede0]' : 'bg-[#f4f5ef]'
      }`}>
        <div className="text-center">
          <div className={`inline-block h-8 w-8 animate-spin rounded-full border-4 ${
            effectiveTheme === 'dark' ? 'border-slate-700 border-t-emerald-500' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] border-t-[#c97c44]' : 'border-[#e1e7da] border-t-[#4a8b3a]'
          }`}></div>
          <p className={`mt-4 text-sm ${
            effectiveTheme === 'dark' ? 'text-slate-400' : effectiveTheme === 'sepia' ? 'text-[#8d6e63]' : 'text-slate-500'
          }`}>Loading Quran...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex h-screen flex-col overflow-hidden ${
      effectiveTheme === 'dark' ? 'bg-[#070a0f] text-slate-100' : effectiveTheme === 'sepia' ? 'bg-[#f5ede0] text-[#3e2723]' : 'bg-[#f4f5ef] text-slate-900'
    }`}>
      <div className={`pointer-events-none absolute inset-0 ${
        effectiveTheme === 'dark'
          ? 'bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_30%),radial-gradient(circle_at_top_right,rgba(6,78,59,0.08),transparent_26%)]'
          : 'bg-[radial-gradient(circle_at_top_left,rgba(74,139,58,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(201,149,63,0.08),transparent_24%)]'
      }`} />
      <TopHeader onSearchClick={() => setShowSearch(true)} />

      <div className={`flex items-center justify-between gap-2 border-b px-4 py-3 backdrop-blur-sm xl:hidden ${
        effectiveTheme === 'dark' ? 'border-slate-800 bg-[#0b111a]/95' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] bg-[#f1e4d4]/85' : 'border-[#ece8de] bg-white/80'
      }`}>
        <button
          type="button"
          onClick={() => setMobilePanel('chapters')}
          className={`rounded-full border px-4 py-2 text-sm font-semibold ${
            effectiveTheme === 'dark' ? 'border-slate-700 bg-slate-900 text-emerald-400' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] bg-[#f5ede0] text-[#c97c44]' : 'border-[#dfe6d5] bg-white text-[#4a8b3a]'
          }`}
        >
          Surahs
        </button>
        <button
          type="button"
          onClick={() => setShowSearch(true)}
          className={`rounded-full border px-4 py-2 text-sm font-semibold ${
            effectiveTheme === 'dark' ? 'border-slate-700 bg-slate-900 text-emerald-400' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] bg-[#f5ede0] text-[#c97c44]' : 'border-[#dfe6d5] bg-white text-[#4a8b3a]'
          }`}
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setMobilePanel('settings')}
          className={`rounded-full border px-4 py-2 text-sm font-semibold ${
            effectiveTheme === 'dark' ? 'border-slate-700 bg-slate-900 text-emerald-400' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] bg-[#f5ede0] text-[#c97c44]' : 'border-[#dfe6d5] bg-white text-[#4a8b3a]'
          }`}
        >
          Settings
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 overflow-hidden xl:pl-[62px]">
        <aside className={`fixed left-0 top-0 z-50 hidden h-screen w-[62px] flex-col items-center border-r py-4 xl:flex ${
          effectiveTheme === 'dark' ? 'border-slate-800 bg-[#0d131f] text-[#8095a6]' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] bg-[#e8dfd1] text-[#7a8b84]' : 'border-[#ece8de] bg-[#ecefed] text-[#8b968f]'
        }`}>
          <a
            className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-600 text-white transition-colors hover:bg-emerald-700"
            href="/"
            aria-label="Quran Mazid Home"
          >
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.99183 0H29.0082C32.8696 0 36 3.13043 36 6.99183V29.0082C36 32.8696 32.8696 36 29.0082 36H6.99183C3.13043 36 0 32.8696 0 29.0082V6.99183C0 3.13043 3.13043 0 6.99183 0Z" fill="white"></path><path d="M26.0687 24.5654V28.2374C26.0688 28.3545 26.0389 28.4696 25.9818 28.5717C25.9247 28.6739 25.8424 28.7597 25.7427 28.821C25.6429 28.8822 25.5292 28.9168 25.4122 28.9215C25.2953 28.9263 25.1791 28.9009 25.0748 28.8479L18 25.2596" stroke="#10b981" strokeWidth="0.782609"></path><path d="M9.92969 24.5654V28.2374C9.92957 28.3545 9.95949 28.4696 10.0166 28.5717C10.0737 28.6739 10.156 28.7597 10.2557 28.821C10.3554 28.8822 10.4692 28.9168 10.5861 28.9215C10.7031 28.9263 10.8193 28.9009 10.9236 28.8479L17.9976 25.2596" stroke="#10b981" strokeWidth="0.782609"></path><path opacity="0.35" d="M17.5839 24.1444C17.5839 24.3737 17.7733 24.5591 18.0018 24.5591V25.5405L8.60421 23.6114L7.45143 23.3821C7.093 23.3109 6.77034 23.1177 6.53844 22.8353C6.30654 22.5528 6.17975 22.1987 6.17969 21.8333V10.8729C6.17969 9.90245 7.04838 9.16131 8.00708 9.31392L18.001 10.9026V11.884C17.8908 11.8842 17.7852 11.9279 17.7071 12.0056C17.629 12.0833 17.5847 12.1886 17.5839 12.2988V24.1436V24.1444Z" fill="#10b981"></path><path opacity="0.35" d="M18.4171 24.1444C18.4171 24.3737 18.2293 24.5591 18 24.5591V25.5405L27.3976 23.6114L28.5503 23.3821C28.9088 23.3109 29.2314 23.1177 29.4633 22.8353C29.6952 22.5528 29.822 22.1987 29.8221 21.8333V10.8729C29.8221 9.90245 28.9534 9.16131 27.9947 9.31392L18 10.9018V11.8832C18.2285 11.8832 18.4171 12.0687 18.4171 12.298V24.1436V24.1444Z" fill="#10b981"></path><path d="M17.5806 24.1443C17.5806 24.3736 17.77 24.5591 17.9986 24.5591V25.5405L9.92986 22.0383L8.60099 21.4623C8.29824 21.3311 8.04048 21.1142 7.85944 20.8383C7.6784 20.5624 7.58197 20.2396 7.58203 19.9096V9.37417C7.58187 9.09963 7.64851 8.82918 7.7762 8.58615C7.9039 8.34312 8.08881 8.13482 8.31498 7.97921C8.54116 7.8236 8.8018 7.72536 9.07441 7.69297C9.34703 7.66058 9.62343 7.69501 9.87977 7.7933L17.9986 10.9026V11.884C17.8883 11.884 17.7824 11.9276 17.7041 12.0053C17.6259 12.083 17.5815 12.1885 17.5806 12.2988V24.1436V24.1443Z" fill="#10b981"></path><path d="M28.0252 9.37374V9.37397V19.9095C28.0252 20.4269 27.7175 20.8958 27.2417 21.1032C27.2416 21.1033 27.2415 21.1033 27.2413 21.1034L25.9131 21.6791L25.9129 21.6792L18.3913 24.9439V24.8493C18.4568 24.8131 18.517 24.7678 18.5702 24.7147C18.6452 24.6398 18.7048 24.5509 18.7454 24.453C18.786 24.3551 18.8069 24.2501 18.8069 24.1441V12.2986C18.8069 12.0848 18.7219 11.8798 18.5708 11.7286C18.5173 11.6751 18.4571 11.6299 18.3921 11.5938V11.1708L26.2587 8.15774L26.2589 8.15769C26.4559 8.08214 26.6684 8.05567 26.878 8.08056C27.0875 8.10546 27.2879 8.18098 27.4618 8.3006C27.6356 8.42023 27.7778 8.58036 27.876 8.76718C27.974 8.95384 28.0253 9.16251 28.0252 9.37374Z" fill="#10b981" stroke="#10b981" strokeWidth="0.782609"></path></svg>
          </a>

          <div className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-8">
              <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/70 hover:text-[#4a8b3a]" title="Home" aria-label="Home">
                <House className="h-4.5 w-4.5" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/70 hover:text-[#4a8b3a]" title="Read Quran" aria-label="Read Quran">
                <Grid2x2 className="h-4.5 w-4.5" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/70 hover:text-[#4a8b3a]" title="Go To Ayah" aria-label="Go To Ayah">
                <Send className="h-4.5 w-4.5" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/70 hover:text-[#4a8b3a]" title="Bookmarks" aria-label="Bookmarks">
                <Bookmark className="h-4.5 w-4.5" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-white/70 hover:text-[#4a8b3a]" title="Others" aria-label="Others">
                <LayoutGrid className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </aside>

        <div className={`hidden xl:block flex-shrink-0 border-r backdrop-blur-sm ${
          effectiveTheme === 'dark' ? 'border-slate-800 bg-[#1a2236]/90' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] bg-[#fbfaf6]/80' : 'border-[#ece8de] bg-[#fbfaf6]/80'
        }`}>
          <LeftSidebar chapters={chapters} selectedChapterId={selectedChapterId} onSelectChapter={handleSelectChapter} />
        </div>

        <main className={`min-h-0 flex-1 overflow-hidden backdrop-blur-sm ${
          effectiveTheme === 'dark' ? 'bg-[#070d1c]' : effectiveTheme === 'sepia' ? 'bg-[#fbf7f0]/92' : 'bg-white/92'
        }`}>
          {detailLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <div className={`inline-block h-8 w-8 animate-spin rounded-full border-4 ${
                  effectiveTheme === 'dark' ? 'border-slate-700 border-t-emerald-500' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] border-t-[#c97c44]' : 'border-[#e1e7da] border-t-[#4a8b3a]'
                }`}></div>
                <p className={`mt-4 text-sm ${
                  effectiveTheme === 'dark' ? 'text-slate-400' : effectiveTheme === 'sepia' ? 'text-[#8d6e63]' : 'text-slate-500'
                }`}>Loading chapter...</p>
              </div>
            </div>
          ) : chapterDetail ? (
            <VerseDisplay
              chapter={chapterDetail}
              fontSettings={settings}
              onToggleAudio={handleToggleAudio}
              activeVerseNumber={playingVerse?.chapterId === chapterDetail.id ? playingVerse.verse : null}
              isActiveVersePaused={isAudioPaused}
              focusVerseNumber={selectedVerseNumber}
              hasPreviousChapter={chapters.some(ch => ch.id === chapterDetail.id - 1)}
              hasNextChapter={chapters.some(ch => ch.id === chapterDetail.id + 1)}
              onPreviousChapter={() => {
                const previous = chapters.find(ch => ch.id === chapterDetail.id - 1);
                if (previous) {
                  handleSelectChapter(previous.id);
                }
              }}
              onNextChapter={() => {
                const next = chapters.find(ch => ch.id === chapterDetail.id + 1);
                if (next) {
                  handleSelectChapter(next.id);
                }
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className={`text-sm ${
                effectiveTheme === 'dark' ? 'text-slate-400' : effectiveTheme === 'sepia' ? 'text-[#8d6e63]' : 'text-slate-500'
              }`}>Select a chapter to begin</p>
            </div>
          )}
        </main>

        <div className={`hidden xl:block flex-shrink-0 border-l backdrop-blur-sm ${
          effectiveTheme === 'dark' ? 'border-slate-800 bg-[#1a2236]/90' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] bg-[#fbfaf6]/80' : 'border-[#ece8de] bg-[#fbfaf6]/80'
        }`}>
          <RightSidebar fontSettings={settings} onUpdateSettings={updateSettings} />
        </div>
      </div>

      {mobilePanel && (
        <div className="fixed inset-0 z-50 bg-black/35 xl:hidden" onClick={() => setMobilePanel(null)}>
          <div
            className={`absolute inset-x-0 bottom-0 max-h-[86vh] overflow-hidden rounded-t-[28px] border-t shadow-[0_-12px_50px_rgba(0,0,0,0.18)] ${
              effectiveTheme === 'dark' ? 'border-slate-700 bg-[#0b111a]' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] bg-[#fbfaf6]' : 'border-[#e7e0d3] bg-[#fbfaf6]'
            }`}
            onClick={e => e.stopPropagation()}
          >
            <div className={`mx-auto mt-3 h-1.5 w-12 rounded-full ${
              effectiveTheme === 'dark' ? 'bg-slate-700' : effectiveTheme === 'sepia' ? 'bg-[#d6d0c7]' : 'bg-[#d6d0c7]'
            }`} />
            <div className="max-h-[calc(86vh-16px)] overflow-y-auto">
              {mobilePanel === 'chapters' ? (
                <LeftSidebar
                  chapters={chapters}
                  selectedChapterId={selectedChapterId}
                  onSelectChapter={handleSelectChapter}
                />
              ) : (
                <RightSidebar fontSettings={settings} onUpdateSettings={updateSettings} />
              )}
            </div>
          </div>
        </div>
      )}


      {/* Search Modal */}
      {showSearch && (
        <SearchModal
          chapters={chapters}
          onSelectResult={handleSelectChapter}
          onClose={() => setShowSearch(false)}
        />
      )}

      {nowPlayingChapter && nowPlayingVerse && (
        <div className={`fixed bottom-0 left-0 right-0 z-50 border-t px-5 py-3 ${
          effectiveTheme === 'dark' ? 'border-slate-700 bg-[#0b111a]/95 text-slate-200' : effectiveTheme === 'sepia' ? 'border-[#d7ccc8] bg-[#f5ede0]/95 text-[#3e2723]' : 'border-[#d7dfcf] bg-white/95 text-slate-700'
        }`}>
          <div className="mx-auto flex max-w-[1600px] items-center gap-4">
            <div className="min-w-[170px] text-[24px] font-semibold leading-none" style={{ fontFamily: 'var(--font-display)' }}>
              {nowPlayingChapter.name} : {nowPlayingVerse}
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <input
                type="range"
                min="0"
                max={Math.max(audioDuration || 0, 1)}
                step="0.1"
                value={audioCurrentTime || 0}
                onMouseDown={() => {
                  const audio = audioRef.current;
                  if (audio) audio.pause();
                }}
                onTouchStart={() => {
                  const audio = audioRef.current;
                  if (audio) audio.pause();
                }}
                onChange={(event) => {
                  const nextTime = Number(event.target.value);
                  handleSeekAudio(nextTime);
                }}
                onMouseUp={() => {
                  const audio = audioRef.current;
                  if (audio && !isAudioPaused) {
                    audio.play().catch(() => {});
                  }
                }}
                onTouchEnd={() => {
                  const audio = audioRef.current;
                  if (audio && !isAudioPaused) {
                    audio.play().catch(() => {});
                  }
                }}
                className={`h-1.5 w-full cursor-pointer appearance-none rounded-full ${
                  effectiveTheme === 'dark' ? 'accent-emerald-500 bg-slate-700' : effectiveTheme === 'sepia' ? 'accent-[#c97c44] bg-[#ddd2c3]' : 'accent-[#4a8b3a] bg-[#d7dfcf]'
                }`}
              />


              <div className="flex items-center justify-between text-sm">
                <span>{formatTime(audioCurrentTime)}</span>
                <div className="flex items-center gap-4">
                  <button type="button" onClick={() => {}} aria-label="More audio options" className="opacity-75 transition-opacity hover:opacity-100">
                    <Ellipsis className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={handlePlayPrevious} aria-label="Previous verse" className="opacity-75 transition-opacity hover:opacity-100">
                    <SkipBack className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleAudio(nowPlayingVerse)}
                    aria-label="Toggle play"
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-white ${
                      effectiveTheme === 'dark' ? 'bg-emerald-600 hover:bg-emerald-500' : effectiveTheme === 'sepia' ? 'bg-[#c97c44] hover:bg-[#b8703b]' : 'bg-[#4a8b3a] hover:bg-[#3f7631]'
                    }`}
                  >
                    {isAudioPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </button>
                  <button type="button" onClick={handlePlayNext} aria-label="Next verse" className="opacity-75 transition-opacity hover:opacity-100">
                    <SkipForward className="h-5 w-5" />
                  </button>
                  <button type="button" onClick={closePlayer} aria-label="Close player" className="opacity-75 transition-opacity hover:opacity-100">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <span>{formatTime(audioDuration)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
