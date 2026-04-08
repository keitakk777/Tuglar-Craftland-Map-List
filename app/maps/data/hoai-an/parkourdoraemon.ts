export const mapParkourDoraemon = {
  // --- THÔNG TIN CƠ BẢN ---
  name: "Parkour Doraemon",
  creator: "Hoài Ân",
  mode: "Parkour",
  difficulty: 2,      // Dễ - Theo đúng tag trong hình của ní
  featured: true,     // Lượt chơi 15.1K cực cao, ưu tiên lên nổi bật
  version: "1.0",
  updateDate: "08/04/2026",

  // --- GIAO DIỆN & MÃ MAP ---
  teamType: "Solo",   // Giữ nguyên theo yêu cầu Leader
  shortCode: "#F00A50",
  
  // --- PHÂN LOẠI TAG (Bộ lọc giữ nguyên) ---
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

  // --- NỘI DUNG HIỂN THỊ ---
  description: "Tham gia hành trình khám phá thế giới của chú mèo máy Doraemon thông qua những thử thách Parkour đầy màu sắc. Vượt qua những địa hình quen thuộc được tái hiện theo phong cách Pixel cực kỳ dễ thương!",
  banner: "/map-cover/hoai-an/Banner 1_2 Parkour Doremon new.jpg",        // 1 ký tự để ní sửa cho nhanh
  videoUrl: "", 

  // --- CHỈ SỐ (Lấy chính xác từ hình ảnh) ---
  likes: "6.9K",
  plays: "15.1K",

  // --- DANH HIỆU & CẬP NHẬT ---
  achievements: [
    { rank: "#1", title: "Map Parkour Anime được yêu thích nhất", type: "gold" },
    { rank: "S", title: "Bậc thầy túi thần kỳ", type: "blue" }
  ],
  
  patchNotes: [
    { title: "Khởi tạo thế giới mèo máy", ver: "1.0", content: "- Ra mắt hệ thống vượt ải chủ đề Doraemon.\n- Tái hiện khung cảnh Nobita và những người bạn.\n- Tối ưu hóa hiệu ứng hình ảnh Pixel." },
  ]
}