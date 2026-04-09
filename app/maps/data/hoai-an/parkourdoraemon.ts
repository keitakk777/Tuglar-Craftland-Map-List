export const mapParkourDoraemon = {
  // 🎯 1. THÔNG TIN CƠ BẢN
  name: "Parkour Doraemon",
  creator: "Hoài Ân",
  team: "Tuglar Craftland", // 🎯 Khai báo đội nhóm để ăn bộ lọc
  shortCode: "#F00A50",
  version: "1.0",
  updateDate: "08/04/2026",
  description: "Tham gia hành trình khám phá thế giới của chú mèo máy Doraemon thông qua những thử thách Parkour đầy màu sắc. Vượt qua những địa hình quen thuộc được tái hiện theo phong cách Pixel cực kỳ dễ thương!",

  // 🎯 2. ĐIỀU HƯỚNG HIỂN THỊ TRANG CHỦ (TỰ ĐỘNG BỐC MAP)
  isTrending: true,    // Chỉ số quá khủng, cho mọc rễ ở dòng Đang Thịnh Hành luôn!
  isTuglar: true,      // Lên dòng Tuglar Originals
  isCommunity: false,
  featured: true,      // Bật lửa 🔥 nổi bật đúng ý Leader

  // 🎯 3. THỂ LOẠI & QUY MÔ
  mode: "Parkour",
  difficulty: 2,       // Dễ - Theo đúng tag
  teamType: "Solo",
  modeTags: [
    "Parkour", 
    "Vượt ải", 
    "Pixel", 
    "Thử thách"
  ],
  teamTags: [
    "Multiplayer",
    "12 người chơi"
  ],

  // 🎯 4. CHỈ SỐ & MEDIA
  likes: "6.9K",
  plays: "15.1K",
  banner: "/map-cover/hoai-an/Banner 1_2 Parkour Doremon new.jpg", 
  videoUrl: "", 

  // 🎯 5. THÀNH TỰU & BẢN CẬP NHẬT
  achievements: [
    { rank: "#1", title: "Map Parkour Anime được yêu thích nhất", type: "gold" },
    { rank: "S", title: "Bậc thầy túi thần kỳ", type: "blue" }
  ],
  patchNotes: [
    { title: "Khởi tạo thế giới mèo máy", ver: "1.0", content: "- Ra mắt hệ thống vượt ải chủ đề Doraemon.\n- Tái hiện khung cảnh Nobita và những người bạn.\n- Tối ưu hóa hiệu ứng hình ảnh Pixel." },
  ]
}