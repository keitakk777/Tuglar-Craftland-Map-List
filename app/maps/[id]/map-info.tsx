// @ts-nocheck
"use client"
import { User2, Gamepad2, Users, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const CRAFTLAND_AUTHORS = ["blueghast", "huỳnh", "long", "long sensei", "huy", "huy lê", "gh channel"];

export default function MapInfo({ map, latestVersion }: { map: any, latestVersion: string }) {
  const isVerified = map.creator && CRAFTLAND_AUTHORS.some((vipName) => map.creator.toLowerCase().includes(vipName));

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
         <div className="h-8 w-1.5 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
         <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">{map.name || "Bản Đồ"}</h1>
         {/* 🎯 Đã cắt bỏ chữ v thừa */}
         <Badge className="ml-2 bg-yellow-500/20 text-yellow-700 border-yellow-500/30 font-semibold">
           v{String(latestVersion).replace(/^v/i, '')}
         </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-y-5 gap-x-4 mt-8">
         <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border ${isVerified ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-muted/40 border-border/50 text-yellow-600'}`}>
              {isVerified ? (
                <img src="/verified-badge.webp" alt="Verified Creator" className="h-6 w-6 object-contain drop-shadow-md" />
              ) : (
                <User2 size={20} />
              )}
            </div>
            <div className="flex flex-col gap-0">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Người tạo</span>
              <span className="text-yellow-600 font-bold text-[15px] leading-tight">{map.creator}</span>
            </div>
         </div>

         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center text-yellow-600 border border-border/50">
              <Gamepad2 size={20} />
            </div>
            <div className="flex flex-col gap-0">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Chế độ</span>
              <span className="font-bold text-[15px] leading-tight uppercase">{map.displayType || "Chế độ"}</span>
            </div>
         </div>

         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center text-yellow-600 border border-border/50">
              <Users size={20} />
            </div>
            <div className="flex flex-col gap-0">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Đội</span>
              <span className="font-bold text-[15px] leading-tight uppercase">{map.displayPlayers || "Tự do"}</span>
            </div>
         </div>

         <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-muted/40 flex items-center justify-center text-yellow-600 border border-border/50">
              <Calendar size={20} />
            </div>
            <div className="flex flex-col gap-0">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Cập nhật</span>
              <span className="font-bold text-[15px] leading-tight uppercase">{map.updateDate || "Không rõ"}</span>
            </div>
         </div>
      </div>

      {map.description && (
        <div className="mt-10 p-6 bg-card/40 rounded-2xl border border-border/50 backdrop-blur-sm shadow-inner italic text-sm text-muted-foreground font-medium leading-relaxed">
           <p className="whitespace-pre-line">{map.description}</p>
        </div>
      )}
    </>
  )
}