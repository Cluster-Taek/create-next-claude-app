import { createFetchError, handleApiError } from './error';
import { type Body, type FetchApi } from './types';

// 클라이언트 토큰 저장소
let authToken: string | null = null;

/**
 * 클라이언트 환경에서 인증 토큰 설정
 * AuthProvider에서 세션 변경 시 호출됨
 */
export const setupClientAuth = (token: string | null) => {
  /* v8 ignore start -- 서버 전용: happy-dom에서 도달 불가 */
  if (typeof window === 'undefined') {
    console.warn('setupClientAuth should only be called on client');
    return;
  }
  /* v8 ignore stop */
  authToken = token;
};

/**
 * 인증 헤더 생성 (환경별 분기)
 */
const getAuthHeaders = async (): Promise<Record<string, string>> => {
  const isServer = typeof window === 'undefined';

  /* v8 ignore start -- 서버 전용: happy-dom에서 도달 불가 */
  if (isServer) {
    const { getServerSession } = await import('next-auth');
    const { authOptions } = await import('@app/api/auth/[...nextauth]/auth-options');
    const session = await getServerSession(authOptions);
    return session?.user?.accessToken ? { Authorization: `Bearer ${session.user.accessToken}` } : {};
  }
  /* v8 ignore stop */

  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

/**
 * /api/* 경로를 실제 API URL로 변환
 */
const resolveApiUrl = (url: string): string => {
  if (url.startsWith('/api/') && !url.startsWith('/api/auth')) {
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
  const authHeaders = await getAuthHeaders();

  const response = await fetch(requestUrl, {
    method,
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
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
