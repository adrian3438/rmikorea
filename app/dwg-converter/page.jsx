import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import DwgConverter from '@/components/DwgConverter';
import { MONO, PAGE, TILE } from '@/lib/ui';

export const metadata = {
  title: 'AI DWG Converter — RMI Global 3D',
  description:
    'Upload a PDF drawing and get back editable DWG geometry — layers, linework and text recovered instead of traced by hand.',
};

const STEPS = [
  ['01', 'Read', 'Pages are rasterised and vector paths lifted straight out of the PDF where they exist.'],
  ['02', 'Recognise', 'Lines, arcs, hatches, dimensions and text blocks are classified and snapped to a grid.'],
  ['03', 'Rebuild', 'Geometry is written as DWG entities on named layers, ready to edit in AutoCAD.'],
];

export default function DwgConverterPage() {
  return (
    <div style={PAGE}>
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 50% at 50% 0%,rgba(236,48,19,.12) 0%,rgba(12,11,11,0) 70%)' }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <SiteHeader current="/dwg-converter" />

        <main style={{ maxWidth: 1180, margin: '0 auto', padding: 'clamp(40px,6vw,86px) clamp(20px,5vw,80px) clamp(56px,7vw,110px)' }}>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 16px 7px 8px', border: '1px solid rgba(255,255,255,.16)', borderRadius: 999, fontSize: 12, fontWeight: 600, letterSpacing: '.04em', color: 'rgba(255,255,255,.72)', marginBottom: 24, background: 'rgba(12,11,11,.55)' }}>
            <span style={{ background: '#ec3013', color: '#ffffff', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>AI</span>
            Drawing recovery
          </div>

          <h1 style={{ fontSize: 'clamp(34px,4.6vw,64px)', lineHeight: 1.04, letterSpacing: '-.035em', fontWeight: 700, margin: '0 0 20px', textWrap: 'balance' }}>
            PDF in. <span style={{ color: '#ec3013' }}>Editable DWG out.</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px,1.2vw,19px)', lineHeight: 1.55, maxWidth: '54ch', margin: '0 0 44px', color: 'rgba(255,255,255,.66)', textWrap: 'pretty' }}>
            Stop retracing supplier drawings. Drop in a PDF and get back real geometry on
            named layers — lines, arcs, text and dimensions you can edit, measure and
            bring into the 3D twin.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 'clamp(24px,3vw,48px)', alignItems: 'start' }}>

            <section aria-label="Convert a drawing" style={{ background: 'rgba(16,14,14,.82)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 20, padding: 'clamp(22px,2.4vw,32px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <span style={{ ...MONO, fontSize: 11, letterSpacing: '.18em', color: '#ec3013' }}>CONVERT</span>
                <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.14)' }} />
              </div>
              <DwgConverter />
            </section>

            <div style={{ display: 'grid', gap: 26 }}>
              <section>
                <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 16px' }}>How it works</h2>
                <div style={{ display: 'grid', gap: 2 }}>
                  {STEPS.map(([n, title, body]) => (
                    <div key={n} style={{ display: 'flex', gap: 14, padding: '14px 16px', ...TILE }}>
                      <span style={{ ...MONO, fontSize: 11, color: '#ec3013', paddingTop: 3 }}>{n}</span>
                      <span>
                        <span style={{ display: 'block', fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{title}</span>
                        <span style={{ display: 'block', fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,.62)' }}>{body}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-.02em', margin: '0 0 14px' }}>Good to know</h2>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 10, fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,.66)' }}>
                  <li style={{ display: 'flex', gap: 10 }}>
                    <span style={{ color: '#ec3013' }}>—</span>
                    <span><strong style={{ color: '#fff' }}>Vector PDFs convert best.</strong> A scanned page is a photograph of a drawing; it has to be traced, and thin or broken lines will not survive cleanly.</span>
                  </li>
                  <li style={{ display: 'flex', gap: 10 }}>
                    <span style={{ color: '#ec3013' }}>—</span>
                    <span><strong style={{ color: '#fff' }}>Check the result before you build from it.</strong> Recovered geometry is a starting point, not a certified drawing.</span>
                  </li>
                  <li style={{ display: 'flex', gap: 10 }}>
                    <span style={{ color: '#ec3013' }}>—</span>
                    <span><strong style={{ color: '#fff' }}>Multi-page PDFs</strong> come back as one DWG per sheet.</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
