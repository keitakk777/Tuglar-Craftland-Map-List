"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Star, Play, Copy, Check, Flame, Info, Search, Filter } from "lucide-react"

// 🎯 BƯỚC 1: IMPORT DATA TỪ KHO CHUNG
import { mapDetails } from "./data"

// 🎯 BƯỚC 2: CHUYỂN DATA & CHUẨN HÓA (FIX LỖI TRÙNG LẶP & AUTO ẢNH)
const ALL_MAPS = Object.entries(mapDetails).map(([key, data]: [string, any]) => {
  // Chuẩn hóa "1 người" thành "Solo" ngay từ đầu để bộ đếm không bị lệch
  const normalizedTeamType = data.teamType === "1 người" ? "Solo" : (data.teamType || "Tự do");
  const normalizedTeamTags = (data.teamTags || []).map((t: string) => t === "1 người" ? "Solo" : t);

  return {
    id: key, 
    name: data.name,
    
    // Thể loại
    displayType: data.mode || "Chưa phân loại", 
    typeTags: Array.from(new Set([data.mode, ...(data.modeTags || [])])).filter(Boolean), 
    
    // Quy mô
    displayPlayers: normalizedTeamType, 
    playerTags: Array.from(new Set([normalizedTeamType, ...normalizedTeamTags])).filter(Boolean), 
    
    // Thông tin khác
    favourite: data.likes || "0",
    difficulty: data.difficulty || 3, 
    shortCode: data.shortCode || "#000000",
    
    // 🖼️ AUTO ẢNH BÌA: Nếu không có banner thì dùng ảnh "Chưa có"
    image: data.banner || "/map-cover/Banner Chưa có.png", 
    featured: data.featured || false
  };
});

const DIFFICULTY_MAP: Record<number, string> = {
  1: "Siêu Dễ", 2: "Dễ", 3: "Trung Bình", 4: "Khó", 5: "Siêu Khó", 6: "Ác Mộng"
}

export default function AllMapsPage() {
  const router = useRouter()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("Tất cả")
  const [filterPlayer, setFilterPlayer] = useState("Tất cả")

  // 🎯 BƯỚC 3: TÍNH TOÁN BỘ ĐẾM (COUNT)
  const typeCounts = ALL_MAPS.flatMap(m => m.typeTags).reduce((acc: any, t) => {
    acc[t] = (acc[t] || 0) + 1; return acc;
  }, {});

  const playerCounts = ALL_MAPS.flatMap(m => m.playerTags).reduce((acc: any, t) => {
    acc[t] = (acc[t] || 0) + 1; return acc;
  }, {});

  // 🎯 BƯỚC 4: HÀM PHÂN CẤP ƯU TIÊN CHO QUY MÔ (CUSTOM SORT)
  const getPlayerPriority = (tag: string) => {
    if (tag === "Solo") return 1;
    if (tag.startsWith("Team")) return 2;
    if (tag.includes("v")) return 3;
    if (tag === "Single player") return 4;
    if (tag === "Multiplayer") return 5;
    if (tag === "Co-op") return 6;
    if (tag.includes("người chơi")) return 7;
    return 8;
  };

  const sortedPlayers = Array.from(new Set(ALL_MAPS.flatMap(m => m.playerTags)))
    .sort((a, b) => {
      const priorityA = getPlayerPriority(a);
      const priorityB = getPlayerPriority(b);
      if (priorityA !== priorityB) return priorityA - priorityB;
      return a.localeCompare(b, 'vi', { numeric: true });
    });

  const sortedTypes = Array.from(new Set(ALL_MAPS.flatMap(m => m.typeTags)))
    .sort((a, b) => a.localeCompare(b, 'vi', { sensitivity: 'base' }));

  const uniqueTypes = ["Tất cả", ...sortedTypes];
  const uniquePlayers = ["Tất cả", ...sortedPlayers];

  // LOGIC LỌC
  const filteredMaps = ALL_MAPS.filter((map) => {
    const matchSearch = map.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchType = filterType === "Tất cả" || map.typeTags.includes(filterType)
    const matchPlayer = filterPlayer === "Tất cả" || map.playerTags.includes(filterPlayer)
    return matchSearch && matchType && matchPlayer
  })

  const handleCopy = (e: React.MouseEvent, code: string, id: string) => {
    e.stopPropagation(); navigator.clipboard.writeText(code); setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const handlePlayNow = (e: React.MouseEvent, code: string) => {
    e.stopPropagation(); 
    window.open(`https://c.freefiremobile.com/?m=1E441${code.replace("#", "")}`, "_blank");
  }

  return (
    <div className="pb-12 min-h-screen">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/5 via-background to-background -z-10" />
      
      <div className="container mx-auto px-4 pt-24 md:pt-32">
        <div className="mb-8 flex flex-col gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Kho Bản Đồ</h1>
            <p className="mt-2 text-muted-foreground font-medium">Khám phá và trải nghiệm toàn bộ các bản đồ từ Tuglar Craftland</p>
          </div>

          {/* BỘ LỌC (FILTERS) */}
          <div className="flex flex-col gap-6 p-6 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-md shadow-sm">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input 
                type="text" placeholder="Tìm kiếm tên map..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border border-border/50 rounded-2xl py-3.5 pl-12 pr-4 outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all font-bold"
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-3">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2"><Filter className="h-3 w-3" /> Chế độ chơi / Thể loại</label>
                <div className="flex flex-wrap gap-2">
                  {uniqueTypes.map(type => (
                    <Badge 
                      key={type} onClick={() => setFilterType(type)}
                      className={`cursor-pointer px-3 py-1.5 text-[10px] font-bold transition-all hover:scale-105 active:scale-95 ${filterType === type ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/20' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
                    >
                      {type} {type !== "Tất cả" && <span className="ml-1 opacity-60 font-medium">({typeCounts[type] || 0})</span>}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex-1 space-y-3">
                <label className="text-[10px] font-black uppercase text-muted-foreground flex items-center gap-2"><Users className="h-3 w-3" /> Quy mô / Số người</label>
                <div className="flex flex-wrap gap-2">
                  {uniquePlayers.map(player => (
                    <Badge 
                      key={player} onClick={() => setFilterPlayer(player)}
                      className={`cursor-pointer px-3 py-1.5 text-[10px] font-bold transition-all hover:scale-105 active:scale-95 ${filterPlayer === player ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/20' : 'bg-muted/50 text-muted-foreground hover:bg-muted'}`}
                    >
                      {player} {player !== "Tất cả" && <span className="ml-1 opacity-60 font-medium">({playerCounts[player] || 0})</span>}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GRID MAP */}
        {filteredMaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 select-none">
            {filteredMaps.map((map) => (
              <div key={map.id} onClick={() => router.push(`/maps/${map.id}`)} className="block group/card cursor-pointer">
                <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-yellow-500/50 hover:shadow-2xl hover:shadow-yellow-500/10 rounded-3xl h-full flex flex-col">
                  <div className="relative aspect-[485/220] overflow-hidden shrink-0">
                    <img src={map.image} alt={map.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105" />
                    <div className="absolute left-3 top-3"><Badge className="bg-black/60 text-white text-[9px] font-bold uppercase">{map.displayType}</Badge></div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white border border-white/10">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />{map.favourite}
                    </div>
                  </div>

                  <CardContent className="p-5 flex flex-col flex-1 justify-between gap-4">
                    <div>
                      <h3 className="text-base font-black tracking-tight flex items-center gap-1.5 group-hover/card:text-yellow-600 transition-colors uppercase">
                        {map.featured && <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />}
                        <span className="line-clamp-1">{map.name}</span>
                      </h3>
                      <div className="mt-1 flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{map.displayPlayers}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{DIFFICULTY_MAP[map.difficulty as keyof typeof DIFFICULTY_MAP] || "Trung Bình"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button onClick={(e) => handlePlayNow(e, map.shortCode)} className="flex-1 h-10 bg-yellow-500 text-black hover:bg-yellow-600 font-black uppercase text-[10px] rounded-xl transition-all shadow-md shadow-yellow-500/20">
                            <Play className="mr-2 h-3 w-3 fill-current" /> CHƠI
                        </Button>
                        <Button variant="outline" size="icon" onClick={(e) => handleCopy(e, map.shortCode, map.id)} className="h-10 w-10 shrink-0 rounded-xl">
                          {copiedId === map.id ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 border border-dashed border-border/50 rounded-3xl bg-card/20">
            <h2 className="text-xl font-bold text-muted-foreground uppercase">Không tìm thấy map nào 🥲</h2>
            <Button onClick={() => { setSearchQuery(""); setFilterType("Tất cả"); setFilterPlayer("Tất cả"); }} className="mt-4 bg-yellow-500 text-black font-bold uppercase rounded-xl">Xóa bộ lọc</Button>
          </div>
        )}
      </div>
    </div>
  )
}