'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ConverterNotConfiguredError,
  MAX_BYTES,
  convertPdfToDwg,
  dwgNameFor,
  formatBytes,
  isConfigured,
  validatePdf,
} from '@/lib/dwg-converter';
import { MONO } from '@/lib/ui';

const RED = '#ec3013';

// idle -> working -> done | error | unconfigured
const STAGE_LABEL = {
  uploading: 'Uploading the drawing',
  converting: 'Tracing geometry and writing DWG',
  done: 'Finished',
};

function Icon({ d, size = 18, stroke = 'currentColor', width = 1.8, fill = 'none' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

export default function DwgConverter() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);      // { filename, url }
  const [dragging, setDragging] = useState(false);

  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const urlRef = useRef(null);

  // A blob URL stays alive until it is revoked; drop the old one whenever the
  // result is replaced and on unmount, or every conversion leaks a file.
  const setResultUrl = useCallback((next) => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    urlRef.current = next?.url ?? null;
    setResult(next);
  }, []);

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    abortRef.current?.abort();
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setFile(null);
    setStatus('idle');
    setProgress(0);
    setStage('');
    setError('');
    setResultUrl(null);
    if (inputRef.current) inputRef.current.value = '';
  }, [setResultUrl]);

  const accept = useCallback((next) => {
    const problem = validatePdf(next);
    setResultUrl(null);
    setProgress(0);
    setStage('');
    if (problem) {
      setFile(null);
      setStatus('error');
      setError(problem);
      return;
    }
    setFile(next);
    setStatus('idle');
    setError('');
  }, [setResultUrl]);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer?.files?.[0];
    if (dropped) accept(dropped);
  }, [accept]);

  async function convert() {
    if (!file || status === 'working') return;
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus('working');
    setError('');
    setProgress(0);
    setStage('uploading');

    try {
      const { filename, blob } = await convertPdfToDwg(file, {
        signal: controller.signal,
        onProgress: (pct, next) => { setProgress(pct); if (next) setStage(next); },
      });
      setResultUrl({ filename, url: URL.createObjectURL(blob) });
      setStatus('done');
      setProgress(100);
    } catch (err) {
      if (err?.name === 'AbortError') { setStatus('idle'); setStage(''); return; }
      if (err instanceof ConverterNotConfiguredError) { setStatus('unconfigured'); return; }
      setStatus('error');
      setError(err?.message || 'Conversion failed.');
    } finally {
      abortRef.current = null;
    }
  }

  const busy = status === 'working';

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      {/* ---------- drop zone ---------- */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(e) => { if (!busy && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); inputRef.current?.click(); } }}
        role="button"
        tabIndex={busy ? -1 : 0}
        aria-label="Choose or drop a PDF to convert"
        style={{
          border: `1.5px dashed ${dragging ? RED : 'rgba(255,255,255,.22)'}`,
          borderRadius: 18,
          background: dragging ? 'rgba(236,48,19,.08)' : 'rgba(255,255,255,.035)',
          padding: 'clamp(28px,4vw,52px) clamp(20px,3vw,36px)',
          textAlign: 'center',
          cursor: busy ? 'default' : 'pointer',
          transition: 'border-color .15s, background .15s',
          opacity: busy ? 0.6 : 1,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={(e) => { const f = e.target.files?.[0]; if (f) accept(f); }}
        />
        <span style={{ display: 'inline-flex', width: 46, height: 46, alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(236,48,19,.14)', color: RED, marginBottom: 14 }}>
          <Icon d="M12 16V4M7 9l5-5 5 5M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" size={22} width={2} />
        </span>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>
          {dragging ? 'Drop it here' : 'Drop a PDF, or click to browse'}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)' }}>
          Vector PDF drawings convert best · up to {formatBytes(MAX_BYTES)}
        </div>
      </div>

      {/* ---------- selected file ---------- */}
      {file && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 14 }}>
          <span style={{ display: 'inline-flex', width: 38, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 10, background: 'rgba(236,48,19,.14)', color: RED, flexShrink: 0 }}>
            <Icon d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6" />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</span>
            <span style={{ display: 'block', ...MONO, fontSize: 11, color: 'rgba(255,255,255,.45)', marginTop: 2 }}>
              {formatBytes(file.size)} · PDF → {dwgNameFor(file.name)}
            </span>
          </span>
          {!busy && (
            <button type="button" onClick={reset} aria-label="Remove file" className="rmi-close" style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 0, borderRadius: 8, color: '#fff', cursor: 'pointer', flexShrink: 0 }}>
              <Icon d="M6 6l12 12M18 6L6 18" size={14} width={2.2} />
            </button>
          )}
        </div>
      )}

      {/* ---------- progress ---------- */}
      {busy && (
        <div style={{ display: 'grid', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
            <span style={{ color: 'rgba(255,255,255,.75)' }}>{STAGE_LABEL[stage] || 'Working'}…</span>
            <span style={{ ...MONO, fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{progress}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(255,255,255,.12)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progress}%`, background: RED, transition: 'width .3s ease' }} />
          </div>
        </div>
      )}

      {/* ---------- actions ---------- */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
        <button
          type="button"
          onClick={convert}
          disabled={!file || busy}
          className={!file || busy ? undefined : 'rmi-btn'}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 9, color: '#fff', fontWeight: 700, fontSize: 15,
            padding: '14px 28px', borderRadius: 999, border: 0,
            cursor: !file || busy ? 'not-allowed' : 'pointer',
            background: !file || busy ? 'rgba(255,255,255,.1)' : undefined,
            opacity: !file || busy ? 0.6 : 1,
          }}
        >
          {busy ? 'Converting…' : 'Convert to DWG'}
          {!busy && <Icon d="M4 12h15M13 6l6 6-6 6" size={16} width={2.4} />}
        </button>
        {busy && (
          <button type="button" onClick={() => abortRef.current?.abort()} className="rmi-btn-ghost" style={{ padding: '14px 24px', borderRadius: 999, border: '1px solid rgba(255,255,255,.18)', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
            Cancel
          </button>
        )}
      </div>

      {/* ---------- result ---------- */}
      {status === 'done' && result && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', background: 'rgba(55,214,122,.10)', border: '1px solid rgba(55,214,122,.35)', borderRadius: 14 }}>
          <span style={{ color: '#37d67a', flexShrink: 0 }}><Icon d="M4 13l5 5L20 7" size={20} width={2.6} /></span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'block', fontSize: 14, fontWeight: 700 }}>Conversion complete</span>
            <span style={{ display: 'block', ...MONO, fontSize: 11, color: 'rgba(255,255,255,.55)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{result.filename}</span>
          </span>
          <a className="rmi-btn" href={result.url} download={result.filename} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#fff', fontWeight: 700, fontSize: 14, padding: '11px 20px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
            <Icon d="M12 4v12M7 11l5 5 5-5M4 20h16" size={15} width={2.2} />
            Download
          </a>
        </div>
      )}

      {/* ---------- errors ---------- */}
      {status === 'error' && error && (
        <div role="alert" style={{ display: 'flex', gap: 12, padding: '14px 16px', background: 'rgba(236,48,19,.10)', border: '1px solid rgba(236,48,19,.4)', borderRadius: 14, fontSize: 14 }}>
          <span style={{ color: RED, flexShrink: 0 }}><Icon d="M12 8v5M12 17h.01M10.3 3.3L2.6 17a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 3.3a2 2 0 00-3.4 0z" size={18} width={2} /></span>
          <span>{error}</span>
        </div>
      )}

      {/* ---------- no engine wired up yet ---------- */}
      {status === 'unconfigured' && (
        <div role="status" style={{ padding: '16px 18px', background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.18)', borderLeft: `2px solid ${RED}`, borderRadius: 14, fontSize: 14, lineHeight: 1.6 }}>
          <strong style={{ display: 'block', marginBottom: 6 }}>No conversion engine is connected yet.</strong>
          <span style={{ color: 'rgba(255,255,255,.7)' }}>
            This screen is finished and validated your file — but the site is a static
            export with no backend, and DWG cannot be written in the browser. Point{' '}
            <code style={{ ...MONO, fontSize: 12, background: 'rgba(0,0,0,.35)', padding: '2px 6px', borderRadius: 5 }}>NEXT_PUBLIC_DWG_ENDPOINT</code>{' '}
            at a conversion service and the download will light up — no other change needed.
          </span>
        </div>
      )}

      {!isConfigured() && status !== 'unconfigured' && (
        <p style={{ ...MONO, fontSize: 11, letterSpacing: '.06em', color: 'rgba(255,255,255,.35)', margin: 0 }}>
          ENGINE NOT CONFIGURED — UPLOAD AND VALIDATION WORK, CONVERSION DOES NOT
        </p>
      )}
    </div>
  );
}
