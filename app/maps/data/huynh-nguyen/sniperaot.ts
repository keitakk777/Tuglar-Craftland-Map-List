export const mapSniperAOT = {
  name: "Sniper AOT",
  creator: "Huỳnh Nguyễn", 
  mode: "Bắn tỉa",
  difficulty: 3, // 🎯 Thêm dòng này để nó hiện là "Dễ" ở khắp mọi nơi
  featured: false, // 🎯 THÊM DÒNG NÀY VÀO NÈ NÍ!
  
  // 🎯 GIAO DIỆN: Card hiện 6v6 nhìn rất "chiến" và đông vui
  teamType: "6v6",
  
  // 🎯 PHÂN LOẠI THỂ LOẠI: Tập trung vào chất Anime và kỹ năng bắn tỉa
  modeTags: [
    "Anime", 
    "Sniper", 
    "Attack on Titan", 
    "Hành động",
    "Bay nhảy",
    "Đối kháng"
  ],

  // 🎯 PHÂN LOẠI QUY MÔ: Sắp xếp theo đúng logic Leader vừa chốt
  teamTags: [
    "6v6", 
    "2 đội", 
    "12 người chơi",
    "Multiplayer"
  ],

  // Code lấy từ link ní gửi: 6C77E92A3B10FA82DCF59265FDFF76454476
  shortCode: "#FREEFIRE6C77E92A3B10FA82DCF59265FDFF76454476", 
  likes: "45",
  plays: "892",
  version: "1.0",
  updateDate: "21/10/2025",
  videoUrl: "", // Đang đợi Editor của ní quay clip highlight nhé
  
  description: "Trải nghiệm cảm giác trở thành xạ thủ trong thế giới Attack on Titan. Những trận đấu súng bắn tỉa kịch tính với tốc độ cao và góc nhìn bao quát.",
  
  // Ní nhớ bỏ ảnh banner vào đúng đường dẫn này nhé
  banner: "/map-cover/huynh-nguyen/Sniper AOT.jpg",
  
  // 🏆 ACHIEVEMENTS: Đã sửa lại cho đúng chất xạ thủ
  achievements: [
    { rank: "#1", title: "Map Sniper chủ đề Anime ấn tượng nhất", type: "gold" },
    { rank: "Top", title: "Xạ thủ AOT xuất sắc", type: "blue" }
  ],
  
  patchNotes: [
    { title: "Ra mắt chính thức", ver: "1.0", content: "- Khởi chạy chế độ Sniper 6v6.\n- Tối ưu hóa địa hình theo phong cách AOT.\n- Cân bằng sát thương súng ngắm." },
  ]
}