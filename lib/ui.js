/** Style constants shared across pages. Layout still lives inline on the JSX. */

export const MONO = { fontFamily: 'ui-monospace,Menlo,monospace' };

export const PAGE = {
  width: '100%',
  background: '#0c0b0b',
  fontFamily: 'var(--font-archivo),system-ui,sans-serif',
  color: '#f5f3f2',
  fontSize: 16,
  lineHeight: 1.6,
  position: 'relative',
  overflowX: 'hidden',
};

export const BTN = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: 9,
  color: '#ffffff',
  fontWeight: 700,
  fontSize: 15,
  padding: '15px 28px',
  borderRadius: 999,
  textDecoration: 'none',
};

export const BTN_GHOST = { ...BTN, border: '1px solid rgba(255,255,255,.18)' };

export const TILE = { background: 'rgba(255,255,255,.05)' };

export const CHIP = { padding: '7px 13px', border: '1px solid rgba(255,255,255,.18)' };
