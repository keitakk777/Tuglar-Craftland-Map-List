"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// Đã thêm ChevronLeft, ChevronRight và Info vào import
import { MapPin, Users, Star, Play, ChevronRight, ChevronLeft, Copy, Check, Flame, Info } from "lucide-react"

const DIFFICULTY_MAP = {
  1: "Siêu Dễ",
  2: "Dễ",
  3: "Trung Bình",
  4: "Khó",
  5: "Siêu Khó",
  6: "Ác Mộng"
}

const maps = [
  {
    id: 1,
    name: "Lưu Trữ Xanh",
    type: "Nhập vai",
    players: "Solo | Multiplayer",
    favourite: "59.7K",
    difficulty: 2,
    shortCode: "#K25M81",
    image: "/map-cover/long-sensei/Cover-Luu-Tru-Xanh-v2.6.jpg",
    featured: true, 
  },
  {
    id: 2,
    name: "Trận Chiến Đá Bóng",
    type: "Đá Bóng",
    players: "5v5",
    favourite: "953",
    difficulty: 3,
    shortCode: "#1A00E4",
    image: "/map-cover/huy-le/Banner Soccer.jpg",
    featured: false,
  },
  {
    id: 3,
    name: "Desert Storm",
    type: "Open World",
    players: "10v10",
    favourite: 4.9,
    difficulty: 2,
    shortCode: "#EXAMPLE",
    image: "from-blue-500/40 via-blue-500/20 to-background",
    featured: true,
  },
  {
    id: 4,
    name: "Map Thử Nghiệm",
    type: "Parkour",
    players: "Solo",
    favourite: "1.2K",
    difficulty: 4,
    shortCode: "#TEST01",
    image: "/map-cover/huy-le/Banner Soccer.jpg",
    featured: false,
  }
]

export function FeaturedMaps() {
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2
      
      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      })
    }
  }

  const handleCopy = (e: React.MouseEvent, code: string, id: number) => {
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
    <section id="maps" className="relative py-8 md:py-12 group">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/50 text-primary">
              Explore Maps
            </Badge>
            <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl uppercase">
              Bản đồ nổi bật
            </h2>
            <p className="mt-2 text-muted-foreground md:text-lg">
              Khám phá các bản đồ nổi bật nhất đến từ đội ngũ Tuglar Craftland
            </p>
          </div>
          <Button variant="ghost" className="gap-2 self-start md:self-auto font-bold uppercase text-xs tracking-widest">
            Xem toàn bộ map
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* --- CAROUSEL VỚI NÚT MÀU ĐEN SIÊU RÕ --- */}
        <div className="relative">
          {/* Nút TRÁI */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-30 h-14 w-14 rounded-full 
                       bg-white/20 backdrop-blur-md border border-white/40 shadow-xl 
                       opacity-0 group-hover:opacity-100 group-hover:-left-7 transition-all duration-500 
                       hidden md:flex hover:bg-white/40"
          >
            <ChevronLeft className="h-8 w-8 text-black" />
          </Button>

          {/* Nút PHẢI */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('right')}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-30 h-14 w-14 rounded-full 
                       bg-white/20 backdrop-blur-md border border-white/40 shadow-xl 
                       opacity-0 group-hover:opacity-100 group-hover:-right-7 transition-all duration-500 
                       hidden md:flex hover:bg-white/40"
          >
            <ChevronRight className="h-8 w-8 text-black" />
          </Button>

          <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 px-2" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {maps.map((map) => (
              <div 
                key={map.id} 
                onClick={() => router.push(`/maps/${map.id}`)}
                className="min-w-[85%] md:min-w-[45%] lg:min-w-[32%] shrink-0 snap-start block group/card cursor-pointer"
              >
                <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 rounded-3xl h-full">
                  
                  {/* Map Image Area */}
                  <div className={`relative aspect-[485/220] overflow-hidden ${!map.image.startsWith('/') ? `bg-gradient-to-br ${map.image}` : 'bg-muted'}`}>
                    {map.image.startsWith('/') ? (
                      <img 
                        src={map.image} 
                        alt={map.name} 
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105" 
                      />
                    ) : (
                      /* Nếu không có ảnh, hiện gradient như code cũ của bạn */
                      <div className={`absolute inset-0 bg-gradient-to-br ${map.image}`} />
                    )}

                    {/* Hiệu ứng hover hiện Xem chi tiết */}
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
                        {/* Ngọn lửa đứng trước tên map */}
                        <h3 className="text-lg font-bold tracking-tight flex items-center gap-1.5 group-hover/card:text-primary transition-colors uppercase">
                          {map.featured && (
                            <Flame className="h-6 w-6 text-orange-500 fill-orange-500 dark:text-amber-400 dark:fill-amber-400 drop-shadow-[0_0_8px_rgba(251,146,60,0.5)] dark:drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] transition-all shrink-0" />
                          )}
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
                            className="flex-1 h-10 bg-primary/10 text-primary hover:bg-primary hover:text-white font-black uppercase text-[11px] rounded-xl transition-all border border-primary/20"
                          >
                              <Play className="mr-2 h-3.5 w-3.5 fill-current" />
                              Chơi
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => handleCopy(e, map.shortCode, map.id)}
                            className="h-10 w-10 shrink-0 rounded-xl border-border/50 hover:border-primary/50 hover:text-primary transition-all active:scale-90 bg-muted/30"
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