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
  return <span className="tabular-nums whitespace-nowrap text-[clamp(0.875rem,3vw,1.25rem)] font-bold leading-none">{timeLeft}</span>; 
};

// --- DỮ LIỆU MẪU SỰ KIỆN ---
const EVENTS_DATA = [
  {
    id: 1,
    tag: "Cuộc thi",
    title: "KTS Tháng 4:\nCao Thủ Vũ Khí",
    description: "Tháng 4 này, Craftland mang đến thử thách mới dành cho các kiến trúc sư tài năng: thiết kế map xoay quanh chủ đề vũ khí – sáng tạo những đấu trường, khu huấn luyện hoặc chế độ chơi độc đáo.",
    image: "/banner-homepage/kts thang 4.jpg",
    status: "Đang diễn ra",
    statusColor: "bg-destructive text-destructive-foreground",
    prize: "6000",
    prizeUnit: "Kim cương",
    participants: "128",
    date: "1/4 - 20/4", 
    endTime: "2026-04-20T23:59:59", 
    actionText: "Tham gia ngay",
    actionLink: "https://www.facebook.com/groups/craftlandvn/posts/26933664449572676", 
    hasLiveStream: false 
  },
  {
    id: 2,
    tag: "Cuộc thi",
    title: "KTS Tháng 3:\nBùng nổ thể thao",
    description: "Tháng 3 này, Craftland mời bạn thử sức sáng tạo với chủ đề Các môn thể thao. Hãy xây dựng những sân thi đấu, khu thể thao hoặc không gian giải trí năng động để người chơi có thể trải nghiệm và giao lưu trong thế giới Craftland!",
    image: "/banner-homepage/kts-thang3.webp",
    status: "Đã kết thúc",
    statusColor: "bg-muted-foreground text-white",
    prize: "4900",
    prizeUnit: "Kim cương",
    participants: "22",
    date: "11.3 - 29.3", 
    endTime: "", 
    actionText: "Đang chờ kết quả",
    actionLink: "https://www.facebook.com/share/p/1CNYeQ7MxT/", 
    hasLiveStream: false 
  },
  {
    id: 3,
    tag: "Giải đấu",
    title: "Đại Chiến Bo Cuối",
    description: "Cơ hội để những tổ đội phối hợp tác chiến và những tay súng tìm kiếm đồng đội mới đã đến! Giải đấu Đại Chiến Bo Cuối với chính thức lộ diện. Bạn đã sẵn sàng chưa?",
    image: "/banner-homepage/dai chien bo cuoi.jpg", 
    status: "Đã kết thúc",
    statusColor: "bg-muted-foreground text-white",
    prize: "66",
    prizeUnit: "Vé quay Chế tác",
    participants: "24",
    date: "20-21.12.2025", 
    endTime: "", 
    actionText: "Xem kết quả",
    actionLink: "https://www.facebook.com/share/p/1DXfXuV8Wk/",
    hasLiveStream: true,
    liveStreamLink: "https://www.youtube.com/watch?v=s7wM6JZ7BKI&t=3986s", 
  },
  {
   id: 4, 
    tag: "Cuộc thi",
    title: "Anh Trai Xây Map\n2025",
    description: "Giải đấu trải qua 2 vòng thi đầy kịch tính, nơi các kiến trúc sư tranh tài để thiết kế những bản đồ đỉnh cao nhất. Các map xuất sắc sẽ được 'Anh Trai' đích thân lựa chọn để quảng bá rộng rãi trong cộng đồng Craftland.",
    image: "/banner-homepage/banner-anh-trai-xay-map-2025.jpg",
    status: "Đã kết thúc",
    statusColor: "bg-muted-foreground text-white",
    prize: "260.000",
    prizeUnit: "VNĐ", 
    participants: "8",
    date: "1-30.9.2025", 
    endTime: "", 
    actionText: "Xem kết quả",
    actionLink: "https://www.facebook.com/tuglar.craftland/posts/pfbid0FYxWm1cCiqnbRUdm1XHLDZn6S1RdYjdkEw9SM38WYGUUwYTZbWfzDjFK269kVgQ7l",
    hasLiveStream: false  
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
                  {/* 🎯 Đã sửa leading-[1.1] thành leading-[1.25] để khoảng cách dòng giãn ra, hết bị cắn dấu */}
                  <h1 className="whitespace-pre-line text-balance text-3xl font-bold leading-[1.25] md:text-4xl lg:text-5xl uppercase">
                    {activeEvent.title}
                  </h1>
                  <p className="mt-4 text-pretty text-muted-foreground md:text-lg leading-relaxed">
                    {activeEvent.description}
                  </p>
                </div>
                
                <div className={`grid grid-cols-2 gap-4 ${activeEvent.status === "Đã kết thúc" ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
                  
                  {/* BOX 1: Giải thưởng */}
                  <div className="flex flex-col justify-center rounded-2xl border border-yellow-500/20 bg-muted/20 p-3 hover:border-yellow-500/50 transition-colors overflow-hidden">
                    <Trophy className="mb-1.5 h-4 w-4 text-yellow-500" />
                    <p className="whitespace-nowrap text-[clamp(1rem,4vw,1.5rem)] font-bold text-foreground leading-none">
                      {activeEvent.prize}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {activeEvent.prizeUnit || "Kim cương"}
                    </p>
                  </div>
                  
                  {/* BOX 2: Tham gia */}
                  <div className="flex flex-col justify-center rounded-2xl border border-yellow-500/20 bg-muted/20 p-3 hover:border-yellow-500/50 transition-colors overflow-hidden">
                    <Users className="mb-1.5 h-4 w-4 text-yellow-500" />
                    <p className="whitespace-nowrap text-[clamp(1rem,4vw,1.5rem)] font-bold text-foreground leading-none">
                      {activeEvent.participants}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tham gia</p>
                  </div>

                  {/* BOX 3: Thời gian */}
                  <div className="flex flex-col justify-center rounded-2xl border border-yellow-500/20 bg-muted/20 p-3 hover:border-yellow-500/50 transition-colors overflow-hidden">
                    <Calendar className="mb-1.5 h-4 w-4 text-yellow-500 shrink-0" />
                    <p className="whitespace-nowrap text-[clamp(0.8rem,3vw,1.1rem)] font-bold text-foreground leading-none tracking-tighter">
                      {activeEvent.date}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Thời gian</p>
                  </div>

                  {/* BOX 4: Còn lại */}
                  {activeEvent.status !== "Đã kết thúc" && (
                    <div className="flex flex-col justify-center rounded-2xl border border-yellow-500/20 bg-muted/20 p-3 hover:border-yellow-500/50 transition-colors overflow-hidden">
                      <Clock className="mb-1.5 h-4 w-4 text-yellow-500" />
                      <div className="leading-none">
                        <CountdownTimer targetDate={activeEvent.endTime} />
                      </div>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Còn lại</p>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 mt-2">
                  <a href={activeEvent.actionLink} target="_blank" rel="noopener noreferrer">
                    <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold uppercase tracking-wider rounded-xl h-12 px-8 shadow-md shadow-yellow-500/20">
                      {activeEvent.actionText}
                    </Button>
                  </a>
                  
                  {/* 🎯 ĐÃ BỌC THẺ A VÀO NÚT WATCH LIVE */}
                  {activeEvent.hasLiveStream && activeEvent.liveStreamLink && (
                    <a href={activeEvent.liveStreamLink} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" variant="outline" className="gap-2 border-border/50 hover:bg-muted/50 hover:text-yellow-600 font-bold uppercase tracking-wider rounded-xl h-12">
                        <PlayCircle className="h-4 w-4" />
                        Watch Live
                      </Button>
                    </a>
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