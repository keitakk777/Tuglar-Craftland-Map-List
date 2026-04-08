export const mapParkourPanda = {
  // --- THÔNG TIN CƠ BẢN ---
  name: "Parkour Panda",
  creator: "Hoài Ân",
  mode: "Parkour",
  difficulty: 4,      // Khó - Theo đúng tag trong hình của ní
  featured: true,     // Map này lượt chơi khá cao, cho lên nổi bật luôn nhé
  version: "1.0",
  updateDate: "08/04/2026",

  // --- GIAO DIỆN & MÃ MAP ---
  teamType: "Solo",    // Hiển thị quy mô đối kháng 6v6
  shortCode: "#A01Y40",
  
  // --- PHÂN LOẠI TAG (Bộ lọc) ---
  modeTags: [
    "Parkour", 
    "Vượt ải", 
    "Pixel",          // Tag đặc trưng trong hình
    "Thử thách"
  ],
  teamTags: [
    "Multiplayer",
    "12 người chơi"
  ],

  // --- NỘI DUNG HIỂN THỊ ---
  description: "Chào mừng đến với thử thách Parkour Panda! Một hành trình vượt chướng ngại vật đầy khó khăn với phong cách nghệ thuật Pixel độc đáo. Hãy chứng minh kỹ năng di chuyển của bạn để chinh phục đỉnh cao cùng đồng đội!",
  banner: "/map-cover/hoai-an/Banner 1_2 Parkour Panda.jpg", 
  videoUrl: "", 

  // --- CHỈ SỐ (Lấy chính xác từ hình ảnh) ---
  likes: "1.3K",
  plays: "4.6K",

  // --- DANH HIỆU & CẬP NHẬT ---
  achievements: [
    { rank: "#1", title: "Sáng tạo phong cách Pixel nghệ thuật", type: "gold" },
    { rank: "Pro", title: "Kỹ năng Parkour thượng thừa", type: "blue" }
  ],
  
  patchNotes: [
    { title: "Khởi tạo thế giới Panda", ver: "1.0", content: "- Xây dựng địa hình Parkour phong cách Pixel.\n- Thiết lập chế độ đối kháng 6 đội 6.\n- Tối ưu hóa hệ thống Checkpoint." },
  ]
}