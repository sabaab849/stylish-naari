// DrapeInMotion — a full-width editorial feature for the saree PDP (React + Tailwind CSS + lucide-react).
// The live prototype renders the same section in plain HTML/CSS/JS (render/pdp.mjs → renderMotion).
//
//   <DrapeInMotion
//     src="/assets/video/hariyali-reel.mp4"
//     poster="/assets/images/hariyali-reel-poster.jpg"
//     body="Sheer teal falls in soft folds, and the gold buti catch the light as it moves…"
//     href="/#craft"
//   />
import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const formatTime = (s) => {
  const t = Math.max(0, Math.round(s || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

function MotionVideo({ src, poster, label }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [duration, setDuration] = useState(0);

  // play only while on screen; never for visitors who prefer reduced motion
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { video.pause(); return undefined; }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? video.play().catch(() => {}) : video.pause()), { threshold: 0.35 });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
    if (muted) video.play().catch(() => {});
  };

  const glass = 'bg-white/15 backdrop-blur-md text-white border border-white/20 rounded-full text-xs font-light';

  return (
    <div className="group relative aspect-[9/16] w-full overflow-hidden rounded-lg bg-neutral-900">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none"
        src={src}
        poster={poster}
        aria-label={label}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100" />
      <div className="absolute inset-x-3.5 bottom-3.5 flex items-center justify-between opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={!muted}
          className={`${glass} flex items-center gap-1.5 px-3 py-1.5 hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white`}
        >
          {muted ? <VolumeX size={14} strokeWidth={1.6} aria-hidden="true" /> : <Volume2 size={14} strokeWidth={1.6} aria-hidden="true" />}
          {muted ? 'Sound off' : 'Sound on'}
        </button>
        <span className={`${glass} px-3 py-1.5 tabular-nums`}>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

export default function DrapeInMotion({
  src,
  poster,
  title = 'The drape in motion',
  body,
  cta = 'Explore the craft',
  href = '#',
  label = 'The saree in motion',
}) {
  return (
    <section aria-labelledby="motion-title" className="relative my-16 overflow-hidden py-20">
      {/* atmospheric backdrop: the saree's own frame, blurred, with a light vignette */}
      <div aria-hidden="true" className="absolute -inset-10 -z-10 scale-110 bg-cover bg-center blur-2xl brightness-[0.62]" style={{ backgroundImage: poster ? `url(${poster})` : undefined }} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-neutral-900/10 backdrop-blur-md [background-image:radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(23,23,23,0.1),rgba(23,23,23,0.55))]" />

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-0 overflow-hidden rounded-2xl shadow-2xl md:grid-cols-2">
        <div className="flex items-center justify-center bg-white p-4">
          <MotionVideo src={src} poster={poster} label={label} />
        </div>

        <div className="flex flex-col items-center justify-center space-y-4 bg-[#FAF8F5] p-8 text-center md:p-12">
          <h2 id="motion-title" className="font-serif text-3xl font-normal uppercase leading-tight tracking-widest text-neutral-900">
            {title}
          </h2>
          <svg viewBox="0 0 48 16" width="48" height="16" fill="none" stroke="currentColor" strokeWidth="1" className="text-neutral-400" aria-hidden="true">
            <path d="M0 8h17M31 8h17" />
            <circle cx="24" cy="8" r="4.5" />
            <circle cx="24" cy="8" r="1.4" fill="currentColor" stroke="none" />
          </svg>
          {body && <p className="max-w-sm font-serif text-lg font-light leading-relaxed text-neutral-600">{body}</p>}
          <a href={href} className="group/cta inline-flex items-center gap-2 pt-2 text-xs font-medium uppercase tracking-[0.14em] text-neutral-900">
            <span className="bg-[length:0_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-300 [background-image:linear-gradient(currentColor,currentColor)] group-hover/cta:bg-[length:100%_1px]">{cta}</span>
            <span aria-hidden="true" className="transition-transform duration-300 group-hover/cta:translate-x-1">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
