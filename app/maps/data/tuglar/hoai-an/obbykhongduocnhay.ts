export const mapObbyKhongDuocNhay = {
  // 🎯 1. THÔNG TIN CƠ BẢN
  name: "Obby Không Được Nhảy",
  creator: "Hoài Ân", 
  team: "Tuglar Craftland", // 🎯 Đã thêm team để bộ lọc nhận diện
  shortCode: "#7C47X0", 
  version: "1.0",
  updateDate: "22/03/2026",
  description: "Trải nghiệm phong cách Parkour hoàn toàn mới: Di chuyển khéo léo để về đích mà KHÔNG ĐƯỢC nhấn nút nhảy. Một thử thách cực hạn cho sự kiên nhẫn!",
  
  // 🎯 2. ĐIỀU HƯỚNG HIỂN THỊ TRANG CHỦ (TỰ ĐỘNG BỐC MAP)
  isTrending: false,   // Map mới ra chưa hot lắm nên tạm để false, lúc nào lên xu hướng thì ní bật true nhé
  isTuglar: true,      // Hoài Ân là mem Tuglar -> Lên dòng "Tuglar Originals"
  isCommunity: false,  // Map nhà làm nên để false
  featured: false,     // Không hiện ngọn lửa 🔥

  // 🎯 3. THỂ LOẠI & QUY MÔ
  mode: "Parkour",
  difficulty: 2,       // Hiện "Dễ" ở mọi nơi
  teamType: "Solo",
  modeTags: [
    "Parkour",
    "Độc lạ",
    "Thách thức",
    "Vượt ải"
  ],
  teamTags: [
    "Solo", 
    "Multiplayer",
    "10 người chơi"
  ],

  // 🎯 4. CHỈ SỐ & MEDIA
  likes: "2",
  plays: "8",
  banner: "/map-cover/hoai-an/Cover Hoài Ân Khong dc nhay.webp", 
  videoUrl: "",        // Không có video, để chuỗi rỗng chuẩn bài
  
  // 🎯 5. THÀNH TỰU & BẢN CẬP NHẬT
  achievements: [
    { rank: "#1", title: "Map Parkour sáng tạo cơ chế 'No-Jump' đầu tiên", type: "gold" }
  ],
  patchNotes: [
    { title: "Ra mắt bản thử nghiệm", ver: "1.0", content: "- Thiết lập hệ thống cảm biến chặn nhảy.\n- Xây dựng 10 giai đoạn vượt ải cơ bản.\n- Tối ưu hóa cho cả chơi đơn và chơi nhiều người." },
  ]
}