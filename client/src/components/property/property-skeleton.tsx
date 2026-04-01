function PropertySkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-56 animate-pulse rounded-xl border bg-muted/40" />
      ))}
    </div>
  )
}

export default PropertySkeleton
