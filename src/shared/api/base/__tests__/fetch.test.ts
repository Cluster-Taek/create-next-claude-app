import { fetchApi, setupClientAuth } from '../fetch';

const mockOkResponse = (data = { data: 'test' }) => ({
  ok: true,
  status: 200,
  json: () => Promise.resolve(data),
});

describe('fetchApi', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(mockOkResponse()))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    setupClientAuth(null);
  });

  it('GET 요청을 올바르게 전송한다', async () => {
    const result = await fetchApi.get('/api/users');

    expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({ method: 'GET' }));
    expect(result).toEqual({ data: 'test' });
  });

  it('GET 요청에 query params를 추가한다', async () => {
    await fetchApi.get('/api/users', { page: 1, limit: 10 });

    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('page=1'), expect.any(Object));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('limit=10'), expect.any(Object));
  });

  it('POST 요청에 body를 JSON으로 전송한다', async () => {
    const body = { name: 'John' };
    await fetchApi.post('/api/users', body);

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(body),
      })
    );
  });

  it('204 응답은 null을 반환한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve({ ok: true, status: 204 }))
    );

    const result = await fetchApi.delete('/api/users/1');
    expect(result).toBeNull();
  });

  it('에러 응답은 에러를 throw한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: () => Promise.resolve({ message: 'Server Error' }),
        })
      )
    );

    await expect(fetchApi.get('/api/users')).rejects.toMatchObject({
      status: 500,
    });
  });

  it('setupClientAuth로 설정한 토큰이 Authorization 헤더에 포함된다', async () => {
    setupClientAuth('test-token');

    await fetchApi.get('/api/users');

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    );
  });

  it('토큰이 null이면 Authorization 헤더가 포함되지 않는다', async () => {
    setupClientAuth(null);

    await fetchApi.get('/api/users');

    const callArgs = vi.mocked(fetch).mock.calls[0][1] as RequestInit;
    const headers = callArgs.headers as Record<string, string>;
    expect(headers.Authorization).toBeUndefined();
  });

  it('PATCH 요청을 올바르게 전송한다', async () => {
    await fetchApi.patch('/api/users/1', { name: 'Updated' });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'PATCH',
        body: JSON.stringify({ name: 'Updated' }),
      })
    );
  });

  it('PUT 요청을 올바르게 전송한다', async () => {
    await fetchApi.put('/api/users/1', { name: 'Replaced' });

    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ name: 'Replaced' }),
      })
    );
  });

  it('/api/로 시작하지 않는 URL은 그대로 사용한다', async () => {
    await fetchApi.get('https://external.com/data');

    expect(fetch).toHaveBeenCalledWith('https://external.com/data', expect.any(Object));
  });

  it('배열 query params를 올바르게 전송한다', async () => {
    await fetchApi.get('/api/users', { ids: [1, 2, 3] });

    const url = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(url).toContain('ids=1');
    expect(url).toContain('ids=2');
    expect(url).toContain('ids=3');
  });

  it('이미 ?가 포함된 URL에 params를 추가하면 &로 연결한다', async () => {
    await fetchApi.get('https://external.com/data?existing=1', { page: 2 });

    const url = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(url).toContain('?existing=1&page=2');
  });

  it('query params에서 null과 undefined 값은 제외한다', async () => {
    await fetchApi.get('/api/users', { page: 1, filter: null, sort: undefined });

    const url = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(url).toContain('page=1');
    expect(url).not.toContain('filter');
    expect(url).not.toContain('sort');
  });

  it('에러 응답의 JSON 파싱이 실패해도 에러를 throw한다', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 502,
          statusText: 'Bad Gateway',
          json: () => Promise.reject(new Error('invalid json')),
        })
      )
    );

    await expect(fetchApi.get('/api/users')).rejects.toMatchObject({
      status: 502,
      data: undefined,
    });
  });
});
