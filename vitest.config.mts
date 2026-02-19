import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './app'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/shared/config/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['html', 'lcov', 'text'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        // 테스트 파일 자체, 배럴/타입 정의
        'src/**/*.test.{ts,tsx}',
        'src/**/index.ts',
        'src/**/*.d.ts',
        'src/**/*types*.ts',

        // 설정·상수 (로직 없음)
        'src/shared/config/**',
        'src/shared/model/**',
        'src/**/config/**',

        // 서버 전용 (단위 테스트 불가, E2E 영역)
        'src/shared/lib/auth/**',

        // Provider·레이아웃 (통합/E2E 영역)
        'src/app/**',
        'src/views/**',
        'src/widgets/**',
        'src/**/model/*Provider*',

        // 엔티티 (API 래퍼 + Zod 스키마 정의, 통합 테스트 영역)
        'src/entities/**',
        'src/shared/api/getQueryClient*',

        // UI 컴포넌트 (E2E 영역 — 변경 시 개별 테스트 추가)
        'src/shared/ui/spinner/**',
        'src/shared/ui/back-button/**',
        'src/features/**/ui/**',

        // 커스텀 훅 (통합 테스트 영역)
        'src/shared/lib/hooks/**',
        'src/entities/**/model/use*',
      ],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
});
