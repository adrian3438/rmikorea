'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const MONO = { fontFamily: 'ui-monospace,Menlo,monospace' };

const SHOT = '/img/sales-room.png';

/**
 * The Sales Meeting Room screenshot inside the "01 / 06" card, plus its lightbox.
 *
 * The lightbox goes through a portal to <body> on purpose. It is position:fixed, and
 * the card wrapping this component sets backdrop-filter — which makes that card a
 * containing block for fixed descendants, so rendering the overlay in place would
 * clip it to the card instead of covering the viewport.
 */
export default function Screenshot() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div
        id="rmi-shot"
        className="rmi-shot"
        title="Click to enlarge"
        onClick={() => setOpen(true)}
        style={{ marginTop: 18, overflow: 'hidden', background: '#0f0e0e', cursor: 'zoom-in', position: 'relative' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 10px', background: '#1b1919', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ec3013' }} />
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4b4745' }} />
          <span style={{ ...MONO, fontSize: 10, letterSpacing: '.06em', color: 'rgba(255,255,255,.45)', marginLeft: 6 }}>alink3d.com / sales-room</span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 700, color: '#ec3013' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ec3013', animation: 'rmiBlink 1.6s infinite' }} />
            LIVE
          </span>
        </div>
        <img
          src={SHOT}
          alt="ALINK3D Sales Meeting Room — live 3D review with participants, chat, PIN list and snapshots"
          style={{ display: 'block', width: '100%', height: 'auto' }}
        />
        <span style={{ position: 'absolute', right: 8, bottom: 8, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(12,11,11,.82)', border: '1px solid rgba(255,255,255,.2)', padding: '5px 10px', fontSize: 10, fontWeight: 700, letterSpacing: '.08em' }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4-4M11 8v6M8 11h6" />
          </svg>
          ENLARGE
        </span>
      </div>

      {open && createPortal(
        <div
          id="rmi-lightbox"
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(16px,4vw,56px)', background: 'rgba(7,6,6,.92)', backdropFilter: 'blur(6px)', cursor: 'zoom-out' }}
        >
          <div style={{ width: '100%', maxWidth: 1600, border: '1px solid rgba(255,255,255,.18)', background: '#0f0e0e' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#1b1919', borderBottom: '1px solid rgba(255,255,255,.1)' }}>
              <span style={{ ...MONO, fontSize: 11, letterSpacing: '.06em', color: 'rgba(255,255,255,.55)' }}>alink3d.com / sales-room / LNG FPSO Pump Package</span>
              <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#ec3013' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ec3013', animation: 'rmiBlink 1.6s infinite' }} />
                LIVE
              </span>
              <button
                type="button"
                className="rmi-close"
                aria-label="Close"
                onClick={() => setOpen(false)}
                style={{ marginLeft: 14, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 0, color: '#ffffff', cursor: 'pointer' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <img
              src={SHOT}
              alt="ALINK3D Sales Meeting Room, enlarged"
              style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '78vh', objectFit: 'contain', background: '#0f0e0e' }}
            />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
