import axios from 'axios';

const BASE_URL = 'https://www.olx.ro/api/v1/offers/';

export async function searchOffers(query, { limit = 50, offset = 0 } = {}) {
  if (!query || typeof query !== 'string') {
    throw new Error('query is required and must be a string');
  }
  const params = new URLSearchParams({ q: query, limit: String(limit), offset: String(offset) });
  const url = `${BASE_URL}?${params.toString()}`;
  let data;
  try {
    const resp = await axios.get(url, {
      headers: {
        accept: 'application/json',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9,ro;q=0.8',
        referer: 'https://www.olx.ro/',
        origin: 'https://www.olx.ro',
      },
      timeout: 15000,
      validateStatus: (s) => s >= 200 && s < 300,
    });
    data = resp.data;
  } catch (err) {
    const res = await fetch(url, {
      headers: {
        accept: 'application/json',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9,ro;q=0.8',
        referer: 'https://www.olx.ro/',
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} fetching OLX offers`);
    }
    data = await res.json();
  }
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
