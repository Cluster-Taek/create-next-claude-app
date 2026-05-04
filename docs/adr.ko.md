# [ADR] 프론트엔드 기술 스택 및 아키텍처 결정 레코드

## 1. 프레임워크 및 언어

- **기술**: Next.js 16 (App Router) · React 19 · TypeScript 5.9
- **이유**:
  - React Compiler 기반 자동 최적화 (Memoization)
  - 개발자 경험(DX) 및 런타임 성능 향상
  - 서버 컴포넌트(RSC) 중심의 효율적 데이터 페칭
  - [선택] `next/cache` 도입 여부는 데이터 갱신 요구사항에 따라 유연하게 적용

## 2. 패키지 매니저

- **기술**: pnpm
- **이유**:
  - 글로벌 저장소 및 하드 링크(Hard link) 활용
  - 디스크 공간 절약 및 압도적인 설치 속도
  - 엄격한 심볼릭 링크(Symlink) 구조
  - 유령 의존성(Phantom Dependency) 사전 차단 및 안정성 확보

## 3. 아키텍처

- **기술**: Feature-Sliced Design (FSD)
- **이유**:
  - `app/`(순수 라우팅)과 `src/`(비즈니스 로직)의 역할 분리
  - 도메인(Feature) 단위 응집도 향상
  - 코드 재사용성 및 유지보수성 극대화
  - Flat 구조 대비 컨텍스트 파악 비용 감소 (동일 기능 개발 시 토큰 소모량 최적화)

## 4. 스타일링

- **기술**: Tailwind CSS v4
- **이유**:
  - SSR 환경 내 Hydration 이슈 원천 차단
  - Utility-first 기반 클래스명 네이밍 고민 해소
  - 공통 스타일 관리 오버헤드 감소
  - 스타일링보다 비즈니스 로직 개발에 집중

## 5. 상태 및 데이터

- **기술**: Zustand · TanStack React Query · React Hook Form + Zod
- **이유**:
  - Zustand: 보일러플레이트가 적은 경량 클라이언트 상태 관리
  - React Query: 서버 상태 동기화 및 캐싱 최적화
  - RHF + Zod: 렌더링 최적화 폼 핸들링 및 안정적인 스키마 검증

## 6. 인증 (Authentication)

- **기술**: NextAuth.js
- **이유**:
  - Next.js 생태계와 최적화된 통합
  - [선택] OAuth 도입 시 복잡한 인증 로직 단축
  - [선택] OAuth 미사용 시, 라이브러리 제외 및 경량화된 커스텀 쿠키 핸들링 로직 적용

## 7. 빌드 시스템

- **기술**: Turbopack
- **이유**:
  - Rust 기반의 초고속 번들링
  - Next.js 환경에 최적화된 압도적인 핫 리로딩(HMR)
  - 개발 서버 초기 구동 속도 및 생산성 극대화

## 8. 테스트 (Testing)

- **기술**: Vitest · Testing Library · Playwright
- **이유**:
  - 테스트 레이어 이원화 (단위/통합 vs E2E)
  - Vitest: 가볍고 빠른 실행 속도의 모듈/컴포넌트 테스트
  - Playwright: 브라우저 환경 기반 사용자 시나리오(E2E) 검증 및 서비스 코어 플로우 안정성 확보

## 9. 개발 환경

- **기술**: ESLint · Prettier · Husky · Commitlint · Steiger
- **이유**:
  - ESLint / Prettier: 일관된 코드 컨벤션 및 포맷팅 유지
  - Husky / Commitlint: Git 훅 기반 커밋 메시지 규칙 강제 및 품질 통제
  - Steiger: FSD 아키텍처 규칙 검증 및 구조적 안정성 보장
