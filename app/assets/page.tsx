import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getAssetsData } from "@/app/maps/fetch-data"
import AssetLibrary from "./asset-library"
import { Box } from "lucide-react"

export const metadata = {
  title: "Kho Asset - Tuglar Craftland",
  description: "Tổng hợp các mẫu thiết kế, mã lệnh và vật phẩm sáng tạo cho Free Fire Craftland.",
}

export default async function AssetsPage() {
  const assets = await getAssetsData()

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="h-16 w-16 bg-yellow-500/10 rounded-2xl flex items-center justify-center mb-4 border border-yellow-500/20 shadow-[0_0_20px_rgba(234,179,8,0.1)]">
              <Box className="h-8 w-8 text-yellow-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Kho <span className="text-yellow-500 text-glow">Asset</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl font-medium">
              Thư viện tài nguyên dành riêng cho các nhà sáng tạo. Copy mã, dán vào map và biến ý tưởng thành hiện thực ngay lập tức.
            </p>
          </div>

          {/* Client Library Component */}
          <AssetLibrary initialAssets={assets} />
        </div>
      </main>

      <Footer />
    </div>
  )
}