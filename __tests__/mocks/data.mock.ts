/**
 * Mock Data for Testing
 * 테스트에서 사용할 Mock 데이터 정의
 */

import { City, Review, Event, UserProfile } from '@/lib/types';

// ============================================================================
// Mock Cities
// ============================================================================

export const mockCities: City[] = [
  {
    id: 'seoul',
    name: '서울',
    province: '서울특별시',
    emoji: '🏙️',
    overall_score: 8.5,
    cost_per_month: '2.5~3.5M',
    internet_speed: 950,
    nomads_count: 1240,
    cafe_rating: 4.6,
    work_score: 8,
    quality_score: 8.3,
    reviews_count: 145,
    likes_count: 234,
    dislikes_count: 12,
    description: '대한민국의 수도이자 최대 도시. 빠른 인터넷과 활발한 노마드 커뮤니티',
    image_url: 'https://images.example.com/seoul.jpg',
  },
  {
    id: 'gangneung',
    name: '강릉',
    province: '강원도',
    emoji: '⛱️',
    overall_score: 7.8,
    cost_per_month: '1.8~2.5M',
    internet_speed: 850,
    nomads_count: 320,
    cafe_rating: 4.4,
    work_score: 7,
    quality_score: 7.9,
    reviews_count: 78,
    likes_count: 156,
    dislikes_count: 8,
    description: '아름다운 해변과 산이 있는 강원도의 도시',
    image_url: 'https://images.example.com/gangneung.jpg',
  },
  {
    id: 'jeonju',
    name: '전주',
    province: '전라북도',
    emoji: '🏮',
    overall_score: 7.5,
    cost_per_month: '1.8~2.3M',
    internet_speed: 820,
    nomads_count: 210,
    cafe_rating: 4.5,
    work_score: 7,
    quality_score: 7.6,
    reviews_count: 52,
    likes_count: 98,
    dislikes_count: 5,
    description: '한옥마을과 전통 음식으로 유명한 문화 도시',
    image_url: 'https://images.example.com/jeonju.jpg',
  },
  {
    id: 'busan',
    name: '부산',
    province: '부산광역시',
    emoji: '🏖️',
    overall_score: 8.0,
    cost_per_month: '2.2~3.0M',
    internet_speed: 920,
    nomads_count: 580,
    cafe_rating: 4.5,
    work_score: 8,
    quality_score: 8.1,
    reviews_count: 112,
    likes_count: 189,
    dislikes_count: 10,
    description: '대한민국 제2의 도시. 해변과 항구가 아름다운 도시',
    image_url: 'https://images.example.com/busan.jpg',
  },
  {
    id: 'daegu',
    name: '대구',
    province: '대구광역시',
    emoji: '🌞',
    overall_score: 7.2,
    cost_per_month: '1.8~2.2M',
    internet_speed: 800,
    nomads_count: 150,
    cafe_rating: 4.3,
    work_score: 7,
    quality_score: 7.3,
    reviews_count: 45,
    likes_count: 67,
    dislikes_count: 6,
    description: '저렴한 생활비와 조용한 환경이 특징인 도시',
    image_url: 'https://images.example.com/daegu.jpg',
  },
];

// ============================================================================
// Mock Reviews
// ============================================================================

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    user_id: 'user-1',
    city_id: 'seoul',
    title: '좋은 도시',
    content: '서울은 정말 좋은 도시입니다. 인터넷 속도가 빠르고 카페도 많습니다.',
    rating: 5,
    created_at: new Date('2024-10-20').toISOString(),
    username: 'Alice',
  },
  {
    id: 'review-2',
    user_id: 'user-2',
    city_id: 'seoul',
    title: '많은 사람들',
    content: '사람이 많아서 가끔 복잡하지만 전반적으로 만족합니다.',
    rating: 4,
    created_at: new Date('2024-10-18').toISOString(),
    username: 'Bob',
  },
  {
    id: 'review-3',
    user_id: 'user-3',
    city_id: 'gangneung',
    title: '조용하고 좋아요',
    content: '강릉은 조용하고 자연이 아름답습니다. 일하기 좋은 환경입니다.',
    rating: 5,
    created_at: new Date('2024-10-15').toISOString(),
    username: 'Charlie',
  },
  {
    id: 'review-4',
    user_id: 'user-4',
    city_id: 'busan',
    title: '해변이 최고',
    content: '부산의 해변은 정말 아름답습니다. 저녁 산책이 최고입니다.',
    rating: 5,
    created_at: new Date('2024-10-10').toISOString(),
    username: 'Diana',
  },
];

// ============================================================================
// Mock Events
// ============================================================================

export const mockEvents: Event[] = [
  {
    id: 'event-1',
    city_id: 'seoul',
    title: 'Nomad Meetup',
    description: '서울 노마드들의 모임',
    category: 'networking',
    date: new Date('2024-11-15').toISOString(),
    time: '19:00',
    location: '강남역 카페',
    creator_id: 'user-1',
    creator_name: 'Alice',
    participant_count: 12,
    created_at: new Date('2024-10-28').toISOString(),
  },
  {
    id: 'event-2',
    city_id: 'seoul',
    title: 'Web Dev Workshop',
    description: 'React와 TypeScript 워크숍',
    category: 'workshop',
    date: new Date('2024-11-20').toISOString(),
    time: '14:00',
    location: '강남 기술 센터',
    creator_id: 'user-2',
    creator_name: 'Bob',
    participant_count: 25,
    created_at: new Date('2024-10-27').toISOString(),
  },
  {
    id: 'event-3',
    city_id: 'busan',
    title: 'Beach Cleanup',
    description: '해변 정소 봉사활동',
    category: 'social',
    date: new Date('2024-11-10').toISOString(),
    time: '10:00',
    location: '해운대 해변',
    creator_id: 'user-3',
    creator_name: 'Charlie',
    participant_count: 30,
    created_at: new Date('2024-10-26').toISOString(),
  },
];

// ============================================================================
// Mock Users
// ============================================================================

export const mockUsers = {
  'user-1': {
    id: 'user-1',
    email: 'alice@example.com',
    name: 'Alice',
    bio: 'Full-stack developer from US',
    avatar_url: 'https://avatars.example.com/alice.jpg',
    created_at: new Date('2024-01-15').toISOString(),
  },
  'user-2': {
    id: 'user-2',
    email: 'bob@example.com',
    name: 'Bob',
    bio: 'Frontend developer from UK',
    avatar_url: 'https://avatars.example.com/bob.jpg',
    created_at: new Date('2024-02-20').toISOString(),
  },
};

// ============================================================================
// Mock Favorites & Bookmarks
// ============================================================================

export const mockFavorites = {
  'user-1': ['seoul', 'busan'],
  'user-2': ['gangneung', 'jeonju'],
};

export const mockBookmarks = {
  'user-1': ['gangneung'],
  'user-2': ['busan', 'daegu'],
};

// ============================================================================
// Mock Utility Functions
// ============================================================================

/**
 * Mock 도시 배열 생성
 */
export function createMockCity(overrides: Partial<City> = {}): City {
  return {
    ...mockCities[0],
    id: Math.random().toString(),
    ...overrides,
  };
}

/**
 * Mock 리뷰 배열 생성
 */
export function createMockReview(overrides: Partial<Review> = {}): Review {
  return {
    ...mockReviews[0],
    id: Math.random().toString(),
    ...overrides,
  };
}

/**
 * Mock 이벤트 배열 생성
 */
export function createMockEvent(overrides: Partial<Event> = {}): Event {
  return {
    ...mockEvents[0],
    id: Math.random().toString(),
    ...overrides,
  };
}

/**
 * Mock 사용자 프로필 생성
 */
export function createMockUserProfile(overrides: Partial<UserProfile> = {}): UserProfile {
  return {
    id: Math.random().toString(),
    email: 'test@example.com',
    name: 'Test User',
    bio: 'Test bio',
    avatar_url: 'https://avatars.example.com/test.jpg',
    created_at: new Date().toISOString(),
    ...overrides,
  };
}
