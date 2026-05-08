// @ts-nocheck
"use client"
import { useState } from "react"
import { Play, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MapActions({ map }: { map: any }) {
  const [copied, setCopied] = useState(false)
  const rawCode = map.shortCode || ""

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const displayCodeText = rawCode.length > 12 ? "COPY CODE" : rawCode

  return (
    <div className="flex gap-3 w-full">
      <Button 
        onClick={() => window.open(`https://c.freefiremobile.com/?m=1E441${rawCode.replace("#", "")}`, "_blank")} 
        className="flex-1 h-13 bg-yellow-500 text-black hover:bg-yellow-600 font-black uppercase text-[13px] rounded-xl transition-all active:scale-95 shadow-sm"
      >
        <Play className="mr-2 h-4 w-4 fill-current" /> CHƠI NGAY
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleCopy} 
        className="group flex items-center justify-start h-13 w-15 hover:w-41.25 transition-all duration-300 ease-in-out rounded-xl border-border/60 bg-slate-100 hover:bg-slate-200 px-0 overflow-hidden shrink-0"
      >
        <div className="flex items-center justify-center min-w-15 h-full shrink-0">
          {copied ? <Check className="h-5 w-5 text-green-600" /> : <Copy className="h-4.5 w-4.5 text-yellow-600" />}
        </div>
        <span className="whitespace-nowrap font-bold text-[14px] text-yellow-600 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {displayCodeText}
        </span>
      </Button>
    </div>
  )
}