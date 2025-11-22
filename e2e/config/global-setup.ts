import { chromium, FullConfig } from '@playwright/test';

/**
 * Playwright 전역 설정 - 모든 테스트 시작 전 실행
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 E2E 테스트 시작 전 설정 중...');

  // 필요시 DB 초기화, API 모킹 설정 등을 여기에서 수행
  // 예: 테스트 데이터 생성, API 서버 시작, 등

  console.log('✅ 전역 설정 완료');
}

export default globalSetup;
