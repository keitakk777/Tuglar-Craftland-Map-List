"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Star, Flame, Play, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion" // 🎯 Import framer-motion để làm hiệu ứng Rung

interface MapItem {
  id: string;
  name: string;
  image: string;
  displayType: string;
  displayPlayers: string;
  favourite: string;
  difficulty: number;
  featured?: boolean;
}

interface MapCarouselProps {
  title: string;
  icon?: React.ReactNode;
  maps: MapItem[];
}

const DIFFICULTY_MAP: Record<number, string> = {
  1: "Siêu Dễ", 2: "Dễ", 3: "Trung Bình", 4: "Khó", 5: "Siêu Khó", 6: "Ác Mộng"
}

export function MapCarousel({ title, icon, maps }: MapCarouselProps) {
  const router = useRouter()
  const carouselRef = useRef<HTMLDivElement>(null)

  // 🎯 STATES: Theo dõi vị trí cuộn và trạng thái Rung
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [shakeLeft, setShakeLeft] = useState(false)
  const [shakeRight, setShakeRight] = useState(false)

  // Hàm kiểm tra xem đã cuộn tới sát lề chưa
  const checkScroll = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 5);
    }
  }

  // Lắng nghe sự kiện cuộn để cập nhật trạng thái
  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [maps]);

  // Hàm xử lý bấm nút cuộn hoặc Rung
  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const { clientWidth } = carouselRef.current;

    if (direction === "left") {
      if (!canScrollLeft) {
        // Hết cỡ bên trái -> Kích hoạt Rung
        setShakeLeft(true);
        setTimeout(() => setShakeLeft(false), 400);
      } else {
        // Trượt nguyên 1 khung màn hình (Cộng thêm 16px là độ rộng của khe hở gap-4)
        carouselRef.current.scrollBy({ left: -(clientWidth + 16), behavior: "smooth" });
      }
    } else {
      if (!canScrollRight) {
        // Hết cỡ bên phải -> Kích hoạt Rung
        setShakeRight(true);
        setTimeout(() => setShakeRight(false), 400);
      } else {
        carouselRef.current.scrollBy({ left: clientWidth + 16, behavior: "smooth" });
      }
    }
  }

  if (!maps || maps.length === 0) return null;

  return (
    <section className="relative w-full py-6 group/section">
      {/* 🎯 HEADER */}
      <div className="flex items-center justify-between mb-4 px-4 md:px-8">
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-foreground">
          {icon}
          {title}
        </h2>
        
        {/* 🎯 NÚT CUỘN (TRÒN KIỂU CŨ) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Mũi tên TRÁI */}
          <motion.div animate={shakeLeft ? { x: [-5, 5, -5, 5, 0] } : {}} transition={{ duration: 0.3 }}>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => scroll("left")} 
              className={`h-9 w-9 rounded-full border-border/50 transition-all
                ${!canScrollLeft ? 'opacity-50 cursor-not-allowed bg-muted/20' : 'hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-500'}
              `}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </motion.div>

          {/* Mũi tên PHẢI */}
          <motion.div animate={shakeRight ? { x: [-5, 5, -5, 5, 0] } : {}} transition={{ duration: 0.3 }}>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => scroll("right")} 
              className={`h-9 w-9 rounded-full border-border/50 transition-all
                ${!canScrollRight ? 'opacity-50 cursor-not-allowed bg-muted/20' : 'hover:bg-yellow-500/10 hover:border-yellow-500/50 hover:text-yellow-500'}
              `}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </div>

      {/* 🎯 VÙNG CUỘN NGANG (SWIMLANE) - ĐÃ FIX KHUNG VUÔNG VỨC */}
      <div className="px-4 md:px-8">
        <div 
          ref={carouselRef}
          onScroll={checkScroll} // Lắng nghe lúc người dùng vuốt tay trên mobile
          className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {maps.map((map) => (
            <div 
              key={map.id} 
              onClick={() => router.push(`/maps/${map.id}`)}
              // 🎯 CSS CHIA SLOT: Mobile (1 card), Tablet (2 card), PC (Đúng 4 card)
              className="snap-start shrink-0 cursor-pointer group/card w-[85vw] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)]"
            >
              <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md transition-all duration-500 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 rounded-2xl h-full flex flex-col">
                
                <div className="relative aspect-[485/220] overflow-hidden shrink-0">
                  <img src={map.image} alt={map.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                  <div className="absolute left-2 top-2"><Badge className="bg-black/70 backdrop-blur-md text-white text-[8px] font-bold uppercase border-none px-2 py-0.5">{map.displayType}</Badge></div>
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md px-2 py-1 text-[9px] font-bold text-white border border-white/10">
                    <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />{map.favourite}
                  </div>
                </div>

                <CardContent className="p-4 flex flex-col flex-1 justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold tracking-tight flex items-center gap-1.5 group-hover/card:text-yellow-500 transition-colors uppercase">
                      {map.featured && <Flame className="h-4 w-4 text-orange-500 fill-orange-500 shrink-0" />}
                      <span className="line-clamp-1">{map.name}</span>
                    </h3>
                    <div className="mt-1.5 flex items-center gap-3 text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3 text-yellow-500/50" />{map.displayPlayers}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-yellow-500/50" />{DIFFICULTY_MAP[map.difficulty] || "Trung Bình"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}