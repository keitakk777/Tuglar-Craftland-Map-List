"use client";

import { useEffect, useState } from "react";
import { getBannerData, EventBannerData } from "./events/fetch-banner";
import { EventClient } from "./events/event-client";

export default function HomePage() {
  const [banners, setBanners] = useState<EventBannerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBannerData().then((data) => {
      if (data && data.length > 0) {
        setBanners(data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-background relative pb-24">
      {/* Background base */}
      <div className="fixed inset-0 bg-background -z-10" />
      
      {/* GIAO DIỆN SỰ KIỆN */}
      {loading ? (
         <div className="w-full pt-32 pb-20 flex items-center justify-center animate-pulse min-h-[500px]">
           <p className="text-slate-500">Đang tải sự kiện...</p>
         </div>
      ) : banners.length > 0 ? (
         <EventClient events={banners} />
      ) : null}

    </main>
  );
}