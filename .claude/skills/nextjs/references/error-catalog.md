# Next.js 16 에러 카탈로그

18개 에러와 해결법. 프로젝트 버전: Next.js 16.1.6 | React 19.2.4

출처: [secondsky/claude-skills](https://github.com/secondsky/claude-skills) 기반, 프로젝트에 맞게 조정.

---

## Next.js 16 Breaking Changes (7개)

### Error 1: params가 Promise

```
Type 'Promise<{ id: string }>' is not assignable to type '{ id: string }'
```

```typescript
// ✅
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

### Error 2: searchParams가 Promise

```
Property 'query' does not exist on type 'Promise<{ query: string }>'
```

```typescript
// ✅
export default async function Page({ searchParams }: { searchParams: Promise<{ query: string }> }) {
  const { query } = await searchParams;
}
```

### Error 3: cookies()에 await 필요

```typescript
// ✅
import { cookies } from 'next/headers';

export async function MyComponent() {
  const cookieStore = await cookies();
}
```

### Error 4: Parallel route에 default.js 필수

```
Error: Parallel route @modal was matched but no default.js was found
```

```typescript
// app/@modal/default.tsx
export default function ModalDefault() {
  return null;
}
```

### Error 5: revalidateTag() 인자 2개 필요

```typescript
// ❌ revalidateTag('posts')
// ✅
revalidateTag('posts', 'max');
revalidateTag('posts', 'default');
revalidateTag('posts', 'seconds:3600');
```

### Error 6: middleware.ts deprecated

```typescript
// middleware.ts → proxy.ts로 이름 변경
// middleware 함수 → proxy 함수로 이름 변경
export function proxy(request: NextRequest) {
  // 동일한 로직
}
```

### Error 7: fetch() 캐시 안 됨

Next.js 16은 옵트인 캐시. `"use cache"` 디렉티브 추가:

```typescript
'use cache';

export async function getPosts() {
  const response = await fetch('/api/posts');
  return response.json();
}
```

---

## Server/Client Components (3개)

### Error 8: Server Component에서 React hooks 사용

```
You're importing a component that needs useState. It only works in a Client Component
```

```typescript
// ✅ 'use client' 추가
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Error 9: Server Component를 Client Component에서 import

```typescript
// ❌ Client Component에서 직접 import
'use client';
import { ServerComponent } from './server-component';

// ✅ children으로 전달
'use client';
export function ClientComponent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}

// 사용
<ClientComponent>
  <ServerComponent />
</ClientComponent>
```

### Error 10: Server Action에 'use server' 누락

```typescript
// ✅
'use server';

export async function createPost(formData: FormData) {
  await db.posts.create({ ... });
}
```

---

## Configuration (5개)

### Error 11: Turbopack 빌드 실패

Turbopack이 Next.js 16 기본 번들러. 호환 불가 시:

```bash
pnpm build -- --webpack
```

### Error 12: next/image 외부 이미지

```
Invalid src prop. Hostname "example.com" is not configured under images
```

```typescript
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'example.com' }],
  },
};
```

### Error 13: Route Group 충돌

```
Error: Conflicting routes: /about and /(marketing)/about
```

같은 URL 경로를 생성하는 Route Group 방지. 서로 다른 경로 사용.

### Error 14: 환경변수 브라우저 미노출

```bash
# .env
SECRET_KEY=abc123                  # 서버 전용
NEXT_PUBLIC_API_URL=https://api    # 브라우저 사용 가능
```

프로젝트에서 이미 사용 중: `NEXT_PUBLIC_DOMAIN`, `NEXT_PUBLIC_API_URL`

### Error 15: TypeScript path alias 미작동

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@app/*": ["./app/*"]
    }
  }
}
```

프로젝트 tsconfig.json에 이미 설정됨.

---

## Optimization (3개)

### Error 16: generateStaticParams 미작동

```typescript
export const dynamic = 'force-static';

export async function generateStaticParams() {
  const posts = await fetch('/api/posts').then((r) => r.json());
  return posts.map((post: { id: string }) => ({ id: post.id }));
}
```

### Error 17: Metadata 미갱신

동적 페이지에서는 `generateMetadata()` 사용:

```typescript
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPost(id);
  return { title: post.title, description: post.excerpt };
}
```

### Error 18: next/font 로딩 안 됨

폰트 변수를 `<html>`에 적용:

```typescript
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

프로젝트에서는 `src/fonts/`에 Geist 폰트를 로컬로 사용 중.

---

## 예방 체크리스트

- [ ] `params`, `searchParams`를 `await`로 사용하고 있는가
- [ ] `cookies()`, `headers()`를 `await`로 호출하고 있는가
- [ ] 모든 parallel route에 `default.tsx`가 있는가
- [ ] `revalidateTag()`에 cacheLife 인자를 넘기고 있는가
- [ ] `'use client'`는 필요한 최하위 컴포넌트에만 있는가
- [ ] Server Action에 `'use server'` 디렉티브가 있는가
- [ ] 외부 이미지 호스트가 `next.config`에 등록되어 있는가
- [ ] 클라이언트에서 사용하는 env에 `NEXT_PUBLIC_` 접두사가 있는가
