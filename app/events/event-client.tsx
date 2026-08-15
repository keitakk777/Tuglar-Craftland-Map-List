"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Trophy, Users, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { EventBannerData } from "./fetch-banner"

const CountdownTimer = ({ targetDate }: { targetDate?: string }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!targetDate) return setTimeLeft("0h");

    const interval = setInterval(() => {
      const now = new Date().getTime();
      let target = new Date(targetDate.replace(" ", "T")).getTime();
      
      if (isNaN(target)) {
        const parts = targetDate.split(" ");
        if (parts.length >= 1) {
            const dateParts = parts[0].split("/");
            if (dateParts.length === 3) target = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${parts[1] || '00:00:00'}`).getTime();
        }
      }

      const distance = target - now;
      if (distance < 0) {
        clearInterval(interval);
        return setTimeLeft("00:00:00");
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

// Hàm xử lý "chống chết" khi ngày tháng nhập từ Google Sheet có ký tự lạ
const parseDateStr = (str: string, fallbackYear: number) => {
    let dStr = str || "";
    if (dStr.includes('-')) dStr = dStr.split('-')[0].trim();
    if (dStr.includes(' ')) dStr = dStr.split(' ').pop() || dStr;
    dStr = dStr.trim();
    
    // Loại bỏ các chữ cái (VD: 23h59)
    dStr = dStr.replace(/[a-zA-Z]/g, '');

    const parts = dStr.split('/');
    if (parts.length >= 2) {
        const day = parseInt(parts[0]) || 1;
        const month = parseInt(parts[1]) || 1;
        return new Date(fallbackYear, month - 1, day);
    }
    return new Date();
};

export function EventClient({ events = [] }: { events: EventBannerData[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState("0%");
  const [passedNodes, setPassedNodes] = useState<boolean[]>([]);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  if (!events || events.length === 0) return null;
  const activeEvent = events[activeIndex];
  if (!activeEvent) return null;

  useEffect(() => {
    if (!activeEvent.milestones || activeEvent.milestones.length === 0) {
      setProgressWidth("0%"); setPassedNodes([]); return;
    }
    const calculateProgress = () => {
      const current = new Date();
      const currTime = current.getTime();
      const eventYear = activeEvent.endTime ? new Date(activeEvent.endTime.replace(" ", "T")).getFullYear() || current.getFullYear() : current.getFullYear();
      
      const totalNodes = activeEvent.milestones.length;
      const parsed = activeEvent.milestones.map((ms, index) => ({
        start: parseDateStr(ms.date, eventYear).getTime(),
        percent: totalNodes > 1 ? (index / (totalNodes - 1)) * 100 : 100
      }));
      setPassedNodes(parsed.map(p => currTime >= p.start));

      if (currTime < parsed[0].start) return setProgressWidth("0%");
      if (currTime >= parsed[totalNodes - 1].start) return setProgressWidth("100%");

      for (let i = 0; i < totalNodes - 1; i++) {
        if (currTime >= parsed[i].start && currTime < parsed[i+1].start) {
          const currentPercent = parsed[i].percent + ((currTime - parsed[i].start) / (parsed[i+1].start - parsed[i].start) * (parsed[i+1].percent - parsed[i].percent));
          setProgressWidth(`${currentPercent}%`); break;
        }
      }
    };
    calculateProgress();
    const timer = setInterval(calculateProgress, 60000); 
    return () => clearInterval(timer);
  }, [activeEvent]);

  return (
    <section id="events" className="relative overflow-hidden w-full">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-background to-background" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      
      <div className="container relative mx-auto px-4 pb-12 pt-28 md:pt-36">
        
        <div className="block lg:hidden mb-5 text-center">
            <Badge variant="outline" className="mb-4 border-yellow-500/50 text-yellow-600 bg-yellow-500/10 font-bold uppercase tracking-widest text-[10px]">
              {activeEvent.tag || "Sự kiện"}
            </Badge>
            <h1 className="whitespace-pre-line text-balance text-2xl font-black leading-tight uppercase text-foreground mb-1">{activeEvent.title}</h1>
            <div className="relative bg-muted/10 p-3 rounded-2xl border border-white/5 text-left mt-3">
              <p className={`text-xs text-muted-foreground whitespace-pre-line transition-all duration-300 leading-relaxed ${!isDescExpanded ? 'line-clamp-3' : ''}`}>{activeEvent.description}</p>
              <button onClick={() => setIsDescExpanded(!isDescExpanded)} className="mt-2 flex items-center gap-1.5 text-[10px] font-black uppercase text-yellow-500">
                {isDescExpanded ? <><ChevronUp className="h-3 w-3" /> Thu gọn</> : <><ChevronDown className="h-3 w-3" /> Xem thêm mô tả</>}
              </button>
            </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">
          <div className="w-full lg:w-1/2 flex flex-col gap-6 relative z-10 shrink-0">
            <div className="relative aspect-[16/9] md:aspect-video overflow-hidden rounded-3xl border border-yellow-500/30 bg-card shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={activeEvent.id} src={activeEvent.image || "/placeholder.jpg"} 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Banner" 
                />
              </AnimatePresence>
              <div className="absolute left-4 top-4">
                <Badge className={`${activeEvent.status === "Đã kết thúc" ? "bg-muted-foreground text-white" : "bg-destructive text-white"} border-none shadow-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider`}>
                  {activeEvent.status}
                </Badge>
              </div>
            </div>

            {activeEvent.milestones && activeEvent.milestones.length > 0 && (
              <div className="w-full p-5 bg-muted/20 rounded-3xl border border-white/5 backdrop-blur-md">
                <div className="relative w-full">
                  <div className="absolute top-[13px] left-8 right-8 h-1">
                    <div className="absolute inset-0 bg-slate-800 rounded-full" />
                    <motion.div initial={{ width: 0 }} animate={{ width: progressWidth }} transition={{ duration: 1 }} className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full z-10" />
                  </div>
                  <div className="relative flex justify-between items-start z-20">
                    {activeEvent.milestones.map((ms, idx) => {
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

            <div className="block lg:hidden w-full overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden mt-2">
               <div className="flex gap-3">
                {events.map((event, index) => (
                    <div key={event.id || index} onClick={() => setActiveIndex(index)} className={`shrink-0 w-28 aspect-[16/9] relative cursor-pointer overflow-hidden rounded-xl transition-all ${activeIndex === index ? 'ring-2 ring-yellow-500' : 'opacity-40'}`}>
                      <img src={event.image || "/placeholder.jpg"} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                ))}
              </div>
            </div>

            <div className="block lg:hidden w-full mt-2">
               <a href={activeEvent.actionLink || "#"} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-wider rounded-2xl h-14 shadow-xl">{activeEvent.actionText || "Tham gia ngay"}</Button>
               </a>
            </div>
          </div>
          
          <div className="hidden lg:flex flex-col lg:w-1/2 flex-1 relative z-10 h-full">
            <div className="w-full flex-1">
              <AnimatePresence mode="wait">
                <motion.div key={activeEvent.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="flex flex-col gap-6">
                  <div>
                    <Badge variant="outline" className="w-fit border-yellow-500/50 text-yellow-600 bg-yellow-500/10 font-bold uppercase tracking-widest mb-4">{activeEvent.tag || "Sự kiện"}</Badge>
                    <h1 className="whitespace-pre-line text-balance text-4xl font-black leading-tight uppercase mb-2">{activeEvent.title}</h1>
                    <p className="text-pretty text-muted-foreground whitespace-pre-line text-base leading-relaxed mt-4">{activeEvent.description}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 mb-4">
                    <div className="bg-card border border-white/5 p-4 rounded-2xl flex flex-col justify-center gap-1 shadow-sm">
                        <Trophy className="h-5 w-5 text-yellow-500 mb-1" />
                        <p className="text-xl font-black">{activeEvent.prize}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{activeEvent.prizeUnit}</p>
                    </div>
                    <div className="bg-card border border-white/5 p-4 rounded-2xl flex flex-col justify-center gap-1 shadow-sm">
                        <Users className="h-5 w-5 text-orange-500 mb-1" />
                        <p className="text-xl font-black">{activeEvent.participants}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tham gia</p>
                    </div>
                    <div className="bg-card border border-white/5 p-4 rounded-2xl flex flex-col justify-center gap-1 shadow-sm">
                        <Calendar className="h-5 w-5 text-blue-500 mb-1" />
                        <p className="text-sm font-black mt-1 mb-0.5">{activeEvent.date}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Thời gian</p>
                    </div>
                    <div className="bg-card border border-white/5 p-4 rounded-2xl flex flex-col justify-center gap-1 shadow-sm">
                        <Clock className="h-5 w-5 text-red-500 mb-1" />
                        <p className="text-sm font-black text-yellow-500 mt-1 mb-0.5"><CountdownTimer targetDate={activeEvent.endTime} /></p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Còn lại</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <a href={activeEvent.actionLink || "#"} target="_blank" rel="noopener noreferrer">
                      <Button size="lg" className="w-fit min-w-[200px] bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-wider rounded-2xl h-14 px-10 shadow-xl">{activeEvent.actionText || "Tham gia ngay"}</Button>
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

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