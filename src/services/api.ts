/**
 * SocialHub API Service
 * Wrapper untuk fetch dengan penanganan token otomatis
 */

const API_URL = '/api';

interface RequestOptions extends RequestInit {
  body?: any;
}

async function apiFetch(endpoint: string, options: RequestOptions = {}) {
  const token = localStorage.getItem('socialhub_token');
  
  const headers = new Headers(options.headers || {});
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Jika body adalah object, ubah ke JSON string (kecuali jika FormData)
  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    body,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Terjadi kesalahan sistem');
  }

  return data;
}

export const api = {
  get: (endpoint: string) => apiFetch(endpoint, { method: 'GET' }),
  post: (endpoint: string, body?: any) => apiFetch(endpoint, { method: 'POST', body }),
  put: (endpoint: string, body?: any) => apiFetch(endpoint, { method: 'PUT', body }),
  delete: (endpoint: string) => apiFetch(endpoint, { method: 'DELETE' }),
};
