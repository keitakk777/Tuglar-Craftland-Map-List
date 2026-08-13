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

// Hàm hỗ trợ dịch file CSV thành dữ liệu mảng
function parseCSV(csvText: string) {
  const lines = csvText.split(/\r?\n/);
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Tách cột thông minh, không bị lỗi nếu trong text có dấu phẩy
    const currentline = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const obj: any = {};
    
    for (let j = 0; j < headers.length; j++) {
      let val = currentline[j] || "";
      obj[headers[j]] = val.replace(/^"|"$/g, '').trim(); 
    }
    result.push(obj);
  }
  return result;
}

// Hàm lấy dữ liệu
export async function getCodeTutorials(): Promise<CodeTutorial[]> {
  try {
    // 🎯 DÁN ĐƯỜNG LINK .CSV CỦA TAB CODE VÀO ĐÂY
    const CSV_LINK = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS-n_jJ0_gFVWcF78Y6GCuX_ab3EeE8_F6dlI82srPqpWDaaTTpdoCFlNZeoP3sq39Y0UXcseOXAIgD/pub?gid=1542007735&single=true&output=csv"; 
    
    const res = await fetch(CSV_LINK, { 
      next: { revalidate: 60 } 
    });
    
    // 🎯 CHỖ NÀY PHẢI LÀ res.text() CHỨ KHÔNG PHẢI res.json()
    const csvText = await res.text(); 
    const data = parseCSV(csvText);   
    
    return data
      .filter((item: any) => item['Trạng thái'] === 'Hiện')
      .map((item: any) => ({
        id: item['STT'] || Math.random(),
        title: item['Name'] || 'Chưa có tiêu đề',
        type: item['Nền tảng'] ? item['Nền tảng'].toLowerCase() : 'text',
        url: item['Link'] || '#',
        thumbnail: item['Preview'] || '/placeholder.jpg',
        author: item['Creator'] || 'Tuglar Team',
        tags: item['Tags'] ? item['Tags'].split(',').map((t: string) => t.trim()) : [],
      }));
  } catch (error) {
    console.error("Lỗi khi lấy data:", error);
    return [];
  }
}