// @ts-nocheck
"use client"
import { useState } from "react"
import { Play, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MapActions({ map }: { map: any }) {
  const [copied, setCopied] = useState(false)
  
  const rawCode = map.shortCode || ""
  const cleanCode = rawCode.replace("#", "").replace(/FREEFIRE/i, "").trim()
  const playLink = `https://c.freefiremobile.com/?m=1E441${cleanCode}`

  const handleCopy = () => {
    if (rawCode) {
      navigator.clipboard.writeText(rawCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) 
    }
  }

  return (
    <div className="mt-6 flex items-center gap-3 w-full">
      <a href={playLink} target="_blank" rel="noopener noreferrer" className="flex-1">
        <Button className="w-full h-16 bg-yellow-500 hover:bg-yellow-600 text-black font-bold uppercase text-lg rounded-2xl transition-all shadow-lg shadow-yellow-500/20 border-none active:scale-[0.98]">
            <Play className="mr-2 h-5 w-5 fill-current" />
            CHƠI NGAY
        </Button>
      </a>

      <div className="group relative">
        <Button
          variant="outline"
          onClick={handleCopy}
          // 🎯 Ép nút dùng flex căn giữa tuyệt đối
          className="h-16 w-16 px-0 rounded-2xl border-border/50 bg-muted/30 transition-all duration-500 ease-in-out group-hover:w-48 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5 flex items-center justify-center overflow-hidden relative active:scale-95"
        >
          {/* Cụm chứa Icon và Chữ */}
          <div className="flex items-center justify-center w-full h-full">
            
            {/* Icon luôn cố định tâm */}
            <div className="shrink-0 flex items-center justify-center">
              {copied ? (
                <Check className="h-6 w-6 text-green-600 animate-in zoom-in duration-300" />
              ) : (
                <Copy className="h-6 w-6 text-muted-foreground group-hover:text-yellow-600 transition-colors duration-300" />
              )}
            </div>

            {/* 🎯 Trick Grid để mở rộng chữ mượt mà không làm lệch tâm flex */}
            <div className="grid transition-all duration-500 overflow-hidden grid-cols-[0fr] group-hover:grid-cols-[1fr] items-center">
              <div className="min-w-0 flex items-center">
                <span className="pl-0 group-hover:pl-2.5 text-base font-bold text-yellow-600 tracking-wider uppercase whitespace-nowrap leading-none mt-0.5">
                  {rawCode.length > 15 ? "COPY MÃ" : rawCode}
                </span>
              </div>
            </div>

          </div>
        </Button>
      </div>
    </div>
  )
}