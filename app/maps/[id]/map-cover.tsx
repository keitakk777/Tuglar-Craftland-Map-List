// @ts-nocheck
"use client"
export default function MapCover({ map }: { map: any }) {
  const fallbackImage = "/map-cover/Banner Chưa có.png"
  const displayBanner = map.image || fallbackImage

  return (
    <div className="relative aspect-[485/220] overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-yellow-500/10 bg-muted/20">
      <img 
        src={displayBanner} 
        className="h-full w-full object-cover" 
        alt={map.name || "Map Cover"} 
        onError={(e) => { e.currentTarget.src = fallbackImage }}
      />
    </div>
  )
}