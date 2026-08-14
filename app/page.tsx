"use client";

import { useEffect, useState } from "react";
import { getBannerData, EventBannerData } from "./web-banner/fetch-banner";
import { EventBanner } from "@/app/web-banner/event-banner";

// Import các phần bên dưới trang chủ của bạn (Dựa theo ảnh bạn chụp)
import { FeaturedMaps } from "@/components/featured-maps";
// import { NewsFeed } from "@/components/news-feed"; 

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
      
      {/* KHU VỰC EVENT BANNER */}
      {loading ? (
         <div className="w-full pt-32 pb-20 flex items-center justify-center animate-pulse min-h-[500px]">
           <p className="text-slate-500">Đang tải sự kiện...</p>
         </div>
      ) : banners.length > 0 ? (
         <EventBanner events={banners} />
      ) : null}

      {/* CÁC THÀNH PHẦN BÊN DƯỚI (MAPS, NEWS) */}
      <div className="container mx-auto px-4 mt-8">
         <FeaturedMaps />
      </div>

    </main>
  );
}