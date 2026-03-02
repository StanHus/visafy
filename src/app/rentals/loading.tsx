export default function RentalsLoading() {
  return (
    <div className="min-h-screen bg-white pt-28 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-56 bg-gray-100 rounded-lg animate-pulse mb-3" />
          <div className="h-4 w-80 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Filter skeleton */}
        <div className="flex flex-wrap gap-3 mb-8">
          <div className="h-10 w-40 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 w-28 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 w-28 bg-gray-100 rounded-lg animate-pulse" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-gray-100 rounded-xl overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-100" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-gray-100 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
                <div className="flex gap-4">
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                  <div className="h-3 w-16 bg-gray-100 rounded" />
                </div>
                <div className="h-6 w-24 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
