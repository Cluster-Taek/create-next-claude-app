---
name: fsd-generator
description: FSD 슬라이스 스캐폴딩. feature, entity, widget 레이어에 세그먼트와 Public API를 자동 생성. Use when creating new features, entities, widgets, or scaffolding FSD slices with /fsd.
user_invocable: true
---

# FSD Generator

FSD 레이어에 새로운 슬라이스를 스캐폴딩한다. 프로젝트 컨벤션에 맞는 세그먼트 구조와 Public API를 생성한다.

## 사용법

```
/fsd <layer> <slice-name> [segments...]
```

- `/fsd feature auth-signup` → 기본 세그먼트(ui, model)로 생성
- `/fsd feature payment ui model api config` → 지정 세그먼트로 생성
- `/fsd entity product` → 기본 세그먼트(api, model)로 생성
- `/fsd widget sidebar` → 기본 세그먼트(ui)로 생성

## 절차

### 1. 입력 파싱

| 인자         | 필수 | 설명                                          |
| ------------ | ---- | --------------------------------------------- |
| `layer`      | O    | `feature`, `entity`, `widget` 중 하나         |
| `slice-name` | O    | 슬라이스명 (kebab-case)                       |
| `segments`   | X    | 생성할 세그먼트. 생략 시 레이어별 기본값 적용 |

레이어별 기본 세그먼트:

| 레이어  | 기본 세그먼트 | 사용 가능 세그먼트     |
| ------- | ------------- | ---------------------- |
| feature | ui, model     | ui, model, api, config |
| entity  | api, model    | api, model             |
| widget  | ui            | ui                     |

### 2. 디렉토리 생성

```
src/{layer}s/{slice-name}/
├── {segment}/
│   └── (템플릿 파일)
└── index.ts     ← Public API
```

### 3. 템플릿 파일 생성

각 세그먼트에 프로젝트 컨벤션에 맞는 초기 파일을 생성한다. [references/templates.md](references/templates.md) 참고.

세그먼트별 생성 파일:

| 세그먼트 | 파일                                | 설명                   |
| -------- | ----------------------------------- | ---------------------- |
| ui       | `{PascalName}.tsx`                  | React 컴포넌트         |
| model    | `types.ts`                          | Zod 스키마 + 타입 추론 |
| model    | `use{PascalName}.ts` (entity)       | React Query 훅         |
| model    | `use{PascalName}Store.ts` (feature) | Zustand 스토어         |
| api      | `{camelName}Api.ts`                 | API 함수               |
| config   | `{kebab-name}-keys.ts`              | 상수 정의              |

### 4. Public API (index.ts) 생성

생성된 세그먼트를 기반으로 index.ts를 구성한다. 주석으로 섹션을 구분한다:

```typescript
// UI
export { PascalName } from './ui/PascalName';

// Model
export { schema } from './model/types';
export type { Type } from './model/types';

// API
export { fetchFn } from './api/nameApi';
```

### 5. 검증

생성 후 확인 사항:

- `pnpm type-check` — 타입 에러 없는지 확인
- `pnpm fsd` — Steiger FSD 구조 검증 통과 확인

## 핵심 규칙

- 슬라이스명은 **kebab-case**: `auth-signup`, `user-profile`
- 컴포넌트 파일명은 **PascalCase**: `AuthSignup.tsx`, `UserProfile.tsx`
- API 파일명은 **camelCase + Api**: `authSignupApi.ts`
- 스토어 파일명은 **use + PascalCase + Store**: `useAuthSignupStore.ts`
- Public API(index.ts)에서만 외부로 export한다
- entities에는 ui 세그먼트를 넣지 않는다
- shared 레이어는 이 스킬의 대상이 아니다 (직접 구성)

## References

- [references/templates.md](references/templates.md) - 세그먼트별 코드 템플릿
- [references/api-patterns.md](references/api-patterns.md) - Server Prefetch, Mutation, Query Key, Pageable 패턴
