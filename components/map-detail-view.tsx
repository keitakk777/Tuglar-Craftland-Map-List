"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Calendar, History, Star, Play, ArrowLeft, Trophy, Copy, Check, PlayCircle, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
// 🎯 BƯỚC 1: IMPORT THƯ VIỆN MOTION
import { motion } from "framer-motion"

export function MapDetailView({ data }: { data: any }) {
  const [copied, setCopied] = useState(false)

  const cleanCode = data?.shortCode?.replace("#", "") || ""
  const playLink = `https://c.freefiremobile.com/?m=1E441${cleanCode}`

  const handleCopy = () => {
    if (data?.shortCode) {
      navigator.clipboard.writeText(data.shortCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) 
    }
  }

  // 🎯 BƯỚC 2: ĐỊNH NGHĨA HIỆU ỨNG (VARIANTS)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Các mục con hiện cách nhau 0.2s
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  }

  const dotVariants = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { type: "spring", stiffness: 200, damping: 10 } }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="container mx-auto px-4 pt-32 pb-12 flex-1">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-yellow-500 mb-8 transition-colors font-semibold uppercase tracking-wider">
            <ArrowLeft className="h-4 w-4" /> Quay lại danh sách Map
        </Link>

        {/* --- PHẦN 1: THÔNG TIN TỔNG QUAN --- */}
        <div className="flex flex-col lg:flex-row gap-10 items-start mb-16">
          <div className="w-full lg:w-[480px] shrink-0">
            <div className="relative aspect-[485/220] overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-yellow-500/10">
              <img src={data.banner} className="h-full w-full object-cover" alt={data.name} />
              <div className="absolute bottom-3 left-3 flex gap-2">
                  <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-[11px] px-2.5 py-1 rounded-lg text-white border border-white/10 font-semibold">
                      <ThumbsUp className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      {data.likes}
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md text-[11px] px-2.5 py-1 rounded-lg text-white border border-white/10 font-semibold">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      {data.plays}
                  </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 w-full">
              <a href={playLink} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button 
                  className="w-full h-16 bg-yellow-500 hover:bg-yellow-600 text-black font-bold uppercase text-lg rounded-2xl transition-all shadow-lg shadow-yellow-500/20 border-none active:scale-[0.98]"
                >
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    CHƠI NGAY
                </Button>
              </a>

              <div className="group relative">
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  className={`
                    h-16 w-16 px-0 rounded-2xl border-border/50 bg-muted/30 transition-all duration-500 ease-in-out
                    group-hover:w-40 group-hover:border-yellow-500/50 group-hover:bg-yellow-500/5
                    flex items-center justify-center overflow-hidden relative active:scale-95
                  `}
                >
                  <span className="absolute left-[54px] opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 text-base font-bold text-yellow-600 whitespace-nowrap tracking-wider">
                    {data.shortCode}
                  </span>

                  <div className={`
                    flex items-center justify-center transition-all duration-500 ease-in-out
                    group-hover:-translate-x-10 shrink-0
                  `}>
                    {copied ? (
                      <Check className="h-6 w-6 text-green-600 animate-in zoom-in duration-300" />
                    ) : (
                      <Copy className="h-6 w-6 text-muted-foreground group-hover:text-yellow-600" />
                    )}
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-4">
               <div className="h-8 w-1.5 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
               <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">{data.name}</h1>
               <Badge className="ml-2 bg-yellow-500/20 text-yellow-700 border-yellow-500/30 font-semibold">v{data.version}</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 mt-6">
               <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.1em]">Người tạo</span>
                  <span className="text-yellow-600 font-bold text-lg uppercase">{data.creator}</span>
               </div>
               <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.1em]">Chế độ chơi</span>
                  <span className="font-bold text-lg uppercase">{data.mode}</span>
               </div>
               <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.1em]">Đội</span>
                  <span className="font-bold text-lg uppercase">{data.teamType}</span>
               </div>
               <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.1em]">Cập nhật</span>
                  <span className="font-bold text-lg uppercase flex items-center gap-2"><Calendar className="h-4 w-4" /> {data.updateDate}</span>
               </div>
            </div>

            <div className="mt-8 p-6 bg-card/40 rounded-2xl border border-border/50 backdrop-blur-sm shadow-inner italic text-sm text-muted-foreground">
                <p className="whitespace-pre-line leading-relaxed font-medium">{data.description}</p>
            </div>
          </div>
        </div>

        {/* --- PHẦN 2: VIDEO VÀ PATCH NOTES --- */}
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {data.videoUrl && (
              <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm mb-8 overflow-hidden">
                <h2 className="flex items-center gap-2 text-2xl font-bold mb-6 text-foreground uppercase tracking-tight">
                  <PlayCircle className="h-7 w-7 text-yellow-500" /> Preview
                </h2>
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-border/30 bg-black/20 shadow-lg">
                  <iframe src={data.videoUrl} className="h-full w-full" allowFullScreen></iframe>
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-sm">
              <h2 className="relative pl-8 flex items-center text-2xl font-bold mb-12 text-foreground uppercase tracking-tight">
                <History className="absolute -left-[11px] text-yellow-500 h-7 w-7" /> 
                Patch Notes
              </h2>
              
              {/* 🎯 BƯỚC 3: ÁP DỤNG MOTION VÀO TIMELINE CONTAINER */}
              <motion.div 
                className="space-y-0"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }} // Chạy 1 lần khi cuộn thấy 20% block
                variants={containerVariants}
              > 
                {data.patchNotes?.map((note: any, index: number) => {
                  const isFirst = index === 0;
                  const isLast = index === data.patchNotes.length - 1;
                  return (
                    <motion.div 
                      key={index} 
                      className="relative pl-8 pb-12 last:pb-0"
                      variants={itemVariants} // Các mục text trượt sang
                    >
                      {!(isFirst && isLast) && (
                         <div className={`absolute left-0 w-[2px] bg-yellow-500/10 ${isFirst ? "top-[10px] bottom-0" : isLast ? "top-0 h-[10px]" : "top-0 bottom-0"}`} />
                      )}
                      
                      {/* Nút tròn hiện dần ra bằng hiệu ứng Spring */}
                      <motion.div 
                        className="absolute -left-[9px] top-0 h-[20px] w-[20px] rounded-full bg-background border-[3px] border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)] z-10" 
                        variants={dotVariants}
                      />

                      <div className="relative -top-[2px]"> 
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h3 className="font-bold text-xl text-yellow-600 leading-none uppercase">{note.title || "Cập nhật mới"}</h3>
                              <div className="px-2 py-0.5 rounded-full border border-yellow-500/50 bg-yellow-500/10 text-yellow-700 text-xs font-bold">v{note.ver}</div>
                          </div>
                          <p className="text-muted-foreground mt-3 text-base whitespace-pre-line leading-relaxed font-medium">{note.content}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
                <h3 className="font-bold mb-6 flex items-center gap-2 text-foreground uppercase text-base tracking-[0.1em]">
                    <Trophy className="h-5 w-5 text-yellow-500" /> Achievements
                </h3>
                <div className="space-y-4">
                   {data.achievements?.map((ach: any, idx: number) => (
                     <div key={idx} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-yellow-500/30 transition-colors">
                        <div className={`h-11 w-11 shrink-0 rounded-lg flex items-center justify-center font-medium text-lg ${
                          ach.type === 'gold' ? 'bg-yellow-500/10 text-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'bg-amber-500/10 text-amber-600 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                        }`}>
                          {ach.rank}
                        </div>
                        <span className="text-sm font-bold uppercase tracking-tight leading-tight">{ach.title}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}