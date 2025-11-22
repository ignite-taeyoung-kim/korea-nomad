/**
 * E2E 테스트용 이벤트 데이터
 */
export const TEST_EVENTS = {
  networkingEvent: {
    title: 'Nomad Meetup in Seoul',
    description: '서울 노마드들의 월간 모임입니다. 네트워킹과 경험 공유의 시간을 가집니다.',
    category: 'networking',
    date: getTomorrowDate(),
    time: '19:00',
    location: '강남역 카페',
    maxParticipants: 50,
  },

  workshopEvent: {
    title: 'Web Development Workshop',
    description: 'React와 TypeScript를 활용한 웹 개발 워크숍입니다.',
    category: 'workshop',
    date: getDateAfterDays(3),
    time: '14:00',
    location: '강남 기술센터',
    maxParticipants: 30,
  },

  socialEvent: {
    title: 'Beach Cleanup Day',
    description: '해변 정소 봉사활동으로 환경을 보호하고 함께 즐거운 시간을 보냅니다.',
    category: 'social',
    date: getDateAfterDays(5),
    time: '10:00',
    location: '해운대 해변',
    maxParticipants: 100,
  },

  tourEvent: {
    title: 'City Walking Tour',
    description: '도시의 숨겨진 명소를 함께 탐험하는 워킹투어입니다.',
    category: 'tour',
    date: getDateAfterDays(7),
    time: '15:00',
    location: '종로 3가역',
    maxParticipants: 25,
  },

  sportEvent: {
    title: 'Basketball Game',
    description: '노마드들과 함께 즐기는 농구 게임입니다.',
    category: 'sports',
    date: getDateAfterDays(2),
    time: '18:00',
    location: '강남 체육관',
    maxParticipants: 20,
  },
} as const;

/**
 * 이벤트 검색/필터링 시나리오
 */
export const EVENT_FILTER_SCENARIOS = {
  byCategory: {
    category: 'networking',
    expected: ['networkingEvent'],
  },

  byDate: {
    dateRange: {
      from: getTomorrowDate(),
      to: getDateAfterDays(3),
    },
  },

  byLocation: {
    location: '강남',
    expected: ['networkingEvent', 'workshopEvent', 'sportEvent'],
  },

  upcoming: {
    filter: 'upcoming',
    description: '예정된 이벤트만 표시',
  },

  past: {
    filter: 'past',
    description: '지난 이벤트만 표시',
  },

  myEvents: {
    filter: 'myEvents',
    description: '내가 참여한 이벤트만 표시',
  },
} as const;

/**
 * 이벤트 생성 검증 시나리오
 */
export const EVENT_VALIDATIONS = {
  validEvent: {
    title: '좋은 이벤트',
    description: '재미있고 좋은 이벤트입니다.',
    category: 'networking',
    date: getTomorrowDate(),
    time: '18:00',
    location: '서울',
    shouldPass: true,
  },

  emptyTitle: {
    title: '',
    description: '설명이 있습니다.',
    category: 'networking',
    date: getTomorrowDate(),
    time: '18:00',
    location: '서울',
    shouldPass: false,
  },

  pastDate: {
    title: '과거 이벤트',
    description: '과거 날짜의 이벤트입니다.',
    category: 'networking',
    date: getDateBefore(1),
    time: '18:00',
    location: '서울',
    shouldPass: false,
  },

  noCategory: {
    title: '이벤트',
    description: '카테고리가 없습니다.',
    category: undefined,
    date: getTomorrowDate(),
    time: '18:00',
    location: '서울',
    shouldPass: false,
  },

  invalidTime: {
    title: '이벤트',
    description: '유효하지 않은 시간입니다.',
    category: 'networking',
    date: getTomorrowDate(),
    time: '25:00',
    location: '서울',
    shouldPass: false,
  },
} as const;

/**
 * 날짜 헬퍼 함수들
 */
function getTomorrowDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
}

function getDateAfterDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

function getDateBefore(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().split('T')[0];
}

/**
 * 이벤트 카테고리
 */
export const EVENT_CATEGORIES = {
  networking: 'Networking',
  workshop: 'Workshop',
  social: 'Social',
  tour: 'Tour',
  sports: 'Sports',
  cultural: 'Cultural',
  food: 'Food & Drink',
  other: 'Other',
} as const;
