import { SECTIONS, TOOLS, sectionHref } from '@/lib/nav';

/**
 * Site footer. It repeats the tool links on purpose: the header nav is hidden on
 * narrow screens, and without this the converter route would be unreachable there.
 */
export default function SiteFooter({ fromHome = false }) {
  return (
    <footer style={{ position: 'relative', zIndex: 4, background: '#0c0b0b', padding: 'clamp(28px,3vw,44px) clamp(20px,5vw,80px)', borderTop: '1px solid rgba(255,255,255,.1)' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '18px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/img/rmi-logo.png" alt="RMI" style={{ height: 24, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>© 2026 RMI Global 3D</span>
        </div>
        <nav style={{ display: 'flex', flexWrap: 'wrap', gap: 20, fontSize: 13 }}>
          {SECTIONS.map((s) => (
            <a key={s.hash} className="rmi-footlink" href={sectionHref(s.hash, fromHome)}>{s.label}</a>
          ))}
          {TOOLS.map((t) => (
            <a key={t.href} className="rmi-footlink" href={t.href}>{t.label}</a>
          ))}
        </nav>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,.45)' }}>Powered by ALINK<span style={{ color: '#ec3013' }}>3D</span>®</div>
      </div>
    </footer>
  );
}
