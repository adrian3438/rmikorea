import Stage from '@/components/Stage';
import Screenshot from '@/components/Screenshot';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { MONO } from '@/lib/ui';

// The six feature sections are laid out identically — only the copy differs.
const SECTION = {
  minHeight: '105vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: 'clamp(40px,8vh,100px) clamp(20px,5vw,80px)',
  pointerEvents: 'none',
};
const CARD = {
  position: 'sticky',
  top: '18vh',
  width: 'min(100%,600px)',
  background: 'rgba(16,14,14,.82)',
  border: '1px solid rgba(255,255,255,.12)',
  borderRadius: 20,
  padding: 'clamp(24px,2.4vw,34px)',
  backdropFilter: 'blur(14px)',
  pointerEvents: 'auto',
};
const H2 = { fontSize: 'clamp(26px,2.6vw,38px)', fontWeight: 700, letterSpacing: '-.025em', lineHeight: 1.1, margin: '0 0 14px' };
const LEAD = { fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,.66)', margin: '0 0 22px' };
const TILE = { background: 'rgba(255,255,255,.05)' };
const CHIP = { padding: '7px 13px', border: '1px solid rgba(255,255,255,.18)' };

const BTN = { display: 'inline-flex', alignItems: 'center', gap: 9, color: '#ffffff', fontWeight: 700, fontSize: 15, padding: '15px 28px', borderRadius: 999, textDecoration: 'none' };
const BTN_GHOST = { ...BTN, border: '1px solid rgba(255,255,255,.18)' };

function Feature({ id, step, title, children }) {
  return (
    <section id={id} style={SECTION}>
      <div style={CARD}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <span style={{ ...MONO, fontSize: 11, letterSpacing: '.18em', color: '#ec3013' }}>{step} / 06</span>
          <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,.14)' }} />
        </div>
        <h2 style={H2}>{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div style={{ width: '100%', background: '#0c0b0b', fontFamily: 'var(--font-archivo),system-ui,sans-serif', color: '#f5f3f2', fontSize: 16, lineHeight: 1.6, position: 'relative', overflowX: 'hidden' }}>

      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 50% at 38% 45%,rgba(236,48,19,.10) 0%,rgba(12,11,11,0) 70%)' }} />

      <Stage />

      <SiteHeader fromHome />

      <div id="rmi-track" style={{ position: 'relative', zIndex: 3 }}>

        {/* ================= hero ================= */}
        <section style={{ minHeight: '92vh', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center', textAlign: 'right', padding: 'clamp(40px,7vh,90px) clamp(20px,5vw,80px)', pointerEvents: 'none' }}>
          <div style={{ maxWidth: 620, pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '7px 16px 7px 8px', border: '1px solid rgba(255,255,255,.16)', borderRadius: 999, fontSize: 12, fontWeight: 600, letterSpacing: '.04em', color: 'rgba(255,255,255,.72)', marginBottom: 26, background: 'rgba(12,11,11,.55)' }}>
              <span style={{ background: '#ec3013', color: '#ffffff', padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>LIVE 3D</span>
              Running in your browser
            </div>
            <h1 style={{ fontSize: 'clamp(38px,5.6vw,80px)', lineHeight: 1.02, letterSpacing: '-.035em', fontWeight: 700, margin: '0 0 22px', textWrap: 'balance' }}>
              Your product, <span style={{ color: 'rgb(236, 48, 19)' }}>alive in 3D</span>
            </h1>
            <p style={{ fontSize: 'clamp(16px,1.25vw,20px)', lineHeight: 1.55, maxWidth: '46ch', margin: '0 0 30px', color: 'rgba(255,255,255,.66)', textWrap: 'pretty' }}>
              Drag to rotate the model. Then keep scrolling — the camera walks you through how teams meet, capture, report and maintain equipment on one shared 3D twin.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 12 }}>
              <a className="rmi-btn" href="#meeting" style={BTN}>
                Take the tour
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
              </a>
              <a className="rmi-btn-ghost" href="#cta" style={{ ...BTN_GHOST, backdropFilter: 'blur(6px)' }}>Book a demo</a>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10, marginTop: 34, ...MONO, fontSize: 11, letterSpacing: '.14em', color: 'rgba(255,255,255,.4)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v18M3 12h18M7 8l-4 4 4 4M17 8l4 4-4 4" /></svg>
              DRAG TO ROTATE · SCROLL TO EXPLORE
            </div>
          </div>
        </section>

        {/* ================= 01 — meeting room ================= */}
        <Feature id="meeting" step="01" title="3D Sales Meeting Room">
          <p style={LEAD}>Open the same model with a buyer anywhere in the world. Everyone shares one camera, one set of annotations and one live spec sheet — no CAD licence, no file transfer, no travel.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#ec3013', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700 }}>JK</span>
            <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#3d4a57', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, marginLeft: -14 }}>MA</span>
            <span style={{ width: 34, height: 34, borderRadius: '50%', background: '#6a5f58', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, marginLeft: -14 }}>SL</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginLeft: 8, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.65)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#37d67a', animation: 'rmiBlink 1.6s infinite' }} />
              3 in the room · Seoul / Houston / Rotterdam
            </span>
          </div>
          <div style={{ display: 'grid', gap: 8, fontSize: 13, color: 'rgba(255,255,255,.75)' }}>
            <div style={{ display: 'flex', gap: 10, padding: '10px 12px', ...TILE, borderLeft: '2px solid #ec3013' }}><strong style={{ color: '#ffffff' }}>Shared camera</strong>follow the presenter or break away</div>
            <div style={{ display: 'flex', gap: 10, padding: '10px 12px', ...TILE, borderLeft: '2px solid rgba(255,255,255,.2)' }}><strong style={{ color: '#ffffff' }}>Live specs</strong>materials, pressure class, lead time</div>
          </div>
          <Screenshot />
        </Feature>

        {/* ================= 02 — snapshot ================= */}
        <Feature id="snapshot" step="02" title="Snapshot">
          <p style={LEAD}>Freeze any view — angle, section cut, hidden parts and all — and it becomes a shareable image with the exact camera state attached. Drop it into a quote, a report or a chat and the receiver can jump straight back into the live model.</p>
          <div style={{ position: 'relative', height: 150, border: '1px solid rgba(255,255,255,.14)', background: 'repeating-linear-gradient(45deg,#1a1717 0 9px,#211d1d 9px 18px)', overflow: 'hidden', marginBottom: 18 }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(236,48,19,0),rgba(236,48,19,.35),rgba(236,48,19,0))', height: '14%', animation: 'rmiScan 3.2s linear infinite' }} />
            <span style={{ position: 'absolute', left: 12, top: 12, width: 22, height: 22, borderLeft: '2px solid #ec3013', borderTop: '2px solid #ec3013' }} />
            <span style={{ position: 'absolute', right: 12, top: 12, width: 22, height: 22, borderRight: '2px solid #ec3013', borderTop: '2px solid #ec3013' }} />
            <span style={{ position: 'absolute', left: 12, bottom: 12, width: 22, height: 22, borderLeft: '2px solid #ec3013', borderBottom: '2px solid #ec3013' }} />
            <span style={{ position: 'absolute', right: 12, bottom: 12, width: 22, height: 22, borderRight: '2px solid #ec3013', borderBottom: '2px solid #ec3013' }} />
            <span style={{ position: 'absolute', left: '50%', bottom: 14, transform: 'translateX(-50%)', ...MONO, fontSize: 10, letterSpacing: '.16em', color: 'rgba(255,255,255,.55)' }}>VIEW-2291 · 09:41 KST</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 12, fontWeight: 600 }}>
            <span style={{ ...CHIP, borderRadius: 999 }}>PNG</span>
            <span style={{ ...CHIP, borderRadius: 999 }}>PDF report</span>
            <span style={{ ...CHIP, borderRadius: 999 }}>Deep link to view</span>
          </div>
        </Feature>

        {/* ================= 03 — pin issue ================= */}
        <Feature id="pin" step="03" title="PIN Issue">
          <p style={LEAD}>Click the exact part and pin the problem to it. Photos, severity, owner and due date live on the geometry itself — so nobody has to describe &quot;the flange on the left side of the pump&quot; ever again.</p>
          <div style={{ border: '1px solid rgba(255,255,255,.14)', background: 'rgba(255,255,255,.04)', padding: 16, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <span style={{ background: '#ec3013', color: '#fff', fontSize: 11, fontWeight: 700, padding: '3px 9px', letterSpacing: '.06em' }}>CRITICAL</span>
              <span style={{ ...MONO, fontSize: 11, color: 'rgba(255,255,255,.5)' }}>ISS-0412 · PUMP P-101</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Mechanical seal leak at discharge</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.58)' }}>Assigned to M. Ahn · due in 2 days · 3 photos</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, color: 'rgba(255,255,255,.7)' }}>
            <div style={{ padding: '10px 12px', ...TILE }}>Pins sync to your CMMS</div>
            <div style={{ padding: '10px 12px', ...TILE }}>Status visible in 3D</div>
          </div>
        </Feature>

        {/* ================= 04 — inspection ================= */}
        <Feature id="inspection" step="04" title="Inspection & Maintenance">
          <p style={LEAD}>Every round walks the model instead of a clipboard. Checklists are attached to components, the history of each part travels with it, and the next service date is one click from the geometry.</p>
          <div style={{ display: 'grid', gap: 2, fontSize: 13 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', ...TILE }}>
              <span style={{ width: 18, height: 18, border: '2px solid #37d67a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#37d67a" strokeWidth="3.4"><path d="M4 13l5 5L20 7" /></svg>
              </span>
              <span style={{ flex: 1 }}>Tank T-201 · wall thickness</span>
              <span style={{ color: 'rgba(255,255,255,.45)', ...MONO, fontSize: 11 }}>PASS</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', ...TILE }}>
              <span style={{ width: 18, height: 18, border: '2px solid #ec3013', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 8, height: 8, background: '#ec3013' }} />
              </span>
              <span style={{ flex: 1 }}>Relief valve PSV-14 · set pressure</span>
              <span style={{ color: '#ec3013', ...MONO, fontSize: 11 }}>DUE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', ...TILE }}>
              <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,.3)' }} />
              <span style={{ flex: 1 }}>Exchanger E-301 · tube cleaning</span>
              <span style={{ color: 'rgba(255,255,255,.45)', ...MONO, fontSize: 11 }}>Q3</span>
            </div>
          </div>
          <div style={{ marginTop: 18, fontSize: 12, color: 'rgba(255,255,255,.5)' }}>Average round time down 38% across 12 sites.</div>
        </Feature>

        {/* ================= 05 — iot ================= */}
        <Feature id="iot" step="05" title="IoT Integration">
          <p style={LEAD}>Bind sensors, PLC tags and SCADA points to the parts they belong to. Live pressure, vibration and temperature stream onto the model itself, and an out-of-range tag lights up the exact component instead of a row in a table.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 2, marginBottom: 16 }}>
            <div style={{ ...TILE, padding: 14 }}>
              <div style={{ ...MONO, fontSize: 10, letterSpacing: '.14em', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>PT-101 · DISCHARGE</div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.02em' }}>12.4 <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.5)' }}>bar</span></div>
            </div>
            <div style={{ ...TILE, padding: 14 }}>
              <div style={{ ...MONO, fontSize: 10, letterSpacing: '.14em', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>VT-204 · BEARING</div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.02em', color: '#ec3013' }}>7.8 <span style={{ fontSize: 13, fontWeight: 600 }}>mm/s</span></div>
            </div>
            <div style={{ ...TILE, padding: 14 }}>
              <div style={{ ...MONO, fontSize: 10, letterSpacing: '.14em', color: 'rgba(255,255,255,.45)', marginBottom: 6 }}>TT-310 · MOTOR</div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-.02em' }}>68 <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,.5)' }}>°C</span></div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 13px', background: 'rgba(236,48,19,.12)', borderLeft: '2px solid #ec3013', fontSize: 13 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ec3013', animation: 'rmiBlink 1.2s infinite' }} />
            <strong style={{ color: '#ffffff' }}>Alarm</strong>
            <span style={{ color: 'rgba(255,255,255,.7)' }}>VT-204 above threshold — pin raised automatically on Pump P-101</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,.72)' }}>
            <span style={CHIP}>OPC UA</span>
            <span style={CHIP}>MQTT</span>
            <span style={CHIP}>Modbus TCP</span>
            <span style={CHIP}>REST / Webhook</span>
          </div>
        </Feature>

        {/* ================= 06 — digital manual ================= */}
        <Feature id="manual" step="06" title="3D Digital Manual">
          <p style={LEAD}>Disassembly, installation and overhaul procedures play as 3D animations instead of line drawings. Each step explodes the right parts, lists the tools and torque values, and a technician can scrub, replay and follow it on site.</p>
          <div style={{ display: 'grid', gap: 2, fontSize: 13, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(236,48,19,.14)', borderLeft: '2px solid #ec3013' }}>
              <span style={{ ...MONO, fontSize: 11, color: '#ec3013' }}>STEP 01</span>
              <span style={{ flex: 1, color: '#ffffff' }}>Isolate and drain the casing</span>
              <span style={{ color: 'rgba(255,255,255,.5)', ...MONO, fontSize: 11 }}>0:24</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', ...TILE }}>
              <span style={{ ...MONO, fontSize: 11, color: 'rgba(255,255,255,.45)' }}>STEP 02</span>
              <span style={{ flex: 1, color: 'rgba(255,255,255,.8)' }}>Remove coupling guard · 4 × M10</span>
              <span style={{ color: 'rgba(255,255,255,.4)', ...MONO, fontSize: 11 }}>0:41</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', ...TILE }}>
              <span style={{ ...MONO, fontSize: 11, color: 'rgba(255,255,255,.45)' }}>STEP 03</span>
              <span style={{ flex: 1, color: 'rgba(255,255,255,.8)' }}>Pull impeller · torque 95 N·m on refit</span>
              <span style={{ color: 'rgba(255,255,255,.4)', ...MONO, fontSize: 11 }}>1:12</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', border: '1px solid rgba(255,255,255,.14)' }}>
            <span style={{ width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#ec3013' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#ffffff"><path d="M8 5l11 7-11 7z" /></svg>
            </span>
            <span style={{ flex: 1, height: 4, background: 'rgba(255,255,255,.14)', position: 'relative' }}>
              <span style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '38%', background: '#ec3013' }} />
            </span>
            <span style={{ ...MONO, fontSize: 11, color: 'rgba(255,255,255,.55)' }}>0:34 / 1:29</span>
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: 'rgba(255,255,255,.5)' }}>Works offline on tablet · exports to PDF work instruction</div>
        </Feature>

        {/* ================= outro ================= */}
        <section style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'clamp(40px,8vh,100px) clamp(20px,5vw,80px)', pointerEvents: 'none' }}>
          <div style={{ maxWidth: 640, pointerEvents: 'auto' }}>
            <h2 style={{ fontSize: 'clamp(30px,3.6vw,56px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.06, margin: '0 0 18px', textWrap: 'balance' }}>One model. Six ways your team already works.</h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,.62)', margin: '0 auto', maxWidth: '48ch' }}>Meeting room, snapshot, pinned issues, maintenance rounds, live IoT data and the animated manual all read from the same twin — so the 3D you sell with is the 3D you operate with.</p>
          </div>
        </section>

      </div>

      {/* ================= call to action ================= */}
      <section id="cta" style={{ position: 'relative', zIndex: 4, background: '#0c0b0b', padding: 'clamp(56px,7vw,110px) clamp(20px,5vw,80px)', borderTop: '1px solid rgba(255,255,255,.1)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 'clamp(20px,2.4vw,40px)', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(28px,3.2vw,48px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1.08, margin: '0 0 16px', textWrap: 'balance' }}>Send one CAD file. See it live this week.</h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.62)', margin: '0 0 28px', maxWidth: '46ch' }}>We convert it, publish it, and hand you a meeting room link you can open with a customer the same day.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <a className="rmi-btn" href="#" style={{ ...BTN, padding: '15px 30px' }}>
                Book a demo
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4"><path d="M4 12h15M13 6l6 6-6 6" /></svg>
              </a>
              <a className="rmi-btn-ghost" href="#" style={{ ...BTN_GHOST, padding: '15px 30px' }}>Talk to sales</a>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.12)' }}>
            {[['38%', 'Faster inspection rounds'], ['2.4M+', 'Model views served'], ['18K+', 'Issues pinned in 3D'], ['1,200+', 'Manufacturers onboard']].map(([n, label]) => (
              <div key={label} style={{ background: '#0c0b0b', padding: 24 }}>
                <div style={{ fontSize: 'clamp(28px,3vw,42px)', fontWeight: 700, letterSpacing: '-.03em', lineHeight: 1 }}>{n}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter fromHome />

    </div>
  );
}
