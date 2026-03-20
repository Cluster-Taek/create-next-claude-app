'use client';

import { signOut, useSession } from 'next-auth/react';
import { type PropsWithChildren, useEffect } from 'react';
import { setupClientAuth } from '@/shared/api';

/**
 * AuthProvider - API 클라이언트 토큰 설정 전용
 * - 서버에서 이미 인증 체크 완료 (verifySession)
 * - 클라이언트에서는 API 요청에 토큰만 주입
 * - 토큰 리프레시 실패 시 자동 로그아웃
 */
export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: session } = useSession();

  // API 클라이언트에 인증 토큰 설정
  useEffect(() => {
    setupClientAuth(session?.user?.accessToken ?? null);
  }, [session?.user?.accessToken]);

  // 토큰 리프레시 실패 시 로그아웃
  useEffect(() => {
    if (session?.error === 'RefreshTokenError') {
      signOut({ callbackUrl: '/login' });
    }
  }, [session?.error]);

  return <>{children}</>;
};
