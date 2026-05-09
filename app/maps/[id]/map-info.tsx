// @ts-nocheck
import { User, Gamepad2, Users, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const CRAFTLAND_AUTHORS = ["Long Sensei", "Huỳnh Nguyễn", "Huy Lê", "Long"];

export default function MapInfo({ map, latestVersion }: { map: any, latestVersion: string }) {
  const isOfficialCreator = CRAFTLAND_AUTHORS.includes(map.creator);

  return (
    <div className="w-full lg:w-[55%] flex flex-col gap-6 lg:pt-1">
      <div className="flex items-stretch gap-4">
         <div className="w-1.5 bg-yellow-500 rounded-full shrink-0 my-1 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
         <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-foreground leading-tight">
              {String(map.name || "Bản Đồ")}
            </h1>
            <Badge variant="outline" className="text-yellow-600 dark:text-yellow-400 border-yellow-500/50 font-black px-2 py-0.5 text-[10px] bg-yellow-500/10 rounded-full h-fit">
              {latestVersion}
            </Badge>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-secondary/50 dark:bg-slate-800/50 flex items-center justify-center shrink-0 border border-border/50 backdrop-blur-sm">
             {/* 🎯 Đã thêm fill-current vào icon User */}
             {isOfficialCreator ? <img src="/verified-badge.webp" className="h-6 w-6 object-contain" alt="badge" /> : <User className="h-5 w-5 text-muted-foreground fill-current" />}
          </div>
          <div className="flex flex-col min-w-0">
             <p className="text-[10px] font-bold text-muted-foreground uppercase">Người tạo</p>
             <p className="font-bold text-sm text-yellow-600 dark:text-yellow-500 truncate">{map.creator}</p>
          </div>
        </div>

        {/* 🎯 Đã thêm fill-current vào Gamepad2 và Calendar */}
        <InfoBox icon={<Gamepad2 className="h-5 w-5 fill-current" />} label="Chế độ" value={map.displayType} />
        <InfoBox icon={<Users className="h-5 w-5 fill-current" />} label="Quy mô" value={map.displayPlayers} />
        <InfoBox icon={<Calendar className="h-5 w-5 fill-current" />} label="Cập Nhật" value={map.updateDate || "Không rõ"} />
      </div>

      {map.description && (
        <div className="p-5 rounded-xl bg-secondary/30 dark:bg-card/30 backdrop-blur-md border border-border/50 text-[13px] text-muted-foreground font-medium italic leading-relaxed shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1 h-full bg-muted-foreground/30"></div>
          "{map.description}"
        </div>
      )}
    </div>
  )
}

function InfoBox({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl border border-border/50 bg-secondary/50 dark:bg-slate-800/50 flex items-center justify-center shrink-0 text-yellow-600 dark:text-yellow-500 backdrop-blur-sm">{icon}</div>
      <div className="flex flex-col min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground uppercase">{label}</p>
        <p className="font-black text-[13px] text-foreground truncate uppercase">{value}</p>
      </div>
    </div>
  )
}