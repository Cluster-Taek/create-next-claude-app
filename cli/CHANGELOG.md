# Changelog

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.6.0](https://github.com/Cluster-Taek/create-next-claude-app/compare/v1.5.0...v1.6.0) (2026-05-04)

### Features

* loading.tsx 및 not-found.tsx 페이지 추가 ([c0d0c83](https://github.com/Cluster-Taek/create-next-claude-app/commit/c0d0c8358b6f814934baf66225c43b3c11accb39))

### Bug Fixes

* FetchError를 Error 클래스로 변경하고 401 이중 에러 전파 방지 ([b2e1852](https://github.com/Cluster-Taek/create-next-claude-app/commit/b2e18522c240a73c8a21b1b6b545cc8a0b1cf551))
* layout 접근성 수정 및 런타임 타입 검증 복원 ([02f1147](https://github.com/Cluster-Taek/create-next-claude-app/commit/02f11474523ab57d6bc1910de5975a202101477a))
* 모달 접근성 개선 및 중복 열기 방지 ([712171a](https://github.com/Cluster-Taek/create-next-claude-app/commit/712171a6944933331499c3bf21ddfbc2bfc2f319))
* 모달에 aria-label 추가하여 스크린 리더 접근성 강화 ([67af847](https://github.com/Cluster-Taek/create-next-claude-app/commit/67af8472b396d59aca916fcfe30bcce0cd83a837))
* 코드 리뷰 피드백 반영 (모달 props 갱신, 토큰 리프레시 로깅) ([4c63913](https://github.com/Cluster-Taek/create-next-claude-app/commit/4c63913f87e8f82021a97f621e2f06b2333622be))
* 토큰 리프레시 실패 시 에러 처리 추가 ([7d39399](https://github.com/Cluster-Taek/create-next-claude-app/commit/7d39399305e5a178437e067df2b848fbf212f068))
* 토큰 리프레시 실패 시 클라이언트 자동 로그아웃 처리 ([61c8327](https://github.com/Cluster-Taek/create-next-claude-app/commit/61c8327638fef2e4854d6661e0928363c0c484ef))

### Performance Improvements

* loading.tsx를 순수 CSS 기반으로 변경 ([e61e4b7](https://github.com/Cluster-Taek/create-next-claude-app/commit/e61e4b70125dbea2a9ed61bb579945d03e05dc66))

### Documentation

* add korean README translation ([9eef397](https://github.com/Cluster-Taek/create-next-claude-app/commit/9eef39735ce5d7ba34d0288e2355d3da503a6707))
* llm 관련 docs 수정 ([fbb86a1](https://github.com/Cluster-Taek/create-next-claude-app/commit/fbb86a18cd4457c491ad0bc2aa958a1029f8b86b))

### Code Refactoring

* Fetch API 모듈 단순화 및 에러 처리 개선 ([a89831a](https://github.com/Cluster-Taek/create-next-claude-app/commit/a89831a9a564fbd2460f62d00012605f2fa6b33c))
* 미사용 코드 및 타입 정리 ([9cb80a5](https://github.com/Cluster-Taek/create-next-claude-app/commit/9cb80a50289a3782982101515c5b32d41c1dc158))

## [1.5.0](https://github.com/Cluster-Taek/create-next-claude-app/compare/v1.4.0...v1.5.0) (2026-03-09)

### Features

* agent-browser 스킬 추가 ([46d1b8a](https://github.com/Cluster-Taek/create-next-claude-app/commit/46d1b8ad7012a6a9d7e1f6f74617ec2f10079ce1))

### Bug Fixes

* 스킬 README의 /browser 명령어를 /agent-browser로 수정 ([e19ff41](https://github.com/Cluster-Taek/create-next-claude-app/commit/e19ff416b1c51ea77af08b516cbbb4852879523e))
* 템플릿 스크립트 실행 권한 부여 ([bf7021e](https://github.com/Cluster-Taek/create-next-claude-app/commit/bf7021e9f38557efd2351f0f86e2878e4da3934b))

## [1.4.0](https://github.com/Cluster-Taek/create-next-claude-app/compare/v1.3.0...v1.4.0) (2026-02-24)

### Features

* fsd 슬라이스 스캐폴딩 스킬 추가 ([6c05fc2](https://github.com/Cluster-Taek/create-next-claude-app/commit/6c05fc202eec2177a5b6bdeacc99283d00cdd800))
* fsd-generator에 API 통합 패턴 레퍼런스 추가 ([de2eafa](https://github.com/Cluster-Taek/create-next-claude-app/commit/de2eafa7d585f70251d0f4409b0b08ac79728988))
* next.js 16 에러 방지 스킬 추가 ([4d5d8b4](https://github.com/Cluster-Taek/create-next-claude-app/commit/4d5d8b4766fc0775a5b66fbb9258986617929d55))
* 요구사항 기반 TDD 스킬 추가 ([f20674a](https://github.com/Cluster-Taek/create-next-claude-app/commit/f20674a45dc7c17f516a6a974c709b5982054a23))

### Bug Fixes

* e2e globalSetup 경로 및 설정 수정 ([516faca](https://github.com/Cluster-Taek/create-next-claude-app/commit/516facaffab505118f5c986d6e7dc8ab2559e057))

### Documentation

* readme 전면 재작성 및 스킬 문서 추가 ([acdf082](https://github.com/Cluster-Taek/create-next-claude-app/commit/acdf082ab6931b523cf79a48aa36438c8c4f0d8d))

## [1.3.0](https://github.com/Cluster-Taek/create-next-claude-app/compare/v1.2.1...v1.3.0) (2026-02-20)

### Features

* **cli:** --version 출력에 환경 정보 추가 ([25a6490](https://github.com/Cluster-Taek/create-next-claude-app/commit/25a6490ca48ada8f3277a797994c27e62f37d8b6))

## 1.0.0 (2026-01-26)

### Features

- Initial release of create-next-claude-app
- Next.js 16 with App Router support
- Feature-Sliced Design architecture scaffolding
- TypeScript configuration
- Tailwind CSS v4 integration
- React Query setup for data fetching
- Zustand for state management
- NextAuth.js for authentication
- React Compiler enabled
- ESLint & Prettier pre-configured
- Husky git hooks setup
- Interactive CLI with project customization options
- Automated dependency installation
- Environment variables generation (NextAuth secrets)
