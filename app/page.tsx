"use client";

import { useEffect, useState } from "react";
import { getBannerData, EventBanner as BannerType } from "./maps/fetch-banner";
import { EventBanner } from "@/components/event-banner";

// Nếu bạn còn dùng NewsFeed, FeaturedMaps... thì import ở đây
// import { NewsFeed } from "@/components/news-feed"
// import { FeaturedMaps } from "@/components/featured-maps"

export default function HomePage() {
  const [banners, setBanners] = useState<BannerType[]>([]);

  useEffect(() => {
    getBannerData().then((data) => {
      if (data && data.length > 0) {
        setBanners(data);
      }
    });
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-background relative pb-24">
      {/* Background base */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/5 via-background to-background -z-10" />
      
      {/* KHU VỰC EVENT BANNER */}
      {banners.length > 0 ? (
        <EventBanner events={banners} />
      ) : (
        <div className="w-full pt-32 pb-20 flex items-center justify-center animate-pulse">
          <p className="text-slate-500">Đang tải sự kiện...</p>
        </div>
      )}

      {/* CHÈN CÁC COMPONENT KHÁC XUỐNG DƯỚI NÀY (Kho Map, NewsFeed v.v.) */}
      {/* <FeaturedMaps /> */}
      {/* <NewsFeed /> */}

    </main>
  );
}