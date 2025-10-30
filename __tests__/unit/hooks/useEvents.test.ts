/**
 * Unit Tests for hooks/useEvents.ts
 *
 * 총 15개의 테스트 케이스로 Supabase 이벤트 조회 및 필터링 훅을 테스트합니다.
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useEvents } from '@/hooks/useEvents';
import { Event } from '@/lib/types';

// ============================================================================
// Mock Setup
// ============================================================================

// Mock Supabase queries
jest.mock('@/lib/supabase/queries', () => ({
  fetchUpcomingEvents: jest.fn(),
}));

import { fetchUpcomingEvents as mockFetchUpcomingEvents } from '@/lib/supabase/queries';

// Mock event data
const mockEvents: Event[] = [
  {
    id: 'event-1',
    city_id: 'seoul',
    title: 'Seoul Nomad Meetup',
    description: '서울 노마드 모임',
    category: 'networking',
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10일 후
    time: '19:00',
    location: '강남역',
    creator_id: 'user-1',
    creator_name: 'Alice',
    participant_count: 12,
  },
  {
    id: 'event-2',
    city_id: 'seoul',
    title: 'Web Dev Workshop',
    description: 'React 워크숍',
    category: 'workshop',
    date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(), // 20일 후
    time: '14:00',
    location: '강남 기술 센터',
    creator_id: 'user-2',
    creator_name: 'Bob',
    participant_count: 25,
  },
  {
    id: 'event-3',
    city_id: 'busan',
    title: 'Beach Cleanup',
    description: '해변 정소',
    category: 'social',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5일 후
    time: '10:00',
    location: '해운대',
    creator_id: 'user-3',
    creator_name: 'Charlie',
    participant_count: 30,
  },
  {
    id: 'event-4',
    city_id: 'busan',
    title: 'Business Networking',
    description: '비즈니스 네트워킹',
    category: 'networking',
    date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15일 후
    time: '18:00',
    location: '서면',
    creator_id: 'user-4',
    creator_name: 'Diana',
    participant_count: 20,
  },
];

// ============================================================================
// Initial Mount Tests - 3 tests
// ============================================================================

describe('useEvents - Initial Mount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('초기 마운트 시 Supabase에서 이벤트를 로드한다 (90일)', async () => {
    // Arrange
    (mockFetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents);

    // Act
    const { result } = renderHook(() => useEvents());

    // Assert
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockFetchUpcomingEvents).toHaveBeenCalledWith(90);
    expect(result.current.events).toEqual(mockEvents);
    expect(result.current.events).toHaveLength(4);
  });

  test('isLoading이 true → false로 변경된다', async () => {
    // Arrange
    (mockFetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents);

    // Act
    const { result } = renderHook(() => useEvents());

    // Assert: 초기 로딩 상태
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  test('초기 필터 상태가 null이다', async () => {
    // Arrange
    (mockFetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents);

    // Act
    const { result } = renderHook(() => useEvents());

    // Assert: 필터가 설정되지 않음
    expect(result.current.selectedCity).toBeNull();
    expect(result.current.selectedCategory).toBeNull();

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.selectedCity).toBeNull();
    expect(result.current.selectedCategory).toBeNull();
  });
});

// ============================================================================
// Filter Logic Tests - 4 tests
// ============================================================================

describe('useEvents - Filter Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('selectedCity가 없으면 모든 이벤트를 반환한다', async () => {
    // Arrange
    (mockFetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents);

    // Act
    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert: 필터링 없음
    expect(result.current.filteredEvents).toEqual(mockEvents);
    expect(result.current.filteredEvents).toHaveLength(4);
  });

  test('selectedCity가 설정되면 해당 도시만 필터링된다', async () => {
    // Arrange
    (mockFetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act: 서울 선택
    act(() => {
      result.current.setSelectedCity('seoul');
    });

    // Assert: 서울 이벤트만 반환
    expect(result.current.filteredEvents).toHaveLength(2);
    expect(result.current.filteredEvents.every(e => e.city_id === 'seoul')).toBe(true);
  });

  test('selectedCategory가 설정되면 해당 카테고리만 필터링된다', async () => {
    // Arrange
    (mockFetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act: networking 선택
    act(() => {
      result.current.setSelectedCategory('networking');
    });

    // Assert: networking 이벤트만 반환
    expect(result.current.filteredEvents).toHaveLength(2);
    expect(result.current.filteredEvents.every(e => e.category === 'networking')).toBe(true);
  });

  test('도시와 카테고리 모두 설정되면 AND 조건으로 필터링된다', async () => {
    // Arrange
    (mockFetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act: 서울 + networking
    act(() => {
      result.current.setSelectedCity('seoul');
      result.current.setSelectedCategory('networking');
    });

    // Assert: 서울의 networking 이벤트만 반환
    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents[0].city_id).toBe('seoul');
    expect(result.current.filteredEvents[0].category).toBe('networking');
  });
});

// ============================================================================
// setSelectedCity/Category() Tests - 2 tests
// ============================================================================

describe('useEvents - Filter State Updates', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('setSelectedCity()로 상태가 업데이트된다', async () => {
    // Arrange
    (mockFetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.selectedCity).toBeNull();

    // Act
    act(() => {
      result.current.setSelectedCity('busan');
    });

    // Assert
    expect(result.current.selectedCity).toBe('busan');
  });

  test('필터 변경 시 filteredEvents가 자동으로 재계산된다', async () => {
    // Arrange
    (mockFetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.filteredEvents).toHaveLength(4);

    // Act: 카테고리 변경
    act(() => {
      result.current.setSelectedCategory('workshop');
    });

    // Assert: 자동으로 재계산됨
    expect(result.current.filteredEvents).toHaveLength(1);
    expect(result.current.filteredEvents[0].category).toBe('workshop');
  });
});

// ============================================================================
// refetch() Tests - 2 tests
// ============================================================================

describe('useEvents - refetch()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('수동으로 이벤트를 다시 로드할 수 있다', async () => {
    // Arrange
    (mockFetchUpcomingEvents as jest.Mock)
      .mockResolvedValueOnce(mockEvents)
      .mockResolvedValueOnce([...mockEvents, { ...mockEvents[0], id: 'event-new' }]);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.events).toHaveLength(4);

    // Act: refetch
    await act(async () => {
      await result.current.refetch();
    });

    // Assert
    await waitFor(() => {
      expect(result.current.events).toHaveLength(5);
    });

    expect(mockFetchUpcomingEvents).toHaveBeenCalledTimes(2);
  });

  test('refetch 시 isLoading이 변경된다', async () => {
    // Arrange
    (mockFetchUpcomingEvents as jest.Mock).mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Act: refetch
    act(() => {
      result.current.refetch();
    });

    // Assert: 로딩 상태로 변경
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});

// ============================================================================
// Time-based Filter Tests - 2 tests
// ============================================================================

describe('useEvents - Time-based Filtering', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('90일 이내의 이벤트만 조회된다', async () => {
    // Arrange
    const futureEvents: Event[] = [
      { ...mockEvents[0], date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
      { ...mockEvents[1], date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString() },
      { ...mockEvents[2], date: new Date(Date.now() + 89 * 24 * 60 * 60 * 1000).toISOString() },
    ];

    (mockFetchUpcomingEvents as jest.Mock).mockResolvedValue(futureEvents);

    // Act
    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert: fetchUpcomingEvents가 90일로 호출됨
    expect(mockFetchUpcomingEvents).toHaveBeenCalledWith(90);
    expect(result.current.events).toEqual(futureEvents);
  });

  test('과거 이벤트는 제외된다 (Supabase 쿼리 레벨에서)', async () => {
    // Arrange: 과거 이벤트는 fetchUpcomingEvents에서 필터링됨
    const upcomingOnly: Event[] = [
      { ...mockEvents[0], date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString() },
      { ...mockEvents[1], date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString() },
    ];

    (mockFetchUpcomingEvents as jest.Mock).mockResolvedValue(upcomingOnly);

    // Act
    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Assert: 모든 이벤트가 미래 날짜
    expect(result.current.events).toHaveLength(2);
    result.current.events.forEach(event => {
      expect(new Date(event.date).getTime()).toBeGreaterThan(Date.now());
    });
  });
});

// ============================================================================
// Error Handling Tests - 2 tests
// ============================================================================

describe('useEvents - Error Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Supabase 실패 시 에러가 처리된다', async () => {
    // Arrange
    (mockFetchUpcomingEvents as jest.Mock).mockRejectedValue(new Error('Database error'));

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    // Act
    const { result } = renderHook(() => useEvents());

    // Assert
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe('이벤트를 가져올 수 없습니다');
    expect(consoleSpy).toHaveBeenCalledWith('이벤트 조회 오류:', expect.any(Error));

    consoleSpy.mockRestore();
  });

  test('네트워크 에러 복구가 가능하다', async () => {
    // Arrange
    (mockFetchUpcomingEvents as jest.Mock)
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(mockEvents);

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const { result } = renderHook(() => useEvents());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.events).toEqual([]);

    // Act: 재시도
    await act(async () => {
      await result.current.refetch();
    });

    // Assert: 복구됨
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.events).toEqual(mockEvents);

    consoleSpy.mockRestore();
  });
});
