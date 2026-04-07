import { Flashlight } from "lucide-react";

export const mapObbyKhongDuocNhay = {
  name: "Obby Không Được Nhảy",
  creator: "Hoài Ân", 
  mode: "Parkour",
    difficulty: 2, // 🎯 Thêm dòng này để nó hiện là "Dễ" ở khắp mọi nơi
  featured: false, // 🎯 THÊM DÒNG NÀY VÀO NÈ NÍ!
  
  // 🎯 QUY MÔ: Map này chơi được cả Solo lẫn nhiều người nên để Solo/Multiplayer là chuẩn
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

  shortCode: "#7C47X0", 
  likes: "2",
  plays: "8",
  version: "1.0",
  updateDate: "22/03/2026",

  // 🚫 KHÔNG CÓ PREVIEW: Để chuỗi rỗng. 
  // Component MapDetailView của ní nên check: if (!videoUrl) thì ẩn phần iframe đi.
  videoUrl: "", 

  description: "Trải nghiệm phong cách Parkour hoàn toàn mới: Di chuyển khéo léo để về đích mà KHÔNG ĐƯỢC nhấn nút nhảy. Một thử thách cực hạn cho sự kiên nhẫn!",

  // 🖼️ ẢNH BÌA: Nếu chưa có ảnh riêng, ní có thể để trống "" 
  // để web tự dùng Background Gradient hoặc dùng 1 ảnh "Coming Soon" chung của team.
  banner: "/map-cover/hoai-an/Cover Hoài Ân Khong dc nhay.webp", 
  
  // 🏆 ACHIEVEMENTS: Đã sửa lại cho đúng nội dung map
  achievements: [
    { rank: "#1", title: "Map Parkour sáng tạo cơ chế 'No-Jump' đầu tiên", type: "gold" }
  ],
  
  patchNotes: [
    { title: "Ra mắt bản thử nghiệm", ver: "1.0", content: "- Thiết lập hệ thống cảm biến chặn nhảy.\n- Xây dựng 10 giai đoạn vượt ải cơ bản.\n- Tối ưu hóa cho cả chơi đơn và chơi nhiều người." },
  ]
}