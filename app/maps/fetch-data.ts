// @ts-nocheck
const ERROR_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23450a0a'/%3E%3Cg transform='translate(364, 140) scale(3)'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='9' cy='9' r='2' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cline x1='3' y1='3' x2='21' y2='21' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Ctext x='50%25' y='280' font-family='sans-serif' font-size='24' font-weight='bold' fill='%23ef4444' text-anchor='middle'%3ETHIẾU ẢNH ASSET%3C/text%3E%3C/svg%3E";

// 1. HÀM XỬ LÝ LINK ẢNH TỰ ĐỘNG
export function getDirectImageUrl(rawUrl: string) {
  if (!rawUrl || rawUrl === "undefined" || rawUrl === "") return ERROR_IMAGE;
  if (rawUrl.includes("googleusercontent.com") || rawUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return rawUrl;

  const driveRegex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = rawUrl.match(driveRegex);
  
  // 🎯 ĐÃ FIX: Thêm dấu $ vào trước {match[1]}
  if (match && match[1]) return `https://lh3.googleusercontent.com/d/${match[1]}`;
  return rawUrl;
}

// 2. HÀM HÚT DATA MAP
export async function getMapsData() {
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=1542007735&single=true&output=csv";
  try {
    const res = await fetch(SHEET_URL, { next: { revalidate: 0 } }); // revalidate: 0 để test lẹ
    const csvText = await res.text();
    const rows = parseCSV(csvText);
    if (rows.length < 2) return [];
    let headerIdx = rows.findIndex(row => row.join("").toLowerCase().includes("tên") || row.join("").toLowerCase().includes("name"));
    if (headerIdx === -1) return [];
    const headers = rows[headerIdx].map(h => h.toLowerCase().trim());
    const getIdx = (keys: string[]) => {
      for (const key of keys) { const found = headers.findIndex(h => h === key); if (found !== -1) return found; }
      for (const key of keys) { const found = headers.findIndex(h => h.includes(key)); if (found !== -1) return found; }
      return -1;
    };
    const idxName = getIdx(["name", "tên map"]), idxCreator = getIdx(["creator", "tác giả"]), idxCode = getIdx(["mã map", "code"]), idxBanner = getIdx(["link banner", "banner"]), idxGameMode = getIdx(["game mode", "thể loại"]), idxTeamMode = getIdx(["team mode"]), idxDesc = getIdx(["mô tả"]), idxPatch = getIdx(["patch note"]), idxDate = getIdx(["update", "cập nhật"]), idxPreview = getIdx(["preview", "video"]);
    return rows.slice(headerIdx + 1).map((row, i) => {
      if (!row || row.length < 5 || !row[idxName]) return null;
      return {
        id: (row[idxCode] || `map-${i}`).replace("#", "").trim(),
        name: String(row[idxName]).replace(/\[.*?\]/g, "").trim(),
        creator: row[idxCreator] || "Ẩn danh",
        team: "Tuglar Craftland",
        displayType: row[idxGameMode] || "Chế độ",
        typeTags: (row[idxGameMode] || "Chế độ").split(",").map(s => s.trim()).filter(Boolean),
        playerTags: (row[idxTeamMode] || "Tự do").split(",").map(s => s.trim()).filter(Boolean),
        shortCode: row[idxCode] || "",
        image: getDirectImageUrl(row[idxBanner]),
        description: row[idxDesc] || "",
        patchNotes: parsePatchNotes(String(row[idxPatch])),
        preview: formatVideoUrl(String(row[idxPreview])),
        updateDate: row[idxDate] || "Không rõ",
        timestamp: i
      };
    }).filter(Boolean).sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) { return []; }
}

// 3. HÀM HÚT DATA SỰ KIỆN
export async function getEventsData() {
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=1652673201&single=true&output=csv";
  try {
    const res = await fetch(SHEET_URL, { next: { revalidate: 0 } });
    const csvText = await res.text();
    const rows = parseCSV(csvText);
    return rows.slice(2).map(row => {
      if (!row[0]) return null;
      return {
        id: row[0], tag: row[1], title: row[2].replace(/\\n/g, '\n'), description: row[3],
        image: getDirectImageUrl(row[4]), status: row[6], prize: row[7], prizeUnit: row[8],
        participants: row[9] || "0", date: row[10], endTime: row[11], actionText: row[12],
        actionLink: row[13], milestones: (row[14] || "").split(";").map(m => {
          const [date, label] = m.split("|"); return { date, label };
        }).filter(m => m.date)
      };
    }).filter(Boolean);
  } catch (e) { return []; }
}

// 4. HÀM HÚT DATA KHO ASSET
export async function getAssetsData() {
  // ⚠️ KIỂM TRA GID NÀY TRÊN SHEET: Click vào tab Kho Asset xem URL có đúng gid=1055745499 không?
  const ASSET_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=1055745499&single=true&output=csv";
  try {
    const res = await fetch(ASSET_SHEET_URL, { next: { revalidate: 0 } });
    if (!res.ok) return [];
    const csvText = await res.text();
    const rows = parseCSV(csvText);
    if (rows.length < 2) return [];
    let headerIdx = rows.findIndex(row => row.join("").toLowerCase().includes("asset name") || row.join("").toLowerCase().includes("tag"));
    if (headerIdx === -1) return [];
    const headers = rows[headerIdx].map(h => h.toLowerCase().trim());
    const getIdx = (keys: string[]) => {
      for (const key of keys) { const found = headers.findIndex(h => h === key); if (found !== -1) return found; }
      for (const key of keys) { const found = headers.findIndex(h => h.includes(key)); if (found !== -1) return found; }
      return -1;
    };
    const idxName = getIdx(["asset name"]), idxCreator = getIdx(["creator"]), idxPreview = getIdx(["preview link", "preview"]), idxDesc = getIdx(["description"]), idxCap = getIdx(["capacity", "dung lượng"]), idxType = getIdx(["type", "loại"]), idxTag = getIdx(["tag"]), idxCode = getIdx(["asset code"]), idxDown = getIdx(["lượt tải", "download"]);
    return rows.slice(headerIdx + 1).map((row, i) => {
      if (!row || row.length < 3 || !row[idxName]) return null;
      return {
        id: row[0] || `asset-${i}`,
        creator: row[idxCreator] || "Ẩn danh",
        image: getDirectImageUrl(row[idxPreview]),
        name: row[idxName],
        description: row[idxDesc] || "",
        capacity: row[idxCap] || "",
        type: row[idxType] || "Miễn phí",
        tags: (row[idxTag] || "").split(",").map(t => t.trim()).filter(Boolean),
        shortCode: row[idxCode] || "",
        downloads: parseInt(String(row[idxDown]).replace(/[^0-9]/g, '')) || 0
      };
    }).filter(Boolean);
  } catch (e) { return []; }
}

// 5. TIỆN ÍCH
function formatVideoUrl(url) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^?&"'>]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
}
function parseCSV(str) {
  const result = []; let row = [], inQuotes = false, val = "";
  for (let i = 0; i < str.length; i++) {
    let char = str[i];
    if (char === '"') { if (inQuotes && str[i + 1] === '"') { val += '"'; i++; } else inQuotes = !inQuotes; }
    else if (char === "," && !inQuotes) { row.push(val.trim()); val = ""; }
    else if ((char === "\n" || char === "\r") && !inQuotes) { if (char === "\r" && str[i + 1] === "\n") i++; row.push(val.trim()); result.push(row); row = []; val = ""; }
    else val += char;
  }
  if (val || row.length > 0) { row.push(val.trim()); result.push(row); }
  return result;
}
function parsePatchNotes(t) {
  if (!t || t === "undefined") return [];
  return t.split("---").map(b => {
    const l = b.trim().split(/\r?\n/).map(s => s.trim()).filter(Boolean);
    if (l.length === 0) return null;
    const m = l[0].match(/\[(.*?)\]\s*(.*)/);
    return { title: m ? m[2] : l[0], ver: m ? m[1] : "v1.0", content: l.slice(1).join("\n") };
  }).filter(Boolean);
}