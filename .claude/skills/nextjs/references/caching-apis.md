# Next.js 16 캐싱 API 레퍼런스

출처: [secondsky/claude-skills](https://github.com/secondsky/claude-skills) 기반.

---

## "use cache" 디렉티브

### 컴포넌트 단위 캐싱

```typescript
'use cache';

export async function BlogPosts() {
  const posts = await db.posts.findMany();
  return posts.map(post => <article key={post.id}>{post.title}</article>);
}
```

### 함수 단위 캐싱

```typescript
export default async function Page() {
  const data = await getData();
  return <div>{data.title}</div>;
}

async function getData() {
  'use cache';
  return await fetch('/api/data').then(r => r.json());
}
```

### 태그 기반 캐싱

```typescript
'use cache';

import { cacheTag } from 'next/cache';

export async function UserProfile({ userId }: { userId: string }) {
  cacheTag(`user-${userId}`);
  const user = await db.users.findUnique({ where: { id: userId } });
  return <div>{user.name}</div>;
}
```

---

## revalidateTag()

Next.js 16에서 2번째 인자(cacheLife) 필수.

```typescript
'use server';

import { revalidateTag } from 'next/cache';

export async function updateUser(userId: string) {
  await db.users.update({ ... });

  revalidateTag('users', 'default');
  revalidateTag(`user-${userId}`, 'default');
}
```

### Cache Life 옵션

```typescript
revalidateTag('posts', 'max'); // 최대 기간 캐시
revalidateTag('posts', 'default'); // 기본 기간
revalidateTag('posts', 'seconds:3600'); // 1시간
revalidateTag('posts', 'seconds:86400'); // 24시간
```

---

## revalidatePath()

```typescript
'use server';

import { revalidatePath } from 'next/cache';

export async function updatePost(id: string) {
  await db.posts.update({ ... });

  revalidatePath('/posts');              // 목록 페이지
  revalidatePath(`/posts/${id}`);        // 상세 페이지
  revalidatePath('/dashboard', 'layout'); // 레이아웃 전체
}
```

---

## updateTag() (Next.js 16 신규)

전체 재검증 없이 캐시 데이터 업데이트. Server Action에서만 사용.

```typescript
'use server';

import { updateTag } from 'next/cache';

export async function incrementViews(postId: string) {
  const post = await db.posts.update({
    where: { id: postId },
    data: { views: { increment: 1 } },
  });

  updateTag(`post-${postId}`, post);
}
```

---

## refresh() (Next.js 16 신규)

현재 페이지 데이터 새로고침. Server Action에서만 사용.

```typescript
'use server';

import { refresh } from 'next/cache';

export async function manualRefresh() {
  refresh();
}
```

---

## PPR (Partial Prerendering)

```typescript
// next.config.ts
const config = { experimental: { ppr: true } };

// page.tsx
export const experimental_ppr = true;

export default async function Page() {
  return (
    <>
      <StaticHeader />
      <Suspense fallback={<Skeleton />}>
        <DynamicContent />
      </Suspense>
    </>
  );
}
```

---

## ISR (Incremental Static Regeneration)

### 시간 기반

```typescript
export const revalidate = 3600; // 1시간마다 재검증

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await fetchPost(id);
  return <article>{post.content}</article>;
}
```

### On-Demand

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const { secret, path, tag } = await request.json();

  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }

  if (path) revalidatePath(path);
  if (tag) revalidateTag(tag, 'default');

  return Response.json({ revalidated: true });
}
```

---

## fetch() 캐시 옵션

```typescript
// 캐시 없음
const fresh = await fetch('/api/data', { cache: 'no-store' });

// 강제 캐시
const cached = await fetch('/api/data', { cache: 'force-cache' });

// 시간 기반 재검증
const timed = await fetch('/api/data', { next: { revalidate: 3600 } });

// 태그 기반 무효화
const tagged = await fetch('/api/data', { next: { tags: ['posts'] } });
```

---

## Next.js 15 → 16 캐시 마이그레이션

```typescript
// ❌ Next.js 15: fetch 자동 캐시
async function getPosts() {
  const res = await fetch('/api/posts'); // 자동 캐시됨
  return res.json();
}

// ✅ Next.js 16: 옵트인 캐시
('use cache');

async function getPosts() {
  const res = await fetch('/api/posts'); // "use cache"로 명시적 캐시
  return res.json();
}
```
