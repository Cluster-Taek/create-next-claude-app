---
name: testcase
description: Spec 문서 또는 요구사항 자료를 기반으로 테스트 케이스(TC) 명세서를 생성. 영역별 표 형식, ID 규칙(TC-{영역}-{NN}) 적용. Use when generating test cases, writing TC documents, running /testcase, or deriving testcases from specs.
user_invocable: true
---

# Testcase

Spec 문서나 요구사항을 입력으로 받아 테스트 케이스(TC) 명세서를 생성한다. 코드 테스트가 아니라 사람이 검토 가능한 표 형식 명세 문서를 출력한다.

```
입력 분석 → 영역 분리 → TC 도출 → 매핑 검증 → 사용자 확인
```

## 절차

### 1. 입력 파싱

인자에 따라 입력 방식을 결정한다:

- `/testcase` (인자 없음) → Spec 파일 경로를 사용자에게 묻는다. 없으면 `docs/spec/` 디렉토리를 스캔하여 후보를 제시한다.
- `/testcase <Spec 파일>` → 해당 Spec 파일에서 영역/요구사항 파싱
- `/testcase <자연어/Gherkin 파일>` → Spec 없이 요구사항 파일에서 직접 TC 도출 (도메인이 명확할 때)

Spec 파일이 없거나 모호하면 먼저 `/spec`을 실행하라고 안내한다.

### 2. 영역 분리 및 TC 도출

[references/tc-template.md](references/tc-template.md) 구조를 따른다.

각 영역(섹션)마다:
1. 정상 케이스 — 기대대로 동작하는 시나리오
2. 분기 케이스 — IF/ELSE/CASE 각 분기마다 별도 TC
3. 상태 전이 — 상태값이 있으면 각 전이마다 TC
4. 엣지 케이스 — 빈 값, 최대값, 권한 없음, 동시 실행
5. 에러 케이스 — 유효성 실패, API 실패, 네트워크 오류

요구사항 → TC 매핑 시 누락이 없도록 각 항목에 대응 TC가 있는지 검증한다.

### 3. TC 명세서 작성

- 파일명: `{도메인}-{기능}.tc.md` (예: `user-list.tc.md`)
- 저장 위치: 입력 Spec과 동일 디렉토리 (`docs/spec/`)
- 영역별 표 (`ID | 테스트 항목 | 테스트 시나리오 | 기대 결과`)
- ID 규칙: `TC-{영역코드}-{2자리 번호}` (예: `TC-LIST-01`, `TC-DET-01`)
- 하단에 💡 주요 체크 포인트 3~5개 추가

### 4. 매핑 검증

Spec의 모든 요구사항이 최소 1개 이상의 TC로 매핑되었는지 확인한다. 누락된 항목이 있으면 사용자에게 보고한다.

### 5. 사용자 확인

생성된 파일 경로와 TC 통계(영역 수, 총 TC 개수)를 보여주고 종료한다.

## 핵심 규칙

- 코드를 작성하지 않는다. 사람이 검토 가능한 표 형식 명세서만 생성한다.
- 한 TC는 단일 검증 포인트만 담는다.
- 분기/조건은 각각 별도 TC로 분리한다 (IF/ELSE → 2개 TC).
- 기대 결과는 관찰 가능한 형태로 서술한다 ("잘 동작" 같은 모호한 표현 금지).
- describe/it 같은 코드 표현 대신 자연어 시나리오로 서술한다.
- Spec에 없는 요구사항을 추측해 추가하지 않는다. 모호하면 사용자에게 질문한다.

## /spec 과의 관계

- `/spec` — 요구사항 → Spec 문서 작성
- `/testcase` — Spec 문서 → TC 명세서 작성

두 스킬은 독립적이다. Spec 없이 곧바로 TC만 만들 수도 있고, Spec 작성 후 별도로 호출할 수도 있다.

## References

- [references/tc-template.md](references/tc-template.md) - TC 템플릿, ID 규칙, 도출 규칙
