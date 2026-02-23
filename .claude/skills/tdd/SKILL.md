---
name: tdd
description: 요구사항 기반 TDD 테스트 생성. 이슈/스펙 문서 또는 대화형 인터뷰로 요구사항을 수집하고, 실패하는 테스트만 작성 (Red 단계). Use when writing tests, running /tdd, doing TDD, or creating test cases from requirements.
user_invocable: true
---

# TDD

요구사항에서 실패하는 테스트를 도출한다. 코드에서 테스트를 도출하지 않는다.

```
요구사항 확보 → 테스트 케이스 도출 → 실패 테스트 작성 → Red 검증
```

## 절차

### 1. 요구사항 확보

인자에 따라 입력 방식을 결정한다:

- `/tdd` (인자 없음) → 대화형 인터뷰 시작. [references/interview-guide.md](references/interview-guide.md) 참고.
- `/tdd docs/specs/login.md` → 스펙 문서에서 수용 기준 파싱
- `/tdd #123` 또는 `/tdd <Linear 이슈 URL>` → Linear 이슈에서 요구사항 추출

### 2. 테스트 케이스 도출

요구사항을 3가지로 분류한다:

| 분류            | 설명                       | 예시                        |
| --------------- | -------------------------- | --------------------------- |
| **정상 케이스** | 기대대로 동작하는 시나리오 | 올바른 이메일로 로그인 성공 |
| **엣지 케이스** | 경계값, 빈 입력, 최대값    | 빈 문자열 제출, 255자 초과  |
| **에러 케이스** | 실패, 예외, 네트워크 오류  | 401 응답, 서버 다운         |

분류한 테스트 케이스 목록을 사용자에게 보여주고 확인받는다.

### 3. 테스트 파일 생성 (Red 상태)

테스트 유형 결정 기준:

| 대상                         | 테스트 유형     | 도구                     |
| ---------------------------- | --------------- | ------------------------ |
| 순수 함수, 유틸리티          | 단위 테스트     | Vitest                   |
| Zustand 스토어, 커스텀 훅    | 훅 테스트       | Vitest + act             |
| React 컴포넌트               | 컴포넌트 테스트 | Vitest + Testing Library |
| 페이지 흐름, 사용자 시나리오 | E2E 테스트      | Playwright               |

프로젝트 테스트 컨벤션을 적용한다. [references/test-patterns.md](references/test-patterns.md) 참고.

### 4. Red 검증

테스트 실행하여 모두 실패하는지 확인한다:

```bash
# 단위/컴포넌트 테스트
pnpm vitest run <test-file-path>

# E2E 테스트
pnpm test:e2e <test-file-path>
```

모든 테스트가 실패하면 Red 단계 완료. 구현 코드는 작성하지 않는다.

## 핵심 규칙

- 구현 코드를 먼저 읽지 않는다. 요구사항만으로 테스트를 작성한다.
- describe/it 블록은 한글로 서술한다.
- 테스트 파일 위치는 FSD 슬라이스 내 `__tests__/` 디렉토리에 생성한다.
- 하나의 it 블록에 하나의 검증만 넣는다.

## References

- [references/interview-guide.md](references/interview-guide.md) - 대화형 인터뷰 질문 가이드
- [references/test-patterns.md](references/test-patterns.md) - 프로젝트 테스트 컨벤션 및 템플릿
