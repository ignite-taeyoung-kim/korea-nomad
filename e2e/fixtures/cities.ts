/**
 * E2E 테스트용 도시 데이터
 */
export const TEST_CITIES = {
  seoul: {
    id: 'seoul',
    name: '서울',
    province: '서울특별시',
    emoji: '🏙️',
    overall_score: 8.5,
    cost_per_month: '2.5~3.5M',
    internet_speed: 950,
    cafe_rating: 4.6,
    work_score: 8,
    quality_score: 8.3,
  },

  gangneung: {
    id: 'gangneung',
    name: '강릉',
    province: '강원도',
    emoji: '⛱️',
    overall_score: 7.8,
    cost_per_month: '1.8~2.5M',
    internet_speed: 850,
    cafe_rating: 4.4,
    work_score: 7,
    quality_score: 7.9,
  },

  jeonju: {
    id: 'jeonju',
    name: '전주',
    province: '전라북도',
    emoji: '🏮',
    overall_score: 7.5,
    cost_per_month: '1.8~2.3M',
    internet_speed: 820,
    cafe_rating: 4.5,
    work_score: 7,
    quality_score: 7.6,
  },

  busan: {
    id: 'busan',
    name: '부산',
    province: '부산광역시',
    emoji: '🏖️',
    overall_score: 8.0,
    cost_per_month: '2.2~3.0M',
    internet_speed: 920,
    cafe_rating: 4.5,
    work_score: 8,
    quality_score: 8.1,
  },

  daegu: {
    id: 'daegu',
    name: '대구',
    province: '대구광역시',
    emoji: '🌞',
    overall_score: 7.2,
    cost_per_month: '1.8~2.2M',
    internet_speed: 800,
    cafe_rating: 4.3,
    work_score: 7,
    quality_score: 7.3,
  },
} as const;

/**
 * 테스트 도시 필터링 시나리오
 */
export const FILTER_SCENARIOS = {
  lowCost: {
    maxCost: '2M',
    expected: ['gangneung', 'jeonju', 'daegu'],
  },

  highSpeed: {
    minSpeed: '900',
    expected: ['seoul', 'busan'],
  },

  bestQuality: {
    minQuality: 8.0,
    expected: ['seoul', 'busan'],
  },

  beachCities: {
    regions: ['강원도', '부산광역시'],
  },

  culturalCities: {
    regions: ['전라북도'],
  },
} as const;

/**
 * 도시별 세부 정보
 */
export const CITY_DETAILS = {
  seoul: {
    description: '대한민국의 수도이자 최대 도시. 빠른 인터넷과 활발한 노마드 커뮤니티',
    nomads_count: 1240,
    reviews_count: 145,
    likes_count: 234,
    dislikes_count: 12,
  },

  gangneung: {
    description: '아름다운 해변과 산이 있는 강원도의 도시',
    nomads_count: 320,
    reviews_count: 78,
    likes_count: 156,
    dislikes_count: 8,
  },

  jeonju: {
    description: '한옥마을과 전통 음식으로 유명한 문화 도시',
    nomads_count: 210,
    reviews_count: 52,
    likes_count: 98,
    dislikes_count: 5,
  },

  busan: {
    description: '대한민국 제2의 도시. 해변과 항구가 아름다운 도시',
    nomads_count: 580,
    reviews_count: 112,
    likes_count: 189,
    dislikes_count: 10,
  },

  daegu: {
    description: '저렴한 생활비와 조용한 환경이 특징인 도시',
    nomads_count: 150,
    reviews_count: 45,
    likes_count: 67,
    dislikes_count: 6,
  },
} as const;
