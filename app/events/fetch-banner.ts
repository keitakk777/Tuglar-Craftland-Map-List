// app/events/fetch-banner.ts

export interface Milestone {
  date: string;
  label: string;
}

export interface EventBannerData {
  id: string;
  tag: string;
  title: string;
  description: string;
  image: string;
  status: string;
  prize: string;
  prizeUnit: string;
  participants: string;
  date: string;
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
  let delimiter = ",";
  const firstLine = str.split('\n')[0] || "";
  if (firstLine.indexOf('\t') > 0) delimiter = '\t';
  else if ((firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length) delimiter = ';';

  const result = []; let row = []; let inQuotes = false; let val = "";
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (char === '"') { if (inQuotes && str[i + 1] === '"') { val += '"'; i++; } else inQuotes = !inQuotes; }
    else if (char === delimiter && !inQuotes) { row.push(val.trim()); val = ""; }
    else if ((char === "\n" || char === "\r") && !inQuotes) { if (char === "\r" && str[i+1] === "\n") i++; row.push(val.trim()); result.push(row); row = []; val = ""; }
    else val += char;
  }
  if (val || row.length > 0) { row.push(val.trim()); result.push(row); }
  return result;
}

export async function getBannerData(): Promise<EventBannerData[]> {
  try {
    const CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=1652673201&single=true&output=csv"; 
    
    const res = await fetch(CSV_LINK, { cache: 'no-store' });
    const csvText = await res.text();

    if (csvText.toLowerCase().includes("<html") || csvText.toLowerCase().includes("<!doctype")) {
      console.error("LỖI: Link đang trả về trang web HTML. Hãy kiểm tra lại publish.");
      return [];
    }

    const rows = parseCSV(csvText);
    if (rows.length < 2) return [];

    let headerIdx = -1;
    
    // ĐIỂM SỬA CHỮA CHÍNH TẠI ĐÂY: 
    // Bắt buộc dòng tiêu đề phải có chữ 'title' VÀ 'status' để tránh bị nhận diện nhầm dòng "Banner Web" bị gộp ô
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      const rowString = rows[i].join("").toLowerCase();
      if ((rowString.includes("title") || rowString.includes("tiêu đề")) && 
          (rowString.includes("status") || rowString.includes("tag") || rowString.includes("trạng thái"))) {
        headerIdx = i;
        break;
      }
    }
    
    // Nếu vẫn không thấy, ta lấy luôn dòng số 2 (index = 1) vì dòng 1 của bạn bị gộp ô
    if (headerIdx === -1) headerIdx = 1;

    const headers = rows[headerIdx].map((h: string) => h.toLowerCase().trim());
    const getIdx = (keys: string[]) => {
      for (const key of keys) { const found = headers.findIndex(h => h === key); if (found !== -1) return found; }
      for (const key of keys) { const found = headers.findIndex(h => h.includes(key)); if (found !== -1) return found; }
      return -1;
    };

    const idxId = getIdx(["id", "stt"]);
    const idxTag = getIdx(["tag", "thẻ"]);
    const idxTitle = getIdx(["title", "tên", "tiêu đề"]);
    const idxDesc = getIdx(["description", "mô tả"]);
    const idxImage = getIdx(["convert", "banner", "ảnh", "hình"]);
    const idxStatus = getIdx(["status", "trạng thái"]);
    const idxPrize = getIdx(["prize", "giải"]);
    const idxPrizeUnit = getIdx(["unit", "đơn vị"]);
    const idxParticipants = getIdx(["participants", "người tham gia"]);
    const idxDateRange = getIdx(["date", "thời gian"]);
    const idxEndTime = getIdx(["end", "hạn"]);
    const idxActionText = getIdx(["action text", "nút"]);
    const idxActionLink = getIdx(["action link", "link"]);
    const idxMilestones = getIdx(["milestones", "lộ trình"]);

    const banners: EventBannerData[] = [];

    for (let i = headerIdx + 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 3) continue;

      let rawMilestones = idxMilestones >= 0 && row[idxMilestones] ? String(row[idxMilestones]) : "";
      let milestones: Milestone[] = [];
      if (rawMilestones) {
        const parts = rawMilestones.split(/;|\\n|\n/);
        for (const p of parts) {
          if (p.includes("|")) {
            const [d, l] = p.split("|");
            if (d && l) milestones.push({ date: d.trim(), label: l.trim() });
          }
        }
      }

      const title = idxTitle >= 0 && row[idxTitle] ? String(row[idxTitle]).trim() : "";
      // Nếu dòng này không có Title, bỏ qua (để lọc các dòng trống dưới cùng của sheet)
      if (!title) continue;

      banners.push({
        id: idxId >= 0 && row[idxId] ? String(row[idxId]) : Math.random().toString(),
        tag: idxTag >= 0 && row[idxTag] ? String(row[idxTag]) : "Sự kiện",
        title: title,
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