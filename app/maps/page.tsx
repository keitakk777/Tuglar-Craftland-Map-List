// @ts-nocheck
"use client"

import { useState, useEffect, Suspense } from "react" 
import { useRouter, useSearchParams } from "next/navigation" 
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Play, Copy, Check, Flame, Search, Filter, ChevronUp, ChevronDown, Loader2, Shield } from "lucide-react" 
import { motion } from "framer-motion"

import { getMapsData } from "./fetch-data"

const TEAM_LOGOS: Record<string, string> = {
  "Tuglar Craftland": "/icon/icon short tuglar dark.png", 
  "GLX Craftland": "/glx-logo.png",
}

function MapsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [allMaps, setAllMaps] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("Tất cả")
  const [filterPlayer, setFilterPlayer] = useState("Tất cả")
  const [filterTeam, setFilterTeam] = useState("Tất cả")
  
  const [visibleCount, setVisibleCount] = useState(40); 
  const [showScroll, setShowScroll] = useState(false);
  const [isExpandedType, setIsExpandedType] = useState(false);
  const LIMIT_TAGS = 12;

  useEffect(() => {
    getMapsData().then(data => {
      setAllMaps(data || []);
      setIsDataLoading(false);
    });
  }, []);

  useEffect(() => {
    const teamFromUrl = searchParams.get('team');
    if (teamFromUrl) {
      setFilterTeam(String(teamFromUrl));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [searchParams]);

  const filteredMaps = allMaps.filter((map) => {
    if (!map || typeof map !== 'object') return false;

    const name = String(map.name || "").toLowerCase();
    const query = String(searchQuery || "").toLowerCase();
    const matchSearch = name.includes(query);

    const typeTags = Array.isArray(map.typeTags) ? map.typeTags.filter(t => typeof t === 'string') : [];
    const playerTags = Array.isArray(map.playerTags) ? map.playerTags.filter(t => typeof t === 'string') : [];

    const matchType = filterType === "Tất cả" || typeTags.includes(filterType);
    const matchPlayer = filterPlayer === "Tất cả" || playerTags.includes(filterPlayer);
    const matchTeam = filterTeam === "Tất cả" || String(map.team || "") === filterTeam;

    return matchSearch && matchType && matchPlayer && matchTeam;
  });

  const displayMaps = filteredMaps.slice(0, visibleCount);

  const handleLoadMore = () => setVisibleCount(prev => prev + 40);

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const uniqueTypes = ["Tất cả", ...Array.from(new Set(allMaps.flatMap(m => Array.isArray(m?.typeTags) ? m.typeTags.filter(t => typeof t === 'string') : []))).sort()];
  const uniquePlayers = ["Tất cả", ...Array.from(new Set(allMaps.flatMap(m => Array.isArray(m?.playerTags) ? m.playerTags.filter(t => typeof t === 'string') : []))).sort((a,b) => a.localeCompare(b, 'vi', {numeric: true}))];
  const uniqueTeams = ["Tất cả", ...Array.from(new Set(allMaps.map(m => m?.team).filter(t => typeof t === 'string'))).sort()];

  const typeCounts = allMaps.flatMap(m => Array.isArray(m?.typeTags) ? m.typeTags.filter(t => typeof t === 'string') : []).reduce((acc: any, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
  const playerCounts = allMaps.flatMap(m => Array.isArray(m?.playerTags) ? m.playerTags.filter(t => typeof t === 'string') : []).reduce((acc: any, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});
  const teamCounts = allMaps.map(m => m?.team).filter(t => typeof t === 'string').reduce((acc: any, t) => { acc[t] = (acc[t] || 0) + 1; return acc; }, {});

  const handleCopy = (e: any, code: string, id: string) => {
    e.stopPropagation(); navigator.clipboard.writeText(String(code || "")); setCopiedId(String(id));
    setTimeout(() => setCopiedId(null), 2000);
  }

  const handlePlayNow = (e: any, code: string) => {
    e.stopPropagation();
    const cleanCode = String(code || "").replace("#", "").replace(/FREEFIRE/i, "").trim();
    window.open(`https://c.freefiremobile.com/?m=1E441${cleanCode}`, "_blank");
  }

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
      <div className="container mx-auto px-4 pt-8 md:pt-10">
        <div className="mb-8 flex flex-col gap-4">
          <div className="text-center md:text-left">
             <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground">Kho Bản Đồ Tổng</h1>
             <p className="mt-2 text-muted-foreground font-medium max-w-2xl">Khám phá vũ trụ map đa dạng từ Tuglar Craftland, các đối tác và cộng đồng sáng tạo</p>
          </div>
          <div className="flex flex-col gap-8 p-8 rounded-4xl border border-border/50 bg-card/30 backdrop-blur-xl shadow-2xl">
             <div className="relative max-w-3xl mx-auto w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input type="text" placeholder="Tìm kiếm tên map..." value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(40); }} className="w-full bg-background/50 border border-border/50 rounded-2xl py-4 pl-14 pr-6 font-bold text-lg outline-none focus:ring-2 focus:ring-yellow-500/20 transition-all" />
             </div>
             <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase text-yellow-500/80 flex items-center gap-2 tracking-widest"><Filter className="h-4 w-4" /> Chế độ chơi / Thể loại</label>
                  <div className="flex flex-wrap gap-2.5">
                     {(isExpandedType ? uniqueTypes : uniqueTypes.slice(0, LIMIT_TAGS)).map((t, idx) => (
                        <Badge key={`${t}-${idx}`} onClick={() => {setFilterType(t); setVisibleCount(40);}} className={`cursor-pointer px-4 py-2 text-[10px] font-bold border-none transition-all hover:scale-105 active:scale-95 ${filterType === t ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'bg-muted/40 text-muted-foreground hover:bg-muted/60'}`}>
                           {t} {t !== "Tất cả" && <span className="ml-1 opacity-60 font-medium">({typeCounts[t] || 0})</span>}
                        </Badge>
                     ))}
                     {uniqueTypes.length > LIMIT_TAGS && (
                        <button onClick={() => setIsExpandedType(!isExpandedType)} className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-black text-yellow-500 hover:text-yellow-400 transition-colors uppercase tracking-widest">
                           {isExpandedType ? <>Thu gọn <ChevronUp className="h-4 w-4" /></> : <>Xem thêm ({uniqueTypes.length - LIMIT_TAGS}) <ChevronDown className="h-4 w-4" /></>}
                        </button>
                     )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/30">
                   <div className="space-y-4">
                      <label className="text-xs font-black uppercase text-yellow-500/80 flex items-center gap-2 tracking-widest"><Users className="h-4 w-4" /> Quy mô / Số người</label>
                      <div className="flex flex-wrap gap-2.5">
                         {uniquePlayers.map((p, idx) => (
                            <Badge key={`${p}-${idx}`} onClick={() => {setFilterPlayer(p); setVisibleCount(40);}} className={`cursor-pointer px-4 py-2 text-[10px] font-bold border-none transition-all hover:scale-105 active:scale-95 ${filterPlayer === p ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'bg-muted/40 text-muted-foreground hover:bg-muted/60'}`}>
                               {p} {p !== "Tất cả" && <span className="ml-1 opacity-60 font-medium">({playerCounts[p] || 0})</span>}
                            </Badge>
                         ))}
                      </div>
                   </div>
                   <div className="space-y-4 md:border-l md:border-border/30 md:pl-8">
                      <label className="text-xs font-black uppercase text-yellow-500/80 flex items-center gap-2 tracking-widest"><Shield className="h-4 w-4" /> Nhóm sáng tạo</label>
                      <div className="flex flex-wrap gap-2.5">
                         {uniqueTeams.map((team, idx) => (
                            <Badge key={`${team}-${idx}`} onClick={() => {setFilterTeam(team); setVisibleCount(40);}} className={`cursor-pointer px-4 py-2 text-[10px] font-bold border-none flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 ${filterTeam === team ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/30' : 'bg-muted/40 text-muted-foreground hover:bg-muted/60'}`}>
                               {TEAM_LOGOS[team] && <img src={TEAM_LOGOS[team]} className={`h-3.5 w-3.5 object-contain ${filterTeam !== team && 'opacity-70 dark:opacity-80'}`} alt="logo" />}
                               <span>{team}</span>
                               {team !== "Tất cả" && <span className="opacity-60 font-medium ml-0.5">({teamCounts[team] || 0})</span>}
                            </Badge>
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        {displayMaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 select-none">
            {displayMaps.map((map, index) => (
              <motion.div key={`${map?.id || 'map'}-${index}`} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: (index % 4) * 0.1 }} onClick={() => router.push(`/maps/${map?.id || ''}`)} className="group/card cursor-pointer block h-full">
                
                {/* 1. THẺ CARD: Ép h-full để cao bằng nhau */}
                <Card className="relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-md flex flex-col transition-all duration-500 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 rounded-3xl h-full">
                  
                  {/* 2. KHUNG ẢNH: Trả lại aspect-[485/220] có ngoặc vuông để Tailwind nhận diện được tỉ lệ */}
                  <div className="relative w-full aspect-[485/220] overflow-hidden shrink-0">
                    <img src={map?.image || "/map-cover/banner-default.png"} alt="Map Image" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover/card:scale-110" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/map-cover/banner-default.png"; }} />
                    <div className="absolute left-3 top-3"><Badge className="bg-black/70 backdrop-blur-md text-white text-[9px] font-bold uppercase border-none">{String(map?.displayType || "Chế độ")}</Badge></div>
                  </div>
                  
                  {/* 3. NỘI DUNG: Dùng flex-1 để lấp đầy khoảng trống */}
                  <CardContent className="p-5 flex flex-col flex-1 gap-4">
                    <div>
                      <h3 className="text-base font-bold flex items-center gap-2 group-hover/card:text-yellow-500 transition-colors uppercase tracking-tight">
                        {map?.featured && <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />}
                        <span className="line-clamp-1">{String(map?.name || "Bản đồ")}</span>
                      </h3>
                      <div className="mt-2 flex items-center gap-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5 text-yellow-500/50" />
                          {String(map?.displayPlayers || "Tự do")}
                        </span>
                      </div>
                    </div>
                    
                    {/* 4. CỤM NÚT BẤM: Dùng mt-auto để đẩy thẳng xuống đáy Card */}
                    <div className="flex items-center gap-2.5 mt-auto pt-2">
                        <Button onClick={(e) => handlePlayNow(e, map?.shortCode)} className="flex-1 h-12 bg-yellow-500 text-black hover:bg-yellow-600 font-black uppercase text-[11px] rounded-xl transition-all shadow-md shadow-yellow-500/20 active:scale-95">
                          <Play className="mr-2 h-4 w-4 fill-current" /> CHƠI
                        </Button>
                        <Button variant="outline" size="icon" onClick={(e) => handleCopy(e, map?.shortCode, map?.id)} className="h-12 w-12 shrink-0 rounded-xl border-border/50 hover:border-yellow-500/50 hover:bg-yellow-500/10 active:scale-95">
                          {copiedId === map?.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                    </div>
                  </CardContent>

                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 border-2 border-dashed border-border/20 rounded-[3rem] bg-card/10 backdrop-blur-sm">
             <div className="bg-muted/20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6"><Search className="h-10 w-10 text-muted-foreground/50" /></div>
             <h2 className="text-2xl font-bold text-muted-foreground/80 uppercase tracking-tight">Không tìm thấy map nào ní ơi 🥲</h2>
             <Button onClick={() => { setSearchQuery(""); setFilterType("Tất cả"); setFilterPlayer("Tất cả"); setFilterTeam("Tất cả"); setVisibleCount(40); }} className="mt-4 bg-yellow-500 text-black font-black uppercase rounded-2xl px-10 h-12 hover:bg-yellow-600 shadow-xl shadow-yellow-500/20">Xóa bộ lọc</Button>
          </div>
        )}

        {displayMaps.length > 0 && visibleCount < filteredMaps.length && (
           <div className="flex justify-center mt-14 mb-8">
              <Button onClick={handleLoadMore} className="bg-yellow-500 text-black font-black uppercase tracking-wider px-10 h-13 rounded-2xl hover:bg-yellow-600 transition-all shadow-xl shadow-yellow-500/20 active:scale-95">Xem thêm bản đồ</Button>
           </div>
        )}
      </div>
      {showScroll && <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="fixed bottom-10 right-10 h-14 w-14 rounded-full bg-yellow-500 text-black shadow-2xl shadow-yellow-500/40 hover:scale-110 active:scale-90 transition-all z-50 p-0"><ChevronUp className="h-7 w-7 stroke-[3px]" /></Button>}
    </div>
  )
}

export default function AllMapsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin h-12 w-12 text-yellow-500" /></div>}>
      <MapsContent />
    </Suspense>
  )
}