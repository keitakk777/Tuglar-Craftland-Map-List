export const mapParkourBanana = {
  // --- THÔNG TIN CƠ BẢN ---
  name: "Parkour Banana",
  creator: "Hoài Ân",
  mode: "Parkour",
  difficulty: 2,      // Dễ - Phù hợp cho mọi người chơi
  featured: false,     // Đưa lên "Bản đồ nổi bật" trang chủ
  version: "1.0",
  updateDate: "08/04/2026",

  // --- GIAO DIỆN & MÃ MAP ---
  teamType: "Solo", // Hiển thị trên Card
  shortCode: "#A01F20",
  
  // --- PHÂN LOẠI TAG (Bộ lọc) ---
  modeTags: [
    "Parkour", 
    "Vượt ải", 
    "Vui nhộn",
    "Thử thách"
  ],
  teamTags: [
    "Solo",
    "Team 2",
    "Multiplayer"
  ],

  // --- NỘI DUNG HIỂN THỊ ---
  description: "Trải nghiệm hành trình vượt chướng ngại vật trong thế giới đầy màu sắc của những trái chuối. Map được thiết kế tối ưu cho việc phối hợp 2 người hoặc phá đảo một mình!",
  banner: "/map-cover/hoai-an/Banner 1_2 Parkour Banana.jpg",
  videoUrl: "", // Sẽ cập nhật sau khi có trailer

  // --- CHỈ SỐ ---
  likes: "4.3K",
  plays: "7.7K",

  // --- DANH HIỆU & CẬP NHẬT ---
  achievements: [
    { rank: "#1", title: "Map Parkour chủ đề Banana vui nhộn nhất", type: "gold" },
    { rank: "Top", title: "Kỹ năng nhảy điêu luyện", type: "blue" }
  ],
  
  patchNotes: [
    { title: "Khởi tạo bản đồ", ver: "1.0", content: "- Ra mắt hệ thống vượt ải chủ đề Banana.\n- Hỗ trợ chế độ chơi đơn và đội 2 người.\n- Tối ưu hóa trải nghiệm di chuyển." },
  ]
}