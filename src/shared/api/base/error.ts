import { type IApiError } from '@/shared/model';

export class FetchError extends Error {
  status: number;
  statusText: string;
  data?: IApiError;

  constructor(status: number, statusText: string, data?: IApiError) {
    super(`${status} ${statusText}`);
    this.name = 'FetchError';
    this.status = status;
    this.statusText = statusText;
    this.data = data;
  }
}

// status는 HTTP 응답 코드로 이미 확보되므로 message 필드만 요구한다.
// 백엔드가 { message } 형태만 반환하는 경우에도 에러 상세 정보를 보존하기 위함.
const hasApiErrorData = (data: unknown): data is IApiError =>
  typeof data === 'object' && data !== null && 'message' in data;

export const createFetchError = (status: number, statusText: string, data?: unknown): FetchError =>
  new FetchError(status, statusText, hasApiErrorData(data) ? data : undefined);

/**
 * API 에러 처리 (401 리다이렉트는 클라이언트 전용)
 */
export const handleApiError = async (error: FetchError): Promise<never> => {
  const { status, data } = error;

  if (status === 401 && typeof window !== 'undefined' && window.location.pathname !== '/login') {
    const { signOut } = await import('next-auth/react');
    await signOut({ redirect: false });
    window.location.href = '/login';
  }

  if (status === 403) {
    console.error('Access denied:', data);
  }

  if (status >= 500) {
    console.error('Server error:', data);
  }

  throw error;
};
