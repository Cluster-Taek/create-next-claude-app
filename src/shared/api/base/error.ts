import { type IApiError } from '@/shared/model';

export interface FetchError {
  status: number;
  statusText: string;
  data?: IApiError;
}

const isApiError = (data: unknown): data is IApiError => {
  return typeof data === 'object' && data !== null;
};

export const createFetchError = (status: number, statusText: string, data?: unknown): FetchError => ({
  status,
  statusText,
  data: isApiError(data) ? data : undefined,
});

/**
 * API 에러 처리 (클라이언트 전용)
 */
export const handleApiError = async (error: FetchError): Promise<never> => {
  const { status, data } = error;

  if (status === 403) {
    console.error('Access denied:', data);
  }

  if (status >= 500) {
    console.error('Server error:', data);
  }

  throw error;
};
