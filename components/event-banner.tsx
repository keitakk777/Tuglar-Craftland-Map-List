"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Trophy, Users, PlayCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// 🎯 COMPONENT NHỎ CHUYÊN ĐỂ ĐẾM NGƯỢC THỜI GIAN
const CountdownTimer = ({ targetDate }: { targetDate?: string }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!targetDate) {
      setTimeLeft("0h");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("00:00:00");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        setTimeLeft(`${days} ngày ${hours}h`);
      } else {
        const h = String(hours).padStart(2, '0');
        const m = String(minutes).padStart(2, '0');
        const s = String(seconds).padStart(2, '0');
        setTimeLeft(`${h}:${m}:${s}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return <span className="opacity-0">00:00:00</span>;
  // 🎯 Đã giảm size chữ ở đây để nó luôn nằm trên 1 dòng
  return <span className="tabular-nums text-lg md:text-xl">{timeLeft}</span>; 
};

// --- DỮ LIỆU MẪU SỰ KIỆN ---
const EVENTS_DATA = [
  {
    id: 1,
    tag: "Kiến Trúc Sư",
    title: "KTS Tháng 4:\nCao Thủ Vũ Khí",
    description: "Tháng 4 này, Craftland mang đến thử thách mới dành cho các kiến trúc sư tài năng: thiết kế map xoay quanh chủ đề vũ khí – sáng tạo những đấu trường, khu huấn luyện hoặc chế độ chơi độc đáo.",
    image: "/banner-homepage/kts-thang3.webp",
    status: "Đang diễn ra",
    statusColor: "bg-destructive text-destructive-foreground",
    prize: "6000",
    prizeUnit: "Kim cương",
    participants: "128",
    date: "Từ 1/4 - 20/4", 
    endTime: "2026-04-20T23:59:59", 
    actionText: "Tham gia ngay",
    actionLink: "https://www.facebook.com/groups/craftlandvn/posts/26933664449572676", // 🎯 Link theo yêu cầu
    hasLiveStream: false // 🎯 Không có livestream
  },
  {
    id: 2,
    tag: "Giải Đấu",
    title: "Tuglar Championship Mùa 1",
    description: "Giải đấu sinh tồn khắc nghiệt nhất dành riêng cho các thành viên Tuglar. Hãy chứng tỏ bản lĩnh, lập team chiến đấu và giành lấy vinh quang cùng tổng giải thưởng cực khủng!",
    image: "/banner-homepage/kts-thang3.webp", 
    status: "Sắp tới",
    statusColor: "bg-blue-600 text-white",
    prize: "20.000",
    prizeUnit: "Kim cương",
    participants: "64/100",
    date: "Từ 15.5 đến 20.5",
    endTime: "2026-05-15T00:00:00", 
    actionText: "Đăng ký sớm",
    actionLink: "https://www.facebook.com/groups/craftlandvn/",
    hasLiveStream: true // Có livestream
  },
  {
    id: 3, 
    tag: "Cuộc thi",
    title: "Anh Trai Xây Map\n2025",
    description: "Giải đấu trải qua 2 vòng thi đầy kịch tính, nơi các kiến trúc sư tranh tài để thiết kế những bản đồ đỉnh cao nhất. Các map xuất sắc sẽ được 'Anh Trai' đích thân lựa chọn để quảng bá rộng rãi trong cộng đồng Craftland.",
    image: "/banner-homepage/banner-anh-trai-xay-map-2025.jpg",
    status: "Đã kết thúc",
    statusColor: "bg-muted-foreground text-white",
    prize: "260.000",
    prizeUnit: "VNĐ", 
    participants: "8",
    date: "Từ 1.9.2025 đến 30.9.2025",
    endTime: "", 
    actionText: "Xem kết quả",
    actionLink: "https://www.facebook.com/tuglar.craftland/posts/pfbid0FYxWm1cCiqnbRUdm1XHLDZn6S1RdYjdkEw9SM38WYGUUwYTZbWfzDjFK269kVgQ7l",
    hasLiveStream: false // 🎯 Không có livestream
  },
  {
    id: 4,
    tag: "Minigame",
    title: "Đua Xe Bắn Súng Đỉnh Cao",
    description: "Trải nghiệm cảm giác mạnh với map đua xe kết hợp bắn súng. Tốc độ và độ chuẩn xác là chìa khóa chiến thắng. Cạnh tranh trên bảng xếp hạng để nhận kim cương mỗi tuần.",
    image: "/banner-homepage/kts-thang3.webp", 
    status: "Đang diễn ra",
    statusColor: "bg-destructive text-destructive-foreground",
    prize: "2000",
    prizeUnit: "Kim cương",
    participants: "85",
    date: "Từ 5.4 đến 12.4",
    endTime: "2026-04-12T23:59:59", 
    actionText: "Tham gia ngay",
    actionLink: "https://www.facebook.com/groups/craftlandvn/",
    hasLiveStream: true // Có livestream
  }
]

export function EventBanner() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeEvent = EVENTS_DATA[activeIndex]

  return (
    <section id="events" className="relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-background to-background" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      
      <div className="container relative mx-auto px-4 py-16 md:py-24">
        
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
          
          <div className="w-full max-w-2xl lg:w-1/2 flex flex-col gap-6 relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEvent.id}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative aspect-video overflow-hidden rounded-3xl border border-yellow-500/30 bg-card shadow-2xl shadow-yellow-500/10 group z-10"
              >
                <div className="absolute inset-0 bg-muted/50" />
                <img 
                  src={activeEvent.image} 
                  alt={activeEvent.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                
                <div className="absolute left-4 top-4">
                  <Badge className={`${activeEvent.statusColor} border-none shadow-lg px-3 py-1 text-xs font-bold uppercase tracking-wider`}>
                    {activeEvent.status === "Đang diễn ra" && (
                      <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-current inline-block" />
                    )}
                    {activeEvent.status}
                  </Badge>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="w-full z-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Các sự kiện khác
              </h3>
              
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {EVENTS_DATA.map((event, index) => {
                  const isActive = activeIndex === index;
                  return (
                    <div 
                      key={event.id}
                      onClick={() => setActiveIndex(index)}
                      className={`relative aspect-[16/9] cursor-pointer overflow-hidden rounded-xl transition-all duration-300 group
                        ${isActive 
                          ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                          : 'border border-border/50 hover:border-yellow-500/50 opacity-60 hover:opacity-100'
                        }
                      `}
                    >
                      <div className="absolute inset-0 bg-muted/50" />
                      <img 
                        src={event.image} 
                        alt={event.title} 
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} 
                      />
                      
                      <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-black/10' : 'bg-black/40 group-hover:bg-black/20'}`} />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <p className={`text-xs font-bold line-clamp-1 transition-colors ${isActive ? 'text-yellow-400' : 'text-white'}`}>
                          {event.title}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-yellow-500/20 blur-3xl" />
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-amber-500/20 blur-2xl" />
          </div>
          
          <div className="flex w-full flex-col gap-6 lg:w-1/2 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEvent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-6"
              >
                <div>
                  <Badge variant="outline" className="mb-4 border-yellow-500/50 text-yellow-600 bg-yellow-500/10 font-bold uppercase tracking-widest">
                    {activeEvent.tag}
                  </Badge>
                  {/* leading-[1.1] sẽ giúp khoảng cách dòng vừa đủ đẹp, không quá xa cũng không quá dít */}
                    <h1 className="text-balance text-3xl font-bold leading-[1.1] md:text-4xl lg:text-5xl md:leading-[1.1] uppercase">
                    {activeEvent.title}
                  </h1>
                  <p className="mt-4 text-pretty text-muted-foreground md:text-lg leading-relaxed">
                    {activeEvent.description}
                  </p>
                </div>
                
                <div className={`grid grid-cols-2 gap-4 ${activeEvent.status === "Đã kết thúc" ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
                  
                  {/* BOX 1: Giải thưởng */}
                  <div className="rounded-2xl border border-yellow-500/20 bg-muted/20 p-4 hover:border-yellow-500/50 transition-colors flex flex-col justify-center">
                    <Trophy className="h-5 w-5 text-yellow-500 mb-2" />
                    <p className="text-xl md:text-2xl font-bold text-foreground leading-tight">{activeEvent.prize}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                      {activeEvent.prizeUnit || "Kim cương"}
                    </p>
                  </div>
                  
                  {/* BOX 2: Tham gia */}
                  <div className="rounded-2xl border border-yellow-500/20 bg-muted/20 p-4 hover:border-yellow-500/50 transition-colors flex flex-col justify-center">
                    <Users className="h-5 w-5 text-yellow-500 mb-2" />
                    <p className="text-xl md:text-2xl font-bold text-foreground leading-tight">{activeEvent.participants}</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Tham gia</p>
                  </div>

                  {/* BOX 3: Thời gian */}
                  <div className="rounded-2xl border border-yellow-500/20 bg-muted/20 p-4 hover:border-yellow-500/50 transition-colors flex flex-col justify-center">
                    <Calendar className="h-5 w-5 text-yellow-500 mb-2 shrink-0" />
                    <p className="text-base md:text-lg font-bold text-foreground leading-tight break-words">
                      {activeEvent.date}
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Thời gian</p>
                  </div>

                  {/* BOX 4: Còn lại (SỬ DỤNG COMPONENT ĐẾM NGƯỢC) */}
                  {activeEvent.status !== "Đã kết thúc" && (
                    <div className="rounded-2xl border border-yellow-500/20 bg-muted/20 p-4 hover:border-yellow-500/50 transition-colors flex flex-col justify-center">
                      <Clock className="h-5 w-5 text-yellow-500 mb-2" />
                      <p className="font-bold text-foreground leading-tight">
                        <CountdownTimer targetDate={activeEvent.endTime} />
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-1">Còn lại</p>
                    </div>
                  )}
                </div>
                
                {/* 🎯 CỤM NÚT BẤM (Đã sửa Link và điều kiện hiển thị Watch Live) */}
                <div className="flex flex-wrap gap-3 mt-2">
                  <a href={activeEvent.actionLink} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold uppercase tracking-wider rounded-xl h-12 px-8 shadow-md shadow-yellow-500/20">
                      {activeEvent.actionText}
                    </Button>
                  </a>
                  
                  {activeEvent.hasLiveStream && (
                    <Button size="lg" variant="outline" className="gap-2 border-border/50 hover:bg-muted/50 hover:text-yellow-600 font-bold uppercase tracking-wider rounded-xl h-12">
                      <PlayCircle className="h-4 w-4" />
                      Watch Live
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}