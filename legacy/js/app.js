/* Scroll choreography: maps page scroll onto the 3D camera story, drives the
   progress dots, fades the stage out past the story, and runs the screenshot lightbox. */
(function () {
  var STAGE_COUNT = 7;          // camera keyframe spans in scene.js (0..7)
  var raf = null, watch = null;

  function lateral() { return window.innerWidth >= 900 ? 0.12 : 0; }

  function tick() {
    raf = null;
    var track = document.getElementById('rmi-track');
    if (!track || !window.RMI3D) return;
    var vh = window.innerHeight;
    var top = track.offsetTop;
    var span = Math.max(1, track.offsetHeight - vh);
    var p = Math.max(0, Math.min(1, (window.scrollY - top) / span)) * STAGE_COUNT;
    var past = Math.max(0, Math.min(1, (window.scrollY - top - span) / (vh * 0.5)));

    window.RMI3D.setProgress(p);
    var stage = document.getElementById('rmi-stage');
    if (stage) stage.style.opacity = (1 - past).toFixed(3);
    document.querySelectorAll('[data-rmi-dot]').forEach(function (el) {
      el.style.background = Math.abs(p - +el.dataset.rmiDot) < 0.5 ? '#ec3013' : 'rgba(255,255,255,.25)';
    });
  }
  function sched() { if (!raf) raf = requestAnimationFrame(tick); }

  function start() {
    var c = document.getElementById('rmi-canvas');
    if (!window.THREE || !window.RMI3D || !c) { setTimeout(start, 120); return; }
    window.RMI3D.init(c, { lateral: lateral() });
    tick();
    watch = setInterval(tick, 600);   // catches layout shifts (fonts, images)
  }

  // hover states declared inline as data-hover="prop:value;prop:value"
  function bindHovers() {
    document.querySelectorAll('[data-hover]').forEach(function (el) {
      var rules = el.getAttribute('data-hover').split(';').filter(Boolean).map(function (r) {
        var i = r.indexOf(':');
        return [r.slice(0, i).trim(), r.slice(i + 1).trim()];
      });
      var prev = [];
      el.addEventListener('mouseenter', function () {
        prev = rules.map(function (r) { return [r[0], el.style.getPropertyValue(r[0])]; });
        rules.forEach(function (r) { el.style.setProperty(r[0], r[1]); });
      });
      el.addEventListener('mouseleave', function () {
        prev.forEach(function (r) { el.style.setProperty(r[0], r[1]); });
      });
    });
  }

  function bindLightbox() {
    var box = document.getElementById('rmi-lightbox');
    var shot = document.getElementById('rmi-shot');
    if (!box || !shot) return;
    var open = function () { box.style.display = 'flex'; };
    var close = function (e) { if (e) e.stopPropagation(); box.style.display = 'none'; };
    shot.addEventListener('click', open);
    box.querySelectorAll('[data-close]').forEach(function (el) { el.addEventListener('click', close); });
    box.addEventListener('click', close);
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  function init() {
    bindHovers();
    bindLightbox();
    window.addEventListener('scroll', sched, { passive: true });
    window.addEventListener('resize', function () { if (window.RMI3D) window.RMI3D.setLateral(lateral()); sched(); });
    start();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
