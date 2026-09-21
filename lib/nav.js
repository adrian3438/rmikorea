/** Shared navigation model, so the header and footer never drift apart. */

// In-page sections of the landing page. On the landing page these are bare
// hashes; from any other route they need a leading "/" to get back there first.
export const SECTIONS = [
  { hash: '#meeting', label: 'Meeting Room' },
  { hash: '#snapshot', label: 'Snapshot' },
  { hash: '#pin', label: 'PIN Issue' },
  { hash: '#inspection', label: 'Inspection' },
  { hash: '#iot', label: 'IoT' },
  { hash: '#manual', label: 'Digital Manual' },
];

// Tools that live on their own route.
export const TOOLS = [
  { href: '/dwg-converter', label: 'AI DWG Converter' },
];

export function sectionHref(hash, fromHome) {
  return fromHome ? hash : `/${hash}`;
}
