export const mapParkourBanhSinhNhat = {
  // --- THÔNG TIN CƠ BẢN ---
  name: "Parkour Bánh Sinh Nhật",
  creator: "Hoài Ân",
  mode: "Parkour",
  difficulty: 2,      // Dễ - Phù hợp để giải trí nhẹ nhàng
  featured: false,    // Map này đang ở mức khởi đầu, để false cho hợp lý ní nhé
  version: "1.0",
  updateDate: "08/04/2026",

  // --- GIAO DIỆN & MÃ MAP ---
  teamType: "Solo",   // Giữ nguyên chuẩn Solo của Leader
  shortCode: "#1B59C0",
  
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
  description: "Chào mừng bạn đến với bữa tiệc sinh nhật đầy thử thách! Hãy vượt qua những chiếc bánh ngọt khổng lồ được thiết kế theo phong cách Pixel để về đích. Đừng để bị 'ngọt' quá mà rơi xuống nhé!",
  banner: "/map-cover/hoai-an/Banner 1_2 Parkour Bánh Sinh Nhật.jpg",        // 1 ký tự để ní sửa cho nhanh
  videoUrl: "", 

  // --- CHỈ SỐ (Lấy chính xác từ hình ảnh) ---
  likes: "185",
  plays: "325",

  // --- DANH HIỆU & CẬP NHẬT ---
  achievements: [
    { rank: "#1", title: "Map Parkour chủ đề Party rực rỡ", type: "gold" },
    { rank: "Top", title: "Vua phá tiệc sinh nhật", type: "blue" }
  ],
  
  patchNotes: [
    { title: "Ra mắt bữa tiệc", ver: "1.0", content: "- Khởi tạo địa hình chủ đề Bánh Sinh Nhật.\n- Thiết kế các chướng ngại vật Pixel màu sắc.\n- Tối ưu hóa cho chế độ thi đấu nhiều người." },
  ]
}