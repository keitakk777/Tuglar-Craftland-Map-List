"use client"

import { useState, useMemo } from "react"
import { Search, Copy, Check, Filter, Cpu, User2, DownloadCloud } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

const GAS_API_URL = "https://script.google.com/macros/s/AKfycby2G8_Zaa9Cy9QKIkULpC1MleZH2YG3_8xzYkeaWkIF4Ih-1IbCwK-7XQrVsSTElR0/exec"

export default function AssetLibrary({ initialAssets = [] }: { initialAssets?: any[] }) {
  const [search, setSearch] = useState("")
  const [selectedTag, setSelectedTag] = useState("Tất cả")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [localDownloads, setLocalDownloads] = useState<Record<string, number>>({})

  const allTags = useMemo(() => {
    const tags = new Set(["Tất cả"])
    initialAssets?.forEach(asset => asset?.tags?.forEach((t: string) => tags.add(t)))
    return Array.from(tags)
  }, [initialAssets])

  const filteredAssets = useMemo(() => {
    return (initialAssets || []).filter(asset => {
      const matchesSearch = asset?.name?.toLowerCase().includes(search.toLowerCase()) || 
                           asset?.shortCode?.toLowerCase().includes(search.toLowerCase())
      const matchesTag = selectedTag === "Tất cả" || asset?.tags?.includes(selectedTag)
      return matchesSearch && matchesTag
    })
  }, [search, selectedTag, initialAssets])

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    setLocalDownloads(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))

    // 🎯 ĐÃ FIX: Chỉ kiểm tra xem link có chứa script google không là gửi luôn
    if (GAS_API_URL.includes("script.google.com")) {
      fetch(GAS_API_URL, {
        method: "POST",
        mode: "no-cors", 
        body: JSON.stringify({ id: id })
      }).catch(e => console.error("Lỗi gửi đếm số:", e))
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center sticky top-20 z-40 bg-background/80 backdrop-blur-md p-4 rounded-2xl border border-white/5 shadow-xl">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Tìm tên asset hoặc mã code..." className="pl-10 h-12 bg-muted/20 border-white/10 rounded-xl focus:ring-yellow-500" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 [&::-webkit-scrollbar]:hidden">
          {allTags.map(tag => (
            <Button key={tag} variant={selectedTag === tag ? "default" : "outline"} onClick={() => setSelectedTag(tag)} className={`rounded-full px-5 whitespace-nowrap h-10 font-bold uppercase text-[10px] tracking-widest transition-all ${selectedTag === tag ? 'bg-yellow-500 text-black border-none shadow-lg shadow-yellow-500/20' : 'border-white/10 hover:border-yellow-500/50'}`}>
              {tag}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAssets.map((asset) => {
            const currentDownloads = (asset.downloads || 0) + (localDownloads[asset.id] || 0)
            return (
              <motion.div key={asset.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group bg-card rounded-2xl border border-white/5 overflow-hidden flex flex-col hover:border-yellow-500/30 transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                <div className="relative aspect-square overflow-hidden bg-muted/20">
                  <img src={asset.image} alt={asset.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-2 left-2"><Badge className={`${asset.type === 'Trả phí' ? 'bg-orange-500' : 'bg-green-600'} text-white border-none text-[8px] font-black uppercase`}>{asset.type}</Badge></div>
                  {asset.capacity && <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5"><Cpu className="h-3 w-3 text-yellow-500" /><span className="text-[10px] font-black text-white">{asset.capacity}</span></div>}
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-sm line-clamp-1 group-hover:text-yellow-500 transition-colors uppercase tracking-tight">{asset.name}</h3>
                  <div className="flex items-center justify-between mt-1 mb-3">
                    <div className="flex items-center gap-1.5 text-muted-foreground"><User2 size={12} className="text-yellow-500/70" /><span className="text-[10px] font-bold uppercase tracking-wider">{asset.creator}</span></div>
                    <div className="flex items-center gap-1 text-muted-foreground bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                      <DownloadCloud size={10} className="text-blue-400" />
                      <span className="text-[10px] font-bold text-blue-400">{currentDownloads}</span>
                    </div>
                  </div>
                  <Button onClick={() => handleCopy(asset.shortCode, asset.id)} className={`mt-auto w-full rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest transition-all ${copiedId === asset.id ? 'bg-green-600 text-white hover:bg-green-600' : 'bg-white/5 hover:bg-yellow-500 hover:text-black text-foreground border border-white/10 hover:border-none'}`}>
                    {copiedId === asset.id ? <><Check className="mr-2 h-3.5 w-3.5" /> Đã Copy</> : <><Copy className="mr-2 h-3.5 w-3.5" /> Copy Mã</>}
                  </Button>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}