/**
 * E2E 테스트용 사용자 데이터
 */
export const TEST_USERS = {
  // 기본 테스트 사용자
  validUser: {
    id: 'test-user-1',
    email: 'testuser@example.com',
    password: 'TestPassword123!',
    name: 'Test User',
    bio: 'I love traveling to new cities',
  },

  // 두 번째 테스트 사용자
  anotherUser: {
    id: 'test-user-2',
    email: 'anotheruser@example.com',
    password: 'TestPassword456!',
    name: 'Another User',
    bio: 'Digital nomad exploring Asia',
  },

  // 회원가입 테스트용 새 사용자
  newUser: {
    email: `newuser-${Date.now()}@example.com`,
    password: 'NewPassword789!',
    name: 'Brand New User',
  },

  // 유효하지 않은 이메일
  invalidEmail: {
    email: 'invalid-email',
    password: 'Password123!',
  },

  // 약한 비밀번호
  weakPassword: {
    email: 'weakpass@example.com',
    password: '123',
  },

  // 비밀번호 불일치
  passwordMismatch: {
    email: 'mismatch@example.com',
    password: 'Password123!',
    confirmPassword: 'DifferentPassword123!',
  },

  // 빈 필드
  emptyFields: {
    email: '',
    password: '',
    name: '',
  },

  // 알려진 사용자 (DB에 존재)
  existingUser: {
    email: 'existing@example.com',
    password: 'ExistingPassword123!',
  },
} as const;

/**
 * 사용자 역할별 테스트 데이터
 */
export const USER_ROLES = {
  admin: {
    email: 'admin@example.com',
    password: 'AdminPassword123!',
  },
  moderator: {
    email: 'moderator@example.com',
    password: 'ModeratorPassword123!',
  },
  user: {
    email: 'user@example.com',
    password: 'UserPassword123!',
  },
} as const;

/**
 * 무작위 테스트 사용자 생성
 */
export function generateRandomUser() {
  const timestamp = Date.now();
  return {
    email: `user-${timestamp}@example.com`,
    password: 'TestPassword123!',
    name: `User ${timestamp}`,
    bio: 'Test user bio',
  };
}
