# 세그먼트별 코드 템플릿

모든 템플릿에서 `{PascalName}`, `{camelName}`, `{kebab-name}`은 슬라이스명을 변환한 것이다.

변환 예시: `user-profile` → PascalName: `UserProfile`, camelName: `userProfile`, kebab-name: `user-profile`

---

## Feature 레이어 템플릿

### ui/{PascalName}.tsx

```typescript
'use client';

export const {PascalName} = () => {
  return (
    <div>
      <h2>{PascalName}</h2>
    </div>
  );
};
```

### model/types.ts

```typescript
import { z } from 'zod';

export const {camelName}Schema = z.object({
  id: z.string(),
});

export type {PascalName} = z.infer<typeof {camelName}Schema>;
```

### model/use{PascalName}Store.ts

```typescript
import { create } from 'zustand';

interface {PascalName}State {
  // 상태 정의
}

export const use{PascalName}Store = create<{PascalName}State>((set) => ({
  // 초기 상태
}));
```

### api/{camelName}Api.ts

```typescript
import { fetchApi } from '@/shared/api';

export const fetch{PascalName} = async () => {
  return fetchApi.get(`/api/{kebab-name}`);
};
```

### config/{kebab-name}-keys.ts

```typescript
export const { UPPER_SNAKE_NAME } = {
  // 상수 정의
} as const;
```

### index.ts (feature — ui + model)

```typescript
// UI
export { {PascalName} } from './ui/{PascalName}';

// Model
export { use{PascalName}Store } from './model/use{PascalName}Store';
export { {camelName}Schema } from './model/types';
export type { {PascalName} as {PascalName}Type } from './model/types';
```

### index.ts (feature — ui + model + api + config)

```typescript
// UI
export { {PascalName} } from './ui/{PascalName}';

// Model
export { use{PascalName}Store } from './model/use{PascalName}Store';
export { {camelName}Schema } from './model/types';
export type { {PascalName} as {PascalName}Type } from './model/types';

// API
export { fetch{PascalName} } from './api/{camelName}Api';

// Config
export { {UPPER_SNAKE_NAME} } from './config/{kebab-name}-keys';
```

---

## Entity 레이어 템플릿

### model/schemas.ts

```typescript
import { z } from 'zod';

export const {camelName}Schema = z.object({
  id: z.number(),
});

export type {PascalName} = z.infer<typeof {camelName}Schema>;

export const {camelName}ParamsSchema = z.object({
  _page: z.number(),
  _per_page: z.number(),
});

export type {PascalName}Params = z.infer<typeof {camelName}ParamsSchema>;
```

### model/use{PascalName}s.ts

```typescript
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { type {PascalName}, type {PascalName}Params } from './schemas';
import { fetch{PascalName}s } from '../api/{camelName}Api';

export const {camelName}sQueryOptions = (params: {PascalName}Params) =>
  queryOptions<{PascalName}[]>({
    queryKey: ['{camelName}s', params],
    queryFn: () => fetch{PascalName}s(params),
  });

export const useSuspense{PascalName}s = (params: {PascalName}Params) => {
  return useSuspenseQuery({camelName}sQueryOptions(params));
};
```

### api/{camelName}Api.ts

```typescript
import { fetchApi } from '@/shared/api';
import { type {PascalName}, type {PascalName}Params } from '../model/schemas';

export const fetch{PascalName}s = async (params: {PascalName}Params): Promise<{PascalName}[]> => {
  return fetchApi.get<{PascalName}[]>(`/api/{kebab-name}s`, params);
};

export const fetch{PascalName} = async (id: number): Promise<{PascalName}> => {
  return fetchApi.get<{PascalName}>(`/api/{kebab-name}s/${id}`);
};
```

### index.ts (entity)

```typescript
// API
export { fetch{PascalName}s, fetch{PascalName} } from './api/{camelName}Api';

// Model - Schemas
export { {camelName}Schema, {camelName}ParamsSchema } from './model/schemas';
export type { {PascalName}, {PascalName}Params } from './model/schemas';

// Model - Hooks
export { {camelName}sQueryOptions, useSuspense{PascalName}s } from './model/use{PascalName}s';
```

---

## Widget 레이어 템플릿

### ui/{PascalName}.tsx

```typescript
export const {PascalName} = () => {
  return (
    <section>
      <h2>{PascalName}</h2>
    </section>
  );
};
```

위젯은 기본적으로 Server Component로 생성한다. 클라이언트 상호작용이 필요하면 `'use client'`를 추가한다.

### index.ts (widget)

```typescript
// UI
export { {PascalName} } from './ui/{PascalName}';
```

---

## 네이밍 변환 규칙

| 입력 (kebab-case) | PascalCase    | camelCase     | UPPER_SNAKE_CASE |
| ----------------- | ------------- | ------------- | ---------------- |
| `auth-signup`     | `AuthSignup`  | `authSignup`  | `AUTH_SIGNUP`    |
| `user-profile`    | `UserProfile` | `userProfile` | `USER_PROFILE`   |
| `payment`         | `Payment`     | `payment`     | `PAYMENT`        |
| `order-item`      | `OrderItem`   | `orderItem`   | `ORDER_ITEM`     |

## 생성 디렉토리 구조 예시

### `/fsd feature auth-signup`

```
src/features/auth-signup/
├── ui/
│   └── AuthSignup.tsx
├── model/
│   ├── types.ts
│   └── useAuthSignupStore.ts
└── index.ts
```

### `/fsd entity product`

```
src/entities/product/
├── api/
│   └── productApi.ts
├── model/
│   ├── schemas.ts
│   └── useProducts.ts
└── index.ts
```

### `/fsd widget sidebar`

```
src/widgets/sidebar/
├── ui/
│   └── Sidebar.tsx
└── index.ts
```

### `/fsd feature payment ui model api config`

```
src/features/payment/
├── ui/
│   └── Payment.tsx
├── model/
│   ├── types.ts
│   └── usePaymentStore.ts
├── api/
│   └── paymentApi.ts
├── config/
│   └── payment-keys.ts
└── index.ts
```
