"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Crown, X, Info } from "lucide-react" 

// 🎯 DATA: Đã cộng thêm 1 Win và 113 KC cho 3 người (Đinh Đức Hải, Tống Văn Nam, Trần Việt Thắng)
const RAW_LEADERBOARD = [
  { name: "Đinh Đức Hải", diamonds: 263, wins: 8 }, 
  { name: "Tống Văn Nam", diamonds: 263, wins: 7 }, 
  { name: "Trần Đăng Minh", diamonds: 100, wins: 5 }, 
  { name: "Lý Quốc Bảo", diamonds: 100, wins: 5 }, 
  { name: "Nguyễn Hữu Thuận", diamonds: 150, wins: 4 }, 
  { name: "Nguyễn Quang Ninh", diamonds: 100, wins: 4 }, 
  { name: "Phạm Hoàng Hiệp", diamonds: 100, wins: 4 }, 
  { name: "Phạm Văn Chuyên", diamonds: 50, wins: 4 }, 
  { name: "Trần Việt Thắng", diamonds: 163, wins: 5 }, // Tăng vọt lên 163 KC, 5 Win
  { name: "Lê Gia Nghĩa", diamonds: 50, wins: 3 }, 
  { name: "Lương Cao Thái", diamonds: 100, wins: 2 }, 
  { name: "Lê Nguyễn Bảo My", diamonds: 100, wins: 2 }, 
  { name: "Đỗ Lê Duy", diamonds: 0, wins: 2 }, 
  { name: "Lò Văn Đạt", diamonds: 50, wins: 1 },
  { name: "Huỳnh Nguyễn", diamonds: 50, wins: 1 },
  { name: "Hoài Ân", diamonds: 50, wins: 1 },
  { name: "Bùi Doãn Việt Hùng", diamonds: 0, wins: 1 }, 
]

export function Leaderboard() {
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false)
  const [sortBy, setSortBy] = useState<"diamonds" | "wins">("diamonds")

  const rankedLeaderboard = useMemo(() => {
    const sorted = [...RAW_LEADERBOARD].sort((a, b) => {
      if (sortBy === "diamonds") {
        if (b.diamonds !== a.diamonds) return b.diamonds - a.diamonds;
        return b.wins - a.wins; 
      } else {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return b.diamonds - a.diamonds; 
      }
    });

    let currentRank = 1;
    return sorted.map((player, index) => {
      if (index > 0) {
        const prev = sorted[index - 1];
        if (sortBy === "diamonds") {
          if (player.diamonds < prev.diamonds || player.wins < prev.wins) {
            currentRank = index + 1; 
          }
        } else {
          if (player.wins < prev.wins || player.diamonds < prev.diamonds) {
            currentRank = index + 1;
          }
        }
      }
      return { ...player, rank: currentRank };
    });
  }, [sortBy]); 

  const top5Players = rankedLeaderboard.slice(0, 5);

  const SortToggle = () => (
    <div className="flex w-full bg-muted/30 p-1 rounded-xl border border-border/30 shadow-inner">
      <button
        onClick={() => setSortBy("diamonds")}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${
          sortBy === "diamonds" 
            ? "bg-background text-yellow-600 shadow-sm border border-border/50" 
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <img src="/icon/kc.png" className={`h-3 w-3 ${sortBy !== "diamonds" && "opacity-50 grayscale"}`} alt="kc" /> 
        Kim Cương
      </button>
      <button
        onClick={() => setSortBy("wins")}
        className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${
          sortBy === "wins" 
            ? "bg-background text-yellow-500 shadow-sm border border-border/50" 
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <Crown className={`h-3 w-3 ${sortBy !== "wins" ? "text-muted-foreground" : "text-yellow-500"}`} /> Trận Win
      </button>
    </div>
  );

  return (
    <>
      <Card className="border-border shadow-xl border-t-4 border-t-yellow-500 overflow-hidden bg-card flex flex-col transition-all duration-300 rounded-2xl">
        <CardHeader className="pb-4 pt-6 border-b border-border/20 bg-background/50 flex flex-row items-center justify-between gap-4 px-6 relative z-20">
          <div className="flex items-center gap-3">
             <Trophy className="h-5 w-5 shrink-0 text-yellow-500/80" /> 
             <span className="text-xl font-black text-foreground tracking-tight">BXH Custom</span>
          </div>
          <Button 
            onClick={() => setShowFullLeaderboard(true)} 
            className="font-black text-[11px] uppercase tracking-widest bg-yellow-500 text-yellow-950 hover:bg-yellow-600 transition-all rounded-full h-8 px-4 shrink-0 shadow-md shadow-yellow-500/20 active:scale-95"
          >
            Xem thêm
          </Button>
        </CardHeader>
        
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="px-6 pt-4 pb-2">
            <SortToggle />
          </div>

          <div className="flex flex-col flex-1">
            {top5Players.map((player, index) => (
              <div key={index} className={`flex items-center justify-between p-4 border-b border-border/20 hover:bg-muted/50 transition-colors px-6 ${player.rank === 1 ? 'bg-yellow-50 dark:bg-yellow-500/10' : ''}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-sm shrink-0 ${player.rank === 1 ? 'bg-yellow-400 text-yellow-950' : player.rank === 2 ? 'bg-slate-300 text-slate-800' : player.rank === 3 ? 'bg-amber-600 text-amber-50' : 'bg-muted text-muted-foreground'}`}>
                    {player.rank === 1 ? <Crown className="h-4 w-4" /> : player.rank}
                  </div>
                  <div className="overflow-hidden">
                    <div className={`font-bold text-sm uppercase truncate ${player.rank === 1 ? 'text-yellow-600 dark:text-yellow-500' : 'text-foreground'}`}>
                      {player.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                      {sortBy === "diamonds" ? (
                        <>{player.wins} Trận Win</>
                      ) : (
                        <>{player.diamonds} Kim Cương <img src="/icon/kc.png" className="h-2.5 w-2.5 opacity-50 grayscale" alt="kc" /></>
                      )}
                    </div>
                  </div>
                </div>

                {sortBy === "diamonds" ? (
                  <div className="flex items-center gap-1.5 font-black text-cyan-700 dark:text-cyan-300 bg-cyan-100/50 dark:bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-200 dark:border-cyan-500/20 shrink-0 min-w-[70px] justify-center shadow-inner shadow-cyan-500/10">
                    {player.diamonds} 
                    <img src="/icon/kc.png" alt="KC" className="h-4 w-4 object-contain drop-shadow-sm" onError={(e) => { e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/753/753064.png" }} />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 font-black text-yellow-800 dark:text-yellow-200 bg-yellow-100/50 dark:bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-200 dark:border-yellow-500/30 shrink-0 min-w-[70px] justify-center shadow-inner shadow-yellow-500/20">
                    {player.wins} Trận
                    <Crown className="h-4 w-4 text-yellow-500 drop-shadow-sm" /> 
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="p-3 bg-muted/30 flex items-center gap-2 px-6 mt-auto">
            <Info className="h-3 w-3 text-muted-foreground shrink-0" />
            <span className="text-[10px] font-bold text-muted-foreground italic uppercase tracking-tighter">
              * Số Win tính toàn bộ Q1. Kim Cương tính từ 14/03
            </span>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showFullLeaderboard && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFullLeaderboard(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[85vh]">
              
              <div className="flex items-center justify-between p-5 border-b border-border bg-background/50 px-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2.5 font-black text-lg uppercase text-foreground tracking-tight">
                    <Trophy className="h-6 w-6 text-yellow-500/80" /> Toàn bộ BXH Custom
                  </div>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5 ml-8">
                    * Số Win tính toàn bộ Q1. Kim Cương tính từ 14/03
                  </span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted/80" onClick={() => setShowFullLeaderboard(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>

              <div className="px-6 py-4 bg-background/95 backdrop-blur-sm border-b border-border/20 sticky top-0 z-10">
                <SortToggle />
              </div>

              <div className="overflow-y-auto p-0 custom-scrollbar flex-1 bg-card">
                {rankedLeaderboard.map((player, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 border-b border-border/20 hover:bg-muted/50 transition-colors px-6 ${player.rank === 1 ? 'bg-yellow-50 dark:bg-yellow-500/10' : ''}`}>
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-sm shrink-0 ${player.rank === 1 ? 'bg-yellow-400 text-yellow-950' : player.rank === 2 ? 'bg-slate-300 text-slate-800' : player.rank === 3 ? 'bg-amber-600 text-amber-50' : 'bg-muted text-muted-foreground'}`}>
                        {player.rank === 1 ? <Crown className="h-4 w-4" /> : player.rank}
                      </div>
                      <div className="overflow-hidden">
                        <div className={`font-bold text-sm uppercase truncate ${player.rank === 1 ? 'text-yellow-600 dark:text-yellow-500' : 'text-foreground'}`}>
                          {player.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-bold flex items-center gap-1">
                          {sortBy === "diamonds" ? (
                            <>{player.wins} Trận Win</>
                          ) : (
                            <>{player.diamonds} Kim Cương <img src="/icon/kc.png" className="h-2.5 w-2.5 opacity-50 grayscale" alt="kc" /></>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {sortBy === "diamonds" ? (
                      <div className="flex items-center gap-1.5 font-black text-cyan-700 dark:text-cyan-300 bg-cyan-100/50 dark:bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-200 dark:border-cyan-500/20 shrink-0 min-w-[70px] justify-center shadow-inner shadow-cyan-500/10">
                        {player.diamonds} 
                        <img src="/icon/kc.png" alt="KC" className="h-4 w-4 object-contain drop-shadow-sm" onError={(e) => { e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/753/753064.png" }} />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 font-black text-yellow-800 dark:text-yellow-200 bg-yellow-100/50 dark:bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-200 dark:border-yellow-500/30 shrink-0 min-w-[70px] justify-center shadow-inner shadow-yellow-500/20">
                        {player.wins} Trận
                        <Crown className="h-4 w-4 text-yellow-500 drop-shadow-sm" /> 
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}