/** @type {import('next').NextConfig} */
const nextConfig = {
  // nginx serves the built files as plain static HTML — no Node process in production.
  // `next build` therefore has to emit a finished site into out/, not a server bundle.
  output: 'export',

  // The export target has no image optimiser behind it, so next/image must not
  // rewrite src into /_next/image?... URLs that nothing would answer.
  images: { unoptimized: true },
};

export default nextConfig;
