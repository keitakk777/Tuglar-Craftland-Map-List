"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Trophy, Users, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

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

export function EventBanner({ events = [] }: { events?: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState("0%");
  const [passedNodes, setPassedNodes] = useState<boolean[]>([]);

  if (!events || !Array.isArray(events) || events.length === 0) return null;
  const activeEvent = events[activeIndex];
  if (!activeEvent) return null;

  useEffect(() => {
    if (!activeEvent.milestones || activeEvent.milestones.length === 0) return;

    const calculateProgress = () => {
      const current = new Date();
      const eventYear = activeEvent.endTime 
        ? new Date(activeEvent.endTime).getFullYear() 
        : current.getFullYear();

      const totalNodes = activeEvent.milestones.length;
      
      const parsed = activeEvent.milestones.map((ms: any, index: number) => {
        const parts = ms.date.split('-');
        const [day, month] = parts[0].split('/');
        const startDate = new Date(eventYear, parseInt(month) - 1, parseInt(day));
        
        return { 
            start: startDate.getTime(), 
            percent: totalNodes > 1 ? (index / (totalNodes - 1)) * 100 : 100 
        };
      });

      const currTime = current.getTime();
      const newPassedNodes = parsed.map((p: any) => currTime >= p.start);
      setPassedNodes(newPassedNodes);

      if (currTime < parsed[0].start) {
        setProgressWidth("0%");
        return;
      }
      if (currTime >= parsed[totalNodes - 1].start) {
        setProgressWidth("100%");
        return;
      }

      for (let i = 0; i < totalNodes - 1; i++) {
        if (currTime >= parsed[i].start && currTime < parsed[i+1].start) {
          const timePassed = currTime - parsed[i].start;
          const timeSegment = parsed[i+1].start - parsed[i].start;
          const timeFraction = timePassed / timeSegment; 
          
          const percentDiff = parsed[i+1].percent - parsed[i].percent;
          const currentPercent = parsed[i].percent + (timeFraction * percentDiff);
          
          setProgressWidth(`${currentPercent}%`);
          break;
        }
      }
    };

    calculateProgress();
    const timer = setInterval(calculateProgress, 60000); 
    return () => clearInterval(timer);
  }, [activeEvent]);

  const descLength = activeEvent.description?.length || 0;
  let descClass = "text-sm md:text-base leading-relaxed line-clamp-3 mt-4"; 
  
  if (descLength > 250) {
    descClass = "text-[10px] md:text-[11px] leading-tight line-clamp-[8] mt-1"; 
  } else if (descLength > 150) {
    descClass = "text-[11px] md:text-xs leading-snug line-clamp-6 mt-2"; 
  } else if (descLength > 80) {
    descClass = "text-xs md:text-sm leading-normal line-clamp-4 mt-3"; 
  }

  return (
    <section id="events" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-background to-background" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      
      <div className="container relative mx-auto px-4 pb-16 pt-4 md:pb-24 md:pt-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* CỘT TRÁI */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 relative z-10 shrink-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEvent.id}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative aspect-[16/9] md:aspect-video overflow-hidden rounded-3xl border border-yellow-500/30 bg-card shadow-2xl shadow-yellow-500/10 group"
              >
                <div className="absolute inset-0 bg-muted/50" />
                <img 
                  src={activeEvent.image || "/placeholder.jpg"} 
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

            {activeEvent.milestones && activeEvent.milestones.length > 0 && (
              <div className="w-full p-6 bg-muted/20 rounded-3xl border border-yellow-500/20 backdrop-blur-md">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 text-center">
                  Lộ trình sự kiện
                </h3>
                <div className="relative w-full">
                  <div className="absolute top-[13px] left-8 right-8 h-1.5">
                    <div className="absolute inset-0 bg-slate-800 rounded-full" />
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: progressWidth }} 
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full z-10 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                    >
                       <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] w-full animate-[pulse_2s_infinite]" />
                    </motion.div>
                  </div>
                  <div className="relative flex justify-between items-start z-20">
                    {activeEvent.milestones.map((ms: any, idx: number) => {
                      const isPassed = passedNodes[idx] || false; 
                      return (
                        <div key={idx} className="flex flex-col items-center gap-2 w-16">
                          <div className={`h-8 w-8 rounded-full border-4 flex items-center justify-center transition-all shadow-lg duration-500
                            ${isPassed ? 'bg-yellow-500 border-yellow-200 scale-110' : 'bg-slate-900 border-slate-700'}`}
                          >
                            {isPassed ? <CheckCircle2 className="h-4 w-4 text-black" /> : <div className="h-2 w-2 bg-slate-500 rounded-full" />}
                          </div>
                          <div className="text-center space-y-1">
                            <p className="text-[10px] font-black text-foreground leading-none">{ms.date}</p>
                            <p className={`text-[9px] font-bold uppercase transition-colors ${isPassed ? 'text-yellow-500' : 'text-muted-foreground'}`}>{ms.label}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
            
            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-yellow-500/20 blur-3xl -z-10" />
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-amber-500/20 blur-2xl -z-10" />
          </div>
          
          {/* CỘT PHẢI */}
          <div className="flex w-full flex-col lg:w-1/2 flex-1 relative z-10">
            
            {/* 🎯 Đã gỡ absolute, thay bằng khóa chiều cao cố định để không bị sập */}
            <div className="w-full h-[470px] sm:h-[420px] md:h-[380px] lg:h-[360px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeEvent.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col gap-5 h-full"
                >
                  <div>
                    <Badge variant="outline" className="mb-4 border-yellow-500/50 text-yellow-600 bg-yellow-500/10 font-bold uppercase tracking-widest">
                      {activeEvent.tag || "Sự kiện"}
                    </Badge>
                    <h1 className="whitespace-pre-line text-balance text-3xl font-bold leading-[1.25] md:text-4xl uppercase">
                      {activeEvent.title}
                    </h1>
                    <p className={`text-pretty text-muted-foreground whitespace-pre-line transition-all duration-300 ${descClass}`}>
                      {activeEvent.description}
                    </p>
                  </div>
                  
                  <div className={`grid grid-cols-2 gap-4 ${activeEvent.status === "Đã kết thúc" ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
                    <div className="flex flex-col justify-center rounded-2xl border border-yellow-500/20 bg-muted/20 p-3 hover:border-yellow-500/50 transition-colors overflow-hidden">
                      <Trophy className="mb-1.5 h-4 w-4 text-yellow-500" />
                      <p className="whitespace-nowrap text-[clamp(1rem,3vw,1.2rem)] font-bold text-foreground leading-none">
                        {activeEvent.prize || "0"}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {activeEvent.prizeUnit || "Giải thưởng"}
                      </p>
                    </div>
                    <div className="flex flex-col justify-center rounded-2xl border border-yellow-500/20 bg-muted/20 p-3 hover:border-yellow-500/50 transition-colors overflow-hidden">
                      <Users className="mb-1.5 h-4 w-4 text-yellow-500" />
                      <p className="whitespace-nowrap text-[clamp(1rem,3vw,1.2rem)] font-bold text-foreground leading-none">
                        {activeEvent.participants || "0"}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tham gia</p>
                    </div>
                    <div className="flex flex-col justify-center rounded-2xl border border-yellow-500/20 bg-muted/20 p-3 hover:border-yellow-500/50 transition-colors overflow-hidden">
                      <Calendar className="mb-1.5 h-4 w-4 text-yellow-500 shrink-0" />
                      <p className="whitespace-nowrap text-[clamp(0.8rem,3vw,1rem)] font-bold text-foreground leading-none tracking-tighter">
                        {activeEvent.date || "Đang cập nhật"}
                      </p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Thời gian</p>
                    </div>
                    {activeEvent.status !== "Đã kết thúc" && activeEvent.endTime && (
                      <div className="flex flex-col justify-center rounded-2xl border border-yellow-500/20 bg-muted/20 p-3 hover:border-yellow-500/50 transition-colors overflow-hidden">
                        <Clock className="mb-1.5 h-4 w-4 text-yellow-500" />
                        <div className="leading-none text-yellow-500">
                          <CountdownTimer targetDate={activeEvent.endTime} />
                        </div>
                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Còn lại</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-1">
                    <a href={activeEvent.actionLink || "#"} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold uppercase tracking-wider rounded-xl h-12 px-8 shadow-md shadow-yellow-500/20 active:scale-95 transition-all">
                        {activeEvent.actionText || "Xem thêm"}
                      </Button>
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 🎯 Bỏ mt-auto, dùng mt-4 để khay sự kiện luôn bám sát đít hộp thông tin */}
            <div className="w-full shrink-0 pt-6 border-t border-border/50 mt-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                Các sự kiện khác
              </h3>
              
              <div className="flex w-full gap-3 overflow-x-auto pb-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                {events.map((event, index) => {
                  const isActive = activeIndex === index;
                  return (
                    <div 
                      key={event.id || index}
                      onClick={() => setActiveIndex(index)}
                      className={`shrink-0 w-32 md:w-36 aspect-[16/9] relative cursor-pointer overflow-hidden rounded-xl transition-all duration-300 snap-start group
                        ${isActive 
                          ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-background shadow-[0_0_15px_rgba(234,179,8,0.3)] scale-95' 
                          : 'border border-border/50 hover:border-yellow-500/50 opacity-60 hover:opacity-100'
                        }
                      `}
                    >
                      <div className="absolute inset-0 bg-muted/50" />
                      <img 
                        src={event.image || "/placeholder.jpg"} 
                        alt={event.title} 
                        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                      />
                      <div className={`absolute inset-0 transition-colors duration-300 ${isActive ? 'bg-black/10' : 'bg-black/50 group-hover:bg-black/30'}`} />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                        <p className={`text-[9px] font-bold line-clamp-1 transition-colors ${isActive ? 'text-yellow-400' : 'text-white'}`}>
                          {event.title?.replace('\n', ' ')}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}