import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapCarousel } from "@/components/map-carousel"
import { TeamCarousel } from "@/components/team-carousel" 
import { Flame, Shield } from "lucide-react"

// 🎯 IMPORT HÀM HÚT DATA MỚI TẠO
import { getMapsData } from "./maps/fetch-data" 

const TEAM_LOGOS: Record<string, string> = {
  "Tuglar Craftland": "/team-avatar/tuglar craftland avt.jpg", 
  "GLX Craftland": "/team-avatar/GLX Craftland AVT.jpg",
}

// 🎯 THÊM CHỮ ASYNC ĐỂ CHỜ DỮ LIỆU TỪ GOOGLE
export default async function Home() {
  
  // 🎯 HÚT TOÀN BỘ MAP TỪ GOOGLE SHEETS
  const ALL_MAPS = await getMapsData();

  // BỘ LỌC MAP (GIỮ NGUYÊN)
  const trendingMaps = ALL_MAPS.filter(map => map.isTrending);
  const tuglarOriginals = ALL_MAPS.filter(map => map.team === "Tuglar Craftland" || map.isTuglar);
  
  const teamNames = Array.from(new Set(ALL_MAPS.map(map => map.team))).filter(
    team => team !== "Không có" && team !== "Không thuộc đội nào cả"
  );

  const featuredTeams = teamNames.map(teamName => {
    const mapCount = ALL_MAPS.filter(map => map.team === teamName).length;
    return {
      name: teamName,
      logo: TEAM_LOGOS[teamName] || "/team-avatar/tuglar craftland avt.jpg",
      mapCount: mapCount
    }
  }).sort((a, b) => b.mapCount - a.mapCount);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/5 via-[#0a0f1a] to-[#020617] -z-10" />
      
      <Header />
      
      <main className="pt-24 pb-10">
        <div className="container mx-auto flex flex-col gap-4">
          
          {trendingMaps.length > 0 && (
            <MapCarousel title="Đang Thịnh Hành" icon={<Flame className="h-6 w-6 text-orange-500" />} maps={trendingMaps} />
          )}

          {tuglarOriginals.length > 0 && (
            <MapCarousel 
              title="Các map của Tuglar Craftland" 
              icon={
                <div className="bg-slate-900 dark:bg-transparent p-1 rounded-full flex items-center justify-center">
                  <img src="/icon/icon short tuglar dark.png" alt="Tuglar Logo" className="h-6 w-6 object-contain drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] dark:invert dark:brightness-200 transition-all" />
                </div>
              } 
              maps={tuglarOriginals} 
            />
          )}

          {featuredTeams.length > 0 && (
            <TeamCarousel title="Đội ngũ sáng tạo nổi bật" icon={<Shield className="h-6 w-6 text-blue-400" />} teams={featuredTeams} />
          )}

        </div>
      </main>
      
      <Footer />
    </div>
  )
}