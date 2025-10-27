interface EmptyStateProps {
  onReset?: () => void
}

export default function EmptyState({ onReset }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-6">🔍</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        검색 결과가 없습니다
      </h3>
      <p className="text-gray-600 mb-6">
        필터를 조정하고 다시 시도해보세요
      </p>
      {onReset && (
        <button
          onClick={onReset}
          className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
        >
          필터 초기화
        </button>
      )}
    </div>
  )
}
