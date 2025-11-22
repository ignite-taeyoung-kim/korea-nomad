/**
 * Playwright 전역 정리 - 모든 테스트 완료 후 실행
 */
async function globalTeardown() {
  console.log('🧹 E2E 테스트 정리 중...');

  // 필요시 DB 정리, API 서버 종료 등을 여기에서 수행
  // 예: 테스트 데이터 삭제, API 서버 종료, 등

  console.log('✅ 정리 완료');
}

export default globalTeardown;
