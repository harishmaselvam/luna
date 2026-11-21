const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function requestJson(path, method = 'GET', payload) {
  const options = { method, credentials: 'include' };
  if (payload !== undefined) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(payload);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || `Request failed (${response.status}).`);
  }

  return result;
}

export function getJson(path) {
  return requestJson(path);
}

export function postJson(path, payload) {
  return requestJson(path, 'POST', payload);
}

export function deleteJson(path) {
  return requestJson(path, 'DELETE');
}
