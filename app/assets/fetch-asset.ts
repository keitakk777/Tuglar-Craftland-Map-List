// @ts-nocheck
import { parseCSV, getDirectImageUrl } from "../maps/fetch-map";

export async function getAssetsData() {
  // LINK LẤY DATA KHO ASSET
  const ASSET_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=1608901754&single=true&output=csv";
  
  try {
    const res = await fetch(ASSET_SHEET_URL, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    
    const csvText = await res.text();
    const rows = parseCSV(csvText); 
    if (rows.length < 2) return [];

    let headerIdx = -1;
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      const rowStr = rows[i].join("").toLowerCase();
      if (rowStr.includes("asset name") || rowStr.includes("asset code") || rowStr.includes("type")) {
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
    const idxType = getIdx(["type", "loại asset", "loại"]);
    const idxTheme = getIdx(["theme", "chủ đề"]);
    const idxCode = getIdx(["asset code", "mã"]);
    const idxTeam = getIdx(["team", "đội", "nhóm"]);

    return rows.slice(headerIdx + 1).map((row, index) => {
      if (!row || row.length < 3) return null;

      let rawName = idxName >= 0 && row[idxName] ? String(row[idxName]) : "";
      if (!rawName) return null; 

      let rawPreview = idxPreview >= 0 && row[idxPreview] ? String(row[idxPreview]) : "";

      return {
        id: idxId >= 0 && row[idxId] ? String(row[idxId]) : `asset-${index}`,
        creator: idxCreator >= 0 && row[idxCreator] ? String(row[idxCreator]) : "Ẩn danh",
        image: getDirectImageUrl(rawPreview), 
        name: rawName,
        description: idxDesc >= 0 && row[idxDesc] ? String(row[idxDesc]) : "",
        capacity: idxCapacity >= 0 && row[idxCapacity] ? String(row[idxCapacity]) : "",
        type: idxType >= 0 && row[idxType] ? String(row[idxType]) : "Khác",
        theme: idxTheme >= 0 && row[idxTheme] ? String(row[idxTheme]) : "Tự do",
        shortCode: idxCode >= 0 && row[idxCode] ? String(row[idxCode]) : "",
        team: idxTeam >= 0 ? String(row[idxTeam]).trim() : ""
      };
    }).filter(Boolean); 

  } catch (e) {
    console.error("Lỗi fetch Kho Asset", e);
    return [];
  }
}