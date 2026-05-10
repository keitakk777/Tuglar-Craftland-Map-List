"use client"
import Link from "next/link"
import { Gamepad2 } from "lucide-react"
import { SiYoutube, SiTiktok, SiFacebook, SiInstagram } from "react-icons/si"

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-md">
      <div className="container mx-auto px-4 py-16">
        {/* Đã chuyển sang bố cục flex chia 2 bên cho cân đối */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          
          {/* 1. BRAND & INTRO */}
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500 shadow-lg shadow-yellow-500/20 group-hover:scale-110 transition-transform">
                <Gamepad2 className="h-6 w-6 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tighter uppercase">Tuglar Craftland</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              Một đội ngũ Creator Craftland (nghiệp dư) tại Việt Nam!
              <br />
              Theo dõi chúng tôi để cập nhật tin tức, bản đồ độc đáo từ thế giới Craftland!
            </p>
          </div>

          {/* 2. FOLLOW US */}
          <div>
            <h4 className="mb-6 text-sm font-bold uppercase tracking-[0.2em] text-foreground">Theo dõi Tuglar</h4>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">Cập nhật những thông tin mới nhất từ chúng mình qua các nền tảng:</p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.youtube.com/@Tuglar.Craftland" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-11 w-11 flex items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground hover:bg-[#FF0000]/10 hover:text-[#FF0000] transition-all duration-300 border border-transparent hover:border-[#FF0000]/20"
              >
                <SiYoutube className="h-5 w-5" />
              </a>

              <a 
                href="https://www.tiktok.com/@tuglar.craftland" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-11 w-11 flex items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground hover:bg-black hover:text-white transition-all duration-300 border border-transparent hover:border-white/10 dark:hover:bg-white dark:hover:text-black"
              >
                <SiTiktok className="h-5 w-5" />
              </a>

              <a 
                href="https://www.facebook.com/tuglar.craftland" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-11 w-11 flex items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground hover:bg-[#1877F2]/10 hover:text-[#1877F2] transition-all duration-300 border border-transparent hover:border-[#1877F2]/20"
              >
                <SiFacebook className="h-5 w-5" />
              </a>

              <a 
                href="https://www.instagram.com/tuglar.craftland" 
                target="_blank" 
                rel="noopener noreferrer"
                className="h-11 w-11 flex items-center justify-center rounded-2xl bg-muted/50 text-muted-foreground hover:bg-[#E4405F]/10 hover:text-[#E4405F] transition-all duration-300 border border-transparent hover:border-[#E4405F]/20"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground tracking-wide font-medium">
            © 2026 <span className="text-yellow-600 font-bold">TUGLAR CRAFTLAND</span>. Designed for Vietnamese Creators.
          </p>
          <div className="flex items-center gap-8 text-xs text-muted-foreground font-semibold uppercase tracking-widest">
            <Link href="#" className="hover:text-yellow-500 transition-colors">Bảo mật</Link>
            <Link href="#" className="hover:text-foreground/50 cursor-not-allowed">Điều khoản</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}