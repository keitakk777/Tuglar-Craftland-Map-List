import { Badge } from "@/components/ui/badge"
import { Leaderboard } from "./components/leaderboard"
import { CustomSchedule } from "./components/custom-schedule"

export default function BeTapXayPage() {
  return (
    <div className="min-h-screen bg-background pt-16 pb-16 px-4">
      {/* Background Layer */}
      <div className="fixed inset-0 bg-background -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent -z-10" />

      {/* 🎯 Container chính: Giữ max-w-6xl để giao diện PC sang trọng */}
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start relative">
          
          {/* 🎯 CỘT TRÁI: BXH Custom (Chiếm 1/3) 
              Đã thêm z-[60] để đảm bảo Pop-up bên trong nó đè lên được 
              tất cả thành phần ở cột phải và thanh Header menu */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 z-[60] transition-all duration-300">
            <Leaderboard />
          </div>

          {/* 🎯 CỘT PHẢI: Bao gồm Header và Lịch (Chiếm 2/3) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* SECTION TIÊU ĐỀ: Căn lề trái để đồng bộ với Lịch bên dưới */}
            <div className="space-y-4 pt-2">
              <Badge className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-none px-4 py-1.5 text-[11px] font-black uppercase tracking-widest shadow-sm shadow-blue-500/10">
                Sân Chơi Cộng Đồng
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-blue-500 dark:text-cyan-400 drop-shadow-sm leading-none">
                Bé Tập Xây
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-medium max-w-2xl leading-relaxed">
                Nơi diễn ra các giải đấu Custom Craftland rực lửa mỗi dịp cuối tuần. Tham gia giao lưu, thể hiện kỹ năng và rinh ngay hàng ngàn Kim Cương! 💎
              </p>
            </div>

            {/* SECTION LỊCH CUSTOM: Nối tiếp ngay bên dưới Header */}
            <div className="pt-2 border-t border-border/40">
              <CustomSchedule />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}