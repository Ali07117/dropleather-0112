interface ProductsErrorProps {
  error: Error
  onRetry: () => void
}

export function ProductsError({ error, onRetry }: ProductsErrorProps) {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col lg:flex-row gap-6 py-4 md:py-6 px-4 lg:px-6">
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-center py-12 max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-semibold font-sora mb-2 text-black">Unable to load products</h3>
            <p className="text-muted-foreground font-sans mb-6 text-sm">
              {error.message || 'Something went wrong while loading products'}
            </p>
            <button
              onClick={onRetry}
              className="px-6 py-3 bg-black text-white rounded-[11px] hover:bg-gray-800 transition-colors font-sora font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}