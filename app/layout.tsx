import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from "@vercel/speed-insights/next"

// 🎯 BƯỚC QUAN TRỌNG: Import Header vào đây! 
// (Lưu ý: Nếu file header.tsx của ní nằm ở thư mục khác, hãy sửa lại đường dẫn import cho đúng nhé)
import { Header } from "@/components/header" 

import './globals.css'

const vietnameseFont = Be_Vietnam_Pro({ 
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam" 
});

export const metadata: Metadata = {
  title: 'Tuglar Craftland - Competitive Gaming',
  description: 'Khám phá bản đồ, tham gia sự kiện và cập nhật tin tức mới nhất từ Tuglar Craftland',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${vietnameseFont.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* 🎯 ĐẶT HEADER Ở ĐÂY ĐỂ NÓ HIỆN TRÊN TẤT CẢ CÁC TRANG */}
          <Header />
          
          {/* Nội dung của từng trang con sẽ được nhét vào đây */}
          <main className="min-h-screen">
            {children}
          </main>
          
        </ThemeProvider>

        {/* Cụm Analytics và SpeedInsights của Vercel */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}