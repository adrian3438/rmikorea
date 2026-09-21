# RMI Global 3D — scroll-driven 3D landing page

Plain HTML / CSS / JS. No build step, no framework, no package manager.

    export/
      index.html      markup for every section
      css/site.css    resets, keyframes, hover + responsive rules
      js/scene.js     three.js scene: skid model, lighting, camera story, PIN sprites
      js/app.js       scroll -> camera progress, progress dots, lightbox, hover binding
      img/            logo + Sales Meeting Room screenshot

## Running it in PhpStorm

1. `File > Open` this `export` folder (or drop it into your project's web root).
2. Right-click `index.html` > `Open in Browser` — PhpStorm's built-in server serves it.
   Opening via `file://` also works; three.js is loaded from a CDN.

Serving under a PHP app: the page is static, so just include it as a view/partial
(rename to `index.php`) and keep the `css/ js/ img/` paths relative to it.

## Where to change things

- **Copy / sections** — `index.html`. Each feature block is a `<section id="...">`
  (`meeting`, `snapshot`, `pin`, `inspection`, `iot`, `manual`).
- **Camera story** — `STAGES` at the top of `js/scene.js`: one entry per scroll step
  (`x/y/z` look-at target, `r` distance, `th` yaw, `ph` pitch). Adding or removing an
  entry means updating `STAGE_COUNT` in `js/app.js` and the dot list in `index.html`.
- **Model** — `buildModel()` in `js/scene.js` builds the skid from primitives. To use a
  real CAD asset instead, load a GLB with `THREE.GLTFLoader` and swap the returned group.
- **Materials / lighting** — the `mat()` block and `init()` in `js/scene.js`.
- **Brand colour** — `#ec3013`, used in both the markup and `scene.js`.

## Dependency

three.js r128, loaded from unpkg in `index.html`. For an offline build, download
`three.min.js` into `js/vendor/` and point the script tag at it.
