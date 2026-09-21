'use client';

import { useEffect, useRef, useState } from 'react';
import { createScene } from '@/lib/scene';

const STAGE_COUNT = 7;                      // camera keyframe spans in lib/scene.js (0..7)
const DOTS = [0, 1, 2, 3, 4, 5, 6];

function lateralFor() {
  return window.innerWidth >= 900 ? 0.12 : 0;
}

/**
 * The fixed 3D stage, the scroll -> camera mapping, and the progress dots.
 * Everything here is browser-only, so it is the page's one client island;
 * the surrounding markup stays a server component and ships as static HTML.
 */
export default function Stage() {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const api = createScene(canvas, { lateral: lateralFor() });
    let raf = null;

    function tick() {
      raf = null;
      const track = document.getElementById('rmi-track');
      if (!track) return;
      const vh = window.innerHeight;
      const top = track.offsetTop;
      const span = Math.max(1, track.offsetHeight - vh);
      const p = Math.max(0, Math.min(1, (window.scrollY - top) / span)) * STAGE_COUNT;
      const past = Math.max(0, Math.min(1, (window.scrollY - top - span) / (vh * 0.5)));

      api.setProgress(p);
      if (stageRef.current) stageRef.current.style.opacity = (1 - past).toFixed(3);

      // Same rule the old dot loop used: highlight the nearest keyframe, and
      // highlight nothing while the progress sits exactly between two.
      const near = Math.round(p);
      setActive(Math.abs(p - near) < 0.5 ? near : -1);
    }

    function sched() { if (!raf) raf = requestAnimationFrame(tick); }
    function onResize() { api.setLateral(lateralFor()); sched(); }

    window.addEventListener('scroll', sched, { passive: true });
    window.addEventListener('resize', onResize);
    const watch = setInterval(tick, 600);   // catches layout shifts (fonts, images)
    tick();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      clearInterval(watch);
      window.removeEventListener('scroll', sched);
      window.removeEventListener('resize', onResize);
      api.dispose();
    };
  }, []);

  return (
    <>
      <div ref={stageRef} id="rmi-stage" style={{ position: 'fixed', inset: 0, zIndex: 1, opacity: 1 }}>
        <canvas
          ref={canvasRef}
          id="rmi-canvas"
          style={{ width: '100%', height: '100%', display: 'block', touchAction: 'pan-y' }}
        />
      </div>

      <div
        style={{
          position: 'fixed',
          left: 'clamp(16px,3vw,40px)',
          bottom: 'clamp(16px,3vw,36px)',
          zIndex: 7,
          display: 'flex',
          flexDirection: 'column',
          gap: 9,
          pointerEvents: 'none',
        }}
      >
        {DOTS.map((i) => (
          <span
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: active === i ? '#ec3013' : 'rgba(255,255,255,.25)',
            }}
          />
        ))}
      </div>
    </>
  );
}
