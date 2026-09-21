import { SECTIONS, TOOLS, sectionHref } from '@/lib/nav';

/**
 * Site header.
 *
 * `fromHome` decides how the section links are written: the landing page wants
 * bare "#meeting" so the browser scrolls in place, every other route wants
 * "/#meeting" so it navigates home first.
 *
 * `current` marks the active tool route.
 */
export default function SiteHeader({ fromHome = false, current = null }) {
  return (
    <header
      style={{
        position: 'relative',
        zIndex: 6,
        display: 'flex',
        alignItems: 'center',
        gap: 'clamp(16px,2vw,40px)',
        padding: '18px clamp(20px,5vw,80px)',
        borderBottom: '1px solid rgba(255,255,255,.1)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 12, marginRight: 'auto', textDecoration: 'none' }}>
        <img src="/img/rmi-logo.png" alt="RMI" style={{ height: 28, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />
        <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)', paddingLeft: 12, borderLeft: '1px solid rgba(255,255,255,.18)' }}>Global 3D</span>
      </a>

      <nav className="rmi-nav" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px,1.6vw,26px)', fontSize: 14, fontWeight: 500 }}>
        {SECTIONS.map((s) => (
          <a key={s.hash} className="rmi-link" href={sectionHref(s.hash, fromHome)}>{s.label}</a>
        ))}
        {TOOLS.map((t) => (
          <a
            key={t.href}
            className="rmi-link rmi-tool"
            href={t.href}
            aria-current={current === t.href ? 'page' : undefined}
            style={current === t.href ? { color: '#ffffff' } : undefined}
          >
            <span className="rmi-tool-badge">AI</span>
            {t.label.replace(/^AI\s+/, '')}
          </a>
        ))}
      </nav>

      <a className="rmi-btn" href={sectionHref('#cta', fromHome)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#ffffff', fontWeight: 700, fontSize: 14, padding: '11px 20px', borderRadius: 999, textDecoration: 'none', whiteSpace: 'nowrap' }}>Book a demo</a>
    </header>
  );
}
