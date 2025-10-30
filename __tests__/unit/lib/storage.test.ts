/**
 * Unit Tests for lib/storage.ts
 *
 * 총 30개의 테스트 케이스로 localStorage 관리 함수들을 테스트합니다.
 */

import {
  getFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  getBookmarks,
  addBookmark,
  removeBookmark,
  isBookmarked,
} from '@/lib/storage';

// ============================================================================
// Favorites Management - 12 tests
// ============================================================================

describe('Favorites Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('초기 상태에서 빈 배열을 반환한다', () => {
    // Act
    const favorites = getFavorites();

    // Assert
    expect(favorites).toEqual([]);
  });

  test('좋아요를 추가할 수 있다', () => {
    // Arrange
    const cityId = 'seoul';

    // Act
    addFavorite(cityId);
    const favorites = getFavorites();

    // Assert
    expect(favorites).toContain(cityId);
    expect(favorites).toHaveLength(1);
  });

  test('여러 개의 좋아요를 추가할 수 있다', () => {
    // Arrange
    const cityIds = ['seoul', 'busan', 'gangneung'];

    // Act
    cityIds.forEach(id => addFavorite(id));
    const favorites = getFavorites();

    // Assert
    expect(favorites).toEqual(cityIds);
    expect(favorites).toHaveLength(3);
  });

  test('중복된 좋아요는 추가되지 않는다', () => {
    // Arrange
    const cityId = 'seoul';

    // Act
    addFavorite(cityId);
    addFavorite(cityId);
    const favorites = getFavorites();

    // Assert
    expect(favorites).toEqual([cityId]);
    expect(favorites).toHaveLength(1);
  });

  test('좋아요를 제거할 수 있다', () => {
    // Arrange
    const cityId = 'seoul';
    addFavorite(cityId);

    // Act
    removeFavorite(cityId);
    const favorites = getFavorites();

    // Assert
    expect(favorites).not.toContain(cityId);
    expect(favorites).toHaveLength(0);
  });

  test('여러 좋아요 중 하나만 제거할 수 있다', () => {
    // Arrange
    addFavorite('seoul');
    addFavorite('busan');
    addFavorite('gangneung');

    // Act
    removeFavorite('busan');
    const favorites = getFavorites();

    // Assert
    expect(favorites).toContain('seoul');
    expect(favorites).toContain('gangneung');
    expect(favorites).not.toContain('busan');
    expect(favorites).toHaveLength(2);
  });

  test('존재하지 않는 좋아요를 제거해도 에러가 발생하지 않는다', () => {
    // Arrange
    addFavorite('seoul');

    // Act & Assert
    expect(() => removeFavorite('busan')).not.toThrow();
    const favorites = getFavorites();
    expect(favorites).toEqual(['seoul']);
  });

  test('isFavorite는 좋아요 상태를 정확히 반환한다', () => {
    // Arrange
    addFavorite('seoul');

    // Act & Assert
    expect(isFavorite('seoul')).toBe(true);
    expect(isFavorite('busan')).toBe(false);
  });

  test('localStorage에 올바른 형식으로 저장된다', () => {
    // Arrange & Act
    addFavorite('seoul');
    const stored = localStorage.getItem('nomad_favorites_user');

    // Assert
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveProperty('cityIds');
    expect(parsed.cityIds).toEqual(['seoul']);
  });

  test('localStorage에서 데이터를 올바르게 불러온다', () => {
    // Arrange
    const data = { cityIds: ['seoul', 'busan'] };
    localStorage.setItem('nomad_favorites_user', JSON.stringify(data));

    // Act
    const favorites = getFavorites();

    // Assert
    expect(favorites).toEqual(['seoul', 'busan']);
  });

  test('잘못된 형식의 데이터가 있으면 빈 배열을 반환한다', () => {
    // Arrange
    localStorage.setItem('nomad_favorites_user', 'invalid json');

    // Act
    const favorites = getFavorites();

    // Assert
    expect(favorites).toEqual([]);
  });

  test('좋아요 추가/제거가 localStorage에 즉시 반영된다', () => {
    // Arrange & Act
    addFavorite('seoul');
    let stored = localStorage.getItem('nomad_favorites_user');
    let parsed = JSON.parse(stored!);
    expect(parsed.cityIds).toContain('seoul');

    removeFavorite('seoul');
    stored = localStorage.getItem('nomad_favorites_user');
    parsed = JSON.parse(stored!);
    expect(parsed.cityIds).not.toContain('seoul');
  });
});

// ============================================================================
// Bookmarks Management - 12 tests
// ============================================================================

describe('Bookmarks Management', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('초기 상태에서 빈 배열을 반환한다', () => {
    // Act
    const bookmarks = getBookmarks();

    // Assert
    expect(bookmarks).toEqual([]);
  });

  test('북마크를 추가할 수 있다', () => {
    // Arrange
    const cityId = 'gangneung';

    // Act
    addBookmark(cityId);
    const bookmarks = getBookmarks();

    // Assert
    expect(bookmarks).toContain(cityId);
    expect(bookmarks).toHaveLength(1);
  });

  test('여러 개의 북마크를 추가할 수 있다', () => {
    // Arrange
    const cityIds = ['seoul', 'busan', 'jeonju'];

    // Act
    cityIds.forEach(id => addBookmark(id));
    const bookmarks = getBookmarks();

    // Assert
    expect(bookmarks).toEqual(cityIds);
    expect(bookmarks).toHaveLength(3);
  });

  test('중복된 북마크는 추가되지 않는다', () => {
    // Arrange
    const cityId = 'busan';

    // Act
    addBookmark(cityId);
    addBookmark(cityId);
    const bookmarks = getBookmarks();

    // Assert
    expect(bookmarks).toEqual([cityId]);
    expect(bookmarks).toHaveLength(1);
  });

  test('북마크를 제거할 수 있다', () => {
    // Arrange
    const cityId = 'gangneung';
    addBookmark(cityId);

    // Act
    removeBookmark(cityId);
    const bookmarks = getBookmarks();

    // Assert
    expect(bookmarks).not.toContain(cityId);
    expect(bookmarks).toHaveLength(0);
  });

  test('여러 북마크 중 하나만 제거할 수 있다', () => {
    // Arrange
    addBookmark('seoul');
    addBookmark('busan');
    addBookmark('daegu');

    // Act
    removeBookmark('busan');
    const bookmarks = getBookmarks();

    // Assert
    expect(bookmarks).toContain('seoul');
    expect(bookmarks).toContain('daegu');
    expect(bookmarks).not.toContain('busan');
    expect(bookmarks).toHaveLength(2);
  });

  test('존재하지 않는 북마크를 제거해도 에러가 발생하지 않는다', () => {
    // Arrange
    addBookmark('seoul');

    // Act & Assert
    expect(() => removeBookmark('nonexistent')).not.toThrow();
    const bookmarks = getBookmarks();
    expect(bookmarks).toEqual(['seoul']);
  });

  test('isBookmarked는 북마크 상태를 정확히 반환한다', () => {
    // Arrange
    addBookmark('gangneung');

    // Act & Assert
    expect(isBookmarked('gangneung')).toBe(true);
    expect(isBookmarked('seoul')).toBe(false);
  });

  test('localStorage에 올바른 형식으로 저장된다', () => {
    // Arrange & Act
    addBookmark('jeonju');
    const stored = localStorage.getItem('nomad_bookmarks_user');

    // Assert
    expect(stored).toBeDefined();
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveProperty('cityIds');
    expect(parsed.cityIds).toEqual(['jeonju']);
  });

  test('localStorage에서 데이터를 올바르게 불러온다', () => {
    // Arrange
    const data = { cityIds: ['gangneung', 'daegu'] };
    localStorage.setItem('nomad_bookmarks_user', JSON.stringify(data));

    // Act
    const bookmarks = getBookmarks();

    // Assert
    expect(bookmarks).toEqual(['gangneung', 'daegu']);
  });

  test('잘못된 형식의 데이터가 있으면 빈 배열을 반환한다', () => {
    // Arrange
    localStorage.setItem('nomad_bookmarks_user', 'invalid json');

    // Act
    const bookmarks = getBookmarks();

    // Assert
    expect(bookmarks).toEqual([]);
  });

  test('북마크 추가/제거가 localStorage에 즉시 반영된다', () => {
    // Arrange & Act
    addBookmark('busan');
    let stored = localStorage.getItem('nomad_bookmarks_user');
    let parsed = JSON.parse(stored!);
    expect(parsed.cityIds).toContain('busan');

    removeBookmark('busan');
    stored = localStorage.getItem('nomad_bookmarks_user');
    parsed = JSON.parse(stored!);
    expect(parsed.cityIds).not.toContain('busan');
  });
});

// ============================================================================
// localStorage Error Handling - 6 tests
// ============================================================================

describe('localStorage Error Handling', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('getFavorites는 localStorage 에러 시 빈 배열을 반환한다', () => {
    // Arrange
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage error');
    });

    // Act
    const favorites = getFavorites();

    // Assert
    expect(favorites).toEqual([]);

    // Cleanup
    jest.restoreAllMocks();
  });

  test('getBookmarks는 localStorage 에러 시 빈 배열을 반환한다', () => {
    // Arrange
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('localStorage error');
    });

    // Act
    const bookmarks = getBookmarks();

    // Assert
    expect(bookmarks).toEqual([]);

    // Cleanup
    jest.restoreAllMocks();
  });

  test('addFavorite는 localStorage 에러 시 조용히 실패한다', () => {
    // Arrange
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage error');
    });

    // Act & Assert
    expect(() => addFavorite('seoul')).not.toThrow();

    // Cleanup
    jest.restoreAllMocks();
  });

  test('addBookmark는 localStorage 에러 시 조용히 실패한다', () => {
    // Arrange
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage error');
    });

    // Act & Assert
    expect(() => addBookmark('busan')).not.toThrow();

    // Cleanup
    jest.restoreAllMocks();
  });

  test('removeFavorite는 localStorage 에러 시 조용히 실패한다', () => {
    // Arrange
    addFavorite('seoul');
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage error');
    });

    // Act & Assert
    expect(() => removeFavorite('seoul')).not.toThrow();

    // Cleanup
    jest.restoreAllMocks();
  });

  test('removeBookmark는 localStorage 에러 시 조용히 실패한다', () => {
    // Arrange
    addBookmark('busan');
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('localStorage error');
    });

    // Act & Assert
    expect(() => removeBookmark('busan')).not.toThrow();

    // Cleanup
    jest.restoreAllMocks();
  });
});

// ============================================================================
// Integration Tests - Favorites and Bookmarks 함께 사용
// ============================================================================

describe('Favorites and Bookmarks Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('좋아요와 북마크는 독립적으로 관리된다', () => {
    // Arrange & Act
    addFavorite('seoul');
    addBookmark('busan');

    // Assert
    expect(getFavorites()).toEqual(['seoul']);
    expect(getBookmarks()).toEqual(['busan']);
  });

  test('같은 도시를 좋아요와 북마크에 동시에 추가할 수 있다', () => {
    // Arrange & Act
    addFavorite('seoul');
    addBookmark('seoul');

    // Assert
    expect(isFavorite('seoul')).toBe(true);
    expect(isBookmarked('seoul')).toBe(true);
    expect(getFavorites()).toContain('seoul');
    expect(getBookmarks()).toContain('seoul');
  });

  test('좋아요를 제거해도 북마크는 유지된다', () => {
    // Arrange
    addFavorite('seoul');
    addBookmark('seoul');

    // Act
    removeFavorite('seoul');

    // Assert
    expect(isFavorite('seoul')).toBe(false);
    expect(isBookmarked('seoul')).toBe(true);
  });

  test('북마크를 제거해도 좋아요는 유지된다', () => {
    // Arrange
    addFavorite('busan');
    addBookmark('busan');

    // Act
    removeBookmark('busan');

    // Assert
    expect(isFavorite('busan')).toBe(true);
    expect(isBookmarked('busan')).toBe(false);
  });

  test('localStorage에 두 개의 별도 키로 저장된다', () => {
    // Arrange & Act
    addFavorite('seoul');
    addBookmark('busan');

    // Assert
    const favoritesKey = localStorage.getItem('nomad_favorites_user');
    const bookmarksKey = localStorage.getItem('nomad_bookmarks_user');

    expect(favoritesKey).toBeDefined();
    expect(bookmarksKey).toBeDefined();
    expect(favoritesKey).not.toEqual(bookmarksKey);
  });

  test('여러 도시를 좋아요와 북마크에 추가할 수 있다', () => {
    // Arrange & Act
    ['seoul', 'busan', 'gangneung'].forEach(id => addFavorite(id));
    ['daegu', 'jeonju'].forEach(id => addBookmark(id));

    // Assert
    expect(getFavorites()).toHaveLength(3);
    expect(getBookmarks()).toHaveLength(2);
  });
});
