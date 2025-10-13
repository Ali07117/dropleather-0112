export function ProductsEmpty() {
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col lg:flex-row gap-6 py-4 md:py-6 px-4 lg:px-6">
        {/* Left Sidebar - Filters (keep visible even when empty) */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <div className="h-8 bg-gray-100 rounded w-1/2 mb-4"></div>
          <p className="text-sm text-muted-foreground font-sans">
            Filters will be available when products are loaded
          </p>
        </div>

        {/* Right Side - Empty State */}
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="text-center py-12 max-w-md">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold font-sora mb-2 text-black">No products available</h3>
            <p className="text-muted-foreground font-sans text-sm">
              Products will appear here when they become available. Check back later or contact your administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}