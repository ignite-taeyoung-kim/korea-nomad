/**
 * CreateEventForm Component Tests
 * 이벤트 생성 폼 컴포넌트의 렌더링, 입력, 검증, 제출 테스트
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CreateEventForm from '@/components/community/CreateEventForm'
import { mockCities } from '@/__tests__/mocks/data.mock'

// ============================================================================
// Test Suite
// ============================================================================

describe('CreateEventForm', () => {
  const mockOnEventCreated = jest.fn()
  const mockOnCancel = jest.fn()
  const defaultProps = {
    cities: mockCities,
    userId: 'user-1',
    userName: 'Test User',
    onEventCreated: mockOnEventCreated,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ==========================================================================
  // Basic Rendering Tests (3 tests)
  // ==========================================================================

  describe('Basic Rendering', () => {
    test('폼 제목이 표시된다', () => {
      // Arrange & Act
      render(<CreateEventForm {...defaultProps} />)

      // Assert
      expect(screen.getByText('새 이벤트 생성')).toBeInTheDocument()
    })

    test('모든 입력 필드가 표시된다', () => {
      // Arrange & Act
      render(<CreateEventForm {...defaultProps} />)

      // Assert
      expect(screen.getByLabelText('이벤트 제목')).toBeInTheDocument()
      expect(screen.getByLabelText('설명')).toBeInTheDocument()
      expect(screen.getByLabelText('도시')).toBeInTheDocument()
      expect(screen.getByLabelText('카테고리')).toBeInTheDocument()
      expect(screen.getByLabelText('날짜')).toBeInTheDocument()
      expect(screen.getByLabelText('시간')).toBeInTheDocument()
      expect(screen.getByLabelText('장소')).toBeInTheDocument()
    })

    test('도시 선택과 카테고리 선택 드롭다운이 표시된다', () => {
      // Arrange & Act
      render(<CreateEventForm {...defaultProps} />)

      // Assert
      const citySelect = screen.getByLabelText('도시') as HTMLSelectElement
      const categorySelect = screen.getByLabelText('카테고리') as HTMLSelectElement

      expect(citySelect).toBeInTheDocument()
      expect(categorySelect).toBeInTheDocument()
      expect(screen.getByText('도시를 선택해주세요')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Title Input Tests (2 tests)
  // ==========================================================================

  describe('Title Input', () => {
    test('제목 입력 필드가 작동한다', () => {
      // Arrange
      render(<CreateEventForm {...defaultProps} />)
      const titleInput = screen.getByLabelText('이벤트 제목') as HTMLInputElement

      // Act
      fireEvent.change(titleInput, { target: { value: 'Test Event' } })

      // Assert
      expect(titleInput.value).toBe('Test Event')
    })

    test('제목 입력 시 상태가 업데이트된다', () => {
      // Arrange
      render(<CreateEventForm {...defaultProps} />)
      const titleInput = screen.getByLabelText('이벤트 제목') as HTMLInputElement

      // Act
      fireEvent.change(titleInput, { target: { value: 'New Event Title' } })

      // Assert
      expect(titleInput.value).toBe('New Event Title')
    })
  })

  // ==========================================================================
  // Description Input Tests (2 tests)
  // ==========================================================================

  describe('Description Input', () => {
    test('설명 textarea가 작동한다', () => {
      // Arrange
      render(<CreateEventForm {...defaultProps} />)
      const descriptionInput = screen.getByLabelText('설명') as HTMLTextAreaElement

      // Act
      fireEvent.change(descriptionInput, {
        target: { value: 'This is a test description' },
      })

      // Assert
      expect(descriptionInput.value).toBe('This is a test description')
    })

    test('설명 입력 시 상태가 업데이트된다', () => {
      // Arrange
      render(<CreateEventForm {...defaultProps} />)
      const descriptionInput = screen.getByLabelText('설명') as HTMLTextAreaElement

      // Act
      fireEvent.change(descriptionInput, { target: { value: 'Detailed description' } })

      // Assert
      expect(descriptionInput.value).toBe('Detailed description')
    })
  })

  // ==========================================================================
  // Category Select Tests (2 tests)
  // ==========================================================================

  describe('Category Select', () => {
    test('5개의 카테고리 옵션이 표시된다', () => {
      // Arrange & Act
      render(<CreateEventForm {...defaultProps} />)

      // Assert
      expect(screen.getByText('네트워킹')).toBeInTheDocument()
      expect(screen.getByText('워크숍')).toBeInTheDocument()
      expect(screen.getByText('사교')).toBeInTheDocument()
      expect(screen.getByText('스포츠')).toBeInTheDocument()
      expect(screen.getByText('문화')).toBeInTheDocument()
    })

    test('카테고리 선택 시 상태가 업데이트된다', () => {
      // Arrange
      render(<CreateEventForm {...defaultProps} />)
      const categorySelect = screen.getByLabelText('카테고리') as HTMLSelectElement

      // Act
      fireEvent.change(categorySelect, { target: { value: 'workshop' } })

      // Assert
      expect(categorySelect.value).toBe('workshop')
    })
  })

  // ==========================================================================
  // Date/Time Inputs Tests (2 tests)
  // ==========================================================================

  describe('Date/Time Inputs', () => {
    test('날짜 입력 필드가 작동한다', () => {
      // Arrange
      render(<CreateEventForm {...defaultProps} />)
      const dateInput = screen.getByLabelText('날짜') as HTMLInputElement

      // Act
      fireEvent.change(dateInput, { target: { value: '2024-12-01' } })

      // Assert
      expect(dateInput.value).toBe('2024-12-01')
    })

    test('시간 입력 필드가 작동한다', () => {
      // Arrange
      render(<CreateEventForm {...defaultProps} />)
      const timeInput = screen.getByLabelText('시간') as HTMLInputElement

      // Act
      fireEvent.change(timeInput, { target: { value: '14:30' } })

      // Assert
      expect(timeInput.value).toBe('14:30')
    })
  })

  // ==========================================================================
  // Location Input Tests (1 test)
  // ==========================================================================

  describe('Location Input', () => {
    test('장소 텍스트 입력이 작동한다', () => {
      // Arrange
      render(<CreateEventForm {...defaultProps} />)
      const locationInput = screen.getByLabelText('장소') as HTMLInputElement

      // Act
      fireEvent.change(locationInput, { target: { value: '강남역 스타벅스' } })

      // Assert
      expect(locationInput.value).toBe('강남역 스타벅스')
    })
  })

  // ==========================================================================
  // Form Submission Tests (2 tests)
  // ==========================================================================

  describe('Form Submission', () => {
    test('유효한 폼 제출 시 onEventCreated가 호출된다', async () => {
      // Arrange
      render(<CreateEventForm {...defaultProps} />)

      // Act - Fill all required fields
      const titleInput = screen.getByLabelText('이벤트 제목')
      const descriptionInput = screen.getByLabelText('설명')
      const citySelect = screen.getByLabelText('도시')
      const dateInput = screen.getByLabelText('날짜')
      const locationInput = screen.getByLabelText('장소')

      fireEvent.change(titleInput, { target: { value: 'Test Event' } })
      fireEvent.change(descriptionInput, { target: { value: 'Test Description' } })
      fireEvent.change(citySelect, { target: { value: 'seoul' } })
      fireEvent.change(dateInput, { target: { value: '2024-12-01' } })
      fireEvent.change(locationInput, { target: { value: 'Test Location' } })

      const submitButton = screen.getByText('이벤트 생성')
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(mockOnEventCreated).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Test Event',
            description: 'Test Description',
            city_id: 'seoul',
            location: 'Test Location',
            creator_id: 'user-1',
            creator_name: 'Test User',
          })
        )
      })
    })

    test('필수 필드가 비어있으면 검증 에러가 표시된다', async () => {
      // Arrange
      render(<CreateEventForm {...defaultProps} />)

      // Act - Submit without filling fields
      const submitButton = screen.getByText('이벤트 생성')
      fireEvent.click(submitButton)

      // Assert - Check for validation error
      await waitFor(() => {
        expect(screen.getByText('이벤트 제목을 입력해주세요')).toBeInTheDocument()
      })

      expect(mockOnEventCreated).not.toHaveBeenCalled()
    })
  })

  // ==========================================================================
  // Cancel Button Tests (2 tests)
  // ==========================================================================

  describe('Cancel Button', () => {
    test('onCancel prop이 전달되면 취소 버튼이 표시된다', () => {
      // Arrange & Act
      render(<CreateEventForm {...defaultProps} onCancel={mockOnCancel} />)

      // Assert
      expect(screen.getByText('취소')).toBeInTheDocument()
    })

    test('취소 버튼 클릭 시 onCancel이 호출된다', () => {
      // Arrange
      render(<CreateEventForm {...defaultProps} onCancel={mockOnCancel} />)

      // Act
      const cancelButton = screen.getByText('취소')
      fireEvent.click(cancelButton)

      // Assert
      expect(mockOnCancel).toHaveBeenCalled()
    })
  })

  // ==========================================================================
  // Additional Validation Tests
  // ==========================================================================

  describe('Additional Validation', () => {
    test('설명이 비어있으면 에러 메시지가 표시된다', async () => {
      // Arrange
      render(<CreateEventForm {...defaultProps} />)

      // Act - Fill only title
      const titleInput = screen.getByLabelText('이벤트 제목')
      fireEvent.change(titleInput, { target: { value: 'Test Event' } })

      const submitButton = screen.getByText('이벤트 생성')
      fireEvent.click(submitButton)

      // Assert
      await waitFor(() => {
        expect(screen.getByText('이벤트 설명을 입력해주세요')).toBeInTheDocument()
      })
    })

    test('날짜가 선택되지 않으면 에러 메시지가 표시된다', async () => {
      // Arrange
      render(<CreateEventForm {...defaultProps} />)

      // Act - Fill title and description only
      fireEvent.change(screen.getByLabelText('이벤트 제목'), {
        target: { value: 'Test' },
      })
      fireEvent.change(screen.getByLabelText('설명'), { target: { value: 'Test Desc' } })

      fireEvent.click(screen.getByText('이벤트 생성'))

      // Assert
      await waitFor(() => {
        expect(screen.getByText('날짜를 선택해주세요')).toBeInTheDocument()
      })
    })
  })
})
