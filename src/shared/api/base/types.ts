export type FetchApi = {
  post: <T = object>(url: string, body?: object, options?: RequestInit) => Promise<T>;
  get: <T = object>(url: string, params?: object, options?: RequestInit) => Promise<T>;
  patch: <T = object>(url: string, body?: object, options?: RequestInit) => Promise<T>;
  put: <T = object>(url: string, body?: object, options?: RequestInit) => Promise<T>;
  delete: <T = object>(url: string, options?: RequestInit) => Promise<T>;
};
