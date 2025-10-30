/**
 * SearchBar Component Tests
 * 검색바 컴포넌트의 렌더링, 입력 처리, 접근성 테스트
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchBar from '@/components/cities/SearchBar'

// ============================================================================
// Test Suite
// ============================================================================

describe('SearchBar', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ==========================================================================
  // Basic Rendering Tests (2 tests)
  // ==========================================================================

  describe('Basic Rendering', () => {
    test('검색 입력 필드가 표시된다', () => {
      // Arrange & Act
      render(<SearchBar value="" onChange={mockOnChange} />)

      // Assert
      const inputElement = screen.getByRole('textbox')
      expect(inputElement).toBeInTheDocument()
      expect(inputElement).toHaveAttribute('type', 'text')
    })

    test('검색 아이콘과 플레이스홀더 텍스트가 표시된다', () => {
      // Arrange & Act
      render(<SearchBar value="" onChange={mockOnChange} />)

      // Assert
      const inputElement = screen.getByPlaceholderText('도시명으로 검색...')
      expect(inputElement).toBeInTheDocument()
      // Search icon is rendered as SVG
      const container = inputElement.parentElement
      expect(container?.querySelector('svg')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Input Change Tests (2 tests)
  // ==========================================================================

  describe('Input Change', () => {
    test('텍스트를 입력하면 onChange가 호출된다', () => {
      // Arrange
      render(<SearchBar value="" onChange={mockOnChange} />)
      const inputElement = screen.getByRole('textbox')

      // Act
      fireEvent.change(inputElement, { target: { value: 'seoul' } })

      // Assert
      expect(mockOnChange).toHaveBeenCalledTimes(1)
      expect(mockOnChange).toHaveBeenCalledWith('seoul')
    })

    test('올바른 값이 onChange에 전달된다', () => {
      // Arrange
      render(<SearchBar value="" onChange={mockOnChange} />)
      const inputElement = screen.getByRole('textbox')

      // Act
      fireEvent.change(inputElement, { target: { value: '서울' } })

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith('서울')
    })
  })

  // ==========================================================================
  // Styling Tests (2 tests)
  // ==========================================================================

  describe('Styling', () => {
    test('검색 아이콘이 절대 위치로 배치된다', () => {
      // Arrange & Act
      const { container } = render(<SearchBar value="" onChange={mockOnChange} />)

      // Assert
      const iconContainer = container.querySelector('.absolute')
      expect(iconContainer).toBeInTheDocument()
      expect(iconContainer).toHaveClass('left-4')
    })

    test('입력 필드가 올바른 스타일을 가진다', () => {
      // Arrange & Act
      render(<SearchBar value="" onChange={mockOnChange} />)
      const inputElement = screen.getByRole('textbox')

      // Assert
      expect(inputElement).toHaveClass('w-full')
      expect(inputElement).toHaveClass('pl-12')
      expect(inputElement).toHaveClass('rounded-lg')
    })
  })

  // ==========================================================================
  // Accessibility Tests (2 tests)
  // ==========================================================================

  describe('Accessibility', () => {
    test('입력 필드에 접근할 수 있다', () => {
      // Arrange & Act
      render(<SearchBar value="" onChange={mockOnChange} />)

      // Assert
      const inputElement = screen.getByRole('textbox')
      expect(inputElement).toBeInTheDocument()
    })

    test('플레이스홀더가 설명적이다', () => {
      // Arrange & Act
      render(<SearchBar value="" onChange={mockOnChange} />)

      // Assert
      const inputElement = screen.getByPlaceholderText('도시명으로 검색...')
      expect(inputElement).toBeInTheDocument()
      expect(inputElement.placeholder).toBe('도시명으로 검색...')
    })
  })

  // ==========================================================================
  // Additional Edge Cases
  // ==========================================================================

  describe('Edge Cases', () => {
    test('초기 값이 입력 필드에 표시된다', () => {
      // Arrange & Act
      render(<SearchBar value="busan" onChange={mockOnChange} />)
      const inputElement = screen.getByRole('textbox') as HTMLInputElement

      // Assert
      expect(inputElement.value).toBe('busan')
    })

    test('빈 문자열을 입력해도 onChange가 호출된다', () => {
      // Arrange
      render(<SearchBar value="test" onChange={mockOnChange} />)
      const inputElement = screen.getByRole('textbox')

      // Act
      fireEvent.change(inputElement, { target: { value: '' } })

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith('')
    })

    test('특수 문자를 입력할 수 있다', () => {
      // Arrange
      render(<SearchBar value="" onChange={mockOnChange} />)
      const inputElement = screen.getByRole('textbox')

      // Act
      fireEvent.change(inputElement, { target: { value: '서울-강남' } })

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith('서울-강남')
    })

    test('긴 검색어를 입력할 수 있다', () => {
      // Arrange
      const longSearchTerm = '서울특별시 강남구 테헤란로 디지털노마드'
      render(<SearchBar value="" onChange={mockOnChange} />)
      const inputElement = screen.getByRole('textbox')

      // Act
      fireEvent.change(inputElement, { target: { value: longSearchTerm } })

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith(longSearchTerm)
    })
  })
})
