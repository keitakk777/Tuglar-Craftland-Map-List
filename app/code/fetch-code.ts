// app/code/fetch-code.ts

export interface CodeTutorial {
  id: string | number;
  date: string;
  author: string;
  tags: string[];
  title: string;
  description: string;
  thumbnail: string;
  images: string[];    // <-- BỔ SUNG: Mảng chứa nhiều link ảnh
  facebookUrl: string;
  tiktokUrl: string;
  videoUrl: string;
  type: string;        
  device: string;      
  status: string;
}

const ERROR_IMAGE = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400' viewBox='0 0 800 400'%3E%3Crect width='800' height='400' fill='%230f172a'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='20' font-weight='bold' fill='%2364748b' text-anchor='middle'%3EThumbnail%3C/text%3E%3C/svg%3E";

export function getDirectImageUrl(rawUrl: string) {
  if (!rawUrl || rawUrl === "undefined" || rawUrl === "") return "";
  if (rawUrl.includes("googleusercontent.com") || rawUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i)) return rawUrl.trim();
  const driveRegex = /\/d\/([a-zA-Z0-9_-]+)/;
  const match = rawUrl.match(driveRegex);
  if (match && match[1]) return "https://lh3.googleusercontent.com/d/" + match[1];
  return rawUrl.trim();
}

function getAutoThumbnail(videoUrl: string, platform: string, currentThumb: string) {
  const parsedThumb = getDirectImageUrl(currentThumb);
  if (parsedThumb && parsedThumb !== ERROR_IMAGE) return parsedThumb;
  
  if (platform === "youtube" && videoUrl) {
    const ytMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^?&"'>]+)/);
    if (ytMatch && ytMatch[1]) {
      return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
    }
  }
  return ERROR_IMAGE;
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

function getSortTime(dateStr: string) {
  if (!dateStr || dateStr.toLowerCase() === "cập nhật gần đây") return 0;
  const parts = dateStr.trim().split("/");
  if (parts.length >= 3) {
    const day = parseInt(parts[0], 10) || 1;
    const month = parseInt(parts[1], 10) || 1;
    const year = parseInt(parts[2], 10) || 2024;
    return new Date(year, month - 1, day).getTime();
  }
  return new Date(dateStr).getTime() || 0;
}

export async function getCodeTutorials(): Promise<CodeTutorial[]> {
  try {
    const CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=2123882422&single=true&output=csv"; 
    
    const res = await fetch(CSV_LINK, { cache: 'no-store' });
    const csvText = await res.text();
    const rows = parseCSV(csvText);
    
    if (rows.length < 2) return [];

    let headerIdx = -1;
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      if (rows[i].join("").toLowerCase().includes("creator") || rows[i].join("").toLowerCase().includes("name")) {
        headerIdx = i;
        break;
      }
    }
    if (headerIdx === -1) headerIdx = 1; 

    const headers = rows[headerIdx].map((h: string) => h.toLowerCase().trim());
    
    const getIdx = (keys: string[]) => {
      for (const key of keys) { const found = headers.findIndex(h => h === key); if (found !== -1) return found; }
      for (const key of keys) { const found = headers.findIndex(h => h.includes(key)); if (found !== -1) return found; }
      return -1;
    };

    const idxId = getIdx(["stt", "id"]);
    const idxDate = getIdx(["ngày", "date"]);
    const idxDevice = getIdx(["nền tảng", "device"]); 
    const idxCreator = getIdx(["creator", "tác giả"]);
    const idxTags = getIdx(["tags", "thẻ"]);
    const idxName = getIdx(["name", "tên"]);
    const idxDesc = getIdx(["mô tả", "description"]);
    const idxThumb = getIdx(["thumbnail", "preview", "ảnh chính"]);
    const idxImages = getIdx(["images", "ảnh chi tiết", "hình ảnh", "bộ ảnh"]); // <-- Tìm cột Nhiều ảnh
    const idxFb = getIdx(["facebook"]);
    const idxTiktok = getIdx(["tiktok"]); 
    const idxVid = getIdx(["yt hoặc tiktok", "youtube", "video", "yt"]); 
    const idxStatus = getIdx(["trạng thái", "status"]);

    const tutorials: CodeTutorial[] = [];

    for (let i = headerIdx + 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 3) continue;

      let status = idxStatus >= 0 && row[idxStatus] ? String(row[idxStatus]).trim().toLowerCase() : "hiện";
      if (status !== "" && status !== "hiện") continue;

      let rawTags = idxTags >= 0 && row[idxTags] ? String(row[idxTags]) : "";
      let tagsList = rawTags.split(",").map(t => t.trim()).filter(Boolean);

      let fbLink = idxFb >= 0 && row[idxFb] ? String(row[idxFb]).trim() : "";
      let ttLink = idxTiktok >= 0 && row[idxTiktok] ? String(row[idxTiktok]).trim() : "";
      let vidLink = idxVid >= 0 && row[idxVid] ? String(row[idxVid]).trim() : "";
      
      let platformType = "text";
      if (vidLink.toLowerCase().includes("youtube") || vidLink.toLowerCase().includes("youtu.be")) {
        platformType = "youtube";
      } else if (vidLink.toLowerCase().includes("tiktok") || ttLink !== "") {
        platformType = "tiktok";
      } else if (fbLink !== "") {
        platformType = "facebook";
      }

      let rawTitle = idxName >= 0 && row[idxName] ? String(row[idxName]) : "";
      if (!rawTitle) continue;

      let rawThumb = idxThumb >= 0 && row[idxThumb] ? String(row[idxThumb]).trim() : "";
      let finalThumbnail = getAutoThumbnail(vidLink || ttLink, platformType, rawThumb);
      if (!finalThumbnail) finalThumbnail = ERROR_IMAGE;

      // 🎯 XỬ LÝ MẢNG HÌNH ẢNH CHI TIẾT
      let rawImages = idxImages >= 0 && row[idxImages] ? String(row[idxImages]) : "";
      // Tách bằng dấu phẩy, chấm phẩy hoặc xuống dòng
      let imagesList = rawImages.split(/[,;\n]/).map(link => getDirectImageUrl(link.trim())).filter(link => link !== "");

      let deviceType = idxDevice >= 0 && row[idxDevice] ? String(row[idxDevice]).trim() : "Mobile";

      tutorials.push({
        id: idxId >= 0 && row[idxId] ? String(row[idxId]) : Math.random().toString(),
        date: idxDate >= 0 && row[idxDate] ? String(row[idxDate]) : "Cập nhật gần đây",
        author: idxCreator >= 0 && row[idxCreator] ? String(row[idxCreator]) : "Tuglar Team",
        tags: tagsList,
        title: rawTitle,
        description: idxDesc >= 0 && row[idxDesc] ? String(row[idxDesc]) : "",
        thumbnail: finalThumbnail,
        images: imagesList,  // <-- Đẩy mảng ảnh vào
        facebookUrl: fbLink,
        tiktokUrl: ttLink,
        videoUrl: vidLink,
        type: platformType,
        device: deviceType, 
        status: "Hiện"
      });
    }

    tutorials.sort((a, b) => {
      const timeA = getSortTime(a.date);
      const timeB = getSortTime(b.date);
      return timeB - timeA;
    });

    return tutorials;
  } catch (error) {
    console.error("Lỗi khi lấy data CODE:", error);
    return [];
  }
}