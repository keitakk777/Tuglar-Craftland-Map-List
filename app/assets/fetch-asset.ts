// @ts-nocheck
import { getDirectImageUrl } from "./fetch-map";

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

export async function getAssetsData() {
  const ASSET_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=1608901754&single=true&output=csv";
  try {
    const res = await fetch(ASSET_SHEET_URL, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const rows = parseCSV(await res.text()); 
    if (rows.length < 2) return [];

    let headerIdx = -1;
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      if (rows[i].join("").toLowerCase().match(/asset name|asset code|type/)) { headerIdx = i; break; }
    }
    if (headerIdx === -1) return [];

    const headers = rows[headerIdx].map((h: string) => h.toLowerCase().trim());
    const getIdx = (keys: string[]) => {
      for (const key of keys) { const found = headers.findIndex(h => h === key); if (found !== -1) return found; }
      for (const key of keys) { const found = headers.findIndex(h => h.includes(key)); if (found !== -1) return found; }
      return -1;
    };

    const idxId = getIdx(["id"]), idxName = getIdx(["asset name", "tên"]), idxCreator = getIdx(["creator", "người tạo"]), idxPreview = getIdx(["preview link", "preview", "link"]), idxDesc = getIdx(["description", "mô tả"]), idxCapacity = getIdx(["capacity", "tải trọng", "dung lượng"]), idxType = getIdx(["type", "loại asset", "loại"]), idxTheme = getIdx(["theme", "chủ đề"]), idxCode = getIdx(["asset code", "mã"]), idxTeam = getIdx(["team", "đội", "nhóm"]);

    return rows.slice(headerIdx + 1).map((row, index) => {
      if (!row || row.length < 3 || !(idxName >= 0 && row[idxName])) return null;
      return {
        id: idxId >= 0 && row[idxId] ? String(row[idxId]) : `asset-${index}`,
        creator: idxCreator >= 0 && row[idxCreator] ? String(row[idxCreator]) : "Ẩn danh",
        image: getDirectImageUrl(idxPreview >= 0 && row[idxPreview] ? String(row[idxPreview]) : ""), 
        name: String(row[idxName]),
        description: idxDesc >= 0 && row[idxDesc] ? String(row[idxDesc]) : "",
        capacity: idxCapacity >= 0 && row[idxCapacity] ? String(row[idxCapacity]) : "",
        type: idxType >= 0 && row[idxType] ? String(row[idxType]) : "Khác",
        theme: idxTheme >= 0 && row[idxTheme] ? String(row[idxTheme]) : "Tự do",
        shortCode: idxCode >= 0 && row[idxCode] ? String(row[idxCode]) : "",
        team: idxTeam >= 0 ? String(row[idxTeam]).trim() : ""
      };
    }).filter(Boolean); 
  } catch (e) { return []; }
}