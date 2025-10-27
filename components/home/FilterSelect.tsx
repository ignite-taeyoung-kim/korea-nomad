'use client'

import { FilterSelectProps } from '@/lib/types'
import { ChevronDown } from 'lucide-react'
import { useRef, useEffect, useState } from 'react'

export default function FilterSelect({
  label,
  value,
  options,
  onChange,
  placeholder = '선택하세요',
  icon,
  className = '',
}: FilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find((opt) => opt.value === value)
  const displayLabel = selectedOption?.label || placeholder

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Hidden label for accessibility */}
      <label htmlFor={`filter-${label}`} className="sr-only">
        {label}
      </label>

      {/* Select button */}
      <button
        id={`filter-${label}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-150 flex items-center justify-between gap-2 text-left"
      >
        <span className="flex items-center gap-2 flex-1 truncate">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <span className="truncate">{displayLabel}</span>
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-50"
        >
          <ul className="py-1">
            {options.map((option) => (
              <li key={option.value}>
                <button
                  role="option"
                  aria-selected={value === option.value}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-3 text-left font-medium transition-colors duration-150 flex items-center gap-2 hover:bg-gray-100 ${
                    value === option.value
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                      : 'text-gray-700'
                  }`}
                >
                  {option.icon && <span>{option.icon}</span>}
                  <span>{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
