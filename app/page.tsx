import { getBannerData } from "./events/fetch-banner";
import { EventClient } from "./events/event-client";

export default async function HomePage() {
  // Lấy dữ liệu ngay từ phía Server (Loại bỏ hoàn toàn lỗi CORS)
  const banners = await getBannerData();

  return (
    <main className="flex min-h-screen flex-col bg-background relative pb-24">
      {/* Background base */}
      <div className="fixed inset-0 bg-background -z-10" />
      
      {/* GIAO DIỆN SỰ KIỆN */}
      {banners && banners.length > 0 ? (
         <EventClient events={banners} />
      ) : (
         <div className="w-full pt-32 pb-20 flex items-center justify-center min-h-[500px]">
           <p className="text-slate-500 font-medium">Chưa có sự kiện nào đang diễn ra.</p>
         </div>
      )}
    </main>
  );
}