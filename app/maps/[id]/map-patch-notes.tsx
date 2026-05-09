// @ts-nocheck
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function MapPatchNotes({ map }: { map: any }) {
  const hasPatchNotes = Array.isArray(map.patchNotes) && map.patchNotes.length > 0;
  if (!map.preview && !hasPatchNotes) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-20">
      <div className="lg:col-span-2 flex flex-col gap-16">
        
        {map.preview && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
               <div className="h-10 w-2 bg-yellow-500 rounded-full shadow-sm"></div>
               <h2 className="text-3xl md:text-4xl font-black uppercase text-foreground tracking-tighter">VIDEO PREVIEW</h2>
            </div>
            <div className="relative w-full shadow-2xl rounded-[2.5rem] overflow-hidden bg-black ring-8 ring-secondary/50" style={{ paddingBottom: '56.25%' }}>
               <iframe className="absolute inset-0 h-full w-full" src={map.preview} frameBorder="0" allowFullScreen></iframe>
            </div>
          </div>
        )}

        {hasPatchNotes && (
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
               <div className="h-10 w-2 bg-yellow-500 rounded-full shadow-sm"></div>
               <h2 className="text-3xl md:text-4xl font-black uppercase text-foreground tracking-tighter">LỊCH SỬ CẬP NHẬT</h2>
            </div>
            <Card className="rounded-[2.5rem] border-border bg-secondary/20 dark:bg-card/30 backdrop-blur-xl shadow-xl overflow-hidden">
              <CardContent className="px-6 md:px-10 py-12 md:py-16">
                <div className="relative border-l-4 border-muted ml-2 space-y-12 pb-4">
                  {map.patchNotes.map((note: any, idx: number) => (
                    <div key={idx} className="relative pl-10 md:pl-14">
                      <div className="absolute -left-[18px] top-1.5 h-8 w-8 rounded-full border-[6px] border-yellow-500 bg-background shadow-md"></div>
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                          <h3 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tight">{note.title}</h3>
                          <Badge className="text-[12px] font-black bg-yellow-500 text-black px-3 py-1 rounded-full border-none">{note.ver}</Badge>
                        </div>
                        <p className="text-sm md:text-base text-muted-foreground font-medium whitespace-pre-line leading-relaxed max-w-3xl">{note.content}</p>
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