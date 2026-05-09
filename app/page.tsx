import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapCarousel } from "@/components/map-carousel"
import { TeamCarousel } from "@/components/team-carousel" 
import { EventBanner } from "@/components/event-banner"
import { Flame, Shield, History } from "lucide-react"

import { getMapsData, getEventsData } from "./maps/fetch-data" 

// Định nghĩa logo cho các team sáng tạo
const TEAM_LOGOS: Record<string, string> = {
  "Tuglar Craftland": "/team-avatar/tuglar craftland avt.jpg", 
  "GLX Craftland": "/team-avatar/GLX Craftland AVT.jpg",
}

export default async function Home() {
  // 🎯 Gọi data song song từ Google Sheets
  const [ALL_MAPS = [], ALL_EVENTS = []] = await Promise.all([
    getMapsData().catch(() => []),
    getEventsData().catch(() => [])
  ]);

  // 1. Lọc các Map có đánh dấu Xu hướng (Trending)
  const trendingMaps = ALL_MAPS.filter(map => map.isTrending);

  // 2. 🎯 TỰ ĐỘNG LẤY TOP 10 MAP MỚI NHẤT TỪ TUGLAR
  // Lấy các bản đồ thuộc team Tuglar và giới hạn 10 cái đầu tiên (đã được sort theo ngày ở fetch-data)
  const latestTuglarMaps = ALL_MAPS
    .filter(map => map.team === "Tuglar Craftland" || map.isTuglar)
    .slice(0, 10); 
  
  // 3. Xử lý danh sách Đội ngũ sáng tạo nổi bật
  const teamNames = Array.from(new Set(ALL_MAPS.map(map => map.team))).filter(
    team => team !== "Không có" && team !== "Không thuộc đội nào cả" && team !== ""
  );

  const featuredTeams = teamNames.map(teamName => {
    const mapCount = ALL_MAPS.filter(map => map.team === teamName).length;
    return {
      name: teamName as string,
      logo: TEAM_LOGOS[teamName as string] || "/team-avatar/tuglar craftland avt.jpg", 
      mapCount: mapCount
    }
  }).sort((a, b) => b.mapCount - a.mapCount);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nền loang màu radial gradient theo phong cách Gaming */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-yellow-500/5 via-[#0a0f1a] to-[#020617] -z-10" />
      
      <Header />
      
      {/* 🎯 pt-16 cho Mobile và pt-24 cho Desktop để giảm khoảng cách với Header */}
      <main className="pt-16 md:pt-24 pb-10">
        
        {/* Banner Sự kiện lớn */}
        {ALL_EVENTS && ALL_EVENTS.length > 0 && (
          <EventBanner events={ALL_EVENTS} />
        )}

        <div className="container mx-auto flex flex-col gap-10 mt-8 md:mt-12">
          
          {/* Section: Map Thịnh Hành */}
          {trendingMaps.length > 0 && (
            <MapCarousel 
              title="Đang Thịnh Hành" 
              icon={<Flame className="h-6 w-6 text-orange-500 fill-current" />} 
              maps={trendingMaps} 
            />
          )}

          {/* Section: Top 10 Map mới cập nhật từ Tuglar */}
          {latestTuglarMaps.length > 0 && (
            <MapCarousel 
              title="Mới cập nhật từ Tuglar" 
              icon={<History className="h-6 w-6 text-blue-500" />} 
              maps={latestTuglarMaps} 
            />
          )}

          {/* Section: Đội ngũ sáng tạo */}
          {featuredTeams.length > 0 && (
            <TeamCarousel 
              title="Đội ngũ sáng tạo nổi bật" 
              icon={<Shield className="h-6 w-6 text-blue-400" />} 
              teams={featuredTeams} 
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
}