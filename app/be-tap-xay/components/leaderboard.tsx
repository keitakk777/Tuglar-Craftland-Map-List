"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card" // 🎯 Bỏ CardTitle vì mình tự build title mới
import { Button } from "@/components/ui/button"
import { Trophy, Crown, X } from "lucide-react" // 🎯 Bỏ icon Gem cũ, bỏ ArrowRight cũ

// DATA BẢNG XẾP HẠNG (Giữ nguyên)
const RAW_LEADERBOARD = [
  { name: "Trần Đăng Minh", diamonds: 100, wins: 2 },
  { name: "Nguyễn Quang Ninh", diamonds: 100, wins: 2 },
  { name: "Tống Văn Nam", diamonds: 100, wins: 2 },
  { name: "Đinh Đức Hải", diamonds: 100, wins: 2 },
  { name: "Nguyễn Hữu Thuận", diamonds: 100, wins: 2 },
  { name: "Lý Quốc Bảo", diamonds: 100, wins: 2 },
  { name: "Lương Cao Thái", diamonds: 100, wins: 2 },
  { name: "Lò Văn Đạt", diamonds: 50, wins: 1 },
  { name: "Huỳnh Nguyễn", diamonds: 50, wins: 1 },
  { name: "Phạm Văn Chuyên", diamonds: 50, wins: 1 },
  { name: "Phạm Hoàng Hiệp", diamonds: 50, wins: 1 },
  { name: "Hoài Ân", diamonds: 50, wins: 1 },
  { name: "Lê Nguyễn Bảo My", diamonds: 50, wins: 1 },
  { name: "Lê Gia Nghĩa", diamonds: 50, wins: 1 },
  { name: "Trần Việt Thắng", diamonds: 50, wins: 1 },
]

export function Leaderboard() {
  const [showFullLeaderboard, setShowFullLeaderboard] = useState(false)

  const rankedLeaderboard = useMemo(() => {
    const sorted = [...RAW_LEADERBOARD].sort((a, b) => {
      if (b.diamonds !== a.diamonds) return b.diamonds - a.diamonds;
      return b.wins - a.wins;
    });

    let currentRank = 1;
    return sorted.map((player, index) => {
      if (index > 0) {
        const prev = sorted[index - 1];
        if (player.diamonds < prev.diamonds || player.wins < prev.wins) {
          currentRank = index + 1; 
        }
      }
      return { ...player, rank: currentRank };
    });
  }, []);

  const top5Players = rankedLeaderboard.slice(0, 5);

  return (
    <>
      <Card className="border-border shadow-xl border-t-4 border-t-yellow-500 overflow-hidden bg-card flex flex-col transition-all duration-300 rounded-2xl">
        
        {/* 🎯 HEADER MỚI: Đã dọn dẹp màu xám, đổi Title, nút vàng rực rỡ */}
        <CardHeader className="pb-5 pt-6 border-b border-border/20 bg-background/50 flex flex-row items-center justify-between gap-4 px-6">
          
          {/* 🎯 Cụm Title mới: Trông tinh tế hơn nhiều */}
          <div className="flex items-center gap-3">
             {/* Icon Cup vàng nhỏ lại 1 chút và đổi màu mờ hơn để title nổi bật */}
             <Trophy className="h-5 w-5 shrink-0 text-yellow-500/80" /> 
             {/* Title mới: "BXH Custom", viết hoa chữ cái đầu, font đậm nhưng không thô */}
             <span className="text-xl font-black text-foreground tracking-tight">
                BXH Custom
             </span>
          </div>

          {/* 🎯 Nút "Xem thêm" MỚI: Fill màu vàng rực rỡ, bo tròn cực xịn */}
          <Button 
            onClick={() => setShowFullLeaderboard(true)} 
            className="font-black text-[11px] uppercase tracking-widest bg-yellow-500 text-yellow-950 hover:bg-yellow-600 transition-all rounded-full h-8 px-4 shrink-0 shadow-md shadow-yellow-500/20 active:scale-95"
          >
            Xem thêm
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="flex flex-col">
            {top5Players.map((player, index) => (
              <div key={index} className={`flex items-center justify-between p-4 border-b border-border/20 hover:bg-muted/50 transition-colors px-6 ${player.rank === 1 ? 'bg-yellow-50 dark:bg-yellow-500/10' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-sm shrink-0 ${player.rank === 1 ? 'bg-yellow-400 text-yellow-950' : player.rank === 2 ? 'bg-slate-300 text-slate-800' : player.rank === 3 ? 'bg-amber-600 text-amber-50' : 'bg-muted text-muted-foreground'}`}>
                    {player.rank === 1 ? <Crown className="h-4 w-4" /> : player.rank}
                  </div>
                  <div className="overflow-hidden">
                    <div className={`font-bold text-sm uppercase truncate ${player.rank === 1 ? 'text-yellow-600 dark:text-yellow-500' : 'text-foreground'}`}>
                      {player.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground font-bold">
                      {player.wins} Trận Win
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 font-black text-cyan-700 dark:text-cyan-300 bg-cyan-100/50 dark:bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-200 dark:border-cyan-500/20 shrink-0">
                  {player.diamonds} 
                  <img src="/icon/kc.png" alt="KC" className="h-4 w-4 object-contain drop-shadow-sm" onError={(e) => { e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/753/753064.png" }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MODAL POP-UP (Cũng được dọn màu Header cho đồng bộ) */}
      <AnimatePresence>
        {showFullLeaderboard && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowFullLeaderboard(false)} className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[85vh]">
              {/* HEADER MODAL: Cũng được dọn sạch màu xám */}
              <div className="flex items-center justify-between p-5 border-b border-border bg-background/50 px-6">
                <div className="flex items-center gap-2.5 font-black text-lg uppercase text-foreground tracking-tight">
                  <Trophy className="h-6 w-6 text-yellow-500/80" /> Toàn bộ BXH Kim Cương
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-muted/80" onClick={() => setShowFullLeaderboard(false)}>
                  <X className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
              <div className="overflow-y-auto p-0 custom-scrollbar flex-1 bg-card">
                {rankedLeaderboard.map((player, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 border-b border-border/20 hover:bg-muted/50 transition-colors px-6 ${player.rank === 1 ? 'bg-yellow-50 dark:bg-yellow-500/10' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shadow-sm shrink-0 ${player.rank === 1 ? 'bg-yellow-400 text-yellow-950' : player.rank === 2 ? 'bg-slate-300 text-slate-800' : player.rank === 3 ? 'bg-amber-600 text-amber-50' : 'bg-muted text-muted-foreground'}`}>
                        {player.rank === 1 ? <Crown className="h-4 w-4" /> : player.rank}
                      </div>
                      <div className="overflow-hidden">
                        <div className={`font-bold text-sm uppercase truncate ${player.rank === 1 ? 'text-yellow-600 dark:text-yellow-500' : 'text-foreground'}`}>
                          {player.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-bold">
                          {player.wins} Trận Win
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 font-black text-cyan-700 dark:text-cyan-300 bg-cyan-100/50 dark:bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-200 dark:border-cyan-500/20 shrink-0">
                      {player.diamonds} 
                      <img src="/icon/kc.png" alt="KC" className="h-4 w-4 object-contain drop-shadow-sm" onError={(e) => { e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/753/753064.png" }} />
                    </div>
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