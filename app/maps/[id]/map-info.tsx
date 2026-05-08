// @ts-nocheck
import { User, Gamepad2, Users, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const CRAFTLAND_AUTHORS = ["Long Sensei", "Huỳnh Nguyễn", "Huy Lê", "Long", "Văn Chuyên"];

export default function MapInfo({ map, latestVersion }: { map: any, latestVersion: string }) {
  const isOfficialCreator = CRAFTLAND_AUTHORS.includes(map.creator);

  return (
    <div className="w-full lg:w-[55%] flex flex-col gap-6 lg:pt-1">
      <div className="flex items-stretch gap-4">
         <div className="w-1.5 bg-yellow-500 rounded-full shrink-0 my-1"></div>
         <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 leading-tight">
              {String(map.name || "Bản Đồ")}
            </h1>
            <Badge variant="outline" className="text-yellow-600 border-yellow-200 font-black px-2 py-0.5 text-[10px] bg-yellow-50/50 rounded-full h-fit">
              {latestVersion}
            </Badge>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-y-6 gap-x-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-border/50">
             {isOfficialCreator ? <img src="/icon/icon short tuglar dark.png" className="h-6 w-6 object-contain" alt="badge" /> : <User className="h-5 w-5 text-slate-400" />}
          </div>
          <div className="flex flex-col min-w-0">
             <p className="text-[10px] font-bold text-slate-400 uppercase">Người tạo</p>
             <p className="font-bold text-sm text-yellow-600 truncate">{map.creator}</p>
          </div>
        </div>

        <InfoBox icon={<Gamepad2 className="h-5 w-5" />} label="Chế độ" value={map.displayType} />
        <InfoBox icon={<Users className="h-5 w-5" />} label="Quy mô" value={map.displayPlayers} />
        <InfoBox icon={<Calendar className="h-5 w-5" />} label="Cập Nhật" value={map.updateDate || "Không rõ"} />
      </div>

      {map.description && (
        <div className="p-5 rounded-xl bg-white border border-border/40 text-[13px] text-slate-500 font-medium italic leading-relaxed shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 w-1 h-full bg-slate-100"></div>
          "{map.description}"
        </div>
      )}
    </div>
  )
}

function InfoBox({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl border border-border/50 bg-white flex items-center justify-center shrink-0 text-slate-400">{icon}</div>
      <div className="flex flex-col min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase">{label}</p>
        <p className="font-black text-[13px] text-slate-800 truncate uppercase">{value}</p>
      </div>
    </div>
  )
}