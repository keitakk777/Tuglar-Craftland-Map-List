export const mapParkourPanda = {
  // 🎯 1. THÔNG TIN CƠ BẢN
  name: "Parkour Panda",
  creator: "Hoài Ân",
  team: "Tuglar Craftland", // 🎯 Đóng dấu chủ quyền Tuglar
  shortCode: "#A01Y40",
  version: "1.0",
  updateDate: "08/04/2026",
  description: "Chào mừng đến với thử thách Parkour Panda! Một hành trình vượt chướng ngại vật đầy khó khăn với phong cách nghệ thuật Pixel độc đáo. Hãy chứng minh kỹ năng di chuyển của bạn để chinh phục đỉnh cao cùng đồng đội!",

  // 🎯 2. ĐIỀU HƯỚNG HIỂN THỊ TRANG CHỦ (TỰ ĐỘNG BỐC MAP)
  isTrending: true,    // Hơn 4.6K lượt chơi thì phải cho lên Trending thôi!
  isTuglar: true,      // Lên dòng Tuglar Originals
  isCommunity: false,
  featured: true,      // Hiện icon ngọn lửa 🔥 (Map khó, nhiều người chơi)

  // 🎯 3. THỂ LOẠI & QUY MÔ
  mode: "Parkour",
  difficulty: 4,       // Khó - Đúng chuẩn thử thách
  teamType: "Solo",    // (Ní nhớ check lại xem map này chơi Solo hay 6v6 nhé)
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
  likes: "1.3K",
  plays: "4.6K",
  banner: "/map-cover/hoai-an/Banner 1_2 Parkour Panda.jpg", 
  videoUrl: "", 

  // 🎯 5. THÀNH TỰU & BẢN CẬP NHẬT
  achievements: [
    { rank: "#1", title: "Sáng tạo phong cách Pixel nghệ thuật", type: "gold" },
    { rank: "Pro", title: "Kỹ năng Parkour thượng thừa", type: "blue" }
  ],
  patchNotes: [
    { title: "Khởi tạo thế giới Panda", ver: "1.0", content: "- Xây dựng địa hình Parkour phong cách Pixel.\n- Thiết lập chế độ đối kháng 6 đội 6. (Cần check lại logic Solo/6v6)\n- Tối ưu hóa hệ thống Checkpoint." },
  ]
}