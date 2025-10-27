/**
 * 공유 기능 유틸리티
 */

export interface ShareOptions {
  title: string
  description: string
  url: string
  cityName: string
  cityScore: number
}

/**
 * URL을 클립보드에 복사
 */
export const copyToClipboard = async (url: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(url)
    return true
  } catch (err) {
    console.error('Failed to copy to clipboard:', err)
    return false
  }
}

/**
 * 카카오톡으로 공유
 */
export const shareToKakaoTalk = (options: ShareOptions) => {
  const { Kakao } = window as any

  if (!Kakao) {
    console.error('Kakao SDK is not loaded')
    return
  }

  if (!Kakao.isInitialized()) {
    // Kakao 초기화가 필요하면 여기서 처리
    console.warn('Kakao SDK not initialized')
    return
  }

  Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title: `${options.title}에서 노마드 라이프를 즐겨보세요!`,
      description: `평점: ${options.cityScore}/10 - ${options.description}`,
      imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400',
      link: {
        mobileWebUrl: options.url,
        webUrl: options.url,
      },
    },
    buttons: [
      {
        title: '확인하기',
        link: {
          mobileWebUrl: options.url,
          webUrl: options.url,
        },
      },
    ],
  })
}

/**
 * 트위터로 공유
 */
export const shareToTwitter = (options: ShareOptions) => {
  const text = `🏙️ ${options.title} (평점: ${options.cityScore}/10)\n${options.description}\n\nKorea Nomad Life에서 더 알아보기!`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(options.url)}`
  window.open(twitterUrl, '_blank', 'width=550,height=420')
}

/**
 * 페이스북으로 공유
 */
export const shareToFacebook = (options: ShareOptions) => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(options.url)}`
  window.open(facebookUrl, '_blank', 'width=600,height=400')
}

/**
 * 네이버 블로그로 공유
 */
export const shareToNaverBlog = (options: ShareOptions) => {
  const naverUrl = `https://blog.naver.com/openapi/share?url=${encodeURIComponent(options.url)}&title=${encodeURIComponent(options.title)}`
  window.open(naverUrl, '_blank', 'width=600,height=400')
}

/**
 * 공유 기능 가능 여부 확인
 */
export const canUseShareApi = () => {
  return typeof navigator !== 'undefined' && !!navigator.share
}

/**
 * 기본 Web Share API 사용 (iOS/Android)
 */
export const shareViaWebAPI = async (options: ShareOptions) => {
  if (!canUseShareApi()) {
    console.error('Web Share API is not supported')
    return
  }

  try {
    await navigator.share({
      title: options.title,
      text: `${options.title} - 평점: ${options.cityScore}/10\n${options.description}`,
      url: options.url,
    })
  } catch (err: any) {
    if (err.name !== 'AbortError') {
      console.error('Error sharing:', err)
    }
  }
}
