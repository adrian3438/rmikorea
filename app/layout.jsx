import { Archivo } from 'next/font/google';
import './globals.css';

// Self-hosted at build time by next/font — the page no longer reaches out to
// fonts.googleapis.com on load, and there is no swap flash.
const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-archivo',
});

export const metadata = {
  title: 'RMI Global 3D — Your product, alive in 3D',
  description:
    'One shared 3D twin for the way teams already work: meeting room, snapshot, pinned issues, inspection rounds, live IoT data and the animated digital manual.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>{children}</body>
    </html>
  );
}
