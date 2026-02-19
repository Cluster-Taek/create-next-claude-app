---
name: review
description: 코드 리뷰 자동 수행. staged 변경사항 또는 지정 경로를 단계별로 분석하여 중요도 순서대로 이슈를 보고. Use when reviewing code, running /review, or checking code quality.
user_invocable: true
---

# Code Review

staged 변경사항 또는 지정된 경로를 3단계 플로우로 리뷰한다. 중요도가 높은 이슈부터 체크하고, 이상 없으면 다음 단계로 넓혀간다.

## 리뷰 대상 결정

- **인자 없이** `/review` → staged 변경사항 대상
- **경로 지정** `/review src/features/auth` → 해당 경로의 파일들 대상

## 절차

1. 리뷰 대상을 결정한다:
   - 경로 인자가 있으면 → 해당 경로의 파일들을 Glob으로 찾아 Read로 읽는다.
   - 경로 인자가 없으면 → `git diff --cached`로 staged 변경사항을 확인한다.
   - staged도 없으면 → 리뷰 대상이 없음을 안내한다.
2. 변경된 파일을 Read 도구로 읽어 전체 컨텍스트를 파악한다.
3. Phase 1 → 2 → 3 순서로 리뷰를 진행한다.

## Phase 1: Critical (항상 실행)

아래 항목을 체크한다:

- **버그** — 런타임 에러, null/undefined 접근, 잘못된 조건문, off-by-one
- **보안** — XSS, injection, 민감 정보 노출, 인증/인가 누락
- **에러 핸들링** — try-catch 누락, 비동기 에러 미처리, 사용자 피드백 없는 실패
- **타입 안전성** — any 사용, 타입 단언 남용, 잘못된 타입 캐스팅

이슈 발견 시 → 즉시 보고하고 Phase 2로 넘어가지 않는다.
이상 없으면 → Phase 2 진행.

## Phase 2: Important

아래 항목을 체크한다:

- **FSD 구조** — 레이어 간 의존성 방향 위반, 슬라이스 간 직접 import
- **관심사 분리** — 하나의 컴포넌트가 여러 역할 수행, 비즈니스 로직과 UI 혼재
- **서버/클라이언트 경계** — 서버 전용 코드의 클라이언트 노출, 'use client' 누락/불필요 사용
- **의존성 방향** — 상위 레이어에서 하위 레이어로의 역참조

이슈 발견 시 → Phase 1 결과(통과)와 함께 보고. Phase 3으로 넘어가지 않는다.
이상 없으면 → Phase 3 진행.

## Phase 3: Suggestions

아래 항목을 체크한다:

- **테스트 커버리지** — 변경된 코드에 대응하는 테스트 파일이 있는지 확인. `__tests__/` 디렉토리나 `.test.ts(x)` 파일을 Glob으로 탐색. 테스트가 없으면 어떤 테스트가 필요한지 제안한다.
- **렌더링** — 불필요한 리렌더링, 누락된 메모이제이션, key prop 문제
- **번들** — 불필요한 import, tree-shaking 방해, 큰 라이브러리 전체 import
- **가독성** — 불명확한 네이밍, 과도한 중첩, 매직 넘버
- **중복** — 반복되는 로직, 추출 가능한 공통 패턴

## 출력 형식

터미널에 마크다운으로 출력한다:

```
## Code Review

### Phase 1: Critical ✅
이상 없음

### Phase 2: Important ⚠️

**[FSD 구조]** `src/features/auth/ui/LoginForm.tsx:15`
shared 레이어에서 features 레이어를 직접 import하고 있음.
→ shared는 features에 의존할 수 없다.

### Phase 3
Phase 2에서 이슈 발견으로 생략
```

각 이슈는 다음을 포함한다:

- **카테고리** 태그
- **파일:라인** 위치
- 문제 설명 (1~2문장)
- `→` 개선 방향 (1문장)

모든 Phase를 통과하면:

```
## Code Review

### Phase 1: Critical ✅
### Phase 2: Important ✅
### Phase 3: Suggestions ✅

이슈 없음. 커밋해도 좋습니다.
```
