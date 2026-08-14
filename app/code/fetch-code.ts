// app/code/fetch-code.ts

export interface CodeTutorial {
  id: string | number;
  date: string;
  author: string;
  tags: string[];
  title: string;
  description: string;
  thumbnail: string;
  facebookUrl: string;
  videoUrl: string;
  type: string; 
  status: string;
}

const ERROR_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%230f172a'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='20' font-weight='bold' fill='%2364748b' text-anchor='middle'%3EThumbnail%3C/text%3E%3C/svg%3E";

export function getDirectImageUrl(rawUrl: string) {
  if (!rawUrl || rawUrl === "undefined" || rawUrl === "") return ERROR_IMAGE;
  if (rawUrl.includes("googleusercontent.com") || rawUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return rawUrl;
  const driveRegex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = rawUrl.match(driveRegex);
  if (match && match[1]) return "https://lh3.googleusercontent.com/d/" + match[1];
  return rawUrl;
}

// Hàm tự động lấy ảnh Thumbnail
function getAutoThumbnail(videoUrl: string, platform: string, currentThumb: string) {
  // 1. Nếu bạn ĐÃ ĐIỀN link ảnh vào Google Sheet -> Ưu tiên dùng luôn ảnh của bạn
  if (currentThumb && currentThumb !== "undefined" && currentThumb !== "" && currentThumb !== "NaN") {
    return getDirectImageUrl(currentThumb);
  }

  // 2. Nếu bạn BỎ TRỐNG cột Thumbnail trong Sheet:
  // TỰ ĐỘNG LẤY ẢNH YOUTUBE
  if (platform === "youtube" && videoUrl) {
    const ytMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^?&"'>]+)/);
    if (ytMatch && ytMatch[1]) {
      // hqdefault.jpg là chất lượng cao, có thể đổi thành maxresdefault.jpg nếu muốn siêu nét
      return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    }
  }

  // 3. Với Tiktok/Facebook bị bỏ trống -> Trả về ảnh mặc định tránh vỡ khung
  return ERROR_IMAGE;
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
    const CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=2123882422&single=true&output=csv"; 
    
    const res = await fetch(CSV_LINK, { cache: 'no-store' });
    const csvText = await res.text();
    const rows = parseCSV(csvText);
    
    if (rows.length < 2) return [];

    let headerIdx = -1;
    for (let i = 0; i < Math.min(3, rows.length); i++) {
      if (rows[i].join("").toLowerCase().includes("creator")) {
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

    const idxId = getIdx(["stt"]);
    const idxDate = getIdx(["ngày", "date"]);
    const idxCreator = getIdx(["creator", "tác giả"]);
    const idxTags = getIdx(["tags"]);
    const idxName = getIdx(["name", "tên"]);
    const idxDesc = getIdx(["mô tả", "description"]);
    const idxThumb = getIdx(["thumbnail", "preview", "ảnh"]);
    const idxFb = getIdx(["facebook"]);
    const idxVid = getIdx(["yt hoặc tiktok", "youtube", "tiktok", "video"]);
    const idxStatus = getIdx(["trạng thái", "status"]);

    const tutorials: CodeTutorial[] = [];

    for (let i = headerIdx + 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 3) continue;

      let status = idxStatus >= 0 && row[idxStatus] ? String(row[idxStatus]).trim().toLowerCase() : "";
      if (!status.includes("hiện")) continue;

      let rawTags = idxTags >= 0 && row[idxTags] ? String(row[idxTags]) : "";
      let tagsList = rawTags.split(",").map(t => t.trim()).filter(Boolean);

      let fbLink = idxFb >= 0 && row[idxFb] ? String(row[idxFb]).trim() : "";
      let vidLink = idxVid >= 0 && row[idxVid] ? String(row[idxVid]).trim() : "";
      
      let platformType = "text";
      if (vidLink.toLowerCase().includes("youtube") || vidLink.toLowerCase().includes("youtu.be")) {
        platformType = "youtube";
      } else if (vidLink.toLowerCase().includes("tiktok")) {
        platformType = "tiktok";
      } else if (fbLink !== "") {
        platformType = "facebook";
      }

      let rawTitle = idxName >= 0 && row[idxName] ? String(row[idxName]) : "";
      if (!rawTitle) continue;

      let rawThumb = idxThumb >= 0 && row[idxThumb] ? String(row[idxThumb]).trim() : "";
      let finalThumbnail = getAutoThumbnail(vidLink, platformType, rawThumb);

      tutorials.push({
        id: idxId >= 0 && row[idxId] ? String(row[idxId]) : Math.random().toString(),
        date: idxDate >= 0 && row[idxDate] ? String(row[idxDate]) : "Cập nhật gần đây",
        author: idxCreator >= 0 && row[idxCreator] ? String(row[idxCreator]) : "Tuglar Team",
        tags: tagsList,
        title: rawTitle,
        description: idxDesc >= 0 && row[idxDesc] ? String(row[idxDesc]) : "",
        thumbnail: finalThumbnail,
        facebookUrl: fbLink,
        videoUrl: vidLink,
        type: platformType,
        status: "Hiện"
      });
    } // <-- CHỖ NÀY LÚC NÃY BỊ THIẾU DẤU }

    console.log("=> Lấy thành công:", tutorials.length, "bài Code.");
    return tutorials;
  } catch (error) {
    console.error("Lỗi khi lấy data CODE:", error);
    return [];
  }
}