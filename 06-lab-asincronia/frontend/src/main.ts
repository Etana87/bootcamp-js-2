import './style.css';
import { fetchPersonajes } from './api';
import type { Personaje } from './types';

const form = document.getElementById('search-form') as HTMLFormElement | null;
const input = document.getElementById('search-input') as HTMLInputElement | null;
const results = document.getElementById('results') as HTMLElement | null;
const status = document.getElementById('status') as HTMLElement | null;

const API_IMAGE_PREFIX = 'http://localhost:3000/';

function createCard(personaje: Personaje): HTMLElement {
  const article = document.createElement('article');
  article.className = 'card';

  const img = document.createElement('img');
  img.alt = personaje.nombre;
  img.src = personaje.imagen ? `${API_IMAGE_PREFIX}${personaje.imagen}` : '';
  img.loading = 'lazy';
  img.addEventListener('error', () => {
    img.src = 'https://via.placeholder.com/240x240?text=Sin+imagen';
  });

  const body = document.createElement('div');
  body.className = 'card-body';
  body.innerHTML = `
    <h3>${personaje.nombre}</h3>
    <p><strong>Apodo:</strong> ${personaje.apodo ?? '-'}</p>
    <p><strong>Especialidad:</strong> ${personaje.especialidad ?? '-'}</p>
    <p><strong>Habilidades:</strong> ${personaje.habilidades?.join(', ') ?? '-'}</p>
    <p><strong>Amigo:</strong> ${personaje.amigo ?? '-'}</p>
  `;

  article.appendChild(img);
  article.appendChild(body);
  return article;
}

async function render(query?: string) {
  if (!results || !status) return;
  results.innerHTML = '';
  status.textContent = 'Cargando...';

  try {
    const personajes = await fetchPersonajes(query);
    status.textContent = `${personajes.length} personaje(s) encontrados.`;

    if (personajes.length === 0) {
      results.innerHTML = `<p class="no-results">No se encontraron personajes.</p>`;
      return;
    }

    const fragment = document.createDocumentFragment();
    personajes.forEach(p => fragment.appendChild(createCard(p)));
    results.appendChild(fragment);
  } catch (error) {
    console.error('Error al cargar personajes:', error);
    status.textContent = 'Error al conectar con la API. Mira la consola.';
    results.innerHTML = '';
  }
}

// submit del formulario -> filtrar
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = input?.value ?? '';
  render(q);
});

// limpiar búsqueda -> mostrar todos
document.getElementById('clear-btn')?.addEventListener('click', () => {
  if (input) input.value = '';
  render();
});

// al cargar la página mostramos todos
window.addEventListener('DOMContentLoaded', () => render());
