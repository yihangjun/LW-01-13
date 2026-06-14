const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const REQUEST_TIMEOUT_MS = 25000;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError('请求超时，后端可能正在唤醒，请稍后重试', 408);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export async function request(path, options = {}) {
  const { body, headers, ...rest } = options;
  const res = await fetchWithTimeout(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let payload;
  try {
    payload = await res.json();
  } catch {
    payload = {};
  }

  if (!res.ok) {
    throw new ApiError(payload.message || '请求失败', res.status);
  }

  return payload;
}

export async function checkApiHealth() {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/health`);
    return res.ok;
  } catch {
    return false;
  }
}
