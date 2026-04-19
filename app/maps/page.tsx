"use client"

import { useState, useEffect, useRef, Suspense } from "react" 
import { useRouter, useSearchParams } from "next/navigation" // 🎯 Thêm useSearchParams
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Play, Copy, Check, Flame, Search, Filter, ChevronUp, ChevronDown, Loader2, Shield } from "lucide-react" 
import { motion, useInView } from "framer-motion"

import { mapDetails } from "./data"

const TEAM_LOGOS: Record<string, string> = {
  "Tuglar Craftland": "/icon/icon short tuglar dark.png", 
  "GLX Craftland": "/glx-logo.png",
}

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
    team: data.team || "Không có", 
    favourite: data.likes || "0",
    difficulty: data.difficulty || 3, 
    shortCode: data.shortCode || "#000000",
    image: data.banner || "/map-cover/banner-default.png", 
    featured: data.featured || false
  };
}).reverse(); 

const DIFFICULTY_MAP: Record<number, string> = {
  1: "Siêu Dễ", 2: "Dễ", 3: "Trung Bình", 4: "Khó", 5: "Siêu Khó", 6: "Ác Mộng"
}

// 🎯 COMPONENT CHÍNH
function MapsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("Tất cả")
  const [filterPlayer, setFilterPlayer] = useState("Tất cả")
  const [filterTeam, setFilterTeam] = useState("Tất cả")
  
  const [visibleCount, setVisibleCount] = useState(8); 
  const [showScroll, setShowScroll] = useState(false);
  const [isExpandedType, setIsExpandedType] = useState(false);
  const LIMIT_TAGS = 12;

  // 🎯 TỰ ĐỘNG BẮT TEAM TỪ URL
  useEffect(() => {
    const teamFromUrl = searchParams.get('team');
    if (teamFromUrl) {
      setFilterTeam(teamFromUrl);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [searchParams]);

  const filteredMaps = ALL_MAPS.filter((map) => {
    const matchSearch = map.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchType = filterType === "Tất cả" || map.typeTags.includes(filterType)
    const matchPlayer = filterPlayer === "Tất cả" || map.playerTags.includes(filterPlayer)
    const matchTeam = filterTeam === "Tất cả" || map.team === filterTeam 
    return matchSearch && matchType && matchPlayer && matchTeam
  })

  const displayMaps = filteredMaps.slice(0, visibleCount);
  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef, { margin: "200px" });

  useEffect(() => {
    if (isInView && visibleCount < filteredMaps.length) {
      setTimeout(() => setVisibleCount(prev => prev + 4), 100);
    }
  }, [isInView, filteredMaps.length, visibleCount]);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter Counts Logic (giữ nguyên của ní)
  const typeCounts = ALL_MAPS.flatMap(m => m.typeTags).reduce((acc: any, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
  const playerCounts = ALL_MAPS.flatMap(m => m.playerTags).reduce((acc: any, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
  const teamCounts = ALL_MAPS.map(m => m.team).reduce((acc: any, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});

  const uniqueTypes = ["Tất cả", ...Array.from(new Set(ALL_MAPS.flatMap(m => m.typeTags))).sort()];
  const uniquePlayers = ["Tất cả", ...Array.from(new Set(ALL_MAPS.flatMap(m => m.playerTags))).sort((a,b) => a.localeCompare(b, 'vi', {numeric: true}))];
  const uniqueTeams = ["Tất cả", ...Array.from(new Set(ALL_MAPS.map(m => m.team))).sort()];

  const handleCopy = (e: any, code: string, id: string) => {
    e.stopPropagation(); navigator.clipboard.writeText(code); setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const handlePlayNow = (e: any, code: string) => {
    e.stopPropagation();
    const cleanCode = code.replace("#", "").replace("FREEFIRE", "").trim();
    window.open(`https://c.freefiremobile.com/?m=1E441${cleanCode}`, "_blank");
  }

  return (
    <div className="pb-24 min-h-screen relative">
      <div className="container mx-auto px-4 pt-24 md:pt-32">
        <div className="mb-8 flex flex-col gap-4">
          <h1 className="text-3xl md:text-5xl font-black uppercase text-foreground">Kho Bản Đồ Tổng</h1>
          <div className="flex flex-col gap-8 p-8 rounded-[2rem] border border-border/50 bg-card/30 backdrop-blur-xl">
             <div className="relative max-w-3xl mx-auto w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input type="text" placeholder="Tìm kiếm tên map..." value={searchQuery} onChange={(e) => {setSearchQuery(e.target.value); setVisibleCount(8);}} className="w-full bg-background/50 border border-border/50 rounded-2xl py-4 pl-14 pr-6 font-bold text-lg outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all"/>
             </div>
             
             {/* Bộ lọc (Tóm gọn lại cho ní) */}
             <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                   {(isExpandedType ? uniqueTypes : uniqueTypes.slice(0, LIMIT_TAGS)).map(t => (
                      <Badge key={t} onClick={() => {setFilterType(t); setVisibleCount(8);}} className={`cursor-pointer px-4 py-2 text-[10px] font-bold border-none ${filterType === t ? 'bg-yellow-500 text-black' : 'bg-muted/40 text-muted-foreground'}`}>{t}</Badge>
                   ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-border/30">
                   <div className="flex flex-wrap gap-2">
                      {uniquePlayers.map(p => (
                         <Badge key={p} onClick={() => {setFilterPlayer(p); setVisibleCount(8);}} className={`cursor-pointer px-4 py-2 text-[10px] font-bold border-none ${filterPlayer === p ? 'bg-yellow-500 text-black' : 'bg-muted/40 text-muted-foreground'}`}>{p}</Badge>
                      ))}
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {uniqueTeams.map(team => (
                         <Badge key={team} onClick={() => {setFilterTeam(team); setVisibleCount(8);}} className={`cursor-pointer px-4 py-2 text-[10px] font-bold border-none flex items-center gap-1.5 ${filterTeam === team ? 'bg-yellow-500 text-black' : 'bg-muted/40 text-muted-foreground'}`}>
                            {TEAM_LOGOS[team] && <img src={TEAM_LOGOS[team]} className="h-3.5 w-3.5 object-contain" alt="logo" />}
                            {team}
                         </Badge>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </div>

        {displayMaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 select-none">
            {displayMaps.map((map, index) => (
              <motion.div key={map.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: (index % 4) * 0.1 }} onClick={() => router.push(`/maps/${map.id}`)} className="group/card cursor-pointer">
                <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md rounded-3xl h-full flex flex-col transition-all hover:border-yellow-500/50">
                  <div className="relative aspect-[485/220] overflow-hidden">
                    {/* 🎯 SỬA: Banner mặc định + onerror null */}
                    <img src={map.image} alt={map.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/map-cover/banner-default.png"; }} />
                    <div className="absolute left-3 top-3"><Badge className="bg-black/70 text-white text-[9px] font-bold uppercase border-none">{map.displayType}</Badge></div>
                    {/* 🎯 ĐÃ XÓA SỐ LIKE Ở ĐÂY */}
                  </div>
                  <CardContent className="p-6 flex flex-col flex-1 justify-between gap-5">
                    <div>
                      <h3 className="text-base font-bold flex items-center gap-2 group-hover/card:text-yellow-500 transition-colors uppercase truncate">
                        {map.featured && <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />} {map.name}
                      </h3>
                      <div className="mt-2 flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase">
                        <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-yellow-500/50" />{map.displayPlayers}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-yellow-500/50" />{DIFFICULTY_MAP[map.difficulty as keyof typeof DIFFICULTY_MAP] || "Trung Bình"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                        <Button onClick={(e) => handlePlayNow(e, map.shortCode)} className="flex-1 h-11 bg-yellow-500 text-black hover:bg-yellow-600 font-black uppercase text-[11px] rounded-xl active:scale-95">CHƠI</Button>
                        <Button variant="outline" size="icon" onClick={(e) => handleCopy(e, map.shortCode, map.id)} className="h-11 w-11 rounded-xl border-border/50">
                          {copiedId === map.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40">
             <h2 className="text-2xl font-bold text-muted-foreground/80">Không tìm thấy map nào ní ơi 🥲</h2>
          </div>
        )}
        <div ref={loadMoreRef} className="h-40 flex items-center justify-center">
           {displayMaps.length > 0 && visibleCount < filteredMaps.length && <Loader2 className="h-10 w-10 animate-spin text-yellow-500" />}
        </div>
      </div>
      {showScroll && <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-10 right-10 h-14 w-14 rounded-full bg-yellow-500 text-black z-50"><ChevronUp /></Button>}
    </div>
  )
}

// 🎯 COMPONENT WRAPPER (Để tránh lỗi Next.js bôi đỏ khi dùng useSearchParams)
export default function AllMapsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-yellow-500" /></div>}>
      <MapsContent />
    </Suspense>
  )
}