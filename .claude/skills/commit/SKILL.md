---
name: commit
description: Git 커밋 자동 생성. staged 변경사항을 분석하여 커밋 메시지를 작성하고 커밋 실행. Use when committing changes, creating git commits, or running /commit.
user_invocable: true
---

# Commit

staged 변경사항을 분석하여 프로젝트 컨벤션에 맞는 커밋 메시지를 작성하고 커밋을 실행한다.

## 절차

1. **상태 확인** — 아래 명령을 병렬 실행:
   - `git status` (untracked 파일 확인)
   - `git diff --cached` (staged 변경사항 확인)
   - `git diff` (unstaged 변경사항 확인)
   - `git log --oneline -5` (최근 커밋 스타일 참고)

2. **이슈 번호 확인** — 브랜치명에서 이슈 번호를 추출한다:
   - 브랜치명 패턴: `feature/#123-description`, `fix/#45-bug`, `#12-something` 등
   - 이슈 번호가 없으면 생략

3. **커밋 타입 결정**:
   - `feat` — 새 기능 추가
   - `fix` — 버그 수정
   - `refactor` — 리팩토링 (기능 변경 없음)
   - `test` — 테스트 추가/수정
   - `docs` — 문서 변경
   - `chore` — 빌드, 설정 등 기타

4. **커밋 메시지 작성** — 아래 포맷을 따른다:

```
#{이슈번호} type: 한글 제목 (간결하게)

- 주요 변경 1
- 주요 변경 2
- 주요 변경 3

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

이슈 번호가 없을 경우:

```
type: 한글 제목 (간결하게)

- 주요 변경 1
- 주요 변경 2

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
```

## 메시지 작성 규칙

- **제목**: 변경의 핵심을 한 줄로 요약. 한글로 작성.
- **본문**: 주요 변경사항을 불릿으로 나열. 3~6개 항목. 각 항목은 "무엇을 했는지"를 간결하게 서술. 지나치게 세부적인 내용(파일명, 설정값 등)은 생략.
- **Co-Authored-By**: 항상 포함.
- 변경사항에 참고 링크가 있다면 본문 뒤에 `References:` 섹션 추가.

## 본문 디테일 수준 예시

### 너무 상세 (X)

```
- Vitest + happy-dom 단위 테스트 환경 구성 (setup, test-utils, Next.js mocks)
- Playwright E2E 테스트 환경 구성 (auth setup, global-setup, CI workflow)
- 비즈니스 로직 중심 커버리지 설정 (UI/Provider/서버 전용 코드 제외, threshold 90%)
```

### 적절한 수준 (O)

```
- Vitest + happy-dom 단위 테스트 환경 구성
- Playwright E2E 테스트 환경 구성
- 비즈니스 로직 중심 커버리지 설정 (threshold 90%)
```

괄호 안의 세부사항은 핵심 수치나 키워드만 남기고 나머지는 생략한다.

## 실행

staged 변경이 없으면 사용자에게 먼저 staging을 안내한다. staging할 파일이 명확하면 `git add`까지 수행한 뒤 커밋한다. 커밋은 HEREDOC 형식으로 실행:

```bash
git commit -m "$(cat <<'EOF'
type: 제목

- 변경 1
- 변경 2

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>
EOF
)"
```

커밋 후 `git status`로 결과를 확인한다.
