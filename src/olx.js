const BASE_URL = 'https://www.olx.ro/api/v1/offers/';

export async function searchOffers(query, { limit = 50, offset = 0 } = {}) {
  if (!query || typeof query !== 'string') {
    throw new Error('query is required and must be a string');
  }
  const params = new URLSearchParams({ q: query, limit: String(limit), offset: String(offset) });
  const url = `${BASE_URL}?${params.toString()}`;
  const res = await fetch(url, { headers: { accept: 'application/json' } });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching OLX offers`);
  }
  const data = await res.json();
  const items = Array.isArray(data && data.data) ? data.data : [];
  return items.map((item) => {
    const priceParam = Array.isArray(item.params) ? item.params.find((p) => p.key === 'price') : undefined;
    const priceValue = priceParam?.value?.value ?? null;
    const currency = priceParam?.value?.currency ?? null;
    return {
      id: item.id,
      title: item.title,
      url: item.url,
      price: priceValue,
      currency,
    };
  });
}
