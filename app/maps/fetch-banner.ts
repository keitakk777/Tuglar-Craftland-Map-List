// @ts-nocheck
import { getDirectImageUrl } from "./fetch-map";

function parseCSVObj(csvText: string) {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const currentline = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj: any = {};
    for (let j = 0; j < headers.length; j++) {
      let val = currentline[j] || "";
      obj[headers[j]] = val.replace(/^"|"$/g, '').trim(); 
    }
    result.push(obj);
  }
  return result;
}

export async function getEventsData() {
  // 🎯 LINK NÀY CHUYÊN ĐỂ LẤY TAB "BANNER WEB"
  const BANNER_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=1652673201&single=true&output=csv";

  try {
    const res = await fetch(BANNER_SHEET_URL, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Lỗi kết nối");
    const csvText = await res.text();
    const rows = parseCSVObj(csvText);

    return rows.map((row: any) => {
      if (!row['ID']) return null;

      let endTimeStr = row['End Time'] || "";
      if (endTimeStr && endTimeStr.includes("/")) {
          const parts = endTimeStr.split(" ");
          const dateParts = parts[0].split("/");
          if (dateParts.length === 3) endTimeStr = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${parts[1] || "00:00:00"}`;
      }

      const rawMilestones = row['Milestones'] || "";
      const milestones = rawMilestones.split(";").filter(Boolean).map((m: string) => {
        const parts = m.split("|");
        if (parts.length < 2) return null;
        return { date: parts[0].trim(), label: parts[1].trim() };
      }).filter((m: any) => m !== null);

      return {
        id: row['ID'],
        tag: row['Tag'] || "Sự kiện",
        title: (row['Title'] || "").replace(/\\n/g, '\n'),
        description: row['Description'] || "",
        image: getDirectImageUrl(row['Banner Link'] || ""),
        status: row['Status'] || "Đang diễn ra",
        prize: row['Prize'] || "",
        prizeUnit: row['Prize Unit'] || "",
        participants: row['Participants'] || "0",
        date: row['Date Range'] || "",
        endTime: endTimeStr,
        actionText: row['Action Text'] || "Tham gia",
        actionLink: row['Action Link'] || "#",
        milestones: milestones
      };
    }).filter(Boolean);

  } catch (e) {
    console.error("Lỗi fetch Events", e);
    return [];
  }
}