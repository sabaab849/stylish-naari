// SareeVideoCard — a 9:16 looping product video for the saree PDP (React + Tailwind CSS + lucide-react).
// The live prototype uses the same design in plain HTML/CSS/JS (render/pdp.mjs → renderFilmCard), so the
// two stay in step. Needs: react, tailwindcss, lucide-react.
//
//   <SareeVideoCard src="/assets/video/hariyali-reel.mp4" poster="/assets/images/hariyali-reel-poster.jpg"
//                   label="Hariyali: the saree in motion" />
import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Maximize2 } from 'lucide-react';

const formatTime = (s) => {
  const t = Math.max(0, Math.round(s || 0));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

export default function SareeVideoCard({ src, poster, label = 'Saree video', className = '' }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [duration, setDuration] = useState(0);
  const [revealed, setRevealed] = useState(false); // touch screens: a tap shows the controls
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [failed, setFailed] = useState(false);

  // Play only while on screen (and never for visitors who prefer reduced motion)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { video.pause(); return undefined; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    }, { threshold: 0.35 });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () => setIsFullscreen(document.fullscreenElement === cardRef.current);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  useEffect(() => {
    if (!revealed) return undefined;
    const t = setTimeout(() => setRevealed(false), 3000);
    return () => clearTimeout(t);
  }, [revealed]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !muted;
    setMuted(!muted);
    if (muted) video.play().catch(() => {});
  };

  const toggleFullscreen = async () => {
    const card = cardRef.current, video = videoRef.current;
    if (!card || !video) return;
    if (document.fullscreenElement) { await document.exitFullscreen(); return; }
    if (card.requestFullscreen) {
      await card.requestFullscreen().catch(() => {});
      video.muted = false; setMuted(false); video.play().catch(() => {});
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen(); // iPhone: the native player
    }
  };

  if (failed) return null; // a broken file hides the card rather than showing an empty box

  const shown = revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5';
  const glass = 'bg-white/15 backdrop-blur-md text-white border border-white/20 rounded-full text-xs font-light';

  return (
    <figure
      ref={cardRef}
      className={`group relative isolate w-full max-w-xs aspect-[9/16] overflow-hidden rounded-2xl bg-neutral-900 ${isFullscreen ? 'max-w-none rounded-none' : ''} ${className}`}
    >
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full ${isFullscreen ? 'object-contain' : 'object-cover group-hover:scale-105'} transition-transform duration-700 ease-out motion-reduce:transition-none`}
        src={src}
        poster={poster}
        aria-label={label}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onError={() => setFailed(true)}
        onClick={() => setRevealed(true)}
      />

      {/* soft gradient: hidden until hover, focus or tap */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-300 ${revealed ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 group-focus-within:opacity-100`}
      />

      <figcaption
        className={`absolute inset-x-3.5 bottom-3.5 flex items-center justify-between gap-2 transition-all duration-300 ${shown} group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:translate-y-0`}
      >
        <button
          type="button"
          onClick={toggleMute}
          aria-pressed={!muted}
          className={`${glass} flex items-center gap-1.5 px-3 py-1.5 transition-colors hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white`}
        >
          {muted ? <VolumeX size={14} strokeWidth={1.6} aria-hidden="true" /> : <Volume2 size={14} strokeWidth={1.6} aria-hidden="true" />}
          {muted ? 'Sound off' : 'Sound on'}
        </button>

        <span className="flex items-center gap-1.5">
          <span className={`${glass} px-3 py-1.5 tabular-nums`}>{formatTime(duration)}</span>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit full screen' : 'Watch full screen'}
            className={`${glass} grid h-[30px] w-[30px] place-items-center transition-colors hover:bg-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white`}
          >
            <Maximize2 size={14} strokeWidth={1.6} aria-hidden="true" />
          </button>
        </span>
      </figcaption>
    </figure>
  );
}
