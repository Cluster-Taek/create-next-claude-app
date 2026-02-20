---
name: nextjs
description: Next.js 16 App Router 패턴 및 에러 방지. async params, "use cache", Server Actions, React 19 패턴. Use when encountering Next.js errors, using App Router APIs, or working with Server Components, caching, metadata.
---

# Next.js 16 App Router

**프로젝트 버전**: Next.js 16.1.6 | React 19.2.4 | Node.js 20.9+ | TypeScript 5.9.3

이 스킬은 Next.js 16 전용 API와 에러 방지에 집중한다. 성능 최적화는 `vercel-react-best-practices` 스킬 참고.

## 프로젝트 설정 현황

```javascript
// next.config.mjs
const nextConfig = {
  reactCompiler: true, // React Compiler 활성화
  experimental: {
    optimizePackageImports: [
      // 배럴 import 최적화
      'react-icons',
      'motion/react',
    ],
  },
};
```

- **React Compiler**: 자동 메모이제이션 활성화됨. `useMemo`, `useCallback` 수동 사용 불필요.
- **Turbopack**: Next.js 16 기본 번들러로 활성화됨.
- **Auth**: NextAuth.js (next-auth 4.x) 사용 중.
- **라우팅**: `app/` 디렉토리 = Next.js 라우팅, `src/` = FSD 아키텍처.

## Next.js 16 핵심 변경사항

| 변경사항        | Before               | After                                  |
| --------------- | -------------------- | -------------------------------------- |
| params          | `params.slug`        | `const { slug } = await params`        |
| searchParams    | `searchParams.query` | `const { query } = await searchParams` |
| cookies/headers | `cookies()` 동기     | `await cookies()` 비동기               |
| 캐싱            | fetch 자동 캐시      | `"use cache"` 옵트인                   |
| 번들러          | Webpack 기본         | Turbopack 기본                         |

### async params (가장 빈번한 에러)

```typescript
// app/users/[id]/page.tsx
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <div>{id}</div>;
}

// generateMetadata도 동일
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `User ${id}` };
}
```

### "use cache" 캐싱

```typescript
'use cache';

import { cacheTag } from 'next/cache';

export async function UserProfile({ userId }: { userId: string }) {
  cacheTag(`user-${userId}`);
  const user = await db.users.findUnique({ where: { id: userId } });
  return <div>{user.name}</div>;
}
```

무효화:

```typescript
'use server';
import { revalidateTag } from 'next/cache';

export async function updateUser(userId: string) {
  await db.users.update({ ... });
  revalidateTag(`user-${userId}`, 'default');
}
```

## Server Components vs Client Components

```
Server Component (기본)          Client Component ('use client')
────────────────────────         ────────────────────────────────
데이터 페칭, DB 접근              onClick, onChange 이벤트
민감한 로직                       useState, useEffect 훅
큰 의존성 (서버에서만)            브라우저 API (window, navigator)
정적 콘텐츠                       실시간 업데이트, 폼 상태
```

**규칙**: `'use client'`는 필요한 최하위 컴포넌트에만 추가한다. layout이나 page 전체에 붙이지 않는다.

**Composition 패턴** (Server Component를 Client Component 안에 넣어야 할 때):

```typescript
// ParentServer.tsx (Server Component)
import { ClientWrapper } from './ClientWrapper';
import { ServerContent } from './ServerContent';

export default function ParentServer() {
  return (
    <ClientWrapper>
      <ServerContent /> {/* children으로 전달하면 Server Component 유지 */}
    </ClientWrapper>
  );
}
```

## Server Actions

```typescript
// app/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const schema = z.object({ title: z.string().min(1) });

export async function createPost(prevState: unknown, formData: FormData) {
  const result = schema.safeParse({ title: formData.get('title') });

  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  await db.posts.create({ data: result.data });
  revalidatePath('/posts');
  return { success: true };
}
```

자세한 패턴: [references/server-actions-patterns.md](references/server-actions-patterns.md)

## 빈발 에러 Top 5

| #   | 에러                                | 원인                               | 해결                  |
| --- | ----------------------------------- | ---------------------------------- | --------------------- |
| 1   | `Promise<{ id: string }>` 타입 에러 | params가 async로 변경              | `await params`        |
| 2   | hooks in Server Component           | Server Component에서 useState 사용 | `'use client'` 추가   |
| 3   | fetch 캐시 안 됨                    | Next.js 16은 옵트인 캐시           | `"use cache"` 추가    |
| 4   | Server Action not found             | `'use server'` 누락                | 디렉티브 추가         |
| 5   | 환경변수 브라우저에서 미노출        | 접두사 없음                        | `NEXT_PUBLIC_` 접두사 |

전체 18개 에러: [references/error-catalog.md](references/error-catalog.md)

## Metadata API

```typescript
// 정적 metadata
export const metadata: Metadata = {
  title: 'My App',
  description: 'Description',
  openGraph: { title: 'My App', images: ['/og.jpg'] },
};

// 동적 metadata (async params)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await fetchPost(id);
  return { title: post.title, description: post.excerpt };
}
```

## References

- [references/error-catalog.md](references/error-catalog.md) - 18개 에러 전체 카탈로그
- [references/caching-apis.md](references/caching-apis.md) - "use cache", revalidateTag, PPR 레퍼런스
- [references/server-actions-patterns.md](references/server-actions-patterns.md) - Server Action 고급 패턴

## 관련 스킬

| 스킬                          | 영역                 |
| ----------------------------- | -------------------- |
| `vercel-react-best-practices` | React 성능 최적화    |
| `feature-sliced-design`       | 프로젝트 아키텍처    |
| `fsd-generator`               | 슬라이스 스캐폴딩    |
| `tdd`                         | 요구사항 기반 테스트 |

**출처**: [secondsky/claude-skills](https://github.com/secondsky/claude-skills) nextjs 스킬 기반, 프로젝트 버전(16.1.6)에 맞게 조정.
