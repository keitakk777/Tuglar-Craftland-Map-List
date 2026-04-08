"use client"

import { useState, useEffect, useRef } from "react" 
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Star, Play, Copy, Check, Flame, Search, Filter, ChevronUp, ChevronDown, Loader2 } from "lucide-react"
import { motion, useInView } from "framer-motion"

// 🎯 BƯỚC 1: IMPORT DATA TỪ KHO CHUNG
import { mapDetails } from "./data"

// 🎯 BƯỚC 2: CHUYỂN DATA & CHUẨN HÓA (Để ngoài component cho nhẹ)
const ALL_MAPS = Object.entries(mapDetails).map(([key, data]: [string, any]) => {
  const normalizedTeamType = data.teamType === "1 người" ? "Solo" : (data.teamType || "Tự do");
  const normalizedTeamTags = (data.teamTags || []).map((t: string) => t === "1 người" ? "Solo" : t);

  return {
    id: key, 
    name: data.name,
    displayType: data.mode || "Chưa phân loại", 
    typeTags: Array.from(new Set([data.mode, ...(data.modeTags || [])])).filter(Boolean), 
    displayPlayers: normalizedTeamType, 
    playerTags: Array.from(new Set([normalizedTeamType, ...normalizedTeamTags])).filter(Boolean), 
    favourite: data.likes || "0",
    difficulty: data.difficulty || 3, 
    shortCode: data.shortCode || "#000000",
    image: data.banner || "/map-cover/Banner Chưa có.png", 
    featured: data.featured || false
  };
});

const DIFFICULTY_MAP: Record<number, string> = {
  1: "Siêu Dễ", 2: "Dễ", 3: "Trung Bình", 4: "Khó", 5: "Siêu Khó", 6: "Ác Mộng"
}

export default function AllMapsPage() {
  const router = useRouter()
  
  // --- 1. STATES (Khai báo trước) ---
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("Tất cả")
  const [filterPlayer, setFilterPlayer] = useState("Tất cả")
  const [visibleCount, setVisibleCount] = useState(8); 
  const [showScroll, setShowScroll] = useState(false);
  const [isExpandedType, setIsExpandedType] = useState(false);
  const LIMIT_TAGS = 12;

  // --- 2. LOGIC LỌC (🎯 PHẢI ĐẶT Ở ĐÂY ĐỂ CÁC EFFECT BÊN DƯỚI DÙNG ĐƯỢC) ---
  const filteredMaps = ALL_MAPS.filter((map) => {
    const matchSearch = map.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchType = filterType === "Tất cả" || map.typeTags.includes(filterType)
    const matchPlayer = filterPlayer === "Tất cả" || map.playerTags.includes(filterPlayer)
    return matchSearch && matchType && matchPlayer
  })

  const displayMaps = filteredMaps.slice(0, visibleCount);

  // --- 3. REFS & EFFECTS (Sử dụng filteredMaps đã khai báo ở trên) ---
  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef, { margin: "200px" });

  useEffect(() => {
    if (isInView && visibleCount < filteredMaps.length) {
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 4);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isInView, filteredMaps.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) setShowScroll(true);
      else setShowScroll(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- 4. TÍNH TOÁN BỘ ĐẾM & DANH SÁCH TAG ---
  const typeCounts = ALL_MAPS.flatMap(m => m.typeTags).reduce((acc: any, t) => {
    acc[t] = (acc[t] || 0) + 1; return acc;
  }, {});

  const playerCounts = ALL_MAPS.flatMap(m => m.playerTags).reduce((acc: any, t) => {
    acc[t] = (acc[t] || 0) + 1; return acc;
  }, {});

  const sortedPlayers = Array.from(new Set(ALL_MAPS.flatMap(m => m.playerTags)))
    .sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }));

  const sortedTypes = Array.from(new Set(ALL_MAPS.flatMap(m => m.typeTags)))
    .sort((a, b) => a.localeCompare(b, 'vi', { sensitivity: 'base' }));

  const uniqueTypes = ["Tất cả", ...sortedTypes];
  const uniquePlayers = ["Tất cả", ...sortedPlayers];

  // --- 5. HANDLERS ---
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopy = (e: React.MouseEvent, code: string, id: string) => {
    e.stopPropagation(); navigator.clipboard.writeText(code); setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const handlePlayNow = (e: React.MouseEvent, code: string) => {
    e.stopPropagation(); 
    const cleanCode = code.replace("#", "").replace("FREEFIRE", "").trim();
    window.open(`https://c.freefiremobile.com/?m=1E441${cleanCode}`, "_blank");
  }

  return (
    <div className="pb-24 min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/5 via-[#0a0f1a] to-[#020617] -z-10" />
      
      <div className="container mx-auto px-4 pt-24 md:pt-32">
        <div className="mb-8 flex flex-col gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground">Kho Bản Đồ</h1>
            <p className="mt-2 text-muted-foreground font-medium max-w-2xl">Khám phá và trải nghiệm toàn bộ các bản đồ từ Tuglar Craftland</p>
          </div>

          <div className="flex flex-col gap-8 p-8 rounded-[2rem] border border-border/50 bg-card/30 backdrop-blur-xl shadow-2xl">
            <div className="relative max-w-3xl mx-auto w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input 
                type="text" placeholder="Tìm kiếm tên map..." value={searchQuery}
                onChange={(e) => {setSearchQuery(e.target.value); setVisibleCount(8);}}
                className="w-full bg-background/50 border border-border/50 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all font-bold text-lg"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-4">
                <label className="text-xs font-black uppercase text-yellow-500/80 flex items-center gap-2 tracking-widest">
                  <Filter className="h-4 w-4" /> Chế độ chơi / Thể loại
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {(isExpandedType ? uniqueTypes : uniqueTypes.slice(0, LIMIT_TAGS)).map(type => (
                    <Badge 
                      key={type} onClick={() => {setFilterType(type); setVisibleCount(8);}}
                      className={`cursor-pointer px-4 py-2 text-[10px] font-bold transition-all hover:scale-105 active:scale-95 border-none ${filterType === type ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'bg-muted/40 text-muted-foreground hover:bg-muted/60'}`}
                    >
                      {type} {type !== "Tất cả" && <span className="ml-1 opacity-60 font-medium">({typeCounts[type] || 0})</span>}
                    </Badge>
                  ))}
                  
                  {uniqueTypes.length > LIMIT_TAGS && (
                    <button 
                      onClick={() => setIsExpandedType(!isExpandedType)}
                      className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-black text-yellow-500 hover:text-yellow-400 transition-colors uppercase tracking-widest"
                    >
                      {isExpandedType ? (
                        <>Thu gọn <ChevronUp className="h-4 w-4" /></>
                      ) : (
                        <>Xem thêm ({uniqueTypes.length - LIMIT_TAGS}) <ChevronDown className="h-4 w-4" /></>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4 space-y-4 lg:border-l lg:border-border/30 lg:pl-10">
                <label className="text-xs font-black uppercase text-yellow-500/80 flex items-center gap-2 tracking-widest">
                  <Users className="h-4 w-4" /> Quy mô / Số người
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {uniquePlayers.map(player => (
                    <Badge 
                      key={player} onClick={() => {setFilterPlayer(player); setVisibleCount(8);}}
                      className={`cursor-pointer px-4 py-2 text-[10px] font-bold transition-all hover:scale-105 active:scale-95 border-none ${filterPlayer === player ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'bg-muted/40 text-muted-foreground hover:bg-muted/60'}`}
                    >
                      {player} {player !== "Tất cả" && <span className="ml-1 opacity-60 font-medium">({playerCounts[player] || 0})</span>}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {displayMaps.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 select-none">
              {displayMaps.map((map, index) => (
                <motion.div
                  key={map.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
                  onClick={() => router.push(`/maps/${map.id}`)} 
                  className="block group/card cursor-pointer"
                >
                  <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md transition-all duration-500 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 rounded-3xl h-full flex flex-col">
                    <div className="relative aspect-[485/220] overflow-hidden shrink-0">
                      <img src={map.image} alt={map.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
                      <div className="absolute left-3 top-3"><Badge className="bg-black/70 backdrop-blur-md text-white text-[9px] font-bold uppercase border-none">{map.displayType}</Badge></div>
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-3 py-1.5 text-[10px] font-bold text-white border border-white/10">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />{map.favourite}
                      </div>
                    </div>

                    <CardContent className="p-6 flex flex-col flex-1 justify-between gap-5">
                      <div>
                        <h3 className="text-base font-bold tracking-tight flex items-center gap-2 group-hover/card:text-yellow-500 transition-colors uppercase">
                          {map.featured && <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />}
                          <span className="line-clamp-1">{map.name}</span>
                        </h3>
                        <div className="mt-2 flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-yellow-500/50" />{map.displayPlayers}</span>
                          <span className="opacity-30">|</span>
                          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-yellow-500/50" />{DIFFICULTY_MAP[map.difficulty as keyof typeof DIFFICULTY_MAP] || "Trung Bình"}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                          <Button onClick={(e) => handlePlayNow(e, map.shortCode)} className="flex-1 h-11 bg-yellow-500 text-black hover:bg-yellow-600 font-black uppercase text-[11px] rounded-xl transition-all shadow-md shadow-yellow-500/20 active:scale-95">
                              <Play className="mr-2 h-4 w-4 fill-current" /> CHƠI
                          </Button>
                          <Button variant="outline" size="icon" onClick={(e) => handleCopy(e, map.shortCode, map.id)} className="h-11 w-11 shrink-0 rounded-xl border-border/50 hover:border-yellow-500/50 hover:bg-yellow-500/10 active:scale-95">
                            {copiedId === map.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                          </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div ref={loadMoreRef} className="h-40 flex items-center justify-center">
               {visibleCount < filteredMaps.length && (
                  <div className="flex flex-col items-center gap-4 text-muted-foreground animate-pulse">
                     <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />
                     <span className="text-[10px] font-black uppercase tracking-[0.4em]">Đang tải thêm bản đồ...</span>
                  </div>
               )}
            </div>
          </>
        ) : (
          <div className="text-center py-40 border-2 border-dashed border-border/20 rounded-[3rem] bg-card/10 backdrop-blur-sm">
            <div className="bg-muted/20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <Search className="h-10 w-10 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-bold text-muted-foreground/80 uppercase tracking-tight">Không tìm thấy map nào ní ơi 🥲</h2>
            <Button onClick={() => { setSearchQuery(""); setFilterType("Tất cả"); setFilterPlayer("Tất cả"); setVisibleCount(8); }} className="bg-yellow-500 text-black font-black uppercase rounded-2xl px-10 h-12 hover:bg-yellow-600 shadow-xl shadow-yellow-500/20">Xóa bộ lọc</Button>
          </div>
        )}
      </div>

      {showScroll && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 h-14 w-14 rounded-full bg-yellow-500 text-black shadow-2xl shadow-yellow-500/40 hover:scale-110 active:scale-90 transition-all z-50 p-0"
        >
          <ChevronUp className="h-7 w-7 stroke-[3px]" />
        </Button>
      )}
    </div>
  )
}