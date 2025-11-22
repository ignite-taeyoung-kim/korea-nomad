/**
 * 테스트 타임아웃 설정
 */
export const TIMEOUTS = {
  // 일반적인 네비게이션
  navigation: 30000,

  // 페이지 로드 완료
  pageLoad: 30000,

  // API 응답 대기
  apiResponse: 15000,

  // 요소 가시성 대기
  elementVisible: 10000,

  // 요소 활성화 대기
  elementEnabled: 10000,

  // 네트워크 유휴 대기
  networkIdle: 5000,

  // 애니메이션 완료 대기
  animation: 2000,

  // 기본 액션 타임아웃
  action: 5000,

  // 데이터 로딩 대기
  dataLoad: 20000,

  // 폼 제출 대기
  formSubmit: 10000,

  // 모달 닫힘 대기
  modalDismiss: 5000,
} as const;

/**
 * 재시도 설정
 */
export const RETRIES = {
  default: 3,
  critical: 5,
  flaky: 2,
} as const;

/**
 * 대기 간격
 */
export const DELAYS = {
  short: 500,
  medium: 1000,
  long: 2000,
  extraLong: 3000,
} as const;
