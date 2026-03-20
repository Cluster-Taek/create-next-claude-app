import { isApiError, type IApiError } from '@/shared/model';

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

export const createFetchError = (status: number, statusText: string, data?: unknown): FetchError =>
  new FetchError(status, statusText, isApiError(data) ? data : undefined);

/**
 * API 에러 처리 (클라이언트 전용)
 */
export const handleApiError = async (error: FetchError): Promise<never> => {
  const { status, data } = error;

  if (status === 401 && typeof window !== 'undefined' && window.location.pathname !== '/login') {
    const { signOut } = await import('next-auth/react');
    await signOut({ redirect: false });
    window.location.href = '/login';
    return new Promise<never>(() => {}); // 리다이렉트 중 후속 코드 실행 방지
  }

  if (status === 403) {
    console.error('Access denied:', data);
  }

  if (status >= 500) {
    console.error('Server error:', data);
  }

  throw error;
};
