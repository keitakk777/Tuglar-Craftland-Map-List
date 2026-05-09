"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel"
import { Play, Copy, Check, Gamepad2, Users, Flame } from "lucide-react"
import { motion } from "framer-motion"

interface MapCarouselProps {
  title: string
  icon: React.ReactNode
  maps: any[]
}

const ERROR_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23450a0a'/%3E%3Cg transform='translate(364, 140) scale(3)'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='9' cy='9' r='2' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cline x1='3' y1='3' x2='21' y2='21' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Ctext x='50%25' y='280' font-family='sans-serif' font-size='24' font-weight='bold' fill='%23ef4444' text-anchor='middle'%3ETHIẾU ẢNH BANNER%3C/text%3E%3C/svg%3E";

export function MapCarousel({ title, icon, maps }: MapCarouselProps) {
  const router = useRouter()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (e: React.MouseEvent, code: string, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handlePlayNow = (e: React.MouseEvent, code: string) => {
    e.stopPropagation()
    const cleanCode = code.replace("#", "").replace(/FREEFIRE/i, "").trim()
    window.open(`https://c.freefiremobile.com/?m=1E441${cleanCode}`, "_blank")
  }

  return (
    <div className="space-y-6 py-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
            {icon}
          </div>
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground dark:text-white">
            {title}
          </h2>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="font-bold text-yellow-600 hover:text-yellow-500 hover:bg-yellow-500/5 uppercase tracking-wider"
          onClick={() => router.push('/maps')}
        >
          Xem tất cả
        </Button>
      </div>

      <Carousel opts={{ align: "start", loop: false }} className="w-full">
        <CarouselContent className="-ml-4">
          {maps.map((map, index) => (
            <CarouselItem key={`${map.id}-${index}`} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <motion.div 
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="h-full"
                onClick={() => router.push(`/maps/${map.id}`)}
              >
                <Card className="relative overflow-hidden border-border/50 bg-card/40 dark:bg-slate-900/40 backdrop-blur-md flex flex-col h-full transition-all duration-500 hover:border-yellow-500/50 hover:shadow-2xl rounded-3xl select-none p-0 gap-0">
                  
                  <div className="relative w-full shrink-0 overflow-hidden bg-slate-900" style={{ paddingBottom: '45.36%' }}>
                    <img 
                      src={map.image || ERROR_IMAGE} 
                      alt={map.name} 
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-110"
                      onError={(e) => { e.currentTarget.src = ERROR_IMAGE }}
                    />
                    {map.isTrending && (
                      <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md">
                        <Flame className="h-4 w-4 text-orange-500 fill-orange-500" />
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 pt-3 flex flex-col flex-1">
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-base font-bold text-foreground dark:text-white uppercase tracking-tight line-clamp-2 group-hover:text-yellow-500 transition-colors">
                        {map.name}
                      </h3>

                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                        <div className="flex items-center gap-1.5">
                          <Gamepad2 className="h-3.5 w-3.5 text-yellow-500/50 fill-current" />
                          <span>{map.typeTags?.[0] || "Chế độ"}</span>
                        </div>
                        <span className="text-border/40 font-light">|</span>
                        <div className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-yellow-500/50 fill-current" />
                          <span>{map.playerTags?.[0] || "Tự do"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 flex items-center gap-2">
                      <Button 
                        onClick={(e) => handlePlayNow(e, map.shortCode)}
                        className="flex-1 h-11 bg-yellow-500 text-black hover:bg-yellow-600 font-black uppercase text-[11px] rounded-xl shadow-md active:scale-95 transition-all"
                      >
                        <Play className="mr-2 h-4 w-4 fill-current" /> CHƠI
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={(e) => handleCopy(e, map.shortCode, map.id)}
                        className="h-11 w-11 shrink-0 rounded-xl border-border/50 hover:bg-yellow-500/10 dark:hover:bg-yellow-500/20 active:scale-95 transition-all"
                      >
                        {copiedId === map.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* 🎯 HAI NÚT MŨI TÊN ĐÃ ĐƯỢC ĐẨY RA RÌA VÀ LÀM TO LÊN */}
        <div className="hidden md:block">
          <CarouselPrevious className="absolute -left-6 lg:-left-12 xl:-left-16 top-1/2 -translate-y-1/2 h-12 w-12 bg-background/80 backdrop-blur-md border-2 border-border/50 hover:border-yellow-500 hover:bg-yellow-500 hover:text-black hover:scale-110 transition-all shadow-xl z-10" />
          <CarouselNext className="absolute -right-6 lg:-right-12 xl:-right-16 top-1/2 -translate-y-1/2 h-12 w-12 bg-background/80 backdrop-blur-md border-2 border-border/50 hover:border-yellow-500 hover:bg-yellow-500 hover:text-black hover:scale-110 transition-all shadow-xl z-10" />
        </div>
      </Carousel>
    </div>
  )
}