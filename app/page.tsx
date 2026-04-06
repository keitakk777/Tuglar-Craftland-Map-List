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
        <NewsFeed />
      </main>
      <Footer />
    </div>
  )
}
