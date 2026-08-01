function getApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && !envUrl.includes('localhost')) {
    return envUrl;
  }
  if (typeof window !== 'undefined' && window.location.hostname && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:3001/api`;
  }
  return envUrl || 'http://localhost:3001/api';
}

export function resolveMediaUrl(url?: string | null): string {
  if (!url) return '';
  const apiBase = getApiBaseUrl().replace(/\/api\/?$/, '');

  if (url.startsWith('/uploads')) {
    return `${apiBase}${url}`;
  }

  if (url.includes('/uploads/')) {
    const filename = url.substring(url.indexOf('/uploads/'));
    return `${apiBase}${filename}`;
  }

  return url;
}

function getToken(): string | null {
  return localStorage.getItem('hookahlab_jwt_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const err = await res.json() as { message?: string };
      message = err.message || message;
    } catch {
      // ignore JSON parse error
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function apiLogin(
  username: string,
  password: string,
): Promise<{ access_token: string; username: string }> {
  const res = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res);
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function apiGetCategories() {
  const res = await fetch(`${getApiBaseUrl()}/categories`);
  return handleResponse(res);
}

export async function apiCreateCategory(data: object) {
  const res = await fetch(`${getApiBaseUrl()}/categories`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiUpdateCategory(id: string, data: object) {
  const res = await fetch(`${getApiBaseUrl()}/categories/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiDeleteCategory(id: string) {
  const res = await fetch(`${getApiBaseUrl()}/categories/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function apiReorderCategories(items: { id: string; position: number }[]) {
  const res = await fetch(`${getApiBaseUrl()}/categories/reorder`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(items),
  });
  return handleResponse(res);
}

// ── Sub Categories ─────────────────────────────────────────────────────────────

export async function apiCreateSubCategory(categoryId: string, data: object) {
  const res = await fetch(`${getApiBaseUrl()}/categories/${categoryId}/subcategories`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiUpdateSubCategory(categoryId: string, subId: string, data: object) {
  const res = await fetch(`${getApiBaseUrl()}/categories/${categoryId}/subcategories/${subId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiDeleteSubCategory(categoryId: string, subId: string) {
  const res = await fetch(`${getApiBaseUrl()}/categories/${categoryId}/subcategories/${subId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

// ── Products ──────────────────────────────────────────────────────────────────

export async function apiCreateProduct(categoryId: string, data: object) {
  const res = await fetch(`${getApiBaseUrl()}/categories/${categoryId}/products`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiUpdateProduct(categoryId: string, productId: number, data: object) {
  const res = await fetch(`${getApiBaseUrl()}/categories/${categoryId}/products/${productId}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

export async function apiDeleteProduct(categoryId: string, productId: number) {
  const res = await fetch(`${getApiBaseUrl()}/categories/${categoryId}/products/${productId}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return handleResponse(res);
}

export async function apiReorderProducts(items: { id: number; position: number }[]) {
  const res = await fetch(`${getApiBaseUrl()}/categories/products/reorder`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(items),
  });
  return handleResponse(res);
}

// ── Welcome Media ─────────────────────────────────────────────────────────────

export async function apiGetWelcome() {
  const res = await fetch(`${getApiBaseUrl()}/welcome`);
  return handleResponse(res);
}

export async function apiUploadFile(file: File): Promise<{ url: string; filename: string; originalname: string; size: number }> {
  const token = getToken();
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${getApiBaseUrl()}/upload`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // Do NOT set Content-Type — browser sets it with boundary automatically
    },
    body: formData,
  });
  return handleResponse(res);
}

export async function apiUpdateWelcome(data: object) {
  const res = await fetch(`${getApiBaseUrl()}/welcome`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

// ── Store Settings & Contact Info ──────────────────────────────────────────────

export async function apiGetSettings() {
  const res = await fetch(`${getApiBaseUrl()}/settings`);
  return handleResponse(res);
}

export async function apiUpdateSettings(data: object) {
  const res = await fetch(`${getApiBaseUrl()}/settings`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  });
  return handleResponse(res);
}

