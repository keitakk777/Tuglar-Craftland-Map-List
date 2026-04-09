"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Map } from "lucide-react"
import { motion } from "framer-motion"

interface TeamItem {
  name: string;
  logo: string;
  mapCount: number;
}

interface TeamCarouselProps {
  title: string;
  icon?: React.ReactNode;
  teams: TeamItem[];
}

export function TeamCarousel({ title, icon, teams }: TeamCarouselProps) {
  const router = useRouter()
  const carouselRef = useRef<HTMLDivElement>(null)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [shakeLeft, setShakeLeft] = useState(false)
  const [shakeRight, setShakeRight] = useState(false)

  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
    }
  }

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [teams]);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const { clientWidth } = carouselRef.current;

    if (direction === "left") {
      if (!canScrollLeft) {
        setShakeLeft(true);
        setTimeout(() => setShakeLeft(false), 400);
      } else {
        carouselRef.current.scrollBy({ left: -(clientWidth + 16), behavior: "smooth" });
      }
    } else {
      if (!canScrollRight) {
        setShakeRight(true);
        setTimeout(() => setShakeRight(false), 400);
      } else {
        carouselRef.current.scrollBy({ left: clientWidth + 16, behavior: "smooth" });
      }
    }
  }

  if (!teams || teams.length === 0) return null;

  return (
    <section className="relative w-full py-6 group/section">
      {/* 🎯 HEADER */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-foreground">
          {icon}
          {title}
        </h2>
        
        {/* 🎯 NÚT CUỘN */}
        <div className="hidden md:flex items-center gap-2">
          <motion.div animate={shakeLeft ? { x: [-5, 5, -5, 5, 0] } : {}} transition={{ duration: 0.3 }}>
            <Button variant="outline" size="icon" onClick={() => scroll("left")} className={`h-9 w-9 rounded-full border-border/50 transition-all ${!canScrollLeft ? 'opacity-50 cursor-not-allowed bg-muted/20' : 'hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-500'}`}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div animate={shakeRight ? { x: [-5, 5, -5, 5, 0] } : {}} transition={{ duration: 0.3 }}>
            <Button variant="outline" size="icon" onClick={() => scroll("right")} className={`h-9 w-9 rounded-full border-border/50 transition-all ${!canScrollRight ? 'opacity-50 cursor-not-allowed bg-muted/20' : 'hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-500'}`}>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* 🎯 VÙNG CUỘN NGANG (SLOT THẺ DỌC) */}
      <div className="px-4 md:px-8">
        <div 
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {teams.map((team) => (
            <div 
              key={team.name} 
              onClick={() => router.push(`/maps`)} 
              // 🎯 Vẫn giữ tỷ lệ chia slot như cũ để không bị quá to
              className="snap-start shrink-0 cursor-pointer group/card w-[45vw] sm:w-[calc(25%-12px)] lg:w-[calc(16.666%-13.5px)]"
            >
              {/* 🎯 BỎ aspect-square ở đây đi để thẻ tự động kéo dài thành hình dọc */}
              <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md transition-all duration-500 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 rounded-2xl h-full flex flex-col">
                
                {/* 🎯 Khu vực Logo Avatar (Set chuẩn Hình Vuông) */}
                <div className="relative w-full aspect-square overflow-hidden bg-black/10 border-b border-border/20">
                   <img 
                     src={team.logo} 
                     alt={team.name} 
                     // object-cover giúp ảnh lấp đầy khung vuông mà không bị méo
                     className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110 z-10" 
                     // 🎯 Đã cập nhật ảnh lỗi thành Avatar của Tuglar
                     onError={(e) => { e.currentTarget.src = "/team-avatar/tuglar craftland avt.jpg" }}
                   />
                </div>

                {/* Khu vực Tên và Số lượng Map */}
                <div className="p-4 bg-background/50 flex flex-col items-center justify-center gap-1.5 flex-1">
                  <h3 className="text-sm font-black text-center line-clamp-2 w-full group-hover/card:text-yellow-500 transition-colors uppercase tracking-tight">
                    {team.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-auto pt-1">
                     <Map className="h-3 w-3 text-yellow-500/60" /> {team.mapCount} Map
                  </div>
                </div>

              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}