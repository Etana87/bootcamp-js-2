import type { Personaje } from './types';

const API_BASE = 'http://localhost:3000';

export async function fetchPersonajes(query?: string): Promise<Personaje[]> {
  const url = query && query.trim() !== ''
    ? `${API_BASE}/personajes?nombre_like=${encodeURIComponent(query)}`
    : `${API_BASE}/personajes`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }
  const data = (await res.json()) as Personaje[];
  return data;
}
