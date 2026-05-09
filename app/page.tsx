// app/page.tsx
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapCarousel } from "@/components/map-carousel"
import { TeamCarousel } from "@/components/team-carousel" 
import { EventBanner } from "@/components/event-banner"
import { Flame, Shield, History } from "lucide-react"

import { getMapsData, getEventsData } from "./maps/fetch-data" 

export default async function Home() {
  const [ALL_MAPS = [], ALL_EVENTS = []] = await Promise.all([
    getMapsData().catch(() => []),
    getEventsData().catch(() => [])
  ]);

  const trendingMaps = ALL_MAPS.filter(map => map.isTrending);

  // 🎯 TỰ ĐỘNG LẤY TOP 10 MAP MỚI NHẤT
  // Hàm getMapsData đã sort theo timestamp, nên ta chỉ cần filter team Tuglar và lấy 10 map đầu.
  const latestTuglarMaps = ALL_MAPS
    .filter(map => map.team === "Tuglar Craftland" || map.isTuglar)
    .slice(0, 10); 
  
  // Logic Team nổi bật (Giữ nguyên)
  const teamNames = Array.from(new Set(ALL_MAPS.map(map => map.team))).filter(
    team => team !== "Không có" && team !== "Không thuộc đội nào cả"
  );

  const featuredTeams = teamNames.map(teamName => {
    const mapCount = ALL_MAPS.filter(map => map.team === teamName).length;
    return {
      name: teamName as string,
      logo: "/team-avatar/tuglar craftland avt.jpg", // Fallback logo
      mapCount: mapCount
    }
  }).sort((a, b) => b.mapCount - a.mapCount);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nền loang màu thông minh theo theme */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-yellow-500/5 via-[#0a0f1a] to-[#020617] -z-10" />
      
      <Header />
      
      <main className="pt-24 pb-10">
        {ALL_EVENTS && ALL_EVENTS.length > 0 && (
          <EventBanner events={ALL_EVENTS} />
        )}

        <div className="container mx-auto flex flex-col gap-10 mt-12">
          {trendingMaps.length > 0 && (
            <MapCarousel title="Đang Thịnh Hành" icon={<Flame className="h-6 w-6 text-orange-500 fill-current" />} maps={trendingMaps} />
          )}

          {/* 🎯 HIỂN THỊ TOP 10 MỚI NHẤT */}
          {latestTuglarMaps.length > 0 && (
            <MapCarousel title="Cập nhật mới nhất từ Tuglar" icon={<History className="h-6 w-6 text-blue-500" />} maps={latestTuglarMaps} />
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