// @ts-nocheck
import { History, PlayCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MapPatchNotes({ map }: { map: any }) {
  const hasPatchNotes = Array.isArray(map.patchNotes) && map.patchNotes.length > 0;
  
  if (!map.preview && !hasPatchNotes) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
      <div className="lg:col-span-2 flex flex-col gap-10">
        
        {/* VIDEO PREVIEW */}
        {map.preview && (
          <Card className="rounded-2xl border-border/40 bg-white shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-50 py-4 px-6">
              <CardTitle className="text-sm font-black uppercase flex items-center gap-3 text-slate-900">
                 <PlayCircle className="h-5 w-5 text-yellow-500" /> VIDEO PREVIEW
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 bg-black">
               <div className="aspect-video">
                  <iframe className="w-full h-full" src={map.preview} allowFullScreen></iframe>
               </div>
            </CardContent>
          </Card>
        )}

        {/* LỊCH SỬ CẬP NHẬT (PHONG CÁCH TIMELINE CŨ) */}
        {hasPatchNotes && (
          <Card className="rounded-2xl border-border/40 bg-white shadow-sm overflow-hidden">
            <CardHeader className="border-b border-slate-50 py-5 px-8">
              <CardTitle className="text-sm font-black uppercase flex items-center gap-3 text-slate-900">
                 <History className="h-5 w-5 text-yellow-500" /> LỊCH SỬ CẬP NHẬT
              </CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-5">
  {/* 🎯 Container chứa đường kẻ dọc xuyên suốt */}
  <div className="relative border-l-2 border-slate-100 ml-1.5 space-y-6 pb-4">
                {map.patchNotes.map((note: any, idx: number) => (
                  <div key={idx} className="relative pl-8">
                    
                    {/* 🎯 Nút tròn rỗng ruột nằm đè lên đường kẻ (đã đổi sang -left-2.25) */}
                    <div className="absolute -left-2.25 top-1 h-4 w-4 rounded-full border-[3px] border-yellow-500 bg-white shadow-sm"></div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-black text-slate-800 uppercase tracking-tight">
                          {String(note.title || "Cập nhật hệ thống")}
                        </h3>
                        <Badge variant="outline" className="text-[10px] font-black text-yellow-600 border-yellow-200 bg-yellow-50/50 px-2 py-0.5 rounded-full">
                          {String(note.ver || "v1.0")}
                        </Badge>
                      </div>
                      
                      {/* 🎯 Nội dung với khoảng cách dòng thoáng (leading-relaxed) */}
                      <p className="text-[13px] text-slate-500 font-medium whitespace-pre-line leading-relaxed">
                        {String(note.content || "")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}