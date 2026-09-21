/**
 * PDF -> DWG conversion adapter.
 *
 * This is the ONLY place that knows how a conversion actually happens. The screen
 * in components/DwgConverter.jsx talks to `convertPdfToDwg` and nothing else, so
 * swapping engines later is a change to this file alone.
 *
 * Nothing is wired up yet — the site is a static export with no backend, and DWG is
 * a closed binary format that cannot be written in the browser. Until an engine is
 * chosen, convertPdfToDwg throws ConverterNotConfiguredError and the UI says so
 * plainly rather than handing anyone a file that is not a real DWG.
 *
 * To wire one up, set NEXT_PUBLIC_DWG_ENDPOINT at build time and implement the
 * request below to match whatever that endpoint expects.
 */

export const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export class ConverterNotConfiguredError extends Error {
  constructor() {
    super('No conversion engine is configured.');
    this.name = 'ConverterNotConfiguredError';
  }
}

export class ConversionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConversionError';
  }
}

const ENDPOINT = process.env.NEXT_PUBLIC_DWG_ENDPOINT || '';

export function isConfigured() {
  return Boolean(ENDPOINT);
}

/** Reject obviously wrong input before any upload happens. */
export function validatePdf(file) {
  if (!file) return 'Choose a PDF file first.';
  const looksPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  if (!looksPdf) return `${file.name} is not a PDF.`;
  if (file.size === 0) return `${file.name} is empty.`;
  if (file.size > MAX_BYTES) {
    return `${file.name} is ${formatBytes(file.size)} — the limit is ${formatBytes(MAX_BYTES)}.`;
  }
  return null;
}

export function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export function dwgNameFor(pdfName) {
  return pdfName.replace(/\.pdf$/i, '') + '.dwg';
}

/**
 * Convert `file` and resolve to { filename, blob }.
 *
 * @param {File} file
 * @param {{ onProgress?: (pct: number, stage: string) => void, signal?: AbortSignal }} opts
 */
export async function convertPdfToDwg(file, { onProgress, signal } = {}) {
  const problem = validatePdf(file);
  if (problem) throw new ConversionError(problem);

  if (!ENDPOINT) throw new ConverterNotConfiguredError();

  onProgress?.(5, 'uploading');

  const body = new FormData();
  body.append('file', file, file.name);

  let res;
  try {
    res = await fetch(ENDPOINT, { method: 'POST', body, signal });
  } catch (err) {
    if (err?.name === 'AbortError') throw err;
    throw new ConversionError('Could not reach the conversion service.');
  }

  if (!res.ok) {
    throw new ConversionError(`The conversion service returned ${res.status}.`);
  }

  onProgress?.(70, 'converting');
  const blob = await res.blob();
  onProgress?.(100, 'done');

  // Prefer the filename the service reports, fall back to the uploaded name.
  const disposition = res.headers.get('content-disposition') || '';
  const match = /filename\*?=(?:UTF-8'')?"?([^";]+)"?/i.exec(disposition);
  const filename = match ? decodeURIComponent(match[1]) : dwgNameFor(file.name);

  return { filename, blob };
}
