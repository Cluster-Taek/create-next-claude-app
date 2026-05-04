import { createFetchError, FetchError, handleApiError } from '../error';

describe('createFetchError', () => {
  it('status와 statusText로 에러 객체를 생성한다', () => {
    const error = createFetchError(404, 'Not Found');

    expect(error).toBeInstanceOf(FetchError);
    expect(error.status).toBe(404);
    expect(error.statusText).toBe('Not Found');
    expect(error.data).toBeUndefined();
    expect(error.message).toBe('404 Not Found');
  });

  it('유효한 객체 data를 포함한다', () => {
    const data = { status: 404, message: 'User not found' };
    const error = createFetchError(404, 'Not Found', data);

    expect(error.data).toEqual(data);
  });

  it('message 필드만 있는 data도 보존한다', () => {
    const data = { message: 'User not found' };
    const error = createFetchError(404, 'Not Found', data);

    expect(error.data).toEqual(data);
  });

  it('객체가 아닌 data는 undefined로 처리한다', () => {
    const error = createFetchError(500, 'Internal Server Error', 'string error');

    expect(error.data).toBeUndefined();
  });

  it('null data는 undefined로 처리한다', () => {
    const error = createFetchError(500, 'Internal Server Error', null);

    expect(error.data).toBeUndefined();
  });
});

describe('handleApiError', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('401 에러 시 signOut 후 로그인 페이지로 리다이렉트한다', async () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/dashboard', href: '' },
      writable: true,
      configurable: true,
    });

    const error = new FetchError(401, 'Unauthorized');

    await expect(handleApiError(error)).rejects.toBeInstanceOf(FetchError);
    expect(window.location.href).toBe('/login');
  });

  it('401 에러지만 이미 로그인 페이지면 리다이렉트하지 않는다', async () => {
    Object.defineProperty(window, 'location', {
      value: { pathname: '/login', href: '' },
      writable: true,
      configurable: true,
    });

    const error = new FetchError(401, 'Unauthorized');

    await expect(handleApiError(error)).rejects.toBeInstanceOf(FetchError);
    expect(window.location.href).toBe('');
  });

  it('403 에러는 콘솔에 access denied를 출력한다', async () => {
    const data = { status: 403, message: 'Forbidden' };
    const error = new FetchError(403, 'Forbidden', data);

    await expect(handleApiError(error)).rejects.toBeInstanceOf(FetchError);
    expect(console.error).toHaveBeenCalledWith('Access denied:', data);
  });

  it('500 이상 에러는 콘솔에 server error를 출력한다', async () => {
    const data = { status: 502, message: 'Internal' };
    const error = new FetchError(502, 'Bad Gateway', data);

    await expect(handleApiError(error)).rejects.toBeInstanceOf(FetchError);
    expect(console.error).toHaveBeenCalledWith('Server error:', data);
  });

  it('모든 에러는 최종적으로 throw된다', async () => {
    const error = new FetchError(400, 'Bad Request');

    await expect(handleApiError(error)).rejects.toBeInstanceOf(FetchError);
  });
});
