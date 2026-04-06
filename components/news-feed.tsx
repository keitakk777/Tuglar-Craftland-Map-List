"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, ChevronRight, TrendingUp, Megaphone, Wrench } from "lucide-react"

const newsItems = [
  {
    id: 1,
    title: "New Season Update: Balance Changes Incoming",
    excerpt: "Major weapon balancing and new character abilities revealed for Season 5.",
    category: "Update",
    date: "2 hours ago",
    icon: Wrench,
    color: "text-primary",
  },
  {
    id: 2,
    title: "Pro League Results: Team Phoenix Takes Crown",
    excerpt: "Intense finals match concludes with a stunning 3-2 victory.",
    category: "Esports",
    date: "5 hours ago",
    icon: TrendingUp,
    color: "text-accent",
  },
  {
    id: 3,
    title: "Community Event: Double XP Weekend",
    excerpt: "Earn double experience points and exclusive rewards this weekend.",
    category: "Event",
    date: "1 day ago",
    icon: Megaphone,
    color: "text-chart-4",
  },
]

export function NewsFeed() {
  return (
    <section id="news" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* News Section */}
          <div className="lg:col-span-2">
            {/* Section Header */}
            <div className="mb-8 flex items-end justify-between">
              <div>
                <Badge variant="outline" className="mb-3 border-primary/50 text-primary">
                  Latest News
                </Badge>
                <h2 className="text-balance text-2xl font-bold tracking-tight md:text-3xl">
                  Stay Updated
                </h2>
              </div>
              <Button variant="ghost" size="sm" className="gap-2">
                All News
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* News Cards */}
            <div className="flex flex-col gap-4">
              {newsItems.map((news) => (
                <Card
                  key={news.id}
                  className="group cursor-pointer border-border/50 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary ${news.color}`}>
                      <news.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {news.category}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {news.date}
                        </span>
                      </div>
                      <h3 className="mt-2 font-semibold tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                        {news.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                        {news.excerpt}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Stats Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-border/50 bg-card p-6">
              <h3 className="mb-6 font-semibold tracking-tight">Live Stats</h3>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Online Players</p>
                    <p className="text-2xl font-bold text-primary">1.2M</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Matches</p>
                    <p className="text-2xl font-bold text-accent">58.4K</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="h-3 w-3 rounded-full bg-accent animate-pulse" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between rounded-xl bg-secondary/50 p-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tournaments</p>
                    <p className="text-2xl font-bold">24</p>
                  </div>
                  <Badge className="bg-primary/20 text-primary">
                    Active
                  </Badge>
                </div>
              </div>
              
              {/* Quick Links */}
              <div className="mt-6 border-t border-border pt-6">
                <h4 className="mb-4 text-sm font-medium text-muted-foreground">Quick Links</h4>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" size="sm" className="justify-start gap-2 text-muted-foreground hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                    Patch Notes
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start gap-2 text-muted-foreground hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                    Leaderboards
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start gap-2 text-muted-foreground hover:text-foreground">
                    <ChevronRight className="h-4 w-4" />
                    Support Center
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
