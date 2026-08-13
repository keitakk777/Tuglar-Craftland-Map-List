// app/code/fetch-code.ts

export interface CodeTutorial {
  id: string | number;
  title: string;
  type: string;
  url: string;
  thumbnail: string;
  author: string;
  tags: string[];
  status: string;
}

const ERROR_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%23450a0a'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' font-weight='bold' fill='%23ef4444' text-anchor='middle'%3ETHIẾU ẢNH%3C/text%3E%3C/svg%3E";

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

export async function getCodeTutorials(): Promise<CodeTutorial[]> {
  try {
    // 🎯 ĐÃ ĐẢM BẢO LINK DÙNG OUTPUT=CSV CHUẨN XÁC NHẤT
    const CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=2123882422&single=true&output=csv"; 
    
    // Dùng cache no-store để test lúc này, code sẽ luôn lấy data tươi mới nhất ngay lập tức
    const res = await fetch(CSV_LINK, { cache: 'no-store' });
    const csvText = await res.text(); 
    const rows = parseCSV(csvText);
    
    if (rows.length < 2) return [];

    // 🎯 TỰ ĐỘNG DÒ TÌM DÒNG TIÊU ĐỀ (Quét 5 dòng đầu tiên, né luôn cả dòng trang trí của bạn)
    let headerIdx = -1;
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      const rowStr = rows[i].join("").toLowerCase();
      if (rowStr.includes("creator") || rowStr.includes("nền tảng")) {
        headerIdx = i;
        break;
      }
    }
    // Nếu vẫn không thấy, ép nó lấy dòng số 2 (index 1) theo như ảnh bạn chụp
    if (headerIdx === -1) headerIdx = 1; 

    const headers = rows[headerIdx].map((h: string) => h.toLowerCase().trim());
    
    const getIdx = (keys: string[]) => {
      for (const key of keys) { const found = headers.findIndex(h => h === key); if (found !== -1) return found; }
      for (const key of keys) { const found = headers.findIndex(h => h.includes(key)); if (found !== -1) return found; }
      return -1;
    };

    const idxId = getIdx(["stt", "id"]);
    const idxName = getIdx(["name", "tên"]);
    const idxPlatform = getIdx(["nền tảng", "platform"]);
    const idxCreator = getIdx(["creator", "tác giả"]);
    const idxTags = getIdx(["tags", "thẻ"]);
    const idxLink = getIdx(["link"]);
    const idxPreview = getIdx(["preview", "ảnh"]);
    const idxStatus = getIdx(["trạng thái", "status"]);

    const tutorials: CodeTutorial[] = [];

// Quét dữ liệu từ dòng dưới dòng tiêu đề
    for (let i = headerIdx + 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 3) continue;

      // 🎯 SỬA LẠI ĐOẠN NÀY: Dùng includes và toLowerCase để bao dung mọi lỗi khoảng trắng hay in hoa in thường
      let status = idxStatus >= 0 && row[idxStatus] ? String(row[idxStatus]).trim().toLowerCase() : "";
      if (!status.includes("hiện")) continue;

      let rawTags = idxTags >= 0 && row[idxTags] ? String(row[idxTags]) : "";
      let tagsList = rawTags.split(",").map(t => t.trim()).filter(Boolean);

      let platformRaw = idxPlatform >= 0 && row[idxPlatform] ? String(row[idxPlatform]).trim().toLowerCase() : "";
      if (platformRaw === "" || platformRaw === "undefined" || platformRaw === "nan") platformRaw = "text";

      tutorials.push({
        id: idxId >= 0 && row[idxId] ? String(row[idxId]) : Math.random().toString(),
        title: idxName >= 0 && row[idxName] ? String(row[idxName]) : "Chưa có tiêu đề",
        type: platformRaw,
        url: idxLink >= 0 && row[idxLink] ? String(row[idxLink]) : "#",
        thumbnail: idxPreview >= 0 && row[idxPreview] ? getDirectImageUrl(String(row[idxPreview])) : "/placeholder.jpg",
        author: idxCreator >= 0 && row[idxCreator] ? String(row[idxCreator]) : "Tuglar Team",
        tags: tagsList,
        status: "Hiện"
      });
    }

    // In log ra Terminal của VS Code để kiểm tra
    console.log("=> Đã hút thành công:", tutorials.length, "bài code"); 
    return tutorials;
  } catch (error) {
    console.error("Lỗi khi lấy data CODE:", error);
    return [];
  }
}