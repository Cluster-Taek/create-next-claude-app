# Claude Code Skills

이 프로젝트에 구성된 Claude Code 스킬 목록과 사용법.

<!-- IMAGE: 스킬 연결 관계도 -->
<!-- /tdd → /fsd → 구현 → /review → /commit 파이프라인 -->
<!-- 자동 활성화 스킬이 각 단계에 연결되는 다이어그램 -->

## 스킬 목록

### 수동 호출 (Slash Command)

| 명령      | 스킬                                    | 설명                                     | 레퍼런스                                                                                                     |
| --------- | --------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `/tdd`    | [tdd](tdd/SKILL.md)                     | 요구사항 기반 TDD 테스트 생성 (Red 단계) | [interview-guide](tdd/references/interview-guide.md), [test-patterns](tdd/references/test-patterns.md)       |
| `/fsd`    | [fsd-generator](fsd-generator/SKILL.md) | FSD 슬라이스 스캐폴딩                    | [templates](fsd-generator/references/templates.md), [api-patterns](fsd-generator/references/api-patterns.md) |
| `/review` | [review](review/SKILL.md)               | 3-Phase 코드 리뷰                        | -                                                                                                            |
| `/commit` | [commit](commit/SKILL.md)               | 한글 커밋 메시지 자동 생성               | -                                                                                                            |

### 자동 활성화

| 스킬                                                                | 설명                         | 활성화 조건                           | 레퍼런스                                                                                                                                                               |
| ------------------------------------------------------------------- | ---------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [nextjs](nextjs/SKILL.md)                                           | Next.js 16 에러 방지         | App Router API, 캐싱, 메타데이터 작업 | [error-catalog](nextjs/references/error-catalog.md), [caching-apis](nextjs/references/caching-apis.md), [server-actions](nextjs/references/server-actions-patterns.md) |
| [vercel-react-best-practices](vercel-react-best-practices/SKILL.md) | React 성능 최적화 (70+ 규칙) | 컴포넌트 작성/수정/리팩토링           | [rules/](vercel-react-best-practices/rules/)                                                                                                                           |
| [feature-sliced-design](feature-sliced-design/SKILL.md)             | FSD 아키텍처 규칙 검증       | 파일 구조, 모듈 의존성 작업           | [rules/](feature-sliced-design/rules/)                                                                                                                                 |
| [web-design-guidelines](web-design-guidelines/SKILL.md)             | UI/UX 가이드라인 검증        | UI 리뷰, 접근성 검사 요청             | -                                                                                                                                                                      |

## 워크플로우

### Full Cycle (새 기능 개발)

```
/tdd → /fsd → 구현 → /review → /commit
```

1. **`/tdd`** — 요구사항에서 실패하는 테스트 작성
2. **`/fsd feature {name}`** — FSD 슬라이스 구조 생성
3. **구현** — nextjs, react-best-practices 스킬이 자동 지원
4. **`/review`** — 코드 리뷰
5. **`/commit`** — 커밋

### 사용 예시

```bash
# 요구사항에서 테스트 생성
/tdd                              # 대화형 인터뷰
/tdd docs/specs/payment.md        # 스펙 문서
/tdd #42                          # Linear 이슈

# FSD 슬라이스 생성
/fsd feature auth-login            # 기본 세그먼트 (ui, model)
/fsd feature payment ui model api  # 세그먼트 지정
/fsd entity product                # 엔티티 (api, model)
/fsd widget sidebar                # 위젯 (ui)

# 코드 리뷰
/review                            # staged 변경사항 리뷰

# 커밋
/commit                            # 커밋 메시지 자동 생성
```

## 디렉토리 구조

```
.claude/skills/
├── README.md                         ← 현재 파일
├── commit/
│   └── SKILL.md
├── review/
│   └── SKILL.md
├── tdd/
│   ├── SKILL.md
│   └── references/
│       ├── interview-guide.md        # 대화형 인터뷰 가이드
│       └── test-patterns.md          # 테스트 템플릿
├── fsd-generator/
│   ├── SKILL.md
│   └── references/
│       ├── templates.md              # 세그먼트별 코드 템플릿
│       └── api-patterns.md           # React Query, Prefetch 패턴
├── nextjs/
│   ├── SKILL.md
│   └── references/
│       ├── error-catalog.md          # 18개 에러 카탈로그
│       ├── caching-apis.md           # "use cache", revalidateTag
│       └── server-actions-patterns.md
├── feature-sliced-design/
│   ├── SKILL.md
│   └── rules/                        # FSD 규칙 8개
├── vercel-react-best-practices/
│   ├── SKILL.md
│   └── rules/                        # 성능 규칙 70+개
└── web-design-guidelines/
    └── SKILL.md
```
