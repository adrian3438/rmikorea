# RMI Global 3D — scroll-driven 3D landing page

Next.js (App Router), exported as a static site. There is no server runtime in
production: `next build` writes finished HTML/CSS/JS into `out/`, and nginx serves
that directory directly.

    app/
      layout.jsx      <html>, metadata, Archivo via next/font
      page.jsx        every section's markup (server component — ships as static HTML)
      globals.css     resets, keyframes, hover classes, responsive rules
    components/
      Stage.jsx       'use client' — the fixed 3D canvas, scroll -> camera, progress dots
      Screenshot.jsx  'use client' — the Sales Meeting Room shot and its lightbox
    lib/
      scene.js        three.js scene: skid model, lighting, camera story, PIN sprites
    public/img/       logo + Sales Meeting Room screenshot
    legacy/           the original no-build HTML/CSS/JS version, kept for reference

Only `page.jsx` and `layout.jsx` render on the server. Everything that needs a
browser lives in the two client components, so the page arrives as complete markup
and the 3D stage hydrates on top of it.

## Running it

    npm install
    npm run dev      # http://localhost:3000
    npm run build    # writes out/

`npm start` is not used — `output: 'export'` in `next.config.mjs` means there is no
server to start. To preview a build: `npx serve out`.

## Deploying

First time only — tell the script where to deploy:

    cp scripts/deploy.env.example scripts/deploy.env
    # fill in RMI_HOST and RMI_SSH_KEY

`deploy.env` is gitignored on purpose: this repo is public, so the host and account
do not belong in it. Exporting `RMI_HOST` / `RMI_SSH_KEY` in your shell works too.

    ./scripts/deploy.sh

Builds, rsyncs `out/` to a staging directory on the web server, checksums every file
against the local build, and only then swaps it into place and reloads nginx. If the
upload does not match, it stops and leaves the live site untouched.

The previous build stays at `/var/www/rmikorea.prev`. To roll back:

    mv /var/www/rmikorea /var/www/rmikorea.bad
    mv /var/www/rmikorea.prev /var/www/rmikorea
    systemctl reload nginx

Served as `rmikorea.com` / `www.rmikorea.com` from `/var/www/rmikorea`, nginx site
`rmikorea.conf`, HTTPS via Let's Encrypt (certbot `--nginx`, auto-renewing; port 80
301-redirects to 443).

## Where to change things

- **Copy / sections** — `app/page.jsx`. The six feature blocks go through one
  `<Feature id step title>` component; only their bodies differ.
- **Camera story** — `STAGES` at the top of `lib/scene.js`: one entry per scroll step
  (`x/y/z` look-at target, `r` distance, `th` yaw, `ph` pitch). Adding or removing an
  entry means updating `STAGE_COUNT` and `DOTS` in `components/Stage.jsx`.
- **Model** — `buildModel()` in `lib/scene.js` builds the skid from primitives. To use a
  real CAD asset instead, load a GLB with `GLTFLoader` and swap the returned group.
- **Materials / lighting** — the `mat()` block and the light setup in `createScene()`.
- **Brand colour** — `#ec3013`, used in both `page.jsx` and `lib/scene.js`.
- **Hover states** — classes in `globals.css` (`.rmi-btn`, `.rmi-link`, …). The property
  a class overrides must not also be set inline, or the inline value wins.

## Dependencies

three.js is pinned to **0.128.0** and bundled — not loaded from a CDN. Do not bump it
casually: `lib/scene.js` uses `outputEncoding` / `sRGBEncoding`, which r152 removed in
favour of `outputColorSpace`. Archivo is self-hosted by `next/font`, so the page makes
no third-party requests at runtime.

## Known gaps

- **The AI DWG Converter does not convert yet.** `/dwg-converter` is a finished screen
  — upload, validation and every state work — but `lib/dwg-converter.js` has no engine
  behind it, so it stops at "no conversion engine is connected" rather than handing
  over a file that is not a real DWG. Set `NEXT_PUBLIC_DWG_ENDPOINT` and implement the
  request in that one file to finish it.
- **No mobile nav.** The header nav is hidden below 1280px and there is no menu button;
  the footer repeats every link so nothing is unreachable, but a narrow-screen menu is
  still missing.
