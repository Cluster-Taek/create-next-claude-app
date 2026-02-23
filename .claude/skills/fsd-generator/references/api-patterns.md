# API 통합 패턴

Entity/Feature에서 React Query와 fetchApi를 사용하는 고급 패턴.

기본 API 템플릿은 [templates.md](templates.md)를 참고한다. 이 문서는 그 위에 추가되는 패턴을 다룬다.

---

## Server Prefetch + HydrationBoundary

Server Component에서 데이터를 미리 가져와 클라이언트에 전달하는 패턴. Entity의 `queryOptions`를 서버/클라이언트 양쪽에서 재사용한다.

### Page (Server Component)

```typescript
// src/views/{slice}/ui/{PascalName}Page.tsx
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { {camelName}sQueryOptions } from '@/entities/{kebab-name}';
import { getQueryClient } from '@/shared/api';

export async function {PascalName}Page() {
  const queryClient = getQueryClient();

  // void: 프리페치 완료를 기다리지 않음 (Suspense가 처리)
  void queryClient.prefetchQuery(
    {camelName}sQueryOptions({ _page: 1, _per_page: 10 })
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <{PascalName}List />
    </HydrationBoundary>
  );
}
```

### Client Component (데이터 소비)

```typescript
// src/views/{slice}/ui/{PascalName}List.tsx
'use client';

import { useSuspense{PascalName}s } from '@/entities/{kebab-name}';

export const {PascalName}List = () => {
  // 서버에서 프리페치된 데이터를 즉시 사용 (워터폴 없음)
  const { data } = useSuspense{PascalName}s({ _page: 1, _per_page: 10 });

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

**핵심**: `queryOptions`를 Entity에서 한 번 정의하고, 서버 prefetch와 클라이언트 훅 양쪽에서 동일하게 사용한다. queryKey가 일치해야 hydration이 동작한다.

---

## useMutation 패턴

### 기본 Mutation + 캐시 무효화

```typescript
// src/entities/{kebab-name}/model/use{PascalName}s.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreate{PascalName}Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {PascalName}CreateFormValues) => create{PascalName}(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['{camelName}s'],
        refetchType: 'all',
      });
    },
  });
};
```

### Feature에서 Mutation 사용

```typescript
// src/features/{slice}/ui/{PascalName}Form.tsx
'use client';

import { useCreate{PascalName}Mutation } from '@/entities/{kebab-name}';

export const {PascalName}Form = ({ onClose }: { onClose: () => void }) => {
  const { mutate } = useCreate{PascalName}Mutation();

  const handleSubmit = (data: FormValues) => {
    mutate(data, {
      onSuccess: () => onClose(),
      onError: (error) => {
        // 폼 에러 처리
        setError('fieldName', { type: 'manual', message: error.message });
      },
    });
  };
};
```

### Optimistic Update

```typescript
export const useUpdate{PascalName}Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { id: number } & Partial<{PascalName}>) =>
      update{PascalName}(data.id, data),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ['{camelName}s'] });

      const previous = queryClient.getQueryData<{PascalName}[]>(['{camelName}s']);

      queryClient.setQueryData<{PascalName}[]>(['{camelName}s'], (old) =>
        old?.map(item => item.id === newData.id ? { ...item, ...newData } : item)
      );

      return { previous };
    },
    onError: (_err, _data, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['{camelName}s'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['{camelName}s'] });
    },
  });
};
```

---

## Query Key 컨벤션

```typescript
// 목록: ['{camelName}s', params]
queryKey: ['users', { _page: 1, _per_page: 10 }];

// 상세: ['{camelName}s', id]
queryKey: ['users', 42];

// 무효화: 상위 키로 하위 전체 무효화
queryClient.invalidateQueries({ queryKey: ['users'] });
// → ['users', params], ['users', 42] 모두 무효화됨
```

규칙:

- 키 첫 번째 요소는 **엔티티 복수형** (camelCase): `'users'`, `'products'`, `'orders'`
- 목록은 params 객체를 두 번째 요소로
- 상세는 id를 두 번째 요소로
- 무효화 시 첫 번째 요소만 지정하면 해당 엔티티의 모든 쿼리가 무효화됨

---

## Pageable 응답 처리

`Pageable<T>` 타입과 `pageableSchema()`로 페이지네이션 응답을 처리한다.

### API 함수

```typescript
// src/entities/{kebab-name}/api/{camelName}Api.ts
import { fetchApi } from '@/shared/api';
import { type {PascalName}, type {PascalName}Params } from '../model/schemas';
import { type Pageable, pageableSchema } from '@/shared/model';

export const fetch{PascalName}s = async (params: {PascalName}Params): Promise<Pageable<{PascalName}>> => {
  const response = await fetchApi.get<Pageable<{PascalName}>>(`/api/{kebab-name}s`, params);
  return pageableSchema({camelName}Schema).parse(response);
};
```

### React Query 훅

```typescript
// src/entities/{kebab-name}/model/use{PascalName}s.ts
import { type Pageable } from '@/shared/model';

export const {camelName}sQueryOptions = (params: {PascalName}Params) =>
  queryOptions<Pageable<{PascalName}>>({
    queryKey: ['{camelName}s', params],
    queryFn: () => fetch{PascalName}s(params),
  });
```

### 클라이언트 사용

```typescript
const { data } = useSuspense{PascalName}s({ _page: 1, _per_page: 10 });

// data.data - 아이템 배열
// data.pages - 전체 페이지 수
// data.items - 전체 아이템 수
// data.next / data.prev - 다음/이전 페이지 번호 (null이면 없음)
```

---

## Zod 응답 검증

API 응답은 Zod 스키마로 런타임 검증한다.

```typescript
// 생성/수정 응답: 단건 파싱
export const create{PascalName} = async (data: FormValues): Promise<{PascalName}> => {
  const response = await fetchApi.post(`/api/{kebab-name}s`, data);
  return {camelName}Schema.parse(response);  // 런타임 검증
};

// 목록 응답: pageableSchema로 파싱
export const fetch{PascalName}s = async (params: Params): Promise<Pageable<{PascalName}>> => {
  const response = await fetchApi.get(`/api/{kebab-name}s`, params);
  return pageableSchema({camelName}Schema).parse(response);
};
```

단건 응답(create, update)은 항상 `schema.parse()`로 검증한다. 목록 응답은 `pageableSchema()`로 감싼다.
