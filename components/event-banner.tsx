"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Trophy, Users, CheckCircle2 } from "lucide-react"
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

// 🎯 COMPONENT CHÍNH
export function EventBanner({ events }: { events: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Nếu chưa có data thì ẩn component đi
  if (!events || events.length === 0) return null;

  const activeEvent = events[activeIndex];

  return (
    <section id="events" className="relative overflow-hidden pt-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-background to-background" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      
      <div className="container relative mx-auto px-4 py-16 md:py-24">
        
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
          
          {/* CỘT TRÁI: ẢNH + TIẾN ĐỘ + LIST SỰ KIỆN KHÁC */}
          <div className="w-full max-w-2xl lg:w-1/2 flex flex-col gap-6 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEvent.id}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative aspect-video overflow-hidden rounded-3xl border border-yellow-500/30 bg-card shadow-2xl shadow-yellow-500/10 group"
              >
                <div className="absolute inset-0 bg-muted/50" />
                <img 
                  src={activeEvent.image} 
                  alt={activeEvent.title} 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                
                <div className="absolute left-4 top-4">
                  <Badge className={`${activeEvent.status === "Đã kết thúc" ? "bg-muted-foreground text-white" : "bg-destructive text-destructive-foreground"} border-none shadow-lg px-3 py-1 text-xs font-bold uppercase tracking-wider`}>
                    {activeEvent.status === "Đang diễn ra" && (
                      <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-current inline-block" />
                    )}
                    {activeEvent.status}
                  </Badge>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* 🎯 THANH TIẾN ĐỘ SỰ KIỆN */}
            {activeEvent.milestones?.length > 0 && (
              <div className="w-full p-6 bg-muted/20 rounded-3xl border border-yellow-500/20 backdrop-blur-md">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 text-center">
                  Lộ trình sự kiện
                </h3>
                <div className="relative flex justify-between items-start px-4">
                  {/* Đường line nền (Tối) */}
                  <div className="absolute top-4 left-6 right-6 h-1.5 bg-slate-800 rounded-full" />
                  
                  {/* Đường line chạy tiến độ (Sáng) - Đang set cứng 50% làm mẫu UI */}
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "50%" }} 
                    className="absolute top-4 left-6 h-1.5 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full z-10 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                  >
                     <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] w-full animate-[pulse_2s_infinite]" />
                  </motion.div>

                  {/* Render các Node */}
                  {activeEvent.milestones.map((ms: any, idx: number) => {
                    // Giả lập logic: mốc 0 và 1 đã qua, các mốc sau chưa tới
                    const isPassed = idx <= 1; 
                    
                    return (
                      <div key={idx} className="relative z-20 flex flex-col items-center gap-2 w-16">
                        <div className={`h-8 w-8 rounded-full border-4 flex items-center justify-center transition-all shadow-lg
                          ${isPassed ? 'bg-yellow-500 border-yellow-200' : 'bg-slate-900 border-slate-700'}`}
                        >
                          {isPassed ? <CheckCircle2 className="h-4 w-4 text-black" /> : <div className="h-2 w-2 bg-slate-500 rounded-full" />}
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-[10px] font-black text-foreground leading-none">{ms.date}</p>
                          <p className={`text-[9px] font-bold uppercase ${isPassed ? 'text-yellow-500' : 'text-muted-foreground'}`}>{ms.label}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* BOX CHỌN SỰ KIỆN KHÁC */}
            <div className="w-full">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Các sự kiện khác
              </h3>
              
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {events.map((event, index) => {
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
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <p className={`text-[10px] font-bold line-clamp-2 transition-colors ${isActive ? 'text-yellow-400' : 'text-white'}`}>
                          {event.title.replace('\n', ' ')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-yellow-500/20 blur-3xl -z-10" />
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-amber-500/20 blur-2xl -z-10" />
          </div>
          
          {/* CỘT PHẢI: THÔNG TIN CHI TIẾT */}
          <div className="flex w-full flex-col gap-6 lg:w-1/2 flex-1 relative z-10">
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
                  <h1 className="whitespace-pre-line text-balance text-3xl font-bold leading-[1.25] md:text-4xl lg:text-5xl uppercase">
                    {activeEvent.title}
                  </h1>
                  <p className="mt-4 text-pretty text-muted-foreground md:text-lg leading-relaxed">
                    {activeEvent.description}
                  </p>
                </div>
                
                <div className={`grid grid-cols-2 gap-4 ${activeEvent.status === "Đã kết thúc" ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
                  
                  <div className="flex flex-col justify-center rounded-2xl border border-yellow-500/20 bg-muted/20 p-3 hover:border-yellow-500/50 transition-colors overflow-hidden">
                    <Trophy className="mb-1.5 h-4 w-4 text-yellow-500" />
                    <p className="whitespace-nowrap text-[clamp(1rem,4vw,1.5rem)] font-bold text-foreground leading-none">
                      {activeEvent.prize}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {activeEvent.prizeUnit || "Kim cương"}
                    </p>
                  </div>
                  
                  <div className="flex flex-col justify-center rounded-2xl border border-yellow-500/20 bg-muted/20 p-3 hover:border-yellow-500/50 transition-colors overflow-hidden">
                    <Users className="mb-1.5 h-4 w-4 text-yellow-500" />
                    <p className="whitespace-nowrap text-[clamp(1rem,4vw,1.5rem)] font-bold text-foreground leading-none">
                      {activeEvent.participants}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tham gia</p>
                  </div>

                  <div className="flex flex-col justify-center rounded-2xl border border-yellow-500/20 bg-muted/20 p-3 hover:border-yellow-500/50 transition-colors overflow-hidden">
                    <Calendar className="mb-1.5 h-4 w-4 text-yellow-500 shrink-0" />
                    <p className="whitespace-nowrap text-[clamp(0.8rem,3vw,1.1rem)] font-bold text-foreground leading-none tracking-tighter">
                      {activeEvent.date}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Thời gian</p>
                  </div>

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
                      {activeEvent.actionText || "Tham gia ngay"}
                    </Button>
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}