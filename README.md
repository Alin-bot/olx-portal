Basic service that connects to OLX RO public search JSON and exports results to CSV.

Usage

1) Install deps:
```
npm install
```

2) Run a search and write CSV:
```
npm run search -- --q "dacia dokker" --limit 50 --out olx_results.csv
```

Notes

- No OLX credentials required for public search.
- Price is parsed from the `params` array where `key === "price"`.
- Output CSV columns: Title, Link, Price.
- Future: support additional filters and formats.
