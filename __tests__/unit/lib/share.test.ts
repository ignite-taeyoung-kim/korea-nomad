/**
 * Unit Tests: lib/share.ts
 * 소셜 공유 기능 유틸리티 테스트 (20 tests)
 */

import {
  copyToClipboard,
  shareToKakaoTalk,
  shareToTwitter,
  shareToFacebook,
  shareToNaverBlog,
  canUseShareApi,
  shareViaWebAPI,
  ShareOptions,
} from '@/lib/share'

describe('lib/share.ts', () => {
  // Mock 공유 옵션
  const mockShareOptions: ShareOptions = {
    title: '서울',
    description: '한국의 중심, 가장 많은 노마드가 활동하는 도시',
    url: 'https://korea-nomad.com/cities/seoul',
    cityName: '서울',
    cityScore: 8.5,
  }

  // ==========================================================================
  // copyToClipboard(): 4 tests
  // ==========================================================================
  describe('copyToClipboard', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('클립보드 API가 사용 가능하면 URL을 복사하고 true를 반환한다', async () => {
      // Arrange
      const url = 'https://korea-nomad.com/cities/seoul'
      const mockWriteText = jest.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        writable: true,
      })

      // Act
      const result = await copyToClipboard(url)

      // Assert
      expect(mockWriteText).toHaveBeenCalledWith(url)
      expect(result).toBe(true)
    })

    test('클립보드 복사가 성공하면 true를 반환한다', async () => {
      // Arrange
      const url = 'https://test.com'
      navigator.clipboard.writeText = jest.fn().mockResolvedValue(undefined)

      // Act
      const result = await copyToClipboard(url)

      // Assert
      expect(result).toBe(true)
    })

    test('클립보드 API가 실패하면 false를 반환한다', async () => {
      // Arrange
      const url = 'https://test.com'
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      navigator.clipboard.writeText = jest
        .fn()
        .mockRejectedValue(new Error('Permission denied'))

      // Act
      const result = await copyToClipboard(url)

      // Assert
      expect(result).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    test('복사된 URL이 정확히 전달된 URL과 일치한다', async () => {
      // Arrange
      const url = 'https://korea-nomad.com/cities/busan?ref=share'
      const mockWriteText = jest.fn().mockResolvedValue(undefined)
      navigator.clipboard.writeText = mockWriteText

      // Act
      await copyToClipboard(url)

      // Assert
      expect(mockWriteText).toHaveBeenCalledWith(url)
      expect(mockWriteText).toHaveBeenCalledTimes(1)
    })
  })

  // ==========================================================================
  // shareToKakaoTalk(): 3 tests
  // ==========================================================================
  describe('shareToKakaoTalk', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('Kakao SDK가 초기화되어 있으면 카카오톡 공유를 실행한다', () => {
      // Arrange
      const mockSendDefault = jest.fn()
      const mockKakao = {
        isInitialized: jest.fn().mockReturnValue(true),
        Share: {
          sendDefault: mockSendDefault,
        },
      }
      ;(window as any).Kakao = mockKakao

      // Act
      shareToKakaoTalk(mockShareOptions)

      // Assert
      expect(mockKakao.isInitialized).toHaveBeenCalled()
      expect(mockSendDefault).toHaveBeenCalled()
      expect(mockSendDefault).toHaveBeenCalledWith(
        expect.objectContaining({
          objectType: 'feed',
          content: expect.objectContaining({
            title: expect.stringContaining('서울'),
            description: expect.stringContaining('8.5/10'),
          }),
        })
      )
    })

    test('Kakao SDK가 로드되지 않았으면 에러 로그를 출력한다', () => {
      // Arrange
      ;(window as any).Kakao = undefined
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      // Act
      shareToKakaoTalk(mockShareOptions)

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Kakao SDK is not loaded'
      )
      consoleErrorSpy.mockRestore()
    })

    test('Kakao SDK가 초기화되지 않았으면 경고를 출력한다', () => {
      // Arrange
      const mockKakao = {
        isInitialized: jest.fn().mockReturnValue(false),
        Share: {
          sendDefault: jest.fn(),
        },
      }
      ;(window as any).Kakao = mockKakao
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      // Act
      shareToKakaoTalk(mockShareOptions)

      // Assert
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Kakao SDK not initialized'
      )
      expect(mockKakao.Share.sendDefault).not.toHaveBeenCalled()
      consoleWarnSpy.mockRestore()
    })
  })

  // ==========================================================================
  // shareToTwitter(): 3 tests
  // ==========================================================================
  describe('shareToTwitter', () => {
    beforeEach(() => {
      window.open = jest.fn()
    })

    test('트위터 공유 URL을 생성하고 새 창을 연다', () => {
      // Arrange
      const mockWindowOpen = jest.fn()
      window.open = mockWindowOpen

      // Act
      shareToTwitter(mockShareOptions)

      // Assert
      expect(mockWindowOpen).toHaveBeenCalled()
      const callArgs = mockWindowOpen.mock.calls[0]
      expect(callArgs[0]).toContain('https://twitter.com/intent/tweet')
      expect(callArgs[0]).toContain(encodeURIComponent('서울'))
      expect(callArgs[1]).toBe('_blank')
      expect(callArgs[2]).toContain('width=550,height=420')
    })

    test('공유 텍스트가 올바르게 인코딩되어 URL에 포함된다', () => {
      // Arrange
      const mockWindowOpen = jest.fn()
      window.open = mockWindowOpen

      // Act
      shareToTwitter(mockShareOptions)

      // Assert
      const callUrl = mockWindowOpen.mock.calls[0][0]
      expect(callUrl).toContain(encodeURIComponent(mockShareOptions.url))
      expect(callUrl).toContain('text=')
    })

    test('도시 점수가 공유 텍스트에 포함된다', () => {
      // Arrange
      const mockWindowOpen = jest.fn()
      window.open = mockWindowOpen

      // Act
      shareToTwitter(mockShareOptions)

      // Assert
      const callUrl = mockWindowOpen.mock.calls[0][0]
      const decodedUrl = decodeURIComponent(callUrl)
      expect(decodedUrl).toContain('8.5/10')
    })
  })

  // ==========================================================================
  // shareToFacebook(): 2 tests
  // ==========================================================================
  describe('shareToFacebook', () => {
    beforeEach(() => {
      window.open = jest.fn()
    })

    test('페이스북 Sharer URL을 생성하고 새 창을 연다', () => {
      // Arrange
      const mockWindowOpen = jest.fn()
      window.open = mockWindowOpen

      // Act
      shareToFacebook(mockShareOptions)

      // Assert
      expect(mockWindowOpen).toHaveBeenCalled()
      const callArgs = mockWindowOpen.mock.calls[0]
      expect(callArgs[0]).toContain(
        'https://www.facebook.com/sharer/sharer.php'
      )
      expect(callArgs[0]).toContain(encodeURIComponent(mockShareOptions.url))
      expect(callArgs[1]).toBe('_blank')
    })

    test('URL 파라미터가 올바르게 인코딩되어 전달된다', () => {
      // Arrange
      const mockWindowOpen = jest.fn()
      window.open = mockWindowOpen
      const optionsWithSpecialChars: ShareOptions = {
        ...mockShareOptions,
        url: 'https://test.com?param=value&another=test',
      }

      // Act
      shareToFacebook(optionsWithSpecialChars)

      // Assert
      const callUrl = mockWindowOpen.mock.calls[0][0]
      expect(callUrl).toContain(
        encodeURIComponent('https://test.com?param=value&another=test')
      )
    })
  })

  // ==========================================================================
  // shareToNaverBlog(): 2 tests
  // ==========================================================================
  describe('shareToNaverBlog', () => {
    beforeEach(() => {
      window.open = jest.fn()
    })

    test('네이버 블로그 공유 URL을 생성하고 새 창을 연다', () => {
      // Arrange
      const mockWindowOpen = jest.fn()
      window.open = mockWindowOpen

      // Act
      shareToNaverBlog(mockShareOptions)

      // Assert
      expect(mockWindowOpen).toHaveBeenCalled()
      const callArgs = mockWindowOpen.mock.calls[0]
      expect(callArgs[0]).toContain('https://blog.naver.com/openapi/share')
      expect(callArgs[0]).toContain(encodeURIComponent(mockShareOptions.url))
      expect(callArgs[0]).toContain(
        encodeURIComponent(mockShareOptions.title)
      )
      expect(callArgs[1]).toBe('_blank')
    })

    test('URL과 제목이 올바르게 인코딩되어 전달된다', () => {
      // Arrange
      const mockWindowOpen = jest.fn()
      window.open = mockWindowOpen
      const koreanOptions: ShareOptions = {
        ...mockShareOptions,
        title: '서울 노마드 라이프',
        url: 'https://korea-nomad.com/cities/서울',
      }

      // Act
      shareToNaverBlog(koreanOptions)

      // Assert
      const callUrl = mockWindowOpen.mock.calls[0][0]
      expect(callUrl).toContain(encodeURIComponent('서울 노마드 라이프'))
      expect(callUrl).toContain(
        encodeURIComponent('https://korea-nomad.com/cities/서울')
      )
    })
  })

  // ==========================================================================
  // canUseShareApi(): 2 tests
  // ==========================================================================
  describe('canUseShareApi', () => {
    test('navigator.share가 존재하면 true를 반환한다', () => {
      // Arrange
      Object.defineProperty(navigator, 'share', {
        value: jest.fn(),
        writable: true,
        configurable: true,
      })

      // Act
      const result = canUseShareApi()

      // Assert
      expect(result).toBe(true)
    })

    test('navigator.share가 없으면 false를 반환한다', () => {
      // Arrange
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        writable: true,
        configurable: true,
      })

      // Act
      const result = canUseShareApi()

      // Assert
      expect(result).toBe(false)
    })
  })

  // ==========================================================================
  // shareViaWebAPI(): 4 tests
  // ==========================================================================
  describe('shareViaWebAPI', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    test('Web Share API를 사용하여 공유를 실행한다', async () => {
      // Arrange
      const mockShare = jest.fn().mockResolvedValue(undefined)
      Object.defineProperty(navigator, 'share', {
        value: mockShare,
        writable: true,
        configurable: true,
      })

      // Act
      await shareViaWebAPI(mockShareOptions)

      // Assert
      expect(mockShare).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '서울',
          text: expect.stringContaining('8.5/10'),
          url: mockShareOptions.url,
        })
      )
    })

    test('Web Share API가 지원되지 않으면 에러 로그를 출력한다', async () => {
      // Arrange
      Object.defineProperty(navigator, 'share', {
        value: undefined,
        writable: true,
        configurable: true,
      })
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      // Act
      await shareViaWebAPI(mockShareOptions)

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Web Share API is not supported'
      )
      consoleErrorSpy.mockRestore()
    })

    test('사용자가 공유를 취소하면 (AbortError) 에러를 로그하지 않는다', async () => {
      // Arrange
      const abortError = new Error('User cancelled')
      abortError.name = 'AbortError'
      const mockShare = jest.fn().mockRejectedValue(abortError)
      Object.defineProperty(navigator, 'share', {
        value: mockShare,
        writable: true,
        configurable: true,
      })
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      // Act
      await shareViaWebAPI(mockShareOptions)

      // Assert
      expect(consoleErrorSpy).not.toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    test('AbortError가 아닌 다른 에러는 로그에 출력된다', async () => {
      // Arrange
      const otherError = new Error('Network error')
      otherError.name = 'NetworkError'
      const mockShare = jest.fn().mockRejectedValue(otherError)
      Object.defineProperty(navigator, 'share', {
        value: mockShare,
        writable: true,
        configurable: true,
      })
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      // Act
      await shareViaWebAPI(mockShareOptions)

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error sharing:', otherError)
      consoleErrorSpy.mockRestore()
    })
  })
})
