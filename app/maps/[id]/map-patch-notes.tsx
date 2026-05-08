// @ts-nocheck
import { History, PlayCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MapPatchNotes({ map }: { map: any }) {
  const hasPatchNotes = Array.isArray(map.patchNotes) && map.patchNotes.length > 0;
  
  if (!map.preview && !hasPatchNotes) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-20">
      <div className="lg:col-span-2 flex flex-col gap-16">
        
        {/* VIDEO PREVIEW - CHUẨN 16:9 VÀ BO GÓC TUYỆT ĐỐI THEO ẢNH 2 */}
        {map.preview && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
               <div className="h-10 w-2 bg-yellow-500 rounded-full"></div>
               <h2 className="text-3xl md:text-4xl font-black uppercase text-slate-900 tracking-tighter">
                  VIDEO PREVIEW
               </h2>
            </div>
            
            {/* Vùng chứa ép tỉ lệ 16:9 (padding-bottom: 56.25%) */}
            <div 
               className="relative w-full shadow-2xl rounded-[3rem] overflow-hidden bg-black ring-[12px] ring-white" 
               style={{ paddingBottom: '56.25%' }}
            >
               <iframe 
                  className="absolute inset-0 h-full w-full" 
                  src={map.preview} 
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
               ></iframe>
            </div>
          </div>
        )}

        {/* LỊCH SỬ CẬP NHẬT - PHONG CÁCH CHUYÊN NGHIỆP CÂN ĐỐI */}
        {hasPatchNotes && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
               <div className="h-10 w-2 bg-yellow-500 rounded-full"></div>
               <h2 className="text-3xl md:text-4xl font-black uppercase text-slate-900 tracking-tighter">
                  LỊCH SỬ CẬP NHẬT
               </h2>
            </div>
            
            <Card className="rounded-[3rem] border-none bg-white shadow-2xl overflow-hidden">
              <CardContent className="px-10 py-16">
                <div className="relative border-l-4 border-slate-100 ml-2 space-y-16 pb-4">
                  {map.patchNotes.map((note: any, idx: number) => (
                    <div key={idx} className="relative pl-14">
                      
                      {/* Nút tròn timeline to, rõ nét, đồng bộ màu sắc */}
                      <div className="absolute -left-[18px] top-1.5 h-8 w-8 rounded-full border-[6px] border-yellow-500 bg-white shadow-lg"></div>
                      
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-wrap items-center gap-4">
                          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                            {String(note.title || "Cập nhật hệ thống")}
                          </h3>
                          <Badge className="text-[14px] font-black bg-yellow-500 text-black px-4 py-1.5 rounded-full border-none shadow-md">
                            {String(note.ver || "v1.0")}
                          </Badge>
                        </div>
                        
                        <p className="text-[16px] text-slate-500 font-semibold whitespace-pre-line leading-relaxed max-w-3xl">
                          {String(note.content || "")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
  )
}