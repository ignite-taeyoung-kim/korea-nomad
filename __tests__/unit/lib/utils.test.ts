/**
 * Unit Tests for lib/utils.ts
 *
 * 총 25개의 테스트 케이스로 유틸리티 함수들을 테스트합니다.
 */

import {
  cn,
  formatNumber,
  formatCost,
  formatSpeed,
  getRatingColor,
  getRatingBgColor,
} from '@/lib/utils';

// ============================================================================
// cn() - Tailwind Class Merge - 6 tests
// ============================================================================

describe('cn - Tailwind Class Merge', () => {
  test('여러 클래스를 병합한다', () => {
    // Arrange & Act
    const result = cn('text-red-500', 'bg-blue-500', 'p-4');

    // Assert
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
    expect(result).toContain('p-4');
  });

  test('중복된 Tailwind 클래스는 마지막 것만 적용한다', () => {
    // Arrange & Act
    const result = cn('text-red-500', 'text-blue-500');

    // Assert
    expect(result).toBe('text-blue-500');
    expect(result).not.toContain('text-red-500');
  });

  test('조건부 클래스를 처리한다', () => {
    // Arrange
    const isActive = true;
    const isDisabled = false;

    // Act
    const result = cn(
      'base-class',
      isActive && 'active-class',
      isDisabled && 'disabled-class'
    );

    // Assert
    expect(result).toContain('base-class');
    expect(result).toContain('active-class');
    expect(result).not.toContain('disabled-class');
  });

  test('배열 형태의 클래스를 처리한다', () => {
    // Arrange & Act
    const result = cn(['text-red-500', 'bg-blue-500']);

    // Assert
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  test('undefined와 null을 무시한다', () => {
    // Arrange & Act
    const result = cn('text-red-500', undefined, null, 'bg-blue-500');

    // Assert
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  test('빈 문자열도 처리한다', () => {
    // Arrange & Act
    const result = cn('', 'text-red-500', '');

    // Assert
    expect(result).toBe('text-red-500');
  });
});

// ============================================================================
// formatNumber() - 6 tests
// ============================================================================

describe('formatNumber', () => {
  test('정수를 한국 로케일 형식으로 포맷한다', () => {
    // Arrange
    const num = 1000;

    // Act
    const result = formatNumber(num);

    // Assert
    expect(result).toBe('1,000');
  });

  test('큰 숫자를 정확히 포맷한다', () => {
    // Arrange
    const num = 1234567;

    // Act
    const result = formatNumber(num);

    // Assert
    expect(result).toBe('1,234,567');
  });

  test('작은 숫자를 포맷한다', () => {
    // Arrange
    const num = 123;

    // Act
    const result = formatNumber(num);

    // Assert
    expect(result).toBe('123');
  });

  test('0을 포맷한다', () => {
    // Arrange
    const num = 0;

    // Act
    const result = formatNumber(num);

    // Assert
    expect(result).toBe('0');
  });

  test('소수점이 있는 숫자를 포맷한다', () => {
    // Arrange
    const num = 1234.56;

    // Act
    const result = formatNumber(num);

    // Assert
    expect(result).toBe('1,234.56');
  });

  test('음수를 포맷한다', () => {
    // Arrange
    const num = -1000;

    // Act
    const result = formatNumber(num);

    // Assert
    expect(result).toBe('-1,000');
  });
});

// ============================================================================
// formatCost() - 5 tests
// ============================================================================

describe('formatCost', () => {
  test('M을 만원으로 변환한다', () => {
    // Arrange
    const cost = '2.5M';

    // Act
    const result = formatCost(cost);

    // Assert
    expect(result).toBe('2.5만원');
  });

  test('범위가 있는 비용을 포맷한다', () => {
    // Arrange
    const cost = '2.5~3.5M';

    // Act
    const result = formatCost(cost);

    // Assert
    expect(result).toBe('2.5~3.5만원');
  });

  test('M이 없는 문자열은 그대로 반환한다', () => {
    // Arrange
    const cost = '1000원';

    // Act
    const result = formatCost(cost);

    // Assert
    expect(result).toBe('1000원');
  });

  test('빈 문자열을 처리한다', () => {
    // Arrange
    const cost = '';

    // Act
    const result = formatCost(cost);

    // Assert
    expect(result).toBe('');
  });

  test('여러 M이 있어도 첫 번째만 변환한다', () => {
    // Arrange
    const cost = 'M~M';

    // Act
    const result = formatCost(cost);

    // Assert
    // Note: replace() only replaces the first occurrence
    expect(result).toBe('만원~M');
  });
});

// ============================================================================
// formatSpeed() - 3 tests
// ============================================================================

describe('formatSpeed', () => {
  test('인터넷 속도를 Mbps 형식으로 포맷한다', () => {
    // Arrange
    const speed = 950;

    // Act
    const result = formatSpeed(speed);

    // Assert
    expect(result).toBe('950 Mbps');
  });

  test('큰 속도 값도 포맷한다', () => {
    // Arrange
    const speed = 1000;

    // Act
    const result = formatSpeed(speed);

    // Assert
    expect(result).toBe('1,000 Mbps');
  });

  test('0 속도도 처리한다', () => {
    // Arrange
    const speed = 0;

    // Act
    const result = formatSpeed(speed);

    // Assert
    expect(result).toBe('0 Mbps');
  });
});

// ============================================================================
// getRatingColor() - 3 tests
// ============================================================================

describe('getRatingColor', () => {
  test('9점 이상은 green 색상을 반환한다', () => {
    // Arrange
    const rating = 9.5;

    // Act
    const result = getRatingColor(rating);

    // Assert
    expect(result).toBe('text-green-600');
  });

  test('8점 이상 9점 미만은 blue 색상을 반환한다', () => {
    // Arrange
    const rating = 8.5;

    // Act
    const result = getRatingColor(rating);

    // Assert
    expect(result).toBe('text-blue-600');
  });

  test('7점 이상 8점 미만은 yellow 색상을 반환한다', () => {
    // Arrange
    const rating = 7.5;

    // Act
    const result = getRatingColor(rating);

    // Assert
    expect(result).toBe('text-yellow-600');
  });

  test('7점 미만은 orange 색상을 반환한다', () => {
    // Arrange
    const rating = 6.5;

    // Act
    const result = getRatingColor(rating);

    // Assert
    expect(result).toBe('text-orange-600');
  });

  test('경계값 9.0은 green 색상을 반환한다', () => {
    // Arrange
    const rating = 9.0;

    // Act
    const result = getRatingColor(rating);

    // Assert
    expect(result).toBe('text-green-600');
  });

  test('경계값 8.0은 blue 색상을 반환한다', () => {
    // Arrange
    const rating = 8.0;

    // Act
    const result = getRatingColor(rating);

    // Assert
    expect(result).toBe('text-blue-600');
  });

  test('경계값 7.0은 yellow 색상을 반환한다', () => {
    // Arrange
    const rating = 7.0;

    // Act
    const result = getRatingColor(rating);

    // Assert
    expect(result).toBe('text-yellow-600');
  });
});

// ============================================================================
// getRatingBgColor() - 2 tests
// ============================================================================

describe('getRatingBgColor', () => {
  test('9점 이상은 green 배경색을 반환한다', () => {
    // Arrange
    const rating = 9.5;

    // Act
    const result = getRatingBgColor(rating);

    // Assert
    expect(result).toBe('bg-green-50');
  });

  test('8점 이상 9점 미만은 blue 배경색을 반환한다', () => {
    // Arrange
    const rating = 8.5;

    // Act
    const result = getRatingBgColor(rating);

    // Assert
    expect(result).toBe('bg-blue-50');
  });

  test('7점 이상 8점 미만은 yellow 배경색을 반환한다', () => {
    // Arrange
    const rating = 7.5;

    // Act
    const result = getRatingBgColor(rating);

    // Assert
    expect(result).toBe('bg-yellow-50');
  });

  test('7점 미만은 orange 배경색을 반환한다', () => {
    // Arrange
    const rating = 6.5;

    // Act
    const result = getRatingBgColor(rating);

    // Assert
    expect(result).toBe('bg-orange-50');
  });

  test('경계값 9.0은 green 배경색을 반환한다', () => {
    // Arrange
    const rating = 9.0;

    // Act
    const result = getRatingBgColor(rating);

    // Assert
    expect(result).toBe('bg-green-50');
  });

  test('경계값 8.0은 blue 배경색을 반환한다', () => {
    // Arrange
    const rating = 8.0;

    // Act
    const result = getRatingBgColor(rating);

    // Assert
    expect(result).toBe('bg-blue-50');
  });

  test('경계값 7.0은 yellow 배경색을 반환한다', () => {
    // Arrange
    const rating = 7.0;

    // Act
    const result = getRatingBgColor(rating);

    // Assert
    expect(result).toBe('bg-yellow-50');
  });
});
