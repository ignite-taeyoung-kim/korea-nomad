/**
 * FilterSelect Component Tests
 * 필터 드롭다운 컴포넌트의 렌더링, 상호작용, 접근성 테스트
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FilterSelect from '@/components/home/FilterSelect'
import { FilterOption } from '@/lib/types'

// ============================================================================
// Test Data
// ============================================================================

const mockOptions: FilterOption[] = [
  { label: '옵션 1', value: 'option1', icon: '🔵' },
  { label: '옵션 2', value: 'option2', icon: '🟢' },
  { label: '옵션 3', value: 'option3', icon: '🟡' },
]

// ============================================================================
// Test Suite
// ============================================================================

describe('FilterSelect', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  // ==========================================================================
  // Basic Rendering Tests (3 tests)
  // ==========================================================================

  describe('Basic Rendering', () => {
    test('라벨이 표시된다 (스크린 리더용)', () => {
      // Arrange & Act
      render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      // Assert
      const label = screen.getByLabelText('테스트 필터')
      expect(label).toBeInTheDocument()
    })

    test('플레이스홀더가 초기에 표시된다', () => {
      // Arrange & Act
      render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
          placeholder="선택해주세요"
        />
      )

      // Assert
      expect(screen.getByText('선택해주세요')).toBeInTheDocument()
    })

    test('아이콘이 표시된다', () => {
      // Arrange & Act
      render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
          icon="💰"
        />
      )

      // Assert
      expect(screen.getByText('💰')).toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Dropdown Toggle Tests (2 tests)
  // ==========================================================================

  describe('Dropdown Toggle', () => {
    test('버튼 클릭 시 드롭다운이 열린다', () => {
      // Arrange
      render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      // Act
      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Assert
      expect(screen.getByRole('listbox')).toBeInTheDocument()
    })

    test('열린 드롭다운을 다시 클릭하면 닫힌다', () => {
      // Arrange
      render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      // Act
      const button = screen.getByRole('button')
      fireEvent.click(button) // Open
      fireEvent.click(button) // Close

      // Assert
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Option Selection Tests (3 tests)
  // ==========================================================================

  describe('Option Selection', () => {
    test('옵션 클릭 시 onChange가 호출된다', () => {
      // Arrange
      render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      // Act
      const button = screen.getByRole('button')
      fireEvent.click(button)
      const option = screen.getByText('옵션 1')
      fireEvent.click(option)

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith('option1')
    })

    test('올바른 값이 onChange에 전달된다', () => {
      // Arrange
      render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      // Act
      const button = screen.getByRole('button')
      fireEvent.click(button)
      const option = screen.getByText('옵션 2')
      fireEvent.click(option)

      // Assert
      expect(mockOnChange).toHaveBeenCalledWith('option2')
      expect(mockOnChange).toHaveBeenCalledTimes(1)
    })

    test('옵션 선택 후 드롭다운이 닫힌다', async () => {
      // Arrange
      render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      // Act
      const button = screen.getByRole('button')
      fireEvent.click(button)
      const option = screen.getByText('옵션 1')
      fireEvent.click(option)

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })
  })

  // ==========================================================================
  // External Click Detection Tests (2 tests)
  // ==========================================================================

  describe('External Click Detection', () => {
    test('외부 클릭 시 드롭다운이 닫힌다', async () => {
      // Arrange
      render(
        <div>
          <FilterSelect
            label="테스트 필터"
            value=""
            options={mockOptions}
            onChange={mockOnChange}
          />
          <div data-testid="outside">외부 요소</div>
        </div>
      )

      // Act
      const button = screen.getByRole('button')
      fireEvent.click(button) // Open dropdown

      const outsideElement = screen.getByTestId('outside')
      fireEvent.mouseDown(outsideElement) // Click outside

      // Assert
      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
      })
    })

    test('mousedown 이벤트 리스너가 등록된다', () => {
      // Arrange
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener')

      // Act
      render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      // Assert
      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function))
    })
  })

  // ==========================================================================
  // Option Rendering Tests (2 tests)
  // ==========================================================================

  describe('Option Rendering', () => {
    test('모든 옵션이 표시된다', () => {
      // Arrange
      render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      // Act
      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Assert
      expect(screen.getByText('옵션 1')).toBeInTheDocument()
      expect(screen.getByText('옵션 2')).toBeInTheDocument()
      expect(screen.getByText('옵션 3')).toBeInTheDocument()
    })

    test('선택된 옵션에 스타일이 적용된다', () => {
      // Arrange
      const { container } = render(
        <FilterSelect
          label="테스트 필터"
          value="option2"
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      // Act
      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Assert
      const selectedOption = container.querySelector('.bg-primary-50')
      expect(selectedOption).toBeInTheDocument()
      expect(selectedOption).toHaveTextContent('옵션 2')
    })
  })

  // ==========================================================================
  // ChevronDown Animation Tests (2 tests)
  // ==========================================================================

  describe('ChevronDown Animation', () => {
    test('드롭다운이 열리면 아이콘이 180도 회전한다', () => {
      // Arrange
      const { container } = render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      // Act
      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Assert
      const chevron = container.querySelector('.rotate-180')
      expect(chevron).toBeInTheDocument()
    })

    test('드롭다운이 닫히면 아이콘이 원위치로 돌아온다', () => {
      // Arrange
      const { container } = render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      // Act
      const button = screen.getByRole('button')
      fireEvent.click(button) // Open
      fireEvent.click(button) // Close

      // Assert
      const chevron = container.querySelector('.rotate-180')
      expect(chevron).not.toBeInTheDocument()
    })
  })

  // ==========================================================================
  // Accessibility Tests (1 test)
  // ==========================================================================

  describe('Accessibility', () => {
    test('적절한 ARIA 속성이 설정되어 있다', () => {
      // Arrange
      render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />
      )

      // Act
      const button = screen.getByRole('button')

      // Assert
      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button).toHaveAttribute('aria-haspopup', 'listbox')

      // Open dropdown
      fireEvent.click(button)
      expect(button).toHaveAttribute('aria-expanded', 'true')

      // Check listbox role
      const listbox = screen.getByRole('listbox')
      expect(listbox).toBeInTheDocument()

      // Check option roles
      const options = screen.getAllByRole('option')
      expect(options).toHaveLength(mockOptions.length)
    })
  })

  // ==========================================================================
  // Edge Cases and Additional Tests
  // ==========================================================================

  describe('Edge Cases', () => {
    test('옵션이 없을 때 드롭다운이 비어있다', () => {
      // Arrange
      render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={[]}
          onChange={mockOnChange}
        />
      )

      // Act
      const button = screen.getByRole('button')
      fireEvent.click(button)

      // Assert
      const listbox = screen.getByRole('listbox')
      expect(listbox).toBeInTheDocument()
      expect(screen.queryAllByRole('option')).toHaveLength(0)
    })

    test('선택된 값이 있으면 플레이스홀더 대신 선택된 옵션이 표시된다', () => {
      // Arrange
      render(
        <FilterSelect
          label="테스트 필터"
          value="option2"
          options={mockOptions}
          onChange={mockOnChange}
          placeholder="선택해주세요"
        />
      )

      // Assert
      expect(screen.getByText('옵션 2')).toBeInTheDocument()
      expect(screen.queryByText('선택해주세요')).not.toBeInTheDocument()
    })

    test('커스텀 className이 적용된다', () => {
      // Arrange
      const { container } = render(
        <FilterSelect
          label="테스트 필터"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
          className="custom-class"
        />
      )

      // Assert
      const wrapper = container.querySelector('.custom-class')
      expect(wrapper).toBeInTheDocument()
    })
  })
})
