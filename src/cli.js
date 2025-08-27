#!/usr/bin/env node
import { searchOffers } from './olx.js';
import { exportToCsv } from './exporter.js';

function printUsage() {
  console.log('Usage: npm run search -- --q "<query>" [--limit N] [--out file.csv]');
}

function parseArgs(argv) {
  const args = { q: undefined, limit: 50, out: 'olx_results.csv' };
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    const val = argv[i + 1];
    if (key === '--q') (args.q = val), (i += 1);
    else if (key === '--limit') (args.limit = Number(val)), (i += 1);
    else if (key === '--out') (args.out = val), (i += 1);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv);
  if (!args.q) {
    printUsage();
    process.exitCode = 1;
    return;
  }
  const offers = await searchOffers(args.q, { limit: args.limit });
  const output = offers.map((o) => ({
    title: o.title,
    url: o.url,
    price: o.price,
    currency: o.currency,
  }));
  const outPath = await exportToCsv(output, args.out);
  console.log(`Wrote ${output.length} rows to ${outPath}`);
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
