/**
 * E2E 테스트용 리뷰 데이터
 */
export const TEST_REVIEWS = {
  goodReview: {
    title: '정말 좋은 도시예요!',
    content: '인터넷 속도가 빠르고 카페가 많아서 작업하기 정말 좋습니다. 추천합니다!',
    rating: 5,
  },

  averageReview: {
    title: '괜찮은 도시',
    content: '나쁘지는 않지만, 물가가 조금 비싼 편입니다.',
    rating: 3,
  },

  badReview: {
    title: '실망했어요',
    content: '인터넷이 느리고 환경이 별로 좋지 않습니다.',
    rating: 1,
  },

  detailedReview: {
    title: '상세한 후기 - 1개월 거주',
    content: `이 도시에서 1개월을 거주했습니다. 장점은 다음과 같습니다:
      1. 카페 문화가 발달함
      2. 대중교통이 잘 되어있음
      3. 노마드 커뮤니티가 활발함

      단점:
      1. 물가가 조금 비쌈
      2. 영어 소통이 어려움`,
    rating: 4,
  },

  shortReview: {
    title: '짧은 리뷰',
    content: '좋아요!',
    rating: 4,
  },

  spamReview: {
    title: 'BUY NOW!!!',
    content: 'Click here for amazing deals!!!',
    rating: 5,
  },
} as const;

/**
 * 리뷰 검증 시나리오
 */
export const REVIEW_VALIDATIONS = {
  validReview: {
    title: '올바른 리뷰',
    content: '이 도시는 정말 훌륭합니다. 모든 것이 좋습니다.',
    rating: 5,
    shouldPass: true,
  },

  emptyTitle: {
    title: '',
    content: '이 도시는 정말 훌륭합니다.',
    rating: 5,
    shouldPass: false,
  },

  emptyContent: {
    title: '좋은 도시',
    content: '',
    rating: 5,
    shouldPass: false,
  },

  invalidRating: {
    title: '좋은 도시',
    content: '이 도시는 정말 훌륭합니다.',
    rating: 10, // 유효 범위: 1-5
    shouldPass: false,
  },

  tooShortContent: {
    title: '도시',
    content: 'ok',
    rating: 3,
    shouldPass: false,
  },

  tooLongContent: {
    title: '도시',
    content: 'a'.repeat(1001), // 1000자 초과
    rating: 3,
    shouldPass: false,
  },
} as const;

/**
 * 리뷰 정렬 시나리오
 */
export const SORT_SCENARIOS = {
  newest: {
    order: 'newest',
    description: '최신순',
  },

  oldest: {
    order: 'oldest',
    description: '오래된순',
  },

  highestRating: {
    order: 'rating-desc',
    description: '높은 평점순',
  },

  lowestRating: {
    order: 'rating-asc',
    description: '낮은 평점순',
  },

  mostHelpful: {
    order: 'helpful',
    description: '도움이 되는순',
  },
} as const;
