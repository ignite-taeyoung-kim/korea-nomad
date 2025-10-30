require('@testing-library/jest-dom');

// ============================================================================
// Global Polyfills
// ============================================================================

// Add TextEncoder/TextDecoder for Next.js compatibility
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// ============================================================================
// Environment Variables
// ============================================================================

// Set up required environment variables for Supabase
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co';
process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = 'test-key';

// ============================================================================
// Global Test Setup
// ============================================================================

// localStorage Mock
const localStorageMock = (() => {
  let store = {};

  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// navigator Mock
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('')),
  },
  writable: true,
});

// IntersectionObserver Mock
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Window.matchMedia Mock
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// ============================================================================
// Global Test Utilities
// ============================================================================

// beforeEach: 각 테스트 전에 localStorage 초기화
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

// afterEach: 각 테스트 후 정리
afterEach(() => {
  jest.clearAllMocks();
});

// ============================================================================
// Suppress Console Warnings (선택사항)
// ============================================================================

// 테스트 중 console.error, console.warn 억제 (필요시 주석 제거)
// global.console = {
//   ...console,
//   error: jest.fn(),
//   warn: jest.fn(),
// };

// ============================================================================
// Test Timeouts
// ============================================================================

// 기본 테스트 타임아웃 설정 (기본값: 5000ms)
jest.setTimeout(10000);

// ============================================================================
// Supabase Client Mocks
// ============================================================================

// Mock next/cache - must be mocked before imports
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn().mockImplementation(() => Promise.resolve()),
  revalidateTag: jest.fn().mockImplementation(() => Promise.resolve()),
}), { virtual: true });

// Mock next/headers
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
  })),
  headers: jest.fn(() => ({
    get: jest.fn(),
  })),
}), { virtual: true });

// Mock server actions
jest.mock('@/app/actions/reviews', () => ({
  createReview: jest.fn().mockResolvedValue({ error: null, data: { id: 'test-id' } }),
  updateReview: jest.fn().mockResolvedValue({ error: null, data: { id: 'test-id' } }),
  deleteReview: jest.fn().mockResolvedValue({ error: null }),
}));

// Mock Supabase client creation
jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(() => ({
    auth: {
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
        order: jest.fn(),
        limit: jest.fn(),
      })),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(),
        })),
      })),
    })),
  })),
}));
