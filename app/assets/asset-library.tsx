"use client"

import { useState, useMemo } from "react"
import { Search, Copy, Check, Cpu, User2, Filter, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"

export default function AssetLibrary({ initialAssets = [] }: { initialAssets?: any[] }) {
  const [search, setSearch] = useState("")
  const [selectedType, setSelectedType] = useState("Tất cả")
  const [selectedTheme, setSelectedTheme] = useState("Tất cả")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const allTypes = useMemo(() => {
    const types = new Set(["Tất cả"])
    initialAssets?.forEach(asset => asset.type && types.add(asset.type))
    return Array.from(types)
  }, [initialAssets])

  const allThemes = useMemo(() => {
    const themes = new Set(["Tất cả"])
    initialAssets?.forEach(asset => asset.theme && themes.add(asset.theme))
    return Array.from(themes)
  }, [initialAssets])

  const filteredAssets = useMemo(() => {
    return (initialAssets || []).filter(asset => {
      const searchLower = search.toLowerCase()
      const matchesSearch = 
        asset?.name?.toLowerCase().includes(searchLower) || 
        asset?.shortCode?.toLowerCase().includes(searchLower) ||
        asset?.description?.toLowerCase().includes(searchLower)
      
      const matchesType = selectedType === "Tất cả" || asset.type === selectedType
      const matchesTheme = selectedTheme === "Tất cả" || asset.theme === selectedTheme
      
      return matchesSearch && matchesType && matchesTheme
    })
  }, [search, selectedType, selectedTheme, initialAssets])

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code); setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="sticky top-20 z-40 bg-background/95 backdrop-blur-md p-4 rounded-2xl border border-border shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm tên, mã code hoặc nội dung mô tả..." 
              className="pl-10 h-12 bg-muted/50 border-border rounded-xl focus:ring-yellow-500 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`h-12 rounded-xl gap-2 font-bold uppercase text-[10px] tracking-widest transition-colors ${showAdvanced ? 'bg-yellow-500 text-black border-transparent hover:bg-yellow-600' : 'border-border hover:border-yellow-500/50'}`}
          >
            <Filter size={14} />
            Lọc chi tiết
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </Button>
        </div>

        {/* 🎯 BỘ LỌC CƠ BẢN (TYPE) */}
        <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
          {allTypes.map(type => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
              className={`rounded-full px-5 whitespace-nowrap h-9 font-bold uppercase text-[9px] tracking-widest transition-all ${
                selectedType === type ? 'bg-yellow-500 text-black border-none shadow-md shadow-yellow-500/20 hover:bg-yellow-600' : 'border-border bg-background hover:border-yellow-500/50 text-foreground'
              }`}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* 🎯 BỘ LỌC CHI TIẾT (THEME - ĐÃ FIX MÀU & BỎ DẤU #) */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-4 border-t border-border"
            >
              <p className="text-[10px] font-black uppercase text-muted-foreground mb-3 tracking-widest">Lọc theo chủ đề:</p>
              <div className="flex flex-wrap gap-2">
                {allThemes.map(theme => (
                  <Button
                    key={theme}
                    variant={selectedTheme === theme ? "default" : "outline"}
                    onClick={() => setSelectedTheme(theme)}
                    className={`rounded-full px-4 h-8 font-bold text-[9px] uppercase tracking-wider transition-all ${
                      selectedTheme === theme ? 'bg-yellow-500 text-black border-none shadow-md shadow-yellow-500/20 hover:bg-yellow-600' : 'border-border bg-background text-muted-foreground hover:text-foreground hover:border-yellow-500/50'
                    }`}
                  >
                    {theme}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        <AnimatePresence mode="popLayout">
          {filteredAssets.map((asset) => (
            <motion.div key={asset.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="group bg-card rounded-2xl border border-border overflow-hidden flex flex-col hover:border-yellow-500/50 transition-all hover:shadow-[0_10px_30px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
              <div className="relative aspect-square overflow-hidden bg-muted/30">
                <img src={asset.image} alt={asset.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                
                <div className="absolute top-2 left-2 drop-shadow-md">
                   <img src="/icon/icon short tuglar.png" alt="Tuglar" className="h-6 w-6 object-contain" />
                </div>

                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <div className="px-2 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[8px] font-black text-white uppercase tracking-tighter">
                    {asset.theme}
                  </div>
                </div>

                {asset.capacity && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md border border-white/10 flex items-center gap-1.5">
                    <Cpu className="h-3 w-3 text-yellow-500" />
                    <span className="text-[10px] font-black text-white">{asset.capacity}</span>
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-sm line-clamp-1 group-hover:text-yellow-500 transition-colors uppercase tracking-tight mb-1">{asset.name}</h3>
                <p className="text-[10px] text-muted-foreground line-clamp-2 mb-3 h-7 leading-relaxed">{asset.description}</p>
                
                <div className="flex items-center gap-1.5 mb-4">
                   <User2 size={12} className="text-yellow-500/70" />
                   <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{asset.creator}</span>
                </div>

                <Button onClick={() => handleCopy(asset.shortCode, asset.id)} className={`mt-auto w-full rounded-xl h-10 font-bold text-[10px] uppercase tracking-widest transition-all ${copiedId === asset.id ? 'bg-green-600 text-white hover:bg-green-600' : 'bg-muted hover:bg-yellow-500 hover:text-black text-foreground border border-border hover:border-transparent'}`}>
                  {copiedId === asset.id ? <><Check className="mr-2 h-3.5 w-3.5" /> Đã Copy</> : <><Copy className="mr-2 h-3.5 w-3.5" /> Copy Mã</>}
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}