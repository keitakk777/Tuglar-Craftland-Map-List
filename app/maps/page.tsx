// @ts-nocheck
"use client"

import { useState, useEffect, Suspense } from "react" 
import { useRouter, useSearchParams } from "next/navigation" 
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Play, Copy, Check, Flame, Search, Filter, ChevronUp, ChevronDown, Loader2, Shield, Gamepad2 } from "lucide-react" 
import { motion } from "framer-motion"

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
  const [isExpandedType, setIsExpandedType] = useState(false);
  const LIMIT_TAGS = 12;

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
      
      <div className="container mx-auto px-4 pt-24 md:pt-32">
        <div className="mb-8 flex flex-col gap-4">
          <div className="text-center md:text-left">
             <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground">Kho Bản Đồ Tổng</h1>
             <p className="mt-2 text-muted-foreground font-medium max-w-2xl">Khám phá vũ trụ map đa dạng từ Tuglar Craftland</p>
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
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border/30">
                   <div className="space-y-4">
                      <label className="text-xs font-black uppercase text-yellow-500/80 flex items-center gap-2 tracking-widest"><Users className="h-4 w-4 fill-current" /> Quy mô / Số người</label>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 select-none mt-4">
          {displayMaps.map((map, index) => (
            <motion.div 
              key={`${map?.id || 'map'}-${index}`} 
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
                  {/* 🎯 ĐÃ XÓA TAG BADGE Ở ĐÂY ĐỂ CHUYỂN XUỐNG DƯỚI */}
                </div>
                
                <CardContent className="p-4 pt-3 flex flex-col flex-1" onClick={(e) => { e.stopPropagation(); router.push(`/maps/${map?.id || ''}`); }}>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start gap-2">
                      {map?.featured && <Flame className="h-5 w-5 shrink-0 text-orange-500 fill-orange-500 mt-0.5" />}
                      <h3 className="text-base font-bold group-hover/card:text-yellow-500 transition-colors uppercase tracking-tight line-clamp-2">
                        {String(map?.name || "Bản đồ")}
                      </h3>
                    </div>

                    {/* 🎯 HÀNG INFO MỚI: [Icon Gameplay] [Gamemode] | [Icon Users] [Teammode] */}
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
        </div>
      </div>
    </div>
  )
}

export default function AllMapsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}><MapsContent /></Suspense>
  )
}