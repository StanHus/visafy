export default function CaptainsLoading() {
  return (
    <div className="min-h-screen bg-white pt-28 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse mb-3" />
          <div className="h-4 w-72 bg-gray-100 rounded animate-pulse" />
        </div>

        {/* Filter skeleton */}
        <div className="flex gap-3 mb-8">
          <div className="h-10 w-40 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-gray-100 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-gray-100 rounded-lg animate-pulse" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-gray-100 rounded-xl p-6 space-y-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100" />
                <div className="space-y-2">
                  <div className="h-4 w-28 bg-gray-100 rounded" />
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                </div>
              </div>
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-2/3 bg-gray-100 rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-100 rounded-full" />
                <div className="h-6 w-16 bg-gray-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
