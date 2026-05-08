// @ts-nocheck
import { ThumbsUp, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function MapCover({ map }: { map: any }) {
  return (
    <div className="relative aspect-[485/220] w-full rounded-2xl overflow-hidden shadow-md border border-border/40 bg-slate-900">
      <img src={map.image} className="absolute inset-0 h-full w-full object-contain" alt="Cover" />
      <div className="absolute bottom-3 left-3 flex gap-2">
         <Badge className="bg-black/60 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 border-none gap-1">
           <ThumbsUp className="h-3 w-3 text-yellow-400 fill-yellow-400" /> 16.3K
         </Badge>
         <Badge className="bg-black/60 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 border-none gap-1">
           <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" /> 59.7K
         </Badge>
      </div>
    </div>
  )
}