const BASE_URL = 'http://localhost:3000/api';

const getToken = () => localStorage.getItem('token');

const headers = (auth = false): HeadersInit => ({
  'Content-Type': 'application/json',
  ...(auth && getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
});

const handle = async (res: Response) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }));
    throw new Error(err.error || `Erro ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
};

// AUTH
export const login = (email: string, password: string) =>
  fetch(`${BASE_URL}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify({ email, password }) }).then(handle);

// USERS
export const getUsers = () => fetch(`${BASE_URL}/users`, { headers: headers(true) }).then(handle);
export const getUser = (id: number) => fetch(`${BASE_URL}/users/${id}`, { headers: headers(true) }).then(handle);
export const createUser = (data: object) => fetch(`${BASE_URL}/users`, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handle);
export const updateUser = (id: number, data: object) => fetch(`${BASE_URL}/users/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(handle);
export const deleteUser = (id: number) => fetch(`${BASE_URL}/users/${id}`, { method: 'DELETE', headers: headers(true) }).then(handle);

// CATEGORIES
export const getCategories = () => fetch(`${BASE_URL}/categories`, { headers: headers() }).then(handle);
export const getCategory = (id: number) => fetch(`${BASE_URL}/categories/${id}`, { headers: headers() }).then(handle);
export const createCategory = (data: object) => fetch(`${BASE_URL}/categories`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handle);
export const searchCategories = (q: string) => fetch(`${BASE_URL}/categories/search?q=${encodeURIComponent(q)}`, { headers: headers() }).then(handle);
export const getCategoryPrompts = (id: number) => fetch(`${BASE_URL}/categories/${id}/prompts`, { headers: headers() }).then(handle);

// PROMPTS
export const getPrompts = () => fetch(`${BASE_URL}/prompts`, { headers: headers() }).then(handle);
export const getPrompt = (id: number) => fetch(`${BASE_URL}/prompts/${id}`, { headers: headers() }).then(handle);
export const createPrompt = (data: object) => fetch(`${BASE_URL}/prompts`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handle);
export const updatePrompt = (id: number, data: object) => fetch(`${BASE_URL}/prompts/${id}`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(handle);
export const deletePrompt = (id: number) => fetch(`${BASE_URL}/prompts/${id}`, { method: 'DELETE', headers: headers(true) }).then(handle);
export const searchPrompts = (q: string) => fetch(`${BASE_URL}/prompts/search?q=${encodeURIComponent(q)}`, { headers: headers() }).then(handle);

// VERSIONS
export const getVersions = (promptId: number) => fetch(`${BASE_URL}/prompts/${promptId}/versions`, { headers: headers() }).then(handle);
export const getVersion = (versionId: number) => fetch(`${BASE_URL}/versions/${versionId}`, { headers: headers() }).then(handle);
export const createVersion = (promptId: number, data: object) => fetch(`${BASE_URL}/prompts/${promptId}/versions`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handle);
export const deleteVersion = (versionId: number) => fetch(`${BASE_URL}/versions/${versionId}`, { method: 'DELETE', headers: headers(true) }).then(handle);

// COMMENTS
export const getComments = (promptId: number) => fetch(`${BASE_URL}/prompts/${promptId}/comments`, { headers: headers() }).then(handle);
export const addComment = (promptId: number, data: object) => fetch(`${BASE_URL}/prompts/${promptId}/comments`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handle);
export const deleteComment = (commentId: number) => fetch(`${BASE_URL}/comments/${commentId}`, { method: 'DELETE', headers: headers(true) }).then(handle);

// RATINGS
export const ratePrompt = (promptId: number, data: object) => fetch(`${BASE_URL}/prompts/${promptId}/rating`, { method: 'POST', headers: headers(true), body: JSON.stringify(data) }).then(handle);
export const updateRating = (promptId: number, data: object) => fetch(`${BASE_URL}/prompts/${promptId}/rating`, { method: 'PUT', headers: headers(true), body: JSON.stringify(data) }).then(handle);
export const deleteRating = (promptId: number) => fetch(`${BASE_URL}/prompts/${promptId}/rating`, { method: 'DELETE', headers: headers(true) }).then(handle);
export const deleteRatingAdmin = (ratingId: number) => fetch(`${BASE_URL}/ratings/${ratingId}`, { method: 'DELETE', headers: headers(true) }).then(handle);