import { BookOpenText, Sparkles, Compass } from 'lucide-react';
import { FeatureCard } from '@/components/feature-card';



const highlights = [
  {
    title: 'Guided recitation',
    description: 'Structured reading flows that help visitors move from the homepage into focused study.',
    icon: BookOpenText
  },
  {
    title: 'Meaningful reflection',
    description: 'Soft visual hierarchy, clear typography, and calm spacing keep the page approachable.',
    icon: Sparkles
  },
  {
    title: 'Built to expand',
    description: 'Frontend and backend folders are ready for content, search, bookmarks, and audio features.',
    icon: Compass
  }
];



export default function Home() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#0b1020_0%,#131b31_52%,#fbf7ef_52%,#fbf7ef_100%)] text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-20 sm:px-10 lg:px-12">
        <div className="relative overflow-hidden rounded-[2rem] border-2 border-sand-300/60 bg-white/8 p-8 shadow-2xl shadow-sand-500/20 backdrop-blur-xl sm:p-12 lg:p-14">
          <div className="pointer-events-none absolute inset-0 bg-hero-radial" />
          <div className="relative grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="max-w-2xl space-y-8">
              <span className="inline-flex items-center rounded-full border-2 border-sand-300/50 bg-sand-400/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.4em] text-sand-200">
                ✨ QuranNest
              </span>
              <div className="space-y-6">
                <h1 className="font-[family:var(--font-display)] text-4xl leading-tight text-white sm:text-5xl lg:text-6xl font-bold drop-shadow-lg">
                  A calm digital home for Quran reading, reflection, and memorization.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-100 sm:text-base font-medium drop-shadow-md">
                  This starter app gives you a polished landing experience, a structured API backend, and a folder layout
                  that can grow into a full Quran study platform without rework.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#highlights"
                  className="rounded-full bg-gradient-to-r from-sand-300 to-sand-400 px-6 py-3 text-base font-bold text-night transition hover:from-sand-200 hover:to-sand-300 shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
                >
                  ↓ Explore features
                </a>
                <a
                  href="/reader"
                  className="rounded-full bg-gradient-to-r from-sand-300 to-sand-400 px-6 py-3 text-base font-bold text-night transition hover:from-sand-200 hover:to-sand-300 shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
                >
                  📖 Start reading
                </a>
              </div>
            </div>


            <div className="grid gap-4 rounded-[1.75rem] border-2 border-sand-300/40 bg-night/60 p-6 shadow-2xl shadow-black/40 backdrop-blur-sm">
              <div className="rounded-[1.35rem] border-2 border-sand-300/30 bg-sand-400/15 p-6">
                <p className="text-sm uppercase tracking-[0.3em] font-bold text-sand-200">📿 Daily verse</p>
                <p className="mt-4 font-[family:var(--font-display)] text-2xl leading-tight text-sand-100 font-bold">
                  Indeed, with hardship comes ease.
                </p>
                <p className="mt-3 text-sm leading-7 text-slate-200 font-medium">A simple inspirational panel for future verse of the day content.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.35rem] border-2 border-sand-300/30 bg-sand-400/15 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] font-bold text-sand-200">📚 Chapters</p>
                  <p className="mt-4 text-3xl font-bold text-sand-100">114</p>
                </div>
                <div className="rounded-[1.35rem] border-2 border-sand-300/30 bg-sand-400/15 p-6">
                  <p className="text-xs uppercase tracking-[0.25em] font-bold text-sand-200">✨ Verses</p>
                  <p className="mt-4 text-3xl font-bold text-sand-100">6,236</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div id="highlights" className="relative mt-16 grid gap-6 lg:grid-cols-3">
          {highlights.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </section>
    </main>
  );
}