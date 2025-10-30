/**
 * Supabase Mock Implementation
 * @supabase/supabase-js와 @supabase/ssr의 Mock 구현
 */

import { mockCities, mockReviews, mockEvents, mockUsers } from './data.mock';

// ============================================================================
// Mock Supabase Auth
// ============================================================================

export const mockSupabaseAuth = {
  getUser: jest.fn(),
  signInWithPassword: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChange: jest.fn(),
};

// ============================================================================
// Mock Supabase Query Builder
// ============================================================================

class MockQueryBuilder {
  tableName: string;
  filters: any[] = [];
  orderBy: { column: string; ascending?: boolean } | null = null;
  limitValue: number | null = null;
  selectColumns: string | null = null;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  select(columns = '*') {
    this.selectColumns = columns;
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ type: 'eq', column, value });
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push({ type: 'neq', column, value });
    return this;
  }

  gt(column: string, value: any) {
    this.filters.push({ type: 'gt', column, value });
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push({ type: 'gte', column, value });
    return this;
  }

  lt(column: string, value: any) {
    this.filters.push({ type: 'lt', column, value });
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push({ type: 'lte', column, value });
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push({ type: 'in', column, values });
    return this;
  }

  order(column: string, { ascending = true } = {}) {
    this.orderBy = { column, ascending };
    return this;
  }

  limit(count: number) {
    this.limitValue = count;
    return this;
  }

  /**
   * Mock 데이터 필터링 및 반환
   */
  private getFilteredData() {
    let data: any[] = [];

    // 테이블에 맞는 Mock 데이터 선택
    switch (this.tableName) {
      case 'cities':
        data = [...mockCities];
        break;
      case 'reviews':
        data = [...mockReviews];
        break;
      case 'events':
        data = [...mockEvents];
        break;
      default:
        data = [];
    }

    // 필터 적용
    data = data.filter((row) => {
      return this.filters.every((filter) => {
        switch (filter.type) {
          case 'eq':
            return row[filter.column] === filter.value;
          case 'neq':
            return row[filter.column] !== filter.value;
          case 'gt':
            return row[filter.column] > filter.value;
          case 'gte':
            return row[filter.column] >= filter.value;
          case 'lt':
            return row[filter.column] < filter.value;
          case 'lte':
            return row[filter.column] <= filter.value;
          case 'in':
            return filter.values.includes(row[filter.column]);
          default:
            return true;
        }
      });
    });

    // 정렬 적용
    if (this.orderBy) {
      data.sort((a, b) => {
        const aVal = a[this.orderBy!.column];
        const bVal = b[this.orderBy!.column];

        if (aVal < bVal) return this.orderBy!.ascending ? -1 : 1;
        if (aVal > bVal) return this.orderBy!.ascending ? 1 : -1;
        return 0;
      });
    }

    // 제한 적용
    if (this.limitValue !== null) {
      data = data.slice(0, this.limitValue);
    }

    return data;
  }

  then(onSuccess: (result: any) => void, onError?: (error: any) => void) {
    try {
      const data = this.getFilteredData();
      onSuccess({ data, error: null });
    } catch (error) {
      if (onError) onError(error);
    }
  }

  catch(onError: (error: any) => void) {
    // For promise chain compatibility
    return this;
  }
}

// ============================================================================
// Mock Supabase Database
// ============================================================================

export const mockSupabaseDatabase = {
  from: jest.fn((tableName: string) => {
    return {
      select: jest.fn((columns = '*') => new MockQueryBuilder(tableName).select(columns)),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      upsert: jest.fn(),
    };
  }),
};

// ============================================================================
// Mock Supabase Client
// ============================================================================

export const mockSupabaseClient = {
  auth: mockSupabaseAuth,
  from: jest.fn((tableName: string) => {
    return new MockQueryBuilder(tableName);
  }),
};

// ============================================================================
// Mock createClient
// ============================================================================

export const mockCreateClient = jest.fn(() => mockSupabaseClient);

// ============================================================================
// Supabase Jest Mock
// ============================================================================

jest.mock('@supabase/supabase-js', () => ({
  createClient: mockCreateClient,
}));

// ============================================================================
// Supabase SSR Jest Mock
// ============================================================================

jest.mock('@supabase/ssr', () => ({
  createBrowserClient: mockCreateClient,
  createServerClient: mockCreateClient,
}));

// ============================================================================
// Helper Functions for Tests
// ============================================================================

/**
 * Mock 데이터 리셋
 */
export function resetMockData() {
  jest.clearAllMocks();
}

/**
 * Mock 사용자 설정
 */
export function setMockUser(user: any) {
  mockSupabaseAuth.getUser.mockResolvedValue({ data: { user }, error: null });
}

/**
 * Mock 사용자 제거 (로그아웃)
 */
export function clearMockUser() {
  mockSupabaseAuth.getUser.mockResolvedValue({ data: { user: null }, error: null });
}

/**
 * Mock 쿼리 결과 설정
 */
export function setMockQueryResult(data: any) {
  mockSupabaseClient.from = jest.fn(() => ({
    select: jest.fn().mockResolvedValue({ data, error: null }),
  }));
}

/**
 * Mock 쿼리 에러 설정
 */
export function setMockQueryError(error: any) {
  mockSupabaseClient.from = jest.fn(() => ({
    select: jest.fn().mockResolvedValue({ data: null, error }),
  }));
}
