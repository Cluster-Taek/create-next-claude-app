import fs from 'node:fs';
import path from 'node:path';

/**
 * E2E 테스트 전 DB를 초기 상태로 리셋
 */
export default function globalSetup() {
  const root = process.cwd();
  const fixturePath = path.resolve(root, 'e2e/fixtures/db.test.json');
  const dbPath = path.resolve(root, 'db.json');

  const fixtureData = fs.readFileSync(fixturePath, 'utf-8');
  fs.writeFileSync(dbPath, fixtureData, 'utf-8');
  console.log('[globalSetup] db.json reset to fixture');
}
