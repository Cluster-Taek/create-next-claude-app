import { screen, waitFor } from '@testing-library/react';
import { signIn } from 'next-auth/react';
import { renderWithProviders } from '@/shared/config/test';
import { LoginForm } from '../LoginForm';

vi.mock('next-auth/react', async () => {
  return {
    useSession: () => ({ data: null, status: 'unauthenticated' }),
    signIn: vi.fn(),
    signOut: vi.fn(),
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe('LoginForm', () => {
  it('로그인 폼을 렌더링한다', () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('기본값이 입력되어 있다', () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByPlaceholderText('email')).toHaveValue('test@gmail.com');
    expect(screen.getByPlaceholderText('password')).toHaveValue('1234');
  });

  it('폼을 제출하면 signIn이 호출된다', async () => {
    const { user } = renderWithProviders(<LoginForm />);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('login-credentials', expect.objectContaining({ login: 'test@gmail.com' }));
    });
  });

  it('이메일을 지우면 유효성 검사 에러가 표시된다', async () => {
    const { user } = renderWithProviders(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('email');
    await user.clear(emailInput);
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(screen.getByText(/이메일/i)).toBeInTheDocument();
    });
  });
});
