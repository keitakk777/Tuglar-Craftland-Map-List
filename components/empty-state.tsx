"use client"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
  title?: string;
  message?: string;
  buttonText?: string;
  href?: string;
}

export function EmptyState({ 
  title = "Dữ liệu đang được cập nhật...", 
  message = "Nội dung này hiện chưa có sẵn hoặc đang trong quá trình hoàn thiện. Vui lòng quay lại sau hoặc khám phá các khu vực khác!",
  buttonText = "Quay lại trang chủ",
  href = "/"
}: EmptyStateProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 pt-32 pb-20 text-center container mx-auto">
        
        {/* TIÊU ĐỀ: Đã fix dính dòng, văn phong chung cho mọi loại dữ liệu */}
        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tight mb-8 text-foreground leading-tight md:leading-[1.1] max-w-5xl text-balance">
          {title}
        </h2>
        
        {/* MÔ TẢ: Ngôn ngữ trung tính, dùng được cho nhiều mục đích */}
        <p className="text-muted-foreground max-w-2xl mb-12 leading-relaxed font-medium text-base md:text-lg opacity-80">
          {message}
        </p>

        {/* NÚT BẤM: Bo tròn đồng bộ, link linh hoạt */}
        <Link href={href}>
          <Button 
            size="lg" 
            className="gap-3 px-10 h-16 font-bold uppercase tracking-widest rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20 bg-primary text-primary-foreground"
          >
            <ArrowLeft className="h-6 w-6" /> {buttonText}
          </Button>
        </Link>
      </main>

      <Footer />
    </div>
  )
}