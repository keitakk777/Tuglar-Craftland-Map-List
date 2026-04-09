import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: "Ní chưa nhập link map!" }, { status: 400 });
  }

  try {
    const response = await fetch(url, { cache: 'no-store' });
    const html = await response.text();
    
    // 1. Lấy Tên Map
    let name = "Tên Map Mới";
    const nameMatch = html.match(/<title>(.*?)<\/title>/i);
    if (nameMatch) name = nameMatch[1].replace("[FF] ", "").trim();

    // 2. Lấy Ảnh bìa
    let thumb = "";
    const imgMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
    if (imgMatch) thumb = imgMatch[1];

    // 3. Lấy Mã Map từ URL
    let mapCode = "";
    const mParam = url.match(/[?&]m=([^&]+)/);
    if (mParam) {
      const mVal = mParam[1];
      if (mVal.length >= 11) {
        const rawCode = mVal.substring(5);
        mapCode = (rawCode.length > 10) ? "#FREEFIRE" + rawCode : "#" + rawCode;
      }
    }
    
    return NextResponse.json({ name, thumb, mapCode });
  } catch (error) {
    return NextResponse.json({ error: "Lỗi kết nối tới Garena" }, { status: 500 });
  }
}