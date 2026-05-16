// @ts-nocheck
"use client"

import { useState, useEffect, Suspense, useMemo, useRef } from "react" 
import { useRouter, useSearchParams } from "next/navigation" 
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// 🎯 ĐÃ FIX: Thêm dòng import Input bị thiếu ở đây
import { Input } from "@/components/ui/input" 
import { Users, Play, Copy, Check, Flame, Search, Filter, ChevronUp, Loader2, Shield, Gamepad2 } from "lucide-react" 
import { motion, AnimatePresence } from "framer-motion"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet"

import { getMapsData } from "./fetch-data"

const TEAM_LOGOS: Record<string, string> = {
  "Tuglar Craftland": "/icon/icon short tuglar dark.png", 
  "GLX Craftland": "/glx-logo.png",
}

const ERROR_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23450a0a'/%3E%3Cg transform='translate(364, 140) scale(3)'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='9' cy='9' r='2' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cline x1='3' y1='3' x2='21' y2='21' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Ctext x='50%25' y='280' font-family='sans-serif' font-size='24' font-weight='bold' fill='%23ef4444' text-anchor='middle'%3ETHIẾU ẢNH BANNER%3C/text%3E%3C/svg%3E";

function MapsContent() {
  const router = useRouter()
  const [allMaps, setAllMaps] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null)
  
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("Tất cả")
  const [filterPlayer, setFilterPlayer] = useState("Tất cả")
  const [filterTeam, setFilterTeam] = useState("Tất cả")
  const [visibleCount, setVisibleCount] = useState(40); 

  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  const [tempType, setTempType] = useState("Tất cả")
  const [tempPlayer, setTempPlayer] = useState("Tất cả")
  const [tempTeam, setTempTeam] = useState("Tất cả")

  const [showScrollTop, setShowScrollTop] = useState(false)
  const ignoreScroll = useRef(false)

  useEffect(() => {
    getMapsData().then(data => {
      setAllMaps(data || []);
      setIsDataLoading(false);
    });
  }, []);

  const filteredMaps = allMaps.filter((map) => {
    if (!map || typeof map !== 'object') return false;
    const name = String(map.name || "").toLowerCase();
    const query = String(searchQuery || "").toLowerCase();
    const matchSearch = name.includes(query);
    const typeTags = Array.isArray(map.typeTags) ? map.typeTags : [];
    const playerTags = Array.isArray(map.playerTags) ? map.playerTags : [];
    const matchType = filterType === "Tất cả" || typeTags.includes(filterType);
    const matchPlayer = filterPlayer === "Tất cả" || playerTags.includes(filterPlayer);
    const matchTeam = filterTeam === "Tất cả" || String(map.team || "") === filterTeam;
    return matchSearch && matchType && matchPlayer && matchTeam;
  });

  const displayMaps = filteredMaps.slice(0, visibleCount);

  const uniqueTypes = ["Tất cả", ...Array.from(new Set(allMaps.flatMap(m => Array.isArray(m?.typeTags) ? m.typeTags : []))).sort()];
  const uniquePlayers = ["Tất cả", ...Array.from(new Set(allMaps.flatMap(m => Array.isArray(m?.playerTags) ? m.playerTags : []))).sort((a,b) => a.localeCompare(b, 'vi', {numeric: true}))];
  const uniqueTeams = ["Tất cả", ...Array.from(new Set(allMaps.map(m => m?.team).filter(t => typeof t === 'string'))).sort()];
  
  const typeCounts = allMaps.flatMap(m => Array.isArray(m?.typeTags) ? m.typeTags : []).reduce((acc: any, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
  const playerCounts = allMaps.flatMap(m => Array.isArray(m?.playerTags) ? m.playerTags : []).reduce((acc: any, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
  const teamCounts = allMaps.map(m => m?.team).filter(t => typeof t === 'string').reduce((acc: any, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});

  useEffect(() => {
    if (isFilterSheetOpen) {
      setTempType(filterType)
      setTempPlayer(filterPlayer)
      setTempTeam(filterTeam)
    }
  }, [isFilterSheetOpen, filterType, filterPlayer, filterTeam])

  useEffect(() => {
    ignoreScroll.current = true
    const timer = setTimeout(() => {
      ignoreScroll.current = false
    }, 500)
    return () => clearTimeout(timer)
  }, [filterType, filterPlayer, filterTeam, isFilterSheetOpen, searchQuery])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleApply = () => {
    setFilterType(tempType)
    setFilterPlayer(tempPlayer)
    setFilterTeam(tempTeam)
    setVisibleCount(40)
    setIsFilterSheetOpen(false)
    setTimeout(() => scrollToTop(), 200)
  }

  const handleReset = () => {
    setTempType("Tất cả")
    setTempPlayer("Tất cả")
    setTempTeam("Tất cả")
  }

  const handleCopy = (e: any, code: string, id: string) => {
    e.stopPropagation(); navigator.clipboard.writeText(String(code || "")); setCopiedId(String(id));
    setTimeout(() => setCopiedId(null), 2000);
  }

  const handlePlayNow = (e: any, code: string) => {
    e.stopPropagation();
    const cleanCode = String(code || "").replace("#", "").replace(/FREEFIRE/i, "").trim();
    window.open(`https://c.freefiremobile.com/?m=1E441${cleanCode}`, "_blank");
  }

  const isFilterActive = filterType !== "Tất cả" || filterPlayer !== "Tất cả" || filterTeam !== "Tất cả"

  if (isDataLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 pb-24 relative overflow-x-hidden">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-yellow-500/5 via-[#0a0f1a] to-[#020617] -z-10" />
        <Loader2 className="h-14 w-14 animate-spin text-yellow-500" />
        <p className="font-black uppercase tracking-widest text-muted-foreground/50 animate-pulse">Đang đồng bộ dữ liệu từ Tuglar...</p>
      </div>
    );
  }

  return (
    <div className="pb-24 min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-yellow-500/5 via-[#0a0f1a] to-[#020617] -z-10" />
      
      <div className="container mx-auto px-4 pt-24 md:pt-32">
        
        <div className="mb-8 flex flex-col gap-6 text-center md:text-left">
          <div>
             <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground">Kho Bản Đồ Tổng</h1>
             <p className="mt-2 text-muted-foreground font-medium max-w-2xl">Khám phá vũ trụ map đa dạng từ cộng đồng Craftland!</p>
          </div>
          
          <div className="relative z-10 bg-background/95 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-border shadow-xl md:max-w-4xl md:mx-auto w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Tìm tên map, tác giả, mã code hoặc nội dung mô tả..." 
                className="pl-10 h-12 bg-muted/50 border-border rounded-xl focus:ring-yellow-500 text-sm w-full shadow-inner"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setVisibleCount(40)
                  scrollToTop()
                }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 select-none mt-4">
          <AnimatePresence mode="popLayout">
            {displayMaps.map((map, index) => (
              <motion.div 
                key={`${map?.id || 'map'}-${index}`} 
                layout
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }} 
                transition={{ duration: 0.5, delay: (index % 4) * 0.1 }} 
                onClick={() => router.push(`/maps/${map?.id || ''}`)} 
                className="group/card cursor-pointer block h-full"
              >
                <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md flex flex-col transition-all duration-500 hover:border-yellow-500/50 hover:shadow-2xl rounded-3xl h-full p-0 gap-0">
                  <div className="relative w-full shrink-0 overflow-hidden bg-slate-900" style={{ paddingBottom: '45.36%' }}>
                    <img src={map?.image || ERROR_IMAGE} alt="Map Image" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = ERROR_IMAGE; }} />
                  </div>
                  
                  <CardContent className="p-4 pt-3 flex flex-col flex-1" onClick={(e) => { e.stopPropagation(); router.push(`/maps/${map?.id || ''}`); }}>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-start gap-2">
                        {map?.featured && <Flame className="h-5 w-5 shrink-0 text-orange-500 fill-orange-500 mt-0.5" />}
                        <h3 className="text-base font-bold group-hover/card:text-yellow-500 transition-colors uppercase tracking-tight line-clamp-2">
                          {String(map?.name || "Bản đồ")}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                         <div className="flex items-center gap-1.5">
                            <Gamepad2 className="h-3.5 w-3.5 text-yellow-500/50 fill-current" />
                            <span>{String(map?.typeTags?.[0] || "Chế độ")}</span>
                         </div>
                         
                         <span className="text-border/40 font-light">|</span>
                         
                         <div className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5 text-yellow-500/50 fill-current" />
                            <span>{String(map?.playerTags?.[0] || "Tự do")}</span>
                         </div>
                      </div>
                    </div>

                    <div className="flex-1 min-h-[12px]"></div>
                    <div className="flex items-center gap-2 mt-auto">
                        <Button onClick={(e) => { e.stopPropagation(); handlePlayNow(e, map?.shortCode); }} className="flex-1 h-11 bg-yellow-500 text-black hover:bg-yellow-600 font-black uppercase text-[11px] rounded-xl transition-all shadow-md active:scale-95"><Play className="mr-2 h-4 w-4 fill-current" /> CHƠI</Button>
                        <Button variant="outline" size="icon" onClick={(e) => handleCopy(e, map?.shortCode, map?.id)} className="h-11 w-11 shrink-0 rounded-xl border-border/50 hover:bg-yellow-500/10 active:scale-95">{copiedId === map?.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex flex-col items-center gap-3">
          
          <AnimatePresence>
            {showScrollTop && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  onClick={scrollToTop}
                  variant="outline"
                  size="icon"
                  className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-background/80 backdrop-blur-md shadow-lg border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-transform hover:scale-110"
                >
                  <ChevronUp size={20} className="md:w-6 md:h-6" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <SheetTrigger asChild>
            <Button className="h-14 w-14 md:h-16 md:w-16 rounded-full shadow-[0_10px_40px_rgba(234,179,8,0.4)] bg-yellow-500 hover:bg-yellow-600 text-black border border-yellow-400 hover:scale-110 transition-transform">
              <Filter size={24} className="md:w-7 md:h-7" />
              {isFilterActive && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 md:w-4 md:h-4 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
              )}
            </Button>
          </SheetTrigger>

        </div>
        
        <SheetContent side="bottom" className="rounded-t-3xl h-[85vh] md:h-[75vh] md:max-w-3xl md:mx-auto flex flex-col p-6 bg-background/95 backdrop-blur-xl border-t md:border-x border-border z-[60]">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="text-left font-black uppercase tracking-widest text-foreground">Bộ lọc bản đồ</SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto py-6 space-y-8 [&::-webkit-scrollbar]:hidden">
            
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                Chế độ chơi / Thể loại
              </p>
              <div className="flex flex-wrap gap-2">
                 {uniqueTypes.map(type => (
                    <Button
                      key={type}
                      variant={tempType === type ? "default" : "outline"}
                      onClick={() => setTempType(type)}
                      className={`rounded-full px-5 h-10 font-bold uppercase text-[10px] tracking-widest transition-all ${
                        tempType === type ? 'bg-yellow-500 text-black border-none shadow-md shadow-yellow-500/20' : 'border-border bg-background'
                      }`}
                    >
                      {type} {type !== "Tất cả" && <span className="ml-1.5 opacity-60 font-medium">({typeCounts[type] || 0})</span>}
                    </Button>
                 ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Quy mô / Số người
              </p>
              <div className="flex flex-wrap gap-2">
                 {uniquePlayers.map(p => (
                    <Button
                      key={p}
                      variant={tempPlayer === p ? "default" : "outline"}
                      onClick={() => setTempPlayer(p)}
                      className={`rounded-full px-4 h-9 font-bold uppercase text-[9px] tracking-widest transition-all ${
                        tempPlayer === p ? 'bg-yellow-500 text-black border-none shadow-md shadow-yellow-500/20' : 'border-border bg-background'
                      }`}
                    >
                      {p} {p !== "Tất cả" && <span className="ml-1.5 opacity-60 font-medium">({playerCounts[p] || 0})</span>}
                    </Button>
                 ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Nhóm sáng tạo
              </p>
              <div className="flex flex-wrap gap-2">
                 {uniqueTeams.map(team => (
                    <Button
                      key={team}
                      variant={tempTeam === team ? "default" : "outline"}
                      onClick={() => setTempTeam(team)}
                      className={`rounded-full px-4 h-9 font-bold uppercase text-[9px] tracking-widest flex items-center gap-2 transition-all ${
                        tempTeam === team ? 'bg-yellow-500 text-black border-none shadow-md shadow-yellow-500/20' : 'border-border bg-background'
                      }`}
                    >
                      {TEAM_LOGOS[team] && <img src={TEAM_LOGOS[team]} className={`h-3.5 w-3.5 object-contain ${tempTeam !== team && 'opacity-70 dark:opacity-80'}`} alt="logo" />}
                      <span>{team}</span>
                      {team !== "Tất cả" && <span className="opacity-60 font-medium">({teamCounts[team] || 0})</span>}
                    </Button>
                 ))}
              </div>
            </div>

          </div>

          <SheetFooter className="flex flex-row gap-3 pt-4 border-t border-border mt-auto">
            <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold uppercase text-[10px] tracking-widest border-border" onClick={handleReset}>
              Reset bộ lọc
            </Button>
            <Button className="flex-1 rounded-xl h-12 bg-yellow-500 text-black hover:bg-yellow-600 font-bold uppercase text-[10px] tracking-widest" onClick={handleApply}>
              Áp dụng
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

    </div>
  )
}

export default function AllMapsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}><MapsContent /></Suspense>
  )
}