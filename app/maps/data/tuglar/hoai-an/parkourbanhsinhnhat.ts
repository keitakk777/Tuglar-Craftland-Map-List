export const mapParkourBanhSinhNhat = {
  // 🎯 1. THÔNG TIN CƠ BẢN
  name: "Parkour Bánh Sinh Nhật",
  creator: "Hoài Ân",
  team: "Tuglar Craftland", // 🎯 Bộ lọc sẽ gom map này vào kho Tuglar
  shortCode: "#1B59C0",
  version: "1.0",
  updateDate: "08/04/2026",
  description: "Chào mừng bạn đến với bữa tiệc sinh nhật đầy thử thách! Hãy vượt qua những chiếc bánh ngọt khổng lồ được thiết kế theo phong cách Pixel để về đích. Đừng để bị 'ngọt' quá mà rơi xuống nhé!",

  // 🎯 2. ĐIỀU HƯỚNG HIỂN THỊ TRANG CHỦ (TỰ ĐỘNG BỐC MAP)
  isTrending: false,   // Đang đà tăng trưởng, tạm ẩn khỏi Trending
  isTuglar: true,      // Lên thẳng băng chuyền Tuglar Originals
  isCommunity: false,  // Map chính chủ -> false
  featured: false,     // Tạm thời chưa bật lửa 🔥

  // 🎯 3. THỂ LOẠI & QUY MÔ
  mode: "Parkour",
  difficulty: 2,       // Dễ - Phù hợp để giải trí nhẹ nhàng
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
  likes: "185",
  plays: "325",
  banner: "/map-cover/hoai-an/Banner 1_2 Parkour Bánh Sinh Nhật.jpg",
  videoUrl: "",        // Đợi có video thì Editor đắp link vào đây

  // 🎯 5. THÀNH TỰU & BẢN CẬP NHẬT
  achievements: [
    { rank: "#1", title: "Map Parkour chủ đề Party rực rỡ", type: "gold" },
    { rank: "Top", title: "Vua phá tiệc sinh nhật", type: "blue" }
  ],
  patchNotes: [
    { title: "Ra mắt bữa tiệc", ver: "1.0", content: "- Khởi tạo địa hình chủ đề Bánh Sinh Nhật.\n- Thiết kế các chướng ngại vật Pixel màu sắc.\n- Tối ưu hóa cho chế độ thi đấu nhiều người." },
  ]
}