import { createFetchError, handleApiError } from './error';
import { type Body, type FetchApi } from './types';

/**
 * /api/* 경로를 실제 API URL로 변환
 */
const resolveApiUrl = (url: string): string => {
  if (url.startsWith('/api/')) {
    const apiPath = url.replace('/api', '');
    return `${process.env.NEXT_PUBLIC_API_URL}${apiPath}`;
  }
  return url;
};

const buildUrl = (url: string, params?: Record<string, unknown>): string => {
  if (!params || Object.keys(params).length === 0) return url;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      value.forEach((item) => searchParams.append(key, String(item)));
    } else {
      searchParams.append(key, String(value));
    }
  });

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${searchParams.toString()}`;
};

/**
 * 통합 fetch wrapper
 */
const request = async <T = object>(method: string, url: string, body?: Body, options?: RequestInit): Promise<T> => {
  const isServer = typeof window === 'undefined';
  const isGet = method === 'GET';
  const resolvedUrl = resolveApiUrl(url);
  const requestUrl = isGet ? buildUrl(resolvedUrl, body as Record<string, unknown>) : resolvedUrl;

  const response = await fetch(requestUrl, {
    method,
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...(!isServer && { credentials: 'include' }),
    body: !isGet && body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let data;
    try {
      data = await response.json();
    } catch {
      // JSON 파싱 실패 시 무시
    }
    const error = createFetchError(response.status, response.statusText, data);

    /* v8 ignore start -- 서버 전용: happy-dom에서 도달 불가 */
    if (isServer) {
      console.error('Server API error:', { status: error.status, url, method });
      throw error;
    }
    /* v8 ignore stop */
    return handleApiError(error);
  }

  if (response.status === 204) return null as T;
  return response.json();
};

export const fetchApi: FetchApi = {
  post: (url, body, options) => request('POST', url, body, options),
  get: (url, params, options) => request('GET', url, params, options),
  patch: (url, body, options) => request('PATCH', url, body, options),
  put: (url, body, options) => request('PUT', url, body, options),
  delete: (url, options) => request('DELETE', url, undefined, options),
};
