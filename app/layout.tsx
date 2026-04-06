import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
  /* ... Giữ nguyên phần icons của Huỳnh ... */
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${vietnameseFont.className} antialiased`}>
        {/* ĐÂY LÀ CHỖ QUAN TRỌNG NHẤT ĐỂ DARK MODE CHẠY ĐƯỢC */}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // Để mặc định là tối cho ngầu đúng chất Tuglar
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}