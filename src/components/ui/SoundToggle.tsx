'use client';

import { useEffect, useRef } from 'react';
import { useExperienceStore } from '@/store/useExperienceStore';

/**
 * Ambient sound toggle (temple bells / soft sitar drone).
 * Drop a loop at /public/audio/ambient-temple.mp3 to activate.
 * Fails silently if the asset is absent — never blocks the experience.
 */
export function SoundToggle() {
  const soundOn = useExperienceStore((s) => s.soundOn);
  const toggleSound = useExperienceStore((s) => s.toggleSound);
  const ref = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    a.volume = 0.35;
    if (soundOn) {
      a.play().catch(() => void 0);
    } else {
      a.pause();
    }
  }, [soundOn]);

  return (
    <>
      <audio ref={ref} loop preload="none" src="/audio/ambient-temple.mp3" />
      <button
        onClick={toggleSound}
        aria-pressed={soundOn}
        aria-label={soundOn ? 'Mute ambience' : 'Play ambience'}
        data-cursor={soundOn ? 'Mute' : 'Listen'}
        className="flex items-center gap-[3px]"
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="block w-[2px] rounded-full"
            style={{
              height: 14,
              background: 'var(--color-brass)',
              transformOrigin: 'bottom',
              animation: soundOn
                ? `eq 900ms ${i * 120}ms ease-in-out infinite alternate`
                : 'none',
              transform: soundOn ? undefined : 'scaleY(0.35)',
              opacity: soundOn ? 1 : 0.5,
            }}
          />
        ))}
        <style>{`@keyframes eq { from { transform: scaleY(0.3) } to { transform: scaleY(1) } }`}</style>
      </button>
    </>
  );
}
