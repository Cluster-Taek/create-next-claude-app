# 프로젝트 테스트 컨벤션 및 템플릿

## 공통 규칙

- **테스트 환경**: Vitest + happy-dom
- **테스트 위치**: FSD 슬라이스 내 `__tests__/` 디렉토리
- **파일 명명**: `{대상이름}.test.ts` 또는 `{대상이름}.test.tsx`
- **서술 언어**: describe/it 블록은 한글로 작성
- **Import alias**: `@/` → `src/`

## 순수 함수 테스트

```typescript
import { targetFunction } from '../target';

describe('targetFunction', () => {
  it('정상 입력이면 기대값을 반환한다', () => {
    expect(targetFunction('valid-input')).toBe('expected');
  });

  it('빈 값이면 기본값을 반환한다', () => {
    expect(targetFunction('')).toBe('default');
  });

  it('null이면 에러를 throw한다', () => {
    expect(() => targetFunction(null)).toThrow();
  });
});
```

위치: `src/shared/lib/__tests__/target.test.ts`

## Zustand 스토어 테스트

```typescript
import { act } from 'react';
import { useTargetStore } from '../useTargetStore';

describe('useTargetStore', () => {
  beforeEach(() => {
    act(() => {
      useTargetStore.setState({
        // 초기 상태로 리셋
      });
    });
  });

  it('초기 상태가 올바르다', () => {
    const state = useTargetStore.getState();
    expect(state.items).toEqual([]);
  });

  it('addItem으로 항목을 추가할 수 있다', () => {
    act(() => {
      useTargetStore.getState().addItem('new-item');
    });
    const state = useTargetStore.getState();
    expect(state.items).toContain('new-item');
  });
});
```

위치: `src/{layer}/{slice}/model/__tests__/useTargetStore.test.ts`

## 컴포넌트 테스트

```typescript
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/shared/config/test';
import { TargetComponent } from '../TargetComponent';

describe('TargetComponent', () => {
  it('기본 요소를 렌더링한다', () => {
    renderWithProviders(<TargetComponent />);
    expect(screen.getByRole('button', { name: '제출' })).toBeInTheDocument();
  });

  it('클릭하면 핸들러가 호출된다', async () => {
    const handleClick = vi.fn();
    const { user } = renderWithProviders(
      <TargetComponent onClick={handleClick} />
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('비활성 상태에서는 클릭할 수 없다', async () => {
    const handleClick = vi.fn();
    const { user } = renderWithProviders(
      <TargetComponent disabled onClick={handleClick} />
    );

    await user.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

위치: `src/{layer}/{slice}/ui/__tests__/TargetComponent.test.tsx`

핵심 패턴:

- `renderWithProviders()` 사용 (QueryClientProvider 포함)
- `{ user }` 구조분해로 userEvent 접근
- `screen.getByRole()` 우선 사용 (접근성 기반 쿼리)
- 비동기 상태 변경은 `waitFor()` 로 감싸기

## 폼 컴포넌트 테스트

```typescript
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/shared/config/test';
import { TargetForm } from '../TargetForm';

describe('TargetForm', () => {
  it('폼 요소를 렌더링한다', () => {
    renderWithProviders(<TargetForm />);

    expect(screen.getByPlaceholderText('이메일')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '제출' })).toBeInTheDocument();
  });

  it('빈 값 제출 시 유효성 에러를 표시한다', async () => {
    const { user } = renderWithProviders(<TargetForm />);

    await user.clear(screen.getByPlaceholderText('이메일'));
    await user.click(screen.getByRole('button', { name: '제출' }));

    await waitFor(() => {
      expect(screen.getByText(/필수/i)).toBeInTheDocument();
    });
  });

  it('유효한 값 제출 시 onSubmit이 호출된다', async () => {
    const onSubmit = vi.fn();
    const { user } = renderWithProviders(<TargetForm onSubmit={onSubmit} />);

    await user.type(screen.getByPlaceholderText('이메일'), 'test@email.com');
    await user.click(screen.getByRole('button', { name: '제출' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@email.com' })
      );
    });
  });
});
```

## API/Fetch 테스트

```typescript
describe('fetchTarget', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('GET 요청을 올바르게 전송한다', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ data: 'test' }), { status: 200 }));

    const result = await fetchTarget('/api/items');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/items'),
      expect.objectContaining({ method: 'GET' })
    );
    expect(result).toEqual({ data: 'test' });
  });

  it('에러 응답은 에러를 throw한다', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 500, statusText: 'Server Error' }));

    await expect(fetchTarget('/api/items')).rejects.toMatchObject({
      status: 500,
    });
  });
});
```

위치: `src/{layer}/{slice}/api/__tests__/target.test.ts`

핵심 패턴:

- `vi.stubGlobal('fetch', vi.fn())` 으로 전역 fetch mock
- `vi.unstubAllGlobals()` 로 정리
- `vi.mocked(fetch).mockResolvedValue()` 로 응답 제어

## E2E 테스트 (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test.describe('기능명', () => {
  test('정상 시나리오를 수행한다', async ({ page }) => {
    await page.goto('/target-page');

    await page.getByPlaceholder('입력').fill('값');
    await page.getByRole('button', { name: '제출' }).click();

    await expect(page).toHaveURL('/expected-url');
  });

  test('에러 시 에러 메시지를 표시한다', async ({ page }) => {
    await page.goto('/target-page');

    await page.getByRole('button', { name: '제출' }).click();

    await expect(page.getByText('에러 메시지')).toBeVisible();
  });
});
```

위치: `e2e/{feature}.spec.ts`

비인증 테스트가 필요하면 파일 상단에 추가:

```typescript
test.use({ storageState: { cookies: [], origins: [] } });
```

## Mock 패턴

### Next.js mock (자동 적용)

setup.ts에서 자동으로 mock되는 항목:

- `next/navigation` — useRouter, useSearchParams, usePathname, redirect, notFound
- `next/image` — img 엘리먼트로 변환
- `next-auth/react` — useSession, signIn, signOut, SessionProvider
- `server-only` — 빈 mock

### 테스트 파일 내 mock 오버라이드

```typescript
vi.mock('next-auth/react', async () => {
  return {
    useSession: () => ({ data: null, status: 'unauthenticated' }),
    signIn: vi.fn(),
    signOut: vi.fn(),
    SessionProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});
```

### console mock

```typescript
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
```

## Red 상태 작성 팁

TDD Red 단계에서 테스트를 작성할 때:

- 아직 존재하지 않는 함수/컴포넌트를 import한다. TypeScript 에러는 무시한다.
- 테스트 본문에 의도를 주석으로 명시한다.
- 각 it 블록이 독립적으로 실패하도록 작성한다.

```typescript
// 아직 존재하지 않는 모듈 import
import { createUser } from '../createUser';

describe('createUser', () => {
  it('유효한 데이터로 사용자를 생성한다', () => {
    // 요구사항: 이름과 이메일이 주어지면 새 사용자 객체를 반환한다
    const user = createUser({ name: '홍길동', email: 'hong@test.com' });

    expect(user).toMatchObject({
      name: '홍길동',
      email: 'hong@test.com',
    });
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeDefined();
  });
});
```
