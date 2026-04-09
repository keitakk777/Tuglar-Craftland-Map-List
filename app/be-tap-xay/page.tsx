import { Badge } from "@/components/ui/badge"
import { Leaderboard } from "./components/leaderboard"
import { CustomSchedule } from "./components/custom-schedule"

export default function BeTapXayPage() {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16 px-4"> {/* 🎯 Tăng pt-16 lên pt-20 để không bị Navbar che mất Badge */}
      {/* Background Layer */}
      <div className="fixed inset-0 bg-background -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent -z-10" />

      {/* 🎯 Container chính */}
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start relative">
          
          {/* CỘT TRÁI: BXH Custom */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 z-[60] transition-all duration-300">
            <Leaderboard />
          </div>

          {/* 🎯 CỘT PHẢI: Đã gỡ bỏ translate-y tổng thể để tránh bị che */}
          <div className="lg:col-span-2 space-y-10 flex flex-col pt-0"> 
            
            {/* 🎯 Cụm tiêu đề: Dùng lg:-mt-1 (khoảng -4px) để cái Badge "hít" lên bằng lề vàng */}
            <div className="space-y-4 lg:-mt-1"> 
              <div className="flex">
                <Badge className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-none px-2 py-0.5 text-[9px] font-black uppercase tracking-widest leading-none shadow-sm shadow-blue-500/5">
                  Sân Chơi Cộng Đồng
                </Badge>
              </div>

              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-blue-500 dark:text-cyan-400 drop-shadow-sm leading-none">
                Bé Tập Xây
              </h1>

              <p className="text-[11px] md:text-sm text-muted-foreground font-medium max-w-2xl leading-relaxed">
                Nơi diễn ra các giải đấu Custom Craftland rực lửa mỗi dịp cuối tuần. Tham gia giao lưu, thể hiện kỹ năng và có cơ hội nhận Kim Cương! 💎
              </p>
            </div>

            {/* SECTION LỊCH CUSTOM */}
            <div className="pt-2 border-t border-border/40">
              <CustomSchedule />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}