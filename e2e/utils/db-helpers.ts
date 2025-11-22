/**
 * 데이터베이스 관련 헬퍼 함수들
 * 참고: 실제 구현은 백엔드 API 또는 테스트 데이터베이스에 따라 달라집니다
 */

/**
 * 테스트 사용자 생성 (API 호출 시뮬레이션)
 */
export async function createTestUser(userData: {
  email: string;
  password: string;
  name: string;
}): Promise<any> {
  // TODO: 실제 API 엔드포인트로 POST 요청
  // const response = await fetch('/api/auth/signup', { ... });
  // return response.json();
  return {
    id: 'user-' + Date.now(),
    ...userData,
    createdAt: new Date(),
  };
}

/**
 * 테스트 사용자 삭제
 */
export async function deleteTestUser(userId: string): Promise<void> {
  // TODO: 실제 API 엔드포인트로 DELETE 요청
  // await fetch(`/api/users/${userId}`, { method: 'DELETE' });
}

/**
 * 데이터베이스 리셋 (테스트 환경)
 */
export async function resetTestDatabase(): Promise<void> {
  // TODO: 테스트 DB 초기화 API 호출
  // 또는 테스트 전용 엔드포인트 호출
}

/**
 * 테스트 데이터 시드 (초기 데이터 설정)
 */
export async function seedTestData(): Promise<void> {
  // TODO: 테스트 필요한 초기 데이터 설정
  // - 테스트 사용자
  // - 테스트 도시
  // - 테스트 리뷰
  // - 테스트 이벤트
}

/**
 * 기존 테스트 데이터 정리
 */
export async function cleanupOldTestData(daysOld: number = 7): Promise<void> {
  // TODO: 오래된 테스트 데이터 삭제
  // const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  // DELETE FROM test_data WHERE createdAt < cutoffDate;
}

/**
 * 특정 사용자의 모든 데이터 삭제
 */
export async function deleteUserAllData(userId: string): Promise<void> {
  // TODO: 사용자 관련 모든 데이터 삭제
  // - 리뷰
  // - 즐겨찾기
  // - 북마크
  // - 이벤트
  // - 프로필
}

/**
 * 테스트 상태 확인
 */
export async function getTestDatabaseStatus(): Promise<{
  status: 'healthy' | 'degraded' | 'down';
  userCount: number;
  cityCount: number;
  reviewCount: number;
  eventCount: number;
}> {
  // TODO: 테스트 DB 상태 조회
  return {
    status: 'healthy',
    userCount: 0,
    cityCount: 0,
    reviewCount: 0,
    eventCount: 0,
  };
}

/**
 * 트랜잭션 시작
 */
export async function beginTransaction(): Promise<void> {
  // TODO: 트랜잭션 시작
}

/**
 * 트랜잭션 커밋
 */
export async function commitTransaction(): Promise<void> {
  // TODO: 트랜잭션 커밋
}

/**
 * 트랜잭션 롤백
 */
export async function rollbackTransaction(): Promise<void> {
  // TODO: 트랜잭션 롤백
}

/**
 * 특정 데이터 조회
 */
export async function queryTestData(query: string): Promise<any[]> {
  // TODO: 테스트 데이터 쿼리
  return [];
}

/**
 * 특정 데이터 삽입
 */
export async function insertTestData(table: string, data: Record<string, any>): Promise<any> {
  // TODO: 테스트 데이터 삽입
  return data;
}

/**
 * 특정 데이터 업데이트
 */
export async function updateTestData(
  table: string,
  id: string,
  data: Record<string, any>
): Promise<any> {
  // TODO: 테스트 데이터 업데이트
  return data;
}

/**
 * 테스트 캐시 초기화
 */
export async function clearTestCache(): Promise<void> {
  // TODO: 테스트 캐시 초기화 (Redis 등)
}

/**
 * 테스트 파일 정리 (업로드된 파일)
 */
export async function cleanupTestFiles(): Promise<void> {
  // TODO: 테스트 중 생성된 임시 파일 정리
}
