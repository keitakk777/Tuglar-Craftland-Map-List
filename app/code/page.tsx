import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import CodeClient from "./code-client"
// Import hàm lấy data bạn vừa dán vào file fetch-data.ts
import { getCodeTutorials } from "./fetch-data"

export default async function CodePage() {
  // Gọi data thật từ Google Sheet (thay vì dùng mock data)
  const tutorials = await getCodeTutorials();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background overflow-x-hidden transition-colors">
      <div className="fixed inset-0 hidden dark:block bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-900/10 via-[#0a0f1a] to-[#020617] -z-10" />
      
      <Header />
      
      <main className="pt-24 pb-10 container mx-auto px-4 relative z-10">
        {/* Ném data thật vào giao diện lưới + bộ lọc ở file Client */}
        <CodeClient initialData={tutorials} />
      </main>

      <Footer />
    </div>
  )
}