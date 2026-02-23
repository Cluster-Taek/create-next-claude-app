# Server Actions 고급 패턴

출처: [secondsky/claude-skills](https://github.com/secondsky/claude-skills) 기반.

---

## Zod 검증 + 구조화된 에러 반환

```typescript
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const PostSchema = z.object({
  title: z.string().min(1, '제목을 입력하세요').max(100),
  content: z.string().min(10, '내용은 10자 이상이어야 합니다'),
});

export type ActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createPost(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const result = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  if (!result.success) {
    return { fieldErrors: result.error.flatten().fieldErrors };
  }

  try {
    await db.posts.create({ data: result.data });
    revalidatePath('/posts');
    return { success: true };
  } catch {
    return { error: '게시글 생성에 실패했습니다.' };
  }
}
```

---

## 클라이언트 폼 + 로딩 상태

```typescript
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { createPost, type ActionState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? '생성 중...' : '게시글 생성'}
    </button>
  );
}

export default function NewPostForm() {
  const [state, formAction] = useFormState<ActionState | null, FormData>(createPost, null);

  return (
    <form action={formAction}>
      {state?.error && <div className="text-red-500">{state.error}</div>}
      <input type="text" name="title" required />
      {state?.fieldErrors?.title && (
        <p className="text-red-500">{state.fieldErrors.title[0]}</p>
      )}
      <textarea name="content" required />
      <SubmitButton />
    </form>
  );
}
```

---

## Optimistic Updates

```typescript
'use client';

import { useOptimistic, useTransition } from 'react';
import { addComment } from './actions';

interface Comment {
  id: string;
  text: string;
  pending?: boolean;
}

export function Comments({ initialComments }: { initialComments: Comment[] }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticComments, addOptimistic] = useOptimistic(
    initialComments,
    (state: Comment[], newComment: Comment) => [...state, { ...newComment, pending: true }],
  );

  async function handleAdd(formData: FormData) {
    const text = formData.get('comment') as string;

    startTransition(() => {
      addOptimistic({ id: `temp-${Date.now()}`, text });
    });

    await addComment(formData);
  }

  return (
    <div>
      <ul>
        {optimisticComments.map(comment => (
          <li key={comment.id} className={comment.pending ? 'opacity-50' : ''}>
            {comment.text}
          </li>
        ))}
      </ul>
      <form action={handleAdd}>
        <input name="comment" required />
        <button type="submit" disabled={isPending}>
          {isPending ? '추가 중...' : '댓글 추가'}
        </button>
      </form>
    </div>
  );
}
```

---

## 재검증 패턴

### Path 기반

```typescript
'use server';

import { revalidatePath } from 'next/cache';

export async function updatePost(id: string, formData: FormData) {
  await db.posts.update({
    where: { id },
    data: { title: formData.get('title') as string },
  });

  revalidatePath('/posts');
  revalidatePath(`/posts/${id}`);
}
```

### Tag 기반 (Next.js 16)

```typescript
'use server';

import { revalidateTag } from 'next/cache';

export async function updatePost(id: string, formData: FormData) {
  await db.posts.update({ ... });

  revalidateTag('posts', 'max');
  revalidateTag(`post-${id}`, 'seconds:60');
}
```

---

## Redirect After Action

```typescript
'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
  const post = await db.posts.create({
    data: { title: formData.get('title') as string },
  });

  revalidatePath('/posts');
  redirect(`/posts/${post.id}`);
  // redirect()는 내부적으로 throw하므로 이후 코드 실행 안 됨
}
```

---

## Progressive Enhancement

JavaScript 없이도 동작하는 폼:

```typescript
// Server Component
import { createPost } from './actions';

export default function NewPostPage() {
  return (
    <form action={createPost}>
      <input type="text" name="title" required />
      <button type="submit">생성</button>
    </form>
  );
}
```

JS 로드 후 React가 hydrate하여 pending 상태 등 클라이언트 기능 추가.
