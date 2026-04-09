"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, UserCheck, Calendar } from "lucide-react"

// 🎯 DATA: Đã lược bỏ trường icon cho gọn
const SCHEDULE_DATA = [
  {
    id: "match-4",
    date: "04/04",
    name: "TsunamiRush",
    reward: 250,
    winners: ["Lê Gia Nghĩa", "Trần Việt Thắng", "Nguyễn Hữu Thuận", "Đinh Đức Hải", "Lý Quốc Bảo", "Lương Cao Thái"]
  },
  {
    id: "match-3",
    date: "28/03",
    name: "Tập Luyện",
    reward: 250,
    winners: ["Lý Quốc Bảo", "Lương Cao Thái", "Trần Đăng Minh", "Hoài Ân", "Lê Nguyễn Bảo My", "Tống Văn Nam"]
  },
  {
    id: "match-2",
    date: "21/03",
    name: "Headshot-Arena",
    reward: 250,
    winners: ["Nguyễn Hữu Thuận", "Huỳnh Nguyễn", "Phạm Văn Chuyên", "Phạm Hoàng Hiệp", "Nguyễn Quang Ninh"]
  },
  {
    id: "match-1",
    date: "14/03",
    name: "Tử Chiến Random",
    reward: 250,
    winners: ["Trần Đăng Minh", "Nguyễn Quang Ninh", "Tống Văn Nam", "Đinh Đức Hải", "Lò Văn Đạt"]
  }
]

export function CustomSchedule() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMatch, setSelectedMatch] = useState(SCHEDULE_DATA[0]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - 300 : scrollLeft + 300;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-black uppercase tracking-tight">Hành Trình Custom</h2>
        </div>
        
        <div className="flex gap-1.5">
          <Button onClick={() => scroll("left")} variant="outline" size="icon" className="h-8 w-8 rounded-full border-muted/50 hover:bg-yellow-500 hover:text-black transition-all">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button onClick={() => scroll("right")} variant="outline" size="icon" className="h-8 w-8 rounded-full border-muted/50 hover:bg-yellow-500 hover:text-black transition-all">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative py-4 bg-muted/5 rounded-2xl border border-border/40">
        
        {/* Đường nối xuyên tâm */}
        <div className="absolute top-[63px] left-0 right-0 h-[2px] bg-muted/30 z-0 overflow-hidden">
          <div 
            className="absolute inset-0 w-full h-full" 
            style={{ 
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, rgba(234, 179, 8, 0.4) 10px, rgba(234, 179, 8, 0.4) 20px)' 
            }} 
          />
        </div>

        <div ref={scrollRef} className="flex gap-12 overflow-x-auto no-scrollbar px-10 relative z-10 snap-x">
          {SCHEDULE_DATA.map((match) => (
            <div key={match.id} className="flex flex-col items-center snap-center shrink-0 w-32 group">
              <span className={`h-5 text-[10px] font-black mb-2 flex items-end transition-colors ${selectedMatch.id === match.id ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                {match.date}
              </span>

              {/* 🎯 Nút tròn Node: Dùng 1 ảnh duy nhất cho tất cả */}
              <button 
                onClick={() => setSelectedMatch(match)}
                className={`relative w-10 h-10 rounded-full border-4 transition-all duration-300 flex items-center justify-center z-10 overflow-hidden
                  ${selectedMatch.id === match.id 
                    ? 'bg-yellow-500 border-yellow-200 dark:border-yellow-900 shadow-[0_0_15px_rgba(234,179,8,0.4)] scale-110' 
                    : 'bg-background border-muted hover:border-yellow-500/50'}`}
              >
                <img 
                  src="/icon/icon craftland 1.png" // 🎯 Chỉ cần đổi tên file ảnh duy nhất ở đây
                  alt="match-icon" 
                  className={`h-5 w-5 object-contain transition-all duration-300
                    ${selectedMatch.id === match.id 
                      ? 'brightness-0 contrast-200 scale-110' 
                      : 'opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0'
                    }`}
                />
              </button>

              <span className={`mt-3 text-[9px] font-black uppercase text-center transition-opacity leading-tight h-6 flex items-start ${selectedMatch.id === match.id ? 'opacity-100 text-yellow-500' : 'opacity-40 group-hover:opacity-100'}`}>
                {match.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* KẾT QUẢ CHI TIẾT */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedMatch.id}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="bg-card border border-border shadow-xl rounded-2xl overflow-hidden p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4 mb-4">
            <h3 className="text-xl font-black uppercase text-yellow-500">{selectedMatch.name}</h3>
            <Badge className="w-fit bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 py-1 px-3 rounded-lg font-black uppercase text-xs flex items-center gap-2">
              Thưởng: {selectedMatch.reward} 
              <img src="/icon/kc.png" className="w-4 h-4 object-contain" alt="kc" />
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {selectedMatch.winners.map((winner, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[11px] font-bold text-foreground/90 bg-muted/20 p-2 rounded-xl border border-border/50">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                {winner}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}