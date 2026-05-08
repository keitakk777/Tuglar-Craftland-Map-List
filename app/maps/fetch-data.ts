// @ts-nocheck
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
      for (const key of keys) {
        const found = headers.findIndex(h => h === key || h.includes(key));
        if (found !== -1) return found;
      }
      return -1;
    };

    const idxName = getIdx(["tên", "name", "tựa game"]);
    const idxCreator = getIdx(["creator", "tác giả", "người tạo"]);
    const idxCode = getIdx(["mã map", "code", "mã"]);
    const idxBanner = getIdx(["link web banner", "link banner", "banner"]); 
    const idxGameMode = getIdx(["game mode", "thể loại", "chế độ"]);
    const idxTeamMode = getIdx(["team mode", "quy mô", "số người"]);
    const idxDesc = getIdx(["mô tả", "hướng dẫn"]);
    const idxPatch = getIdx(["patch note", "patch"]); 
    const idxDate = getIdx(["update", "cập nhật", "ngày", "date"]);

    const maps = [];
    const seenIds = new Set();

    for (let i = headerIdx + 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 5) continue;

      let rawName = idxName >= 0 && row[idxName] ? String(row[idxName]) : "";
      let rawCode = idxCode >= 0 && row[idxCode] ? String(row[idxCode]) : "";
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

      maps.push({
        id: mapId, 
        name: mapName, 
        creator: idxCreator >= 0 && row[idxCreator] ? String(row[idxCreator]) : "Ẩn danh",
        team: "Tuglar Craftland", 
        displayType: rawGameMode,
        typeTags: [rawGameMode.trim()],
        displayPlayers: rawTeamMode,
        playerTags: rawTeamMode.split(",").map((s)=>s.trim()).filter(Boolean),
        shortCode: mapCode,
        image: idxBanner >= 0 && row[idxBanner] ? String(row[idxBanner]) : "/map-cover/banner-default.png",
        description: idxDesc >= 0 && row[idxDesc] ? String(row[idxDesc]) : "",
        patchNotes: idxPatch >= 0 ? parsePatchNotes(String(row[idxPatch])) : [],
        updateDate: rawUpdateDate, // 🎯 Lấy ngày cập nhật thô
        timestamp: timeScore 
      });
    }
    maps.sort((a, b) => b.timestamp - a.timestamp);
    return maps;
  } catch (error) { return []; }
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