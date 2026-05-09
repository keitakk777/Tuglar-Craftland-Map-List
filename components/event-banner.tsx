"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Trophy, Users, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
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

      if (days > 0) setTimeLeft(`${days} ngày ${hours}h`);
      else setTimeLeft(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return <span className="opacity-0">00:00:00</span>;
  return <span className="tabular-nums whitespace-nowrap">{timeLeft}</span>; 
};

export function EventBanner({ events = [] }: { events?: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState("0%");
  const [passedNodes, setPassedNodes] = useState<boolean[]>([]);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  if (!events || !Array.isArray(events) || events.length === 0) return null;
  const activeEvent = events[activeIndex];
  if (!activeEvent) return null;

  useEffect(() => {
    if (!activeEvent.milestones || activeEvent.milestones.length === 0) return;
    const calculateProgress = () => {
      const current = new Date();
      const eventYear = activeEvent.endTime ? new Date(activeEvent.endTime).getFullYear() : current.getFullYear();
      const totalNodes = activeEvent.milestones.length;
      const parsed = activeEvent.milestones.map((ms: any, index: number) => {
        const parts = ms.date.split('-');
        const [day, month] = parts[0].split('/');
        const startDate = new Date(eventYear, parseInt(month) - 1, parseInt(day));
        return { start: startDate.getTime(), percent: totalNodes > 1 ? (index / (totalNodes - 1)) * 100 : 100 };
      });
      const currTime = current.getTime();
      setPassedNodes(parsed.map((p: any) => currTime >= p.start));

      if (currTime < parsed[0].start) { setProgressWidth("0%"); return; }
      if (currTime >= parsed[totalNodes - 1].start) { setProgressWidth("100%"); return; }

      for (let i = 0; i < totalNodes - 1; i++) {
        if (currTime >= parsed[i].start && currTime < parsed[i+1].start) {
          const currentPercent = parsed[i].percent + ((currTime - parsed[i].start) / (parsed[i+1].start - parsed[i].start) * (parsed[i+1].percent - parsed[i].percent));
          setProgressWidth(`${currentPercent}%`);
          break;
        }
      }
    };
    calculateProgress();
    const timer = setInterval(calculateProgress, 60000); 
    return () => clearInterval(timer);
  }, [activeEvent]);

  return (
    <section id="events" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-background to-background" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      
      <div className="container relative mx-auto px-4 pb-12 pt-1 md:pt-8">
        
        {/* HEADER MOBILE: Đã fix khoảng cách Pill & Tiêu đề */}
        <div className="block lg:hidden mb-5 text-center">
            <Badge variant="outline" className="mb-4 border-yellow-500/50 text-yellow-600 bg-yellow-500/10 font-bold uppercase tracking-widest text-[10px]">
              {activeEvent.tag || "Sự kiện"}
            </Badge>
            <h1 className="whitespace-pre-line text-balance text-2xl font-black leading-tight uppercase text-foreground mb-1">
              {activeEvent.title}
            </h1>
            <div className="relative bg-muted/10 p-3 rounded-2xl border border-white/5 text-left mt-3">
              <p className={`text-xs text-muted-foreground whitespace-pre-line transition-all duration-300 leading-relaxed ${!isDescExpanded ? 'line-clamp-3' : ''}`}>
                {activeEvent.description}
              </p>
              <button onClick={() => setIsDescExpanded(!isDescExpanded)} className="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase text-yellow-500">
                {isDescExpanded ? <><ChevronUp className="h-3 w-3" /> Thu gọn</> : <><ChevronDown className="h-3 w-3" /> Xem thêm mô tả</>}
              </button>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">
          
          {/* CỘT TRÁI: BANNER (STATS OVERLAY) + TIẾN ĐỘ */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6 relative z-10 shrink-0">
            <div className="relative aspect-[16/9] md:aspect-video overflow-hidden rounded-3xl border border-yellow-500/30 bg-card shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeEvent.id}
                  src={activeEvent.image || "/placeholder.jpg"} 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt="Banner" 
                />
              </AnimatePresence>
              
              <div className="absolute left-4 top-4">
                <Badge className={`${activeEvent.status === "Đã kết thúc" ? "bg-muted-foreground text-white" : "bg-destructive text-white"} border-none shadow-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider`}>
                  {activeEvent.status}
                </Badge>
              </div>

              {/* STATS OVERLAY: Gradient đen mờ đè lên ảnh banner */}
              <div className="absolute bottom-0 left-0 right-0 p-4 pt-10 bg-gradient-to-t from-black/95 via-black/60 to-transparent">
                <div className="grid grid-cols-4 gap-2">
                   <div className="flex flex-col items-center justify-center text-white">
                      <Trophy className="h-4 w-4 text-yellow-500 mb-1" />
                      <p className="text-[10px] md:text-xs font-black uppercase tracking-tight">{activeEvent.prize}</p>
                      <p className="text-[7px] md:text-[8px] font-bold text-white/50 uppercase">{activeEvent.prizeUnit}</p>
                   </div>
                   <div className="flex flex-col items-center justify-center text-white border-l border-white/10">
                      <Users className="h-4 w-4 text-yellow-500 mb-1" />
                      <p className="text-[10px] md:text-xs font-black uppercase tracking-tight">{activeEvent.participants}</p>
                      <p className="text-[7px] md:text-[8px] font-bold text-white/50 uppercase">Tham gia</p>
                   </div>
                   <div className="flex flex-col items-center justify-center text-white border-l border-white/10">
                      <Calendar className="h-4 w-4 text-yellow-500 mb-1" />
                      <p className="text-[8px] md:text-[10px] font-black uppercase tracking-tighter">{activeEvent.date}</p>
                      <p className="text-[7px] md:text-[8px] font-bold text-white/50 uppercase">Hạn chót</p>
                   </div>
                   <div className="flex flex-col items-center justify-center text-white border-l border-white/10">
                      <Clock className="h-4 w-4 text-yellow-500 mb-1" />
                      <div className="text-[8px] md:text-[10px] font-black uppercase text-yellow-500">
                        <CountdownTimer targetDate={activeEvent.endTime} />
                      </div>
                      <p className="text-[7px] md:text-[8px] font-bold text-white/50 uppercase">Còn lại</p>
                   </div>
                </div>
              </div>
            </div>

            {/* THANH TIẾN ĐỘ */}
            {activeEvent.milestones && activeEvent.milestones.length > 0 && (
              <div className="w-full p-5 bg-muted/20 rounded-3xl border border-white/5 backdrop-blur-md">
                <div className="relative w-full">
                  <div className="absolute top-[13px] left-8 right-8 h-1">
                    <div className="absolute inset-0 bg-slate-800 rounded-full" />
                    <motion.div initial={{ width: 0 }} animate={{ width: progressWidth }} transition={{ duration: 1 }} className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full z-10" />
                  </div>
                  <div className="relative flex justify-between items-start z-20">
                    {activeEvent.milestones.map((ms: any, idx: number) => {
                      const isPassed = passedNodes[idx] || false; 
                      return (
                        <div key={idx} className="flex flex-col items-center gap-2 w-14 md:w-16">
                          <div className={`h-7 w-7 md:h-8 md:w-8 rounded-full border-[3px] flex items-center justify-center transition-all ${isPassed ? 'bg-yellow-500 border-yellow-200' : 'bg-slate-900 border-slate-700'}`}>
                            {isPassed ? <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4 text-black" /> : <div className="h-1.5 w-1.5 bg-slate-500 rounded-full" />}
                          </div>
                          <div className="text-center space-y-0.5">
                            <p className="text-[8px] md:text-[10px] font-black text-foreground whitespace-nowrap">{ms.date}</p>
                            <p className={`text-[7px] md:text-[9px] font-bold uppercase line-clamp-1 ${isPassed ? 'text-yellow-500' : 'text-muted-foreground'}`}>{ms.label}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TOGGLE SỰ KIỆN NHANH (MOBILE) */}
            <div className="block lg:hidden w-full overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
               <div className="flex gap-3">
                {events.map((event, index) => (
                    <div key={event.id || index} onClick={() => setActiveIndex(index)} className={`shrink-0 w-28 aspect-[16/9] relative cursor-pointer overflow-hidden rounded-xl transition-all ${activeIndex === index ? 'ring-2 ring-yellow-500' : 'opacity-40'}`}>
                      <img src={event.image || "/placeholder.jpg"} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                ))}
              </div>
            </div>

            {/* NÚT THAM GIA MOBILE */}
            <div className="block lg:hidden w-full mt-2">
               <a href={activeEvent.actionLink || "#"} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-wider rounded-2xl h-14 shadow-xl">
                    {activeEvent.actionText || "Tham gia ngay"}
                  </Button>
               </a>
            </div>
          </div>
          
          {/* CỘT PHẢI: THÔNG TIN DESKTOP */}
          <div className="hidden lg:flex flex-col lg:w-1/2 flex-1 relative z-10 h-full">
            <div className="w-full flex-1">
              <AnimatePresence mode="wait">
                <motion.div key={activeEvent.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex flex-col gap-6">
                  <div>
                    <Badge variant="outline" className="w-fit border-yellow-500/50 text-yellow-600 bg-yellow-500/10 font-bold uppercase tracking-widest mb-4">{activeEvent.tag || "Sự kiện"}</Badge>
                    <h1 className="whitespace-pre-line text-balance text-4xl font-black leading-tight uppercase mb-2">{activeEvent.title}</h1>
                    <p className="text-pretty text-muted-foreground whitespace-pre-line text-base leading-relaxed mt-4">
                      {activeEvent.description}
                    </p>
                  </div>
                  <div className="mt-4">
                    <a href={activeEvent.actionLink || "#"} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="w-fit min-w-[200px] bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-wider rounded-2xl h-14 px-10 shadow-xl">
                        {activeEvent.actionText || "Tham gia ngay"}
                      </Button>
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* DANH SÁCH SỰ KIỆN KHÁC (DESKTOP) */}
            <div className="w-full shrink-0 pt-8 border-t border-white/5 mt-10">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Các sự kiện khác</h3>
              <div className="flex w-full gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
                {events.map((event, index) => (
                    <div key={event.id || index} onClick={() => setActiveIndex(index)} className={`shrink-0 w-36 aspect-[16/9] relative cursor-pointer overflow-hidden rounded-xl transition-all ${activeIndex === index ? 'ring-2 ring-yellow-500 scale-95' : 'opacity-40 hover:opacity-100'}`}>
                      <img src={event.image || "/placeholder.jpg"} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                        <p className={`text-[9px] font-bold line-clamp-1 ${activeIndex === index ? 'text-yellow-400' : 'text-white'}`}>{event.title?.replace('\n', ' ')}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}