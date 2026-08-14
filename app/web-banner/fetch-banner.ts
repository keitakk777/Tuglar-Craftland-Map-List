// app/maps/fetch-banner.ts

export interface Milestone {
  date: string;
  label: string;
}

export interface EventBannerData {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;  // Lưu ý: Đã đổi thành 'image' thay vì 'imageUrl'
  status: string;
  prize: string;
  prizeUnit: string;
  participants: string;
  date: string;  // Đã đổi thành 'date' thay vì 'dateRange'
  endTime: string;
  actionText: string;
  actionLink: string;
  milestones: Milestone[];
}

const ERROR_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23450a0a'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='20' font-weight='bold' fill='%23ef4444' text-anchor='middle'%3ETHI%E1%BA%BEU%20%E1%BA%A2NH%20BANNER%3C/text%3E%3C/svg%3E";

export function getDirectImageUrl(rawUrl: string) {
  if (!rawUrl || rawUrl === "undefined" || rawUrl === "") return ERROR_IMAGE;
  if (rawUrl.includes("googleusercontent.com") || rawUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return rawUrl;
  const driveRegex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = rawUrl.match(driveRegex);
  if (match && match[1]) return "https://lh3.googleusercontent.com/d/" + match[1];
  return rawUrl;
}

function parseCSV(str: string) {
  const result = []; let row = []; let inQuotes = false; let val = "";
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (char === '"') { if (inQuotes && str[i + 1] === '"') { val += '"'; i++; } else inQuotes = !inQuotes; }
    else if (char === "," && !inQuotes) { row.push(val.trim()); val = ""; }
    else if ((char === "\n" || char === "\r") && !inQuotes) { if (char === "\r" && str[i+1] === "\n") i++; row.push(val.trim()); result.push(row); row = []; val = ""; }
    else val += char;
  }
  if (val || row.length > 0) { row.push(val.trim()); result.push(row); }
  return result;
}

export async function getBannerData(): Promise<EventBannerData[]> {
  try {
    const CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=319803875&single=true&output=csv"; 
    
    const res = await fetch(CSV_LINK, { cache: 'no-store' });
    const csvText = await res.text();
    const rows = parseCSV(csvText);
    if (rows.length < 2) return [];

    let headerIdx = -1;
    for (let i = 0; i < Math.min(3, rows.length); i++) {
      if (rows[i].join("").toLowerCase().includes("title") || rows[i].join("").toLowerCase().includes("banner")) {
        headerIdx = i;
        break;
      }
    }
    if (headerIdx === -1) headerIdx = 0;

    const headers = rows[headerIdx].map((h: string) => h.toLowerCase().trim());
    const getIdx = (keys: string[]) => {
      for (const key of keys) { const found = headers.findIndex(h => h === key); if (found !== -1) return found; }
      for (const key of keys) { const found = headers.findIndex(h => h.includes(key)); if (found !== -1) return found; }
      return -1;
    };

    const idxId = getIdx(["id", "stt"]);
    const idxTag = getIdx(["tag"]);
    const idxTitle = getIdx(["title", "tên"]);
    const idxDesc = getIdx(["description", "mô tả"]);
    const idxImage = getIdx(["convert id link", "banner link", "ảnh"]);
    const idxStatus = getIdx(["status", "trạng thái"]);
    const idxPrize = getIdx(["prize", "giải"]);
    const idxPrizeUnit = getIdx(["prize unit", "đơn vị"]);
    const idxParticipants = getIdx(["participants", "người tham gia"]);
    const idxDateRange = getIdx(["date range", "thời gian"]);
    const idxEndTime = getIdx(["end time", "hạn"]);
    const idxActionText = getIdx(["action text", "nút"]);
    const idxActionLink = getIdx(["action link", "link"]);
    const idxMilestones = getIdx(["milestones", "lộ trình"]);

    const banners: EventBannerData[] = [];

    for (let i = headerIdx + 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 5) continue;

      let rawMilestones = idxMilestones >= 0 && row[idxMilestones] ? String(row[idxMilestones]) : "";
      let milestones: Milestone[] = [];
      if (rawMilestones) {
        const parts = rawMilestones.split(";");
        for (const p of parts) {
          const [d, l] = p.split("|");
          if (d && l) milestones.push({ date: d.trim(), label: l.trim() });
        }
      }

      banners.push({
        id: idxId >= 0 && row[idxId] ? String(row[idxId]) : Math.random().toString(),
        tag: idxTag >= 0 && row[idxTag] ? String(row[idxTag]) : "Sự kiện",
        title: idxTitle >= 0 && row[idxTitle] ? String(row[idxTitle]) : "Chưa có tiêu đề",
        description: idxDesc >= 0 && row[idxDesc] ? String(row[idxDesc]) : "",
        image: idxImage >= 0 && row[idxImage] ? getDirectImageUrl(String(row[idxImage])) : ERROR_IMAGE,
        status: idxStatus >= 0 && row[idxStatus] ? String(row[idxStatus]) : "Đang diễn ra",
        prize: idxPrize >= 0 && row[idxPrize] ? String(row[idxPrize]) : "-",
        prizeUnit: idxPrizeUnit >= 0 && row[idxPrizeUnit] ? String(row[idxPrizeUnit]) : "",
        participants: idxParticipants >= 0 && row[idxParticipants] ? String(row[idxParticipants]) : "0",
        date: idxDateRange >= 0 && row[idxDateRange] ? String(row[idxDateRange]) : "-",
        endTime: idxEndTime >= 0 && row[idxEndTime] ? String(row[idxEndTime]) : "",
        actionText: idxActionText >= 0 && row[idxActionText] ? String(row[idxActionText]) : "Tham gia",
        actionLink: idxActionLink >= 0 && row[idxActionLink] ? String(row[idxActionLink]) : "#",
        milestones
      });
    }

    return banners;
  } catch (error) {
    console.error("Lỗi khi lấy data BANNER:", error);
    return [];
  }
}