import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
import { type NextAuthOptions, type User } from 'next-auth';
import CredentialsProvider, { type CredentialsConfig } from 'next-auth/providers/credentials';
import { tokenRefresh } from '@/entities/account';

const credentialsProviderOption: CredentialsConfig = {
  type: 'credentials',
  id: 'login-credentials',
  name: 'login-credentials',
  credentials: {
    login: { label: 'Email', type: 'text' },
    password: { label: 'Password', type: 'password' },
  },
  async authorize(credentials: Record<string, unknown> | undefined) {
    try {
      // const user = await login({
      //   login: credentials?.login as string,
      //   password: credentials?.password as string,
      //   remember: false,
      // });

      // should be replaced with the above code
      if (credentials?.login === 'test@gmail.com' && credentials?.password === '1234') {
        const user = {
          name: 'John Doe',
          accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
          refreshToken: 'refreshToken',
        };
        return {
          id: credentials?.login as string,
          name: user.name,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [CredentialsProvider(credentialsProviderOption)],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === 'update') {
        token.user = session.user;
        return token;
      }

      // token: default jwt object
      // user: 최초 로그인 시 사용자 정보가 들어있고 이후에는 null
      // account: 최초 로그인 시 provider 정보가 들어있고 이후에는 null

      // [1] 최초 로그인 시
      if (account && user) {
        return {
          user,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          exp: jwtDecode(user.accessToken as string).exp as number,
        };
      }

      // [2] 로그인 이후 토큰 만료 전
      if (dayjs().isBefore(dayjs((token.exp as number) * 1000))) {
        return token;
      }

      // [3] 로그인 이후 토큰 만료 후
      try {
        const { accessToken, refreshToken } = await tokenRefresh(token.refreshToken as string);
        token.accessToken = accessToken;
        token.refreshToken = refreshToken;
        token.exp = jwtDecode(accessToken).exp as number;
      } catch {
        return { ...token, error: 'RefreshTokenError' };
      }

      return token;
    },

    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as User;
      }
      if (token.error) {
        session.error = token.error as string;
      }
      return session;
    },
  },
};
