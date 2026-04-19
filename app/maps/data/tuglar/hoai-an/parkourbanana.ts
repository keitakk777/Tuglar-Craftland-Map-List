export const mapParkourBanana = {
  // 🎯 1. THÔNG TIN CƠ BẢN
  name: "Parkour Banana",
  creator: "Hoài Ân",
  team: "Tuglar Craftland", // 🎯 Khai báo đội nhóm để bộ lọc hoạt động
  shortCode: "#A01F20",
  version: "1.0",
  updateDate: "08/04/2026",
  description: "Trải nghiệm hành trình vượt chướng ngại vật trong thế giới đầy màu sắc của những trái chuối. Map được thiết kế tối ưu cho việc phối hợp 2 người hoặc phá đảo một mình!",

  // 🎯 2. ĐIỀU HƯỚNG HIỂN THỊ TRANG CHỦ (TỰ ĐỘNG BỐC MAP)
  isTrending: true,    // Chỉ số khủng (4.3K Likes) thế này thì phải nằm dòng Trending ngay!
  isTuglar: true,      // Lên dòng Tuglar Originals
  isCommunity: false,  // Map nhà làm -> false
  featured: false,     // Tạm thời chưa bật lửa 🔥 theo ý ní

  // 🎯 3. THỂ LOẠI & QUY MÔ
  mode: "Parkour",
  difficulty: 2,       // Dễ - Phù hợp cho mọi người chơi
  teamType: "Solo",
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

  // 🎯 4. CHỈ SỐ & MEDIA
  likes: "4.3K",
  plays: "7.7K",
  banner: "/map-cover/hoai-an/Banner 1_2 Parkour Banana.jpg",
  videoUrl: "",        // Sẽ cập nhật sau khi có trailer

  // 🎯 5. THÀNH TỰU & BẢN CẬP NHẬT
  achievements: [
    { rank: "#1", title: "Map Parkour chủ đề Banana vui nhộn nhất", type: "gold" },
    { rank: "Top", title: "Kỹ năng nhảy điêu luyện", type: "blue" }
  ],
  patchNotes: [
    { title: "Khởi tạo bản đồ", ver: "1.0", content: "- Ra mắt hệ thống vượt ải chủ đề Banana.\n- Hỗ trợ chế độ chơi đơn và đội 2 người.\n- Tối ưu hóa trải nghiệm di chuyển." },
  ]
}