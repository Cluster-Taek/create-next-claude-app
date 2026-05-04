---
name: spec
description: 자연어/Gherkin 요구사항을 표준 Spec 문서로 변환. 페이지 개요/UI 영역/비즈니스 로직 구조로 정리된 명세서를 생성. Use when writing specs, documenting requirements, running /spec, or converting requirements into specifications.
user_invocable: true
---

# Spec

자연어/Gherkin 요구사항을 표준 Spec 문서로 변환한다. 코드 작성도, 테스트 케이스 도출도 하지 않는다. 명세 문서만 생성한다.

```
요구사항 확보 → 영역 분리 → Spec 문서 작성 → 사용자 확인
```

테스트 케이스(TC)는 별도 스킬 `/testcase` 로 생성한다.

## 절차

### 1. 입력 파싱

인자에 따라 입력 방식을 결정한다:

- `/spec` (인자 없음) → 대화형 인터뷰 시작. [references/interview-guide.md](references/interview-guide.md) 참고.
- `/spec <자연어/Gherkin 파일>` → 파일에서 요구사항 파싱

요구사항 형식이 모호하면 사용자에게 형식과 산출물 위치를 확인한다.

### 2. Spec 문서 작성

[references/spec-template.md](references/spec-template.md) 구조를 따른다.

- 파일명: `{도메인}-{기능}.spec.md` (예: `user-list.spec.md`)
- 저장 위치: `docs/spec/` (없으면 사용자에게 확인 후 생성)
- 표/IF-ELSE/CASE 문법으로 조건 명시
- 비즈니스 로직(상태 정의, 트리거, 매핑) 별도 섹션으로 분리

### 3. 사용자 확인

생성된 Spec 파일 경로와 핵심 통계(섹션 수)를 보여준다.

후속 단계 안내:
> TC 명세서를 작성하려면 `/testcase {파일경로}` 를 실행하세요.

## 핵심 규칙

- 코드도, TC도 작성하지 않는다. Spec 문서만 생성한다.
- 요구사항에 없는 내용을 추측해 추가하지 않는다. 모호하면 질문한다.
- UI 영역 단위로 섹션을 분리한다 (Header, 검색, 리스트, 팝업 등).
- 분기/조건은 IF/ELSE/CASE로 명시한다.
- 상태값이 있으면 정의표(상태명/정의/트리거)로 정리한다.

## /testcase 와의 관계

- `/spec` — 요구사항 → Spec 문서 작성
- `/testcase` — Spec 문서 → TC 명세서 작성

두 스킬은 독립적이다. Spec 작성 후 별도로 `/testcase`를 호출하여 TC를 도출한다.

## References

- [references/interview-guide.md](references/interview-guide.md) - 대화형 요구사항 인터뷰 가이드
- [references/spec-template.md](references/spec-template.md) - Spec 문서 템플릿 및 작성 규칙
