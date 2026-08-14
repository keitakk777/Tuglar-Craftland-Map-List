"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// Fix 4: Đã thêm CheckCircle2 vào đây
import { ArrowRight, Flame, Map as MapIcon, Users, Play, Copy, Star, CheckCircle2 } from "lucide-react"
import Link from "next/link"
// Fix 1: Sửa getMapData thành getMapsData
import { getMapsData, MapData } from "@/app/maps/fetch-map"

const DIFFICULTY_MAP: Record<number, string> = {
  1: "Siêu Dễ",
  2: "Dễ",
  3: "Bình Thường",
  4: "Khó",
  5: "Siêu Khó",
}

export function FeaturedMaps() {
  const [maps, setMaps] = useState<MapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    // Fix 2: Khai báo rõ data có kiểu là MapData[]
    getMapsData().then((data: MapData[]) => {
      // Đảm bảo data tồn tại rồi mới slice 4 map đầu
      const featured = data && data.length > 0 ? data.slice(0, 4) : [];
      setMaps(featured);
      setLoading(false);
    });
  }, []);

  const handleCopy = (e: React.MouseEvent, code: string) => {
    e.preventDefault();
    navigator.clipboard.writeText(code);
    setCopiedId(code);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <section className="py-12 md:py-20 relative overflow-hidden">
        <div className="container relative z-10 mx-auto px-4 animate-pulse">
           <div className="flex items-center gap-3 mb-10">
             <div className="w-12 h-12 rounded-full bg-slate-800"></div>
             <div className="h-8 w-48 bg-slate-800 rounded-lg"></div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-80 bg-slate-800 rounded-3xl"></div>
              ))}
           </div>
        </div>
      </section>
    );
  }

  if (maps.length === 0) return null;

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 lg:mb-16">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500 blur-xl opacity-50 rounded-full" />
              <div className="bg-gradient-to-br from-orange-400 to-orange-600 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center relative shadow-lg transform -rotate-6">
                <Flame className="w-6 h-6 md:w-8 md:h-8 text-white fill-white" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 uppercase tracking-tight">
                Đang thịnh hành
              </h2>
              <p className="text-slate-400 mt-1 md:mt-2 font-medium text-sm md:text-base">
                Những bản đồ được chơi nhiều nhất tuần qua
              </p>
            </div>
          </div>

          <Link href="/maps">
            <Button variant="outline" className="rounded-full font-bold uppercase tracking-wider text-xs border-white/10 hover:bg-white/5 h-12 px-6">
              Xem tất cả <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {maps.map((map, index) => (
            <Link href={`/maps/${map.id}`} key={map.id}>
              <Card className="group relative overflow-hidden bg-card/40 backdrop-blur-sm border-white/5 hover:border-orange-500/50 transition-all duration-500 rounded-[2rem] flex flex-col h-full hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.2)]">
                
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="absolute inset-0 bg-slate-900 animate-pulse" />
                  <img
                    src={map.thumbnail}
                    alt={map.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.jpg" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  
                  <div className="absolute top-4 left-4">
                    <div className="bg-orange-500 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3 fill-current" /> TOP {index + 1}
                    </div>
                  </div>
                </div>

                <CardContent className="relative p-6 pt-0 flex flex-col flex-grow z-10 -mt-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {/* Fix 3: Khai báo (tag: string) thay vì để trống */}
                    {map.tags && map.tags.slice(0, 2).map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="bg-background/80 backdrop-blur-md border-white/10 text-[10px] font-bold uppercase tracking-wider px-3 py-1">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="font-black text-xl mb-3 line-clamp-2 text-white group-hover:text-orange-400 transition-colors">
                    {map.name}
                  </h3>

                  <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider mt-auto mb-6">
                    <span className="flex items-center gap-1.5">
                      <MapIcon className="w-3.5 h-3.5 text-orange-500" />
                      {map.mode}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      {map.players || 0}
                    </span>
                  </div>

                  <div className="flex gap-2 relative z-20">
                    <Button className="flex-1 rounded-xl h-12 bg-white text-black hover:bg-orange-500 hover:text-white font-black tracking-widest uppercase transition-colors">
                      <Play className="w-4 h-4 mr-2 fill-current" /> Chơi
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="w-12 h-12 rounded-xl border-white/10 bg-background/50 hover:bg-white/10 shrink-0"
                      onClick={(e) => handleCopy(e, map.code)}
                    >
                      {copiedId === map.code ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Copy className="w-5 h-5 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}