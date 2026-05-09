// 🎯 HÀM HÚT DATA SỰ KIỆN TỪ GOOGLE SHEETS BẢN CHUẨN
export async function getEventsData() {
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=1652673201&single=true&output=csv";

  try {
    const res = await fetch(SHEET_URL, { next: { revalidate: 60 } });
    const csvText = await res.text();
    const rows = parseCSV(csvText); 

    // Bỏ qua 2 dòng đầu (dòng title ",Banner web" và dòng Header)
    return rows.slice(2).map(row => {
      if (!row[0]) return null; // Bỏ qua nếu cột ID trống

      // 🎯 Dùng link ảnh trực tiếp từ cột "Convert ID Link" (index 5)
      // Nếu cột này trống, fallback sang tự động convert từ link Drive ở cột "Banner Link" (index 4)
      let banner = row[5] || row[4] || "";
      if (banner.includes("drive.google.com")) {
        const fileId = banner.match(/[-\w]{25,}/);
        if (fileId) banner = `https://lh3.googleusercontent.com/d/${fileId[0]}`;
      }

      // 🎯 Xử lý Milestones (Thanh tiến trình) từ cột O (index 14)
      const rawMilestones = row[14] || "";
      const milestones = rawMilestones.split(";").map(m => {
        const [date, label] = m.split("|");
        return { date, label };
      }).filter(m => m.date);

      // 🎯 Fix lỗi định dạng ngày cho Đồng hồ đếm ngược (End Time)
      // Chuyển "25/05/2026 23:59:59" -> "2026-05-25T23:59:59"
      let endTimeStr = row[11] || "";
      if (endTimeStr && endTimeStr.includes("/")) {
          const parts = endTimeStr.split(" ");
          const dateParts = parts[0].split("/");
          if (dateParts.length === 3) {
              endTimeStr = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${parts[1] || "00:00:00"}`;
          }
      }

      // Trả về Object chuẩn để map thẳng vào UI
      return {
        id: row[0],                        // ID
        tag: row[1],                       // Tag (Cuộc thi)
        title: row[2].replace(/\\n/g, '\n'), // Title (Xử lý xuống dòng)
        description: row[3],               // Description
        image: banner,                     // Banner Link
        status: row[6],                    // Status (Đang diễn ra)
        prize: row[7],                     // Prize (6000)
        prizeUnit: row[8],                 // Prize Unit (KC)
        participants: row[9] || "0",       // Participants (Fallback về 0 nếu trống)
        date: row[10],                     // Date Range (5/5 - 25/5)
        endTime: endTimeStr,               // End Time (Đã fix Format)
        actionText: row[12],               // Action Text
        actionLink: row[13],               // Action Link
        milestones: milestones             // Data lộ trình Node
      };
    }).filter(Boolean); // Xóa các phần tử null

  } catch (e) {
    console.error("Lỗi fetch Events", e);
    return [];
  }
}