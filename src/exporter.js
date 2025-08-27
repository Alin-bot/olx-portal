import fs from 'node:fs';
import path from 'node:path';

function escapeCsv(value) {
  const s = value == null ? '' : String(value);
  if (/[",\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export async function exportToCsv(rows, outfile) {
  if (!Array.isArray(rows)) throw new Error('rows must be an array');
  const outputPath = path.resolve(process.cwd(), outfile || 'olx_results.csv');
  const header = ['Title', 'Link', 'Price'];
  const normalized = rows.map((r) => ({
    title: r.title ?? '',
    url: r.url ?? '',
    priceFormatted: r.price != null && r.currency ? `${r.price} ${r.currency}` : r.price ?? '',
  }));
  const lines = [header.join(',')].concat(
    normalized.map((r) => [escapeCsv(r.title), escapeCsv(r.url), escapeCsv(r.priceFormatted)].join(','))
  );
  await fs.promises.writeFile(outputPath, lines.join('\n'), 'utf8');
  return outputPath;
}
