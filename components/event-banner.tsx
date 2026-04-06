"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Trophy, Users, ChevronRight } from "lucide-react"

export function EventBanner() {
  return (
    <section id="events" className="relative overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />
      
      <div className="container relative mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-12">
          {/* Event Image */}
          <div className="relative w-full max-w-2xl lg:w-1/2">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border/50 bg-card shadow-2xl shadow-primary/10">
              {/* Placeholder for event image */}
              <img src="/banner-homepage/kts-thang3.webp" alt="Event Banner" className="absolute inset-0 w-full h-full object-cover" />
              
              {/* Live indicator */}
              <div className="absolute left-4 top-4">
                <Badge className="bg-destructive text-destructive-foreground">
                  <span className="mr-1.5 h-2 w-2 animate-pulse rounded-full bg-current" />
                  Đang diễn ra
                </Badge>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -left-4 -top-4 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />
          </div>
          
          {/* Event Info */}
          <div className="flex w-full flex-col gap-6 lg:w-1/2">
            <div>
              <Badge variant="outline" className="mb-4 border-primary/50 text-primary">
                Kiến Trúc Sư
              </Badge>
              <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
               Kiến Trúc Sư Tháng 4: Cao Thủ Vũ Khí
              </h1>
              <p className="mt-4 text-pretty text-muted-foreground md:text-lg">
                Tháng 4 này, Craftland mang đến thử thách mới dành cho các kiến trúc sư tài năng: thiết kế map xoay quanh chủ đề vũ khí – sáng tạo những đấu trường, khu huấn luyện hoặc chế độ chơi độc đáo để người chơi luyện tập và nâng cao kỹ năng sử dụng vũ khí.
              </p>
            </div>
            
            {/* Event Stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-xl border border-border/50 bg-card p-4">
                <Trophy className="h-5 w-5 text-primary" />
                <p className="mt-2 text-2xl font-bold">6000</p>
                <p className="text-xs text-muted-foreground">Kim cương</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card p-4">
                <Users className="h-5 w-5 text-accent" />
                <p className="mt-2 text-2xl font-bold">128</p>
                <p className="text-xs text-muted-foreground">Người tham gia</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card p-4">
                <Calendar className="h-5 w-5 text-primary" />
                <p className="mt-2 text-2xl font-bold">Từ 30.3</p>
                <p className="text-xs text-muted-foreground">đến 20.4</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card p-4">
                <Clock className="h-5 w-5 text-accent" />
                <p className="mt-2 text-2xl font-bold">72h</p>
                <p className="text-xs text-muted-foreground">Còn lại</p>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button size="lg" className="gap-2">
                Tham gia ngay
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch Live
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
