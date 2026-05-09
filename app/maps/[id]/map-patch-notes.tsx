// @ts-nocheck
"use client"
import { History, PlayCircle, Trophy } from "lucide-react"
import { motion } from "framer-motion"

export default function MapPatchNotes({ map }: { map: any }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  const hasPatchNotes = Array.isArray(map.patchNotes) && map.patchNotes.length > 0;
  const hasAchievements = Array.isArray(map.achievements) && map.achievements.length > 0;

  if (!map.preview && !hasPatchNotes && !hasAchievements) return null;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2">
        
        {map.preview && map.preview.trim() !== "" && (
          <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm mb-8 overflow-hidden">
            <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 text-foreground uppercase tracking-tight">
              <PlayCircle className="h-7 w-7 text-yellow-500" /> Preview
            </h2>
            <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/30 bg-black/20 shadow-lg">
              <iframe src={map.preview} className="h-full w-full" allowFullScreen></iframe>
            </div>
          </div>
        )}

        {hasPatchNotes && (
          <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm">
            <h2 className="relative pl-8 flex items-center text-2xl font-bold mb-12 text-foreground uppercase tracking-tight">
              <History className="absolute -left-[11px] text-yellow-500 h-7 w-7" /> Patch Notes
            </h2>
            <motion.div className="space-y-0" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={containerVariants}> 
              {map.patchNotes.map((note: any, index: number) => (
                <motion.div key={index} className="relative pl-8 pb-12 last:pb-0" variants={itemVariants}>
                  {index !== map.patchNotes.length - 1 && <div className="absolute left-0 w-[2px] bg-yellow-500/10 top-[10px] bottom-0" />}
                  <div className="absolute -left-[9px] top-0 h-[20px] w-[20px] rounded-full bg-background border-[3px] border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)] z-10" />
                  <div className="relative -top-[2px]"> 
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl text-yellow-600 leading-none uppercase">{note.title || "Cập nhật mới"}</h3>
                          {/* 🎯 Đã cắt bỏ chữ v thừa ở đây */}
                          <div className="px-2 py-0.5 rounded-full border border-yellow-500/50 bg-yellow-500/10 text-yellow-700 text-xs font-bold">
                            v{String(note.ver).replace(/^v/i, '')}
                          </div>
                      </div>
                      <p className="text-muted-foreground mt-3 text-base whitespace-pre-line leading-relaxed font-medium">{note.content}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {hasAchievements && (
        <div className="space-y-6">
           <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
              <h3 className="font-bold mb-6 flex items-center gap-2 text-foreground uppercase text-base tracking-[0.1em]">
                  <Trophy className="h-5 w-5 text-yellow-500" /> Achievements
              </h3>
              <div className="space-y-4">
                 {map.achievements.map((ach: any, idx: number) => (
                   <div key={idx} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-yellow-500/30 transition-colors group/ach">
                      <div className={`h-11 w-11 shrink-0 rounded-lg flex items-center justify-center font-bold text-lg ${
                        ach.type === 'gold' ? 'bg-yellow-500/10 text-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'bg-amber-500/10 text-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      }`}>
                        {ach.rank}
                      </div>
                      <span className="text-sm font-bold uppercase tracking-tight leading-tight group-hover/ach:text-yellow-600 transition-colors">{ach.title}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  )
}