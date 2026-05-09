// @ts-nocheck
import { Badge } from "@/components/ui/badge"

export default function MapCover({ map }: { map: any }) {
  return (
    <div className="relative aspect-[485/220] w-full rounded-2xl overflow-hidden shadow-md border border-border/40 bg-slate-900">
      <img src={map.image} className="absolute inset-0 h-full w-full object-contain" alt="Cover" />
      {/* 🎯 ĐÃ XÓA PHẦN HIỂN THỊ LIKE VÀ STAR TẠI ĐÂY */}
    </div>
  )
}