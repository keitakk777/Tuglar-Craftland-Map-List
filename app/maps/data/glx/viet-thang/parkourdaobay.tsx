export const mapParkourDaoBay = {
  // 🎯 1. THÔNG TIN CƠ BẢN
  name: "Parkour Đảo Bay",
  creator: "WIN Là THUA", 
  team: "GLX Craftland", 
  shortCode: "#M16D94", 
  version: "3.0", 
  updateDate: "19/04/2026",
  description: "Win Là Thua thử thách bạn parkour để lên đảo bay và nhiều điều thú vị đang chờ đợi bạn chơi thử.",
  
  // 🎯 2. ĐIỀU HƯỚNG HIỂN THỊ TRANG CHỦ (TỰ ĐỘNG BỐC MAP)
  isTrending: false,   
  isTuglar: false,     
  isCommunity: true,   
  featured: false,     

  // 🎯 3. THỂ LOẠI & QUY MÔ
  mode: "Parkour",
  difficulty: 3,       
  teamType: "Solo",
  modeTags: [
    "Parkour"
  ],
  teamTags: [
    "Solo", 
    "Đội đơn"
  ],

  // 🎯 4. CHỈ SỐ & MEDIA
  likes: "62",
  plays: "465",
  banner: "/map-cover/banner-default.png", 
  videoUrl: "",        
  
  // 🎯 5. THÀNH TỰU & BẢN CẬP NHẬT
  achievements: [
    { 
      // 🎯 Tăng size lên h-8 w-8, ép màu đen ở nền sáng (brightness-0)
      rank: <img src="/icon/icon craftland 1.png" alt="BTX" className="h-8 w-8 object-contain brightness-0 dark:brightness-100 drop-shadow-md transition-all" />, 
      title: "Map Custom BTX (7/3/2026)", 
      type: "silver" 
    }
  ],
  patchNotes: [
    { title: "Bảng Cập Nhật V3", ver: "3.0", content: "- Cập nhật đồ họa Đảo Bay.\n- Thêm nhiều điều thú vị và thử thách mới." },
  ]
}