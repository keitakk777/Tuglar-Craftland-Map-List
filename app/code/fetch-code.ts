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

// Hàm tự viết để đọc CSV siêu chuẩn (bỏ qua dấu phẩy trong ngoặc kép)
function parseCSV(csvText: string) {
  const result: any[] = [];
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return result;

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const currentline = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj: any = {};
    
    for (let j = 0; j < headers.length; j++) {
      let val = currentline[j] || "";
      obj[headers[j]] = val.replace(/^"|"$/g, '').trim(); 
    }
    result.push(obj);
  }
  return result;
}

// LẤY DỮ LIỆU THƯ VIỆN CODE
export async function getCodeTutorials(): Promise<CodeTutorial[]> {
  try {
    // 🎯 Đã cập nhật đúng ID tab Kho Code của bạn (gid=2040973686)
    const CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=2040973686&single=true&output=csv"; 
    
    const res = await fetch(CSV_LINK, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Fetch failed");

    const csvText = await res.text(); 
    const data = parseCSV(csvText);   
    
    const tutorials: CodeTutorial[] = data
      .filter((item: any) => item['Trạng thái'] === 'Hiện')
      .map((item: any) => ({
        id: item['STT'] || Math.random().toString(),
        title: item['Name'] || 'Chưa có tiêu đề',
        type: item['Nền tảng'] ? String(item['Nền tảng']).toLowerCase() : 'text',
        url: item['Link'] || '#',
        thumbnail: item['Preview'] || '/placeholder.jpg',
        author: item['Creator'] || 'Tuglar Team',
        tags: item['Tags'] ? String(item['Tags']).split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        status: item['Trạng thái']
      }));

    return tutorials;
  } catch (error) {
    console.error("Lỗi khi lấy data CODE:", error);
    return [];
  }
}