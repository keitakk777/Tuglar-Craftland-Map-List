// @ts-nocheck
"use client"
import { useState } from "react"
import { Play, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MapActions({ map }: { map: any }) {
  const [copied, setCopied] = useState(false)
  const rawCode = map.shortCode || ""

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex gap-3 w-full">
      <Button 
        onClick={() => window.open(`https://c.freefiremobile.com/?m=1E441${rawCode.replace("#", "")}`, "_blank")} 
        className="flex-1 h-13 bg-yellow-500 text-black hover:bg-yellow-600 font-black uppercase text-[13px] rounded-xl transition-all shadow-lg shadow-yellow-500/20"
      >
        <Play className="mr-2 h-4 w-4 fill-current" /> CHƠI NGAY
      </Button>
      
      <Button 
        variant="outline" 
        onClick={handleCopy} 
        className="group flex items-center justify-start h-13 w-15 hover:w-40 transition-all duration-300 rounded-xl border-border bg-secondary/50 dark:bg-slate-800/50 backdrop-blur-md px-0 overflow-hidden shrink-0"
      >
        <div className="flex items-center justify-center min-w-15 h-full shrink-0">
          {copied ? <Check className="h-5 w-5 text-green-600 dark:text-green-500" /> : <Copy className="h-4.5 w-4.5 text-yellow-600 dark:text-yellow-500" />}
        </div>
        <span className="whitespace-nowrap font-bold text-[13px] text-yellow-600 dark:text-yellow-500 tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
          {rawCode.length > 10 ? "COPY" : rawCode}
        </span>
      </Button>
    </div>
  )
}