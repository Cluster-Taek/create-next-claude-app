import { render } from '@testing-library/react';
import { signOut, useSession } from 'next-auth/react';
import { AuthProvider } from '../AuthProvider';

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('@/shared/api', () => ({
  setupClientAuth: vi.fn(),
}));

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('session.error가 RefreshTokenError이면 signOut을 호출한다', () => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: { accessToken: 'token', refreshToken: 'refresh' },
        error: 'RefreshTokenError',
        expires: '',
      },
      status: 'authenticated',
      update: vi.fn(),
    });

    render(
      <AuthProvider>
        <div>test</div>
      </AuthProvider>
    );

    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });

  it('session.error가 없으면 signOut을 호출하지 않는다', () => {
    vi.mocked(useSession).mockReturnValue({
      data: {
        user: { accessToken: 'token', refreshToken: 'refresh' },
        expires: '',
      },
      status: 'authenticated',
      update: vi.fn(),
    });

    render(
      <AuthProvider>
        <div>test</div>
      </AuthProvider>
    );

    expect(signOut).not.toHaveBeenCalled();
  });
});
