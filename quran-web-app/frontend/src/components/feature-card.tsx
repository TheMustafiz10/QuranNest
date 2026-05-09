import type { LucideIcon } from 'lucide-react';

type FeatureCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <article className="rounded-2xl border-2 border-sand-300/70 bg-gradient-to-br from-white to-slate-50 p-6 text-night shadow-lg backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-sand-400">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sand-300 to-sand-400 text-sand-900 shadow-md">
        <Icon className="h-7 w-7" />
      </div>
      <h2 className="mt-5 font-[family:var(--font-display)] text-2xl font-bold text-slate-950">{title}</h2>
      <p className="mt-3 leading-7 text-base text-slate-700 font-medium">{description}</p>
    </article>
  );
}