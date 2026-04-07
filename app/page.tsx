import { SpeedInsights } from "@vercel/speed-insights/next"
import { Header } from "@/components/header"
import { EventBanner } from "@/components/event-banner"
import { FeaturedMaps } from "@/components/featured-maps"
import { NewsFeed } from "@/components/news-feed"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <EventBanner />
        <FeaturedMaps />
        
        {/* 🎯 Tạm ẩn phần NewsFeed (Tin tức & Thống kê) */}
        {/* <NewsFeed /> */}
        
      </main>
      <Footer />
    </div>
  )
}