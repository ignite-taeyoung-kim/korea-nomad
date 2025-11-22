/**
 * 환경별 Base URL 설정
 */
export const BASE_URLS = {
  development: 'http://localhost:3000',
  staging: process.env.STAGING_URL || 'https://staging.korea-nomad.com',
  production: process.env.PRODUCTION_URL || 'https://korea-nomad.com',
} as const;

export const getBaseUrl = (): string => {
  const env = process.env.PLAYWRIGHT_ENV || 'development';
  return BASE_URLS[env as keyof typeof BASE_URLS];
};

/**
 * 주요 페이지 경로
 */
export const ROUTES = {
  home: '/',
  cities: '/cities',
  community: '/community',
  dashboard: '/dashboard',
  login: '/auth/login',
  signup: '/auth/signup',
} as const;

/**
 * 전체 URL 생성
 */
export const getPageUrl = (path: string): string => {
  return `${getBaseUrl()}${path}`;
};
