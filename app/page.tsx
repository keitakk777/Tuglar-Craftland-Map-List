import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MapCarousel } from "@/components/map-carousel"
import { TeamCarousel } from "@/components/team-carousel" 
import { Flame, Shield } from "lucide-react"

import { mapDetails } from "./maps/data/index"

// 🎯 TỪ ĐIỂN LOGO CÁC TEAM
// ⚠️ QUAN TRỌNG: Nhớ lưu file logo của glx vào thư mục public/team-avatar/ với tên glx.png
const TEAM_LOGOS: Record<string, string> = {
  "Tuglar Craftland": "/team-avatar/tuglar craftland avt.jpg", 
  "GLX Craftland": "/team-avatar/GLX Craftland AVT.jpg", // 🎯 Đã cập nhật đúng tên team và đường dẫn ảnh
}

// 🎯 CHUẨN HÓA DATA VÀ LẬT NGƯỢC
const ALL_MAPS = Object.entries(mapDetails).map(([key, data]: [string, any]) => {
  const normalizedTeamType = data.teamType === "1 người" ? "Solo" : (data.teamType || "Tự do");

  return {
    id: key, 
    name: data.name,
    displayType: data.mode || "Chưa phân loại", 
    displayPlayers: normalizedTeamType, 
    team: data.team || "Không có", 
    favourite: data.likes || "0",
    difficulty: data.difficulty || 3, 
    image: data.banner || "/map-cover/Banner Chưa có.png", 
    featured: data.featured || false,
    isTrending: data.isTrending || false,
    isTuglar: data.isTuglar || false,
  };
}).reverse(); 

export default function Home() {
  // 🎯 1. LỌC DATA CHO CÁC DÒNG MAP CHỮ NHẬT
  const trendingMaps = ALL_MAPS.filter(map => map.isTrending);
  const tuglarOriginals = ALL_MAPS.filter(map => map.team === "Tuglar Craftland" || map.isTuglar);
  
  // 🎯 2. LỌC DATA CHO DÒNG ĐỘI NGŨ NỔI BẬT (Hình vuông)
  const teamNames = Array.from(new Set(ALL_MAPS.map(map => map.team))).filter(
    team => team !== "Không có" && team !== "Không thuộc đội nào cả"
  );

  const featuredTeams = teamNames.map(teamName => {
    // Đếm xem team này có bao nhiêu map
    const mapCount = ALL_MAPS.filter(map => map.team === teamName).length;
    return {
      name: teamName,
      logo: TEAM_LOGOS[teamName] || "/team-avatar/tuglar craftland avt.jpg", // Dùng logo mặc định nếu chưa set
      mapCount: mapCount
    }
  }).sort((a, b) => b.mapCount - a.mapCount); // Team nào nhiều map hơn thì đứng trước

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/5 via-[#0a0f1a] to-[#020617] -z-10" />
      
      <Header />
      
      <main className="pt-24 pb-10">
        <div className="container mx-auto flex flex-col gap-4">
          
          {/* SECTION 1: MAP CAROUSEL (Thẻ chữ nhật) */}
          {trendingMaps.length > 0 && (
            <MapCarousel 
              title="Đang Thịnh Hành" 
              icon={<Flame className="h-6 w-6 text-orange-500" />} 
              maps={trendingMaps} 
            />
          )}

          {/* SECTION 2: MAP CAROUSEL (Thẻ chữ nhật) */}
          {tuglarOriginals.length > 0 && (
            <MapCarousel 
              title="Các map của Tuglar Craftland" 
              icon={
                <div className="bg-slate-900 dark:bg-transparent p-1 rounded-full flex items-center justify-center">
                  <img 
                    src="/icon/icon short tuglar dark.png" 
                    alt="Tuglar Logo" 
                    className="h-6 w-6 object-contain drop-shadow-[0_0_10px_rgba(234,179,8,0.5)] dark:invert dark:brightness-200 transition-all" 
                  />
                </div>
              } 
              maps={tuglarOriginals} 
            />
          )}

          {/* 🎯 SECTION 3: TEAM CAROUSEL (Thẻ hình vuông) */}
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