"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Star, Play, ChevronRight, ChevronLeft, Copy, Check, Flame, Info } from "lucide-react"
import { motion, useAnimation } from "framer-motion"

// 🎯 BƯỚC 1: IMPORT KHO CHUNG - CHÌA KHÓA ĐỂ ĐỒNG BỘ 100%
import { mapDetails } from "@/app/maps/data"

const DIFFICULTY_MAP = {
  1: "Siêu Dễ",
  2: "Dễ",
  3: "Trung Bình",
  4: "Khó",
  5: "Siêu Khó",
  6: "Ác Mộng"
}

// 🎯 BƯỚC 2: TỰ ĐỘNG LỌC & CHUẨN HÓA DỮ LIỆU TỪ KHO CHUNG
const FEATURED_LIST = Object.entries(mapDetails)
  .map(([key, data]: [string, any]) => {
    // Chuẩn hóa "1 người" thành "Solo" cho đồng bộ UI
    const normalizedPlayers = data.teamType === "1 người" ? "Solo" : (data.teamType || "Tự do");
    
    return {
      id: key, 
      name: data.name,
      type: data.mode || "Chưa phân loại",
      players: normalizedPlayers,
      favourite: data.likes || "0",
      difficulty: data.difficulty || 3, // Lấy đúng số từ file lẻ của ní
      shortCode: data.shortCode || "#000000",
      image: data.banner || "/map-cover/Banner Chưa có.png", 
      featured: data.featured || false
    };
  })
  .filter(map => map.featured); // Chỉ lấy những map ní đánh dấu là nổi bật

export function FeaturedMaps() {
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const controlsLeft = useAnimation()
  const controlsRight = useAnimation()

  useEffect(() => {
    setMounted(true)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth, scrollWidth } = scrollContainerRef.current

      if (direction === 'left') {
        if (scrollLeft <= 15) {
          controlsLeft.start({
            x: [0, -10, 10, -8, 8, -5, 5, 0],
            transition: { duration: 0.4, ease: "easeInOut" }
          })
        } else {
          scrollContainerRef.current.scrollTo({
            left: scrollLeft - clientWidth / 2,
            behavior: 'smooth'
          })
        }
      } else {
        if (Math.ceil(scrollLeft + clientWidth) >= scrollWidth - 15) {
          controlsRight.start({
            x: [0, 10, -10, 8, -8, 5, -5, 0],
            transition: { duration: 0.4, ease: "easeInOut" }
          })
        } else {
          scrollContainerRef.current.scrollTo({
            left: scrollLeft + clientWidth / 2,
            behavior: 'smooth'
          })
        }
      }
    }
  }

  const handleCopy = (e: React.MouseEvent, code: string, id: string) => {
    e.stopPropagation() 
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handlePlayNow = (e: React.MouseEvent, code: string) => {
    e.stopPropagation() 
    const cleanCode = code.replace("#", "")
    window.open(`https://c.freefiremobile.com/?m=1E441${cleanCode}`, "_blank")
  }

  if (!mounted) return null

  return (
    <section id="popular-maps" className="relative py-8 md:py-12 group select-none">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="outline" className="mb-3 border-yellow-500/50 text-yellow-600 bg-yellow-500/10 font-bold uppercase tracking-widest">
              Explore Maps
            </Badge>
            <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl uppercase">
              Bản đồ nổi bật
            </h2>
            <p className="mt-2 text-muted-foreground md:text-lg">
              Khám phá các bản đồ nổi bật nhất đến từ đội ngũ Tuglar Craftland
            </p>
          </div>
          <Button 
            onClick={() => router.push('/maps')}
            variant="ghost" 
            className="gap-2 self-start md:self-auto font-bold uppercase text-xs tracking-widest hover:text-yellow-600 hover:bg-yellow-500/10 transition-colors"
          >
            Xem toàn bộ map
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* --- CAROUSEL --- */}
        <div className="relative">
          
          {/* Nút Điều Hướng */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 group-hover:-left-7 transition-all duration-500 hidden md:block">
            <motion.button animate={controlsLeft} onClick={() => scroll('left')} className="h-14 w-14 rounded-full bg-yellow-500 text-black border border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center justify-center hover:bg-yellow-600 transition-colors cursor-pointer">
              <ChevronLeft className="h-8 w-8" />
            </motion.button>
          </div>

          <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 group-hover:-right-7 transition-all duration-500 hidden md:block">
            <motion.button animate={controlsRight} onClick={() => scroll('right')} className="h-14 w-14 rounded-full bg-yellow-500 text-black border border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.3)] flex items-center justify-center hover:bg-yellow-600 transition-colors cursor-pointer">
              <ChevronRight className="h-8 w-8" />
            </motion.button>
          </div>

          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-2 pt-2" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {FEATURED_LIST.map((map) => (
              <div 
                key={map.id} 
                onClick={() => router.push(`/maps/${map.id}`)}
                className="min-w-[85%] md:min-w-[45%] lg:min-w-[32%] shrink-0 snap-start block group/card cursor-pointer"
              >
                <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 rounded-3xl h-full">
                  
                  <div className="relative aspect-[485/220] overflow-hidden">
                    <img 
                      src={map.image} 
                      alt={map.name} 
                      draggable="false"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105 pointer-events-none" 
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full transform translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">
                          <Info className="h-4 w-4 text-white" />
                          <span className="text-white text-[10px] font-bold uppercase tracking-widest">Xem chi tiết</span>
                      </div>
                    </div>
                    
                    <div className="absolute left-3 top-3 z-10">
                      <Badge variant="secondary" className="bg-black/60 text-white border-white/10 backdrop-blur-md text-[10px] font-medium uppercase">
                        {map.type}
                      </Badge>
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-white border border-white/10">
                      <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                      {map.favourite}
                    </div>
                  </div>

                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4">
                      <div>
                        <h3 className="text-lg font-bold tracking-tight flex items-center gap-1.5 group-hover/card:text-yellow-600 transition-colors uppercase">
                          <Flame className="h-6 w-6 text-orange-500 fill-orange-500 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)] transition-all shrink-0" />
                          {map.name}
                        </h3>
                        
                        <div className="mt-1 flex items-center gap-3 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {map.players}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {DIFFICULTY_MAP[map.difficulty as keyof typeof DIFFICULTY_MAP]}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                          <Button 
                            onClick={(e) => handlePlayNow(e, map.shortCode)}
                            className="flex-1 h-10 bg-yellow-500 text-black hover:bg-yellow-600 font-black uppercase text-[11px] rounded-xl transition-all border-none shadow-md shadow-yellow-500/20"
                          >
                              <Play className="mr-2 h-3.5 w-3.5 fill-current" />
                              Chơi
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => handleCopy(e, map.shortCode, map.id)}
                            className="h-10 w-10 shrink-0 rounded-xl border-border/50 hover:border-yellow-500/50 hover:text-yellow-600 hover:bg-yellow-500/10 transition-all active:scale-90 bg-muted/30"
                          >
                            {copiedId === map.id ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}