// @ts-nocheck
const ERROR_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23450a0a'/%3E%3Cg transform='translate(364, 140) scale(3)'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='9' cy='9' r='2' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3Cline x1='3' y1='3' x2='21' y2='21' fill='none' stroke='%23ef4444' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/g%3E%3Ctext x='50%25' y='280' font-family='sans-serif' font-size='24' font-weight='bold' fill='%23ef4444' text-anchor='middle'%3ETHIẾU ẢNH BANNER%3C/text%3E%3C/svg%3E";

// ==========================================
// 1. HÀM XỬ LÝ LINK ẢNH TỰ ĐỘNG (DÙNG CHUNG)
// ==========================================
export function getDirectImageUrl(rawUrl: string) {
  if (!rawUrl || rawUrl === "undefined") return ERROR_IMAGE;
  
  if (rawUrl.includes("googleusercontent.com") || rawUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) {
    return rawUrl;
  }

  const driveRegex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = rawUrl.match(driveRegex);
  
  if (match && match[1]) {
    // Ép ID đó thành link ảnh xịn của Google
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }

  return rawUrl;
}

// ==========================================
// 2. HÀM HÚT DATA MAP
// ==========================================
export async function getMapsData() {
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=1542007735&single=true&output=csv";

  try {
    const res = await fetch(SHEET_URL, { next: { revalidate: 60 } });
    const csvText = await res.text();
    const rows = parseCSV(csvText);
    if (rows.length < 2) return [];

    let headerIdx = -1;
    for (let i = 0; i < Math.min(10, rows.length); i++) {
      const rowStr = rows[i].join("").toLowerCase();
      if ((rowStr.includes("tên") || rowStr.includes("name")) && (rowStr.includes("mã") || rowStr.includes("code"))) {
        headerIdx = i; break;
      }
    }
    if (headerIdx === -1) return [];

    const headers = rows[headerIdx].map((h: string) => h.toLowerCase().trim());
    const getIdx = (keys: string[]) => {
      for (const key of keys) { const found = headers.findIndex(h => h === key); if (found !== -1) return found; }
      for (const key of keys) { const found = headers.findIndex(h => h.includes(key)); if (found !== -1) return found; }
      return -1;
    };

    const idxName = getIdx(["name", "tên map", "tựa game", "tên"]);
    const idxCreator = getIdx(["creator", "người tạo", "tác giả"]);
    const idxCode = getIdx(["mã map", "code", "mã"]);
    const idxBanner = getIdx(["link banner web", "link banner", "banner"]); 
    const idxGameMode = getIdx(["game mode", "thể loại", "chế độ"]);
    const idxTeamMode = getIdx(["team mode", "quy mô"]); 
    const idxDesc = getIdx(["mô tả", "hướng dẫn"]);
    const idxPatch = getIdx(["patch note", "patch"]); 
    const idxDate = getIdx(["update", "cập nhật", "ngày", "date"]);
    const idxPreview = getIdx(["preview", "video", "clip"]);

    const maps = [];
    const seenIds = new Set();

    for (let i = headerIdx + 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 5) continue;

      let rawName = idxName >= 0 && row[idxName] ? String(row[idxName]) : "";
      let rawCode = idxCode >= 0 && row[idxCode] ? String(row[idxCode]) : "";
      
      const rowString = row.join(" ");
      if (rowString.includes("Exception: Service invoked") || rowString.includes("#ERROR!") || rawName.includes("Exception")) continue; 

      let rawGameMode = idxGameMode >= 0 && row[idxGameMode] ? String(row[idxGameMode]) : "Chế độ";
      let rawTeamMode = idxTeamMode >= 0 && row[idxTeamMode] ? String(row[idxTeamMode]) : "Tự do";

      const mapName = rawName.replace(/\[([0-9a-fA-F]{6}|b|c|i|s|u|sub|sup)\]/gi, "").replace(/[\r\n\t]+/g, " ").trim();
      const mapCode = rawCode.replace(/[\r\n\s]+/g, "").trim();

      if (!mapName || mapName.toLowerCase().includes("đang tải")) continue;

      let mapId = mapCode.replace("#", "").trim();
      if (!mapId) mapId = `map-${i}`;
      if (seenIds.has(mapId)) mapId = `${mapId}-row-${i}`;
      seenIds.add(mapId);

      let timeScore = i; 
      let rawUpdateDate = "Không rõ";
      if (idxDate >= 0 && row[idxDate]) {
        rawUpdateDate = String(row[idxDate]).trim();
        const parts = rawUpdateDate.split("/"); 
        if (parts.length >= 3) timeScore = new Date(parseInt(parts[2]), parseInt(parts[1])-1, parseInt(parts[0])).getTime();
      }

      const typeTagsList = rawGameMode.split(",").map(s => s.trim()).filter(Boolean);
      const playerTagsList = rawTeamMode.split(",").map(s => s.trim()).filter(Boolean);

      let rawImage = idxBanner >= 0 && row[idxBanner] ? String(row[idxBanner]).trim() : "";
      let mapImage = getDirectImageUrl(rawImage);

      maps.push({
        id: mapId, 
        name: mapName, 
        creator: idxCreator >= 0 && row[idxCreator] ? String(row[idxCreator]) : "Ẩn danh",
        team: "Tuglar Craftland", 
        displayType: rawGameMode,
        typeTags: typeTagsList.length > 0 ? typeTagsList : ["Chế độ"],
        displayPlayers: rawTeamMode,
        playerTags: playerTagsList.length > 0 ? playerTagsList : ["Tự do"],
        shortCode: mapCode,
        image: mapImage,
        description: idxDesc >= 0 && row[idxDesc] ? String(row[idxDesc]) : "",
        patchNotes: idxPatch >= 0 ? parsePatchNotes(String(row[idxPatch])) : [],
        preview: idxPreview >= 0 ? formatVideoUrl(String(row[idxPreview])) : "",
        updateDate: rawUpdateDate, 
        timestamp: timeScore 
      });
    }
    maps.sort((a, b) => b.timestamp - a.timestamp);
    return maps;
  } catch (error) { return []; }
}

// ==========================================
// 3. HÀM HÚT DATA SỰ KIỆN 
// ==========================================
export async function getEventsData() {
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=1652673201&single=true&output=csv";

  try {
    const res = await fetch(SHEET_URL, { next: { revalidate: 60 } });
    const csvText = await res.text();
    const rows = parseCSV(csvText); 

    return rows.slice(2).map(row => {
      if (!row[0]) return null; 

      // 🎯 Dùng hàm chung để tự cắt link ảnh Banner
      let bannerUrl = row[4] || ""; 
      let banner = getDirectImageUrl(bannerUrl);

      const rawMilestones = row[14] || "";
      const milestones = rawMilestones.split(";").map(m => {
        const [date, label] = m.split("|");
        return { date, label };
      }).filter(m => m.date);

      let endTimeStr = row[11] || "";
      if (endTimeStr && endTimeStr.includes("/")) {
          const parts = endTimeStr.split(" ");
          const dateParts = parts[0].split("/");
          if (dateParts.length === 3) {
              endTimeStr = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}T${parts[1] || "00:00:00"}`;
          }
      }

      return {
        id: row[0],
        tag: row[1],
        title: row[2].replace(/\\n/g, '\n'),
        description: row[3],
        image: banner,
        status: row[6],
        prize: row[7],
        prizeUnit: row[8],
        participants: row[9] || "0",
        date: row[10],
        endTime: endTimeStr,
        actionText: row[12],
        actionLink: row[13],
        milestones: milestones
      };
    }).filter(Boolean); 

  } catch (e) {
    console.error("Lỗi fetch Events", e);
    return [];
  }
}

// ==========================================
// 4. HÀM HÚT DATA KHO ASSET (THÔNG MINH TỰ DÒ CỘT)
// ==========================================
export async function getAssetsData() {
  // ⚠️ KIỂM TRA LẠI: Đảm bảo đây ĐÚNG là link Publish CSV của tab "Kho Asset" nha!
  const ASSET_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=ĐIỀN_GID_KHO_ASSET_VÀO_ĐÂY&single=true&output=csv";

  try {
    const res = await fetch(ASSET_SHEET_URL, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    
    const csvText = await res.text();
    const rows = parseCSV(csvText); 
    if (rows.length < 2) return [];

    // 🎯 TỰ ĐỘNG DÒ TÌM VỊ TRÍ CỘT (Khỏi lo ní đổi thứ tự)
    let headerIdx = -1;
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      const rowStr = rows[i].join("").toLowerCase();
      if (rowStr.includes("asset name") || rowStr.includes("asset code") || rowStr.includes("tag")) {
        headerIdx = i; break;
      }
    }
    if (headerIdx === -1) return [];

    const headers = rows[headerIdx].map((h: string) => h.toLowerCase().trim());
    const getIdx = (keys: string[]) => {
      for (const key of keys) { const found = headers.findIndex(h => h === key); if (found !== -1) return found; }
      for (const key of keys) { const found = headers.findIndex(h => h.includes(key)); if (found !== -1) return found; }
      return -1;
    };

    const idxId = getIdx(["id"]);
    const idxName = getIdx(["asset name", "tên"]);
    const idxCreator = getIdx(["creator", "người tạo"]);
    const idxPreview = getIdx(["preview link", "preview", "link"]);
    const idxDesc = getIdx(["description", "mô tả"]);
    const idxCapacity = getIdx(["capacity", "tải trọng", "dung lượng"]);
    const idxType = getIdx(["type", "loại"]);
    const idxTag = getIdx(["tag", "thể loại"]);
    const idxCode = getIdx(["asset code", "mã"]);

    // Map dữ liệu
    return rows.slice(headerIdx + 1).map((row, index) => {
      if (!row || row.length < 3) return null;

      let rawName = idxName >= 0 && row[idxName] ? String(row[idxName]) : "";
      if (!rawName) return null; // Nếu không có tên thì bỏ qua dòng đó

      const rawTags = idxTag >= 0 && row[idxTag] ? String(row[idxTag]) : "";
      const tagsList = rawTags.split(",").map(t => t.trim()).filter(Boolean);

      let rawPreview = idxPreview >= 0 && row[idxPreview] ? String(row[idxPreview]) : "";

      return {
        id: idxId >= 0 && row[idxId] ? String(row[idxId]) : `asset-${index}`,
        creator: idxCreator >= 0 && row[idxCreator] ? String(row[idxCreator]) : "Ẩn danh",
        image: getDirectImageUrl(rawPreview), 
        name: rawName,
        description: idxDesc >= 0 && row[idxDesc] ? String(row[idxDesc]) : "",
        capacity: idxCapacity >= 0 && row[idxCapacity] ? String(row[idxCapacity]) : "",
        type: idxType >= 0 && row[idxType] ? String(row[idxType]) : "Miễn phí",
        tags: tagsList,
        shortCode: idxCode >= 0 && row[idxCode] ? String(row[idxCode]) : ""
      };
    }).filter(Boolean); 

  } catch (e) {
    console.error("Lỗi fetch Kho Asset", e);
    return [];
  }
}


// ==========================================
// 5. CÁC HÀM TIỆN ÍCH HỖ TRỢ
// ==========================================
function formatVideoUrl(url: string) {
  if (!url || url === "undefined" || url === "PV" || url === "LINK") return "";
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^?&"'>]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : "";
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

function parsePatchNotes(rawText: string) {
  if (!rawText || rawText === "undefined") return [];
  return rawText.split("---").map(block => {
    const lines = block.trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;
    const match = lines[0].match(/\[(.*?)\]\s*(.*)/);
    return { title: match ? match[2] : lines[0], ver: match ? match[1] : "v1.0", content: lines.slice(1).join("\n") };
  }).filter(Boolean);
}