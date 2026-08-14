"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, X, Code2, ExternalLink, Calendar, User, AlignLeft, Video, Filter, ChevronUp, FileText } from "lucide-react";
import { SiYoutube, SiTiktok, SiFacebook } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CodeTutorial } from "./fetch-code";
import Link from "next/link";
// Import Dialog cho Bộ lọc nổi bật giữa màn hình
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  youtube: <SiYoutube className="w-5 h-5 text-red-500" />,
  tiktok: <SiTiktok className="w-5 h-5 text-slate-900 dark:text-white" />,
  facebook: <SiFacebook className="w-5 h-5 text-blue-500" />,
  text: <FileText className="w-5 h-5 text-yellow-500" />,
};

const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^?&"'>]+)/);
  if (ytMatch && ytMatch[1]) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return null;
};

const getTiktokEmbedUrl = (url: string) => {
  if (!url) return null;
  const ttMatch = url.match(/tiktok\.com\/.*video\/(\d+)/);
  if (ttMatch && ttMatch[1]) return `https://www.tiktok.com/embed/v2/${ttMatch[1]}`;
  return null;
};

export default function CodeClient({ initialData }: { initialData: CodeTutorial[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // State lọc thực tế đang áp dụng
  const [activePlatform, setActivePlatform] = useState("all");
  const [activeTag, setActiveTag] = useState("all");

  // State tạm thời khi mở Dialog bộ lọc
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempPlatform, setTempPlatform] = useState("all");
  const [tempTag, setTempTag] = useState("all");

  const [selectedTut, setSelectedTut] = useState<CodeTutorial | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const allAvailableTags = useMemo(() => {
    const tags = new Set<string>();
    initialData.forEach(tut => tut.tags.forEach(t => { if (t) tags.add(t); }));
    return Array.from(tags);
  }, [initialData]);

  // Lọc data
  const filteredData = initialData.filter((tut) => {
    const matchesSearch = tut.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tut.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlatform = activePlatform === "all" || tut.type === activePlatform;
    const matchesTag = activeTag === "all" || tut.tags.includes(activeTag);
    return matchesSearch && matchesPlatform && matchesTag;
  });

  // Đồng bộ temp state khi mở Dialog
  useEffect(() => {
    if (isFilterOpen) {
      setTempPlatform(activePlatform);
      setTempTag(activeTag);
    }
  }, [isFilterOpen, activePlatform, activeTag]);

  // Cuộn trang
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleApplyFilter = () => {
    setActivePlatform(tempPlatform);
    setActiveTag(tempTag);
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    setTempPlatform("all");
    setTempTag("all");
  };

  const isFilterActive = activePlatform !== "all" || activeTag !== "all";

  return (
    <div className="relative pb-24">
      
      {/* HEADER */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 uppercase tracking-tight">
          Thư Viện Code Craftland
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Tổng hợp các video hướng dẫn, logic If/Else và mẹo code xịn xò từ đội ngũ sáng tạo.
        </p>
      </div>

      {/* THANH TÌM KIẾM CƠ BẢN (NẰM NGANG TRÊN MÀN HÌNH) */}
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-4 sm:p-5 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Input Tìm kiếm */}
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input 
            type="text" 
            placeholder="Tìm kiếm theo tên bài viết hoặc thẻ tag..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 h-14 rounded-2xl bg-slate-100 dark:bg-[#0a0f1a] border-transparent focus:ring-yellow-500 shadow-inner text-base"
          />
        </div>

        {/* Cụm 3 nút MXH thao tác nhanh */}
        <div className="flex gap-2 shrink-0 bg-slate-100 dark:bg-[#0a0f1a] p-1.5 rounded-2xl shadow-inner border border-slate-200 dark:border-white/5">
          {['youtube', 'tiktok', 'facebook'].map((plat) => (
            <Button
              key={plat}
              onClick={() => {
                const newPlatform = activePlatform === plat ? 'all' : plat;
                setActivePlatform(newPlatform);
              }}
              variant={activePlatform === plat ? "default" : "ghost"}
              className={`w-12 h-11 rounded-xl p-0 transition-all ${
                activePlatform === plat 
                  ? 'bg-white dark:bg-white text-black shadow-md scale-105' 
                  : 'hover:bg-white dark:hover:bg-white/10 text-slate-500'
              }`}
              title={plat.toUpperCase()}
            >
              {PLATFORM_ICONS[plat]}
            </Button>
          ))}
        </div>
      </div>

      {/* LƯỚI GRID HIỂN THỊ */}
      {filteredData.length === 0 ? (
        <div className="text-center py-20 text-slate-500 font-medium bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
          Không tìm thấy tài liệu nào phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredData.map((tut, index) => {
              const hasThumbnail = tut.thumbnail && !tut.thumbnail.includes("THIẾU ẢNH") && !tut.thumbnail.includes("ERROR");

              return (
                <motion.div key={tut.id} layout initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (index % 3) * 0.1 }} onClick={() => setSelectedTut(tut)} className="group cursor-pointer h-full">
                  <Card className="relative overflow-hidden border-slate-200 dark:border-white/10 bg-white dark:bg-card/40 backdrop-blur-md flex flex-col transition-all duration-500 hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] rounded-3xl h-full p-0">
                    
                    <div className="relative w-full aspect-video bg-slate-100 dark:bg-slate-900 overflow-hidden p-2 flex items-center justify-center">
                      {hasThumbnail ? (
                        <img src={tut.thumbnail} alt={tut.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 rounded-t-3xl" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900">
                          <Code2 className="w-10 h-10 text-slate-400 mb-2" />
                          <span className="text-slate-400 text-xs font-mono line-clamp-1 px-4">{tut.title}</span>
                        </div>
                      )}
                      <div className="absolute top-4 left-4 bg-white/95 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 shadow-sm z-10 border border-slate-200 dark:border-white/10">
                        {PLATFORM_ICONS[tut.type] || <FileText className="w-4 h-4 text-yellow-500" />}
                        <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{tut.type === "text" ? "Tài liệu" : tut.type}</span>
                      </div>
                    </div>
                    
                    <CardContent className="p-5 pt-0 flex flex-col flex-1">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {tut.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 px-2.5 py-1 rounded-md">#{tag}</span>
                        ))}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors line-clamp-2">{tut.title}</h3>
                      <div className="flex-1 min-h-[8px]"></div>
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4 mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <User className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                          </div>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{tut.author}</span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{tut.date}</span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ========================================== */}
      {/* NÚT VÀNG NỔI & DIALOG BỘ LỌC ĐẦY ĐỦ        */}
      {/* ========================================== */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex flex-col items-center gap-3">
        <AnimatePresence>
          {showScrollTop && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.8 }} transition={{ duration: 0.2 }}>
              <Button onClick={scrollToTop} variant="outline" size="icon" className="h-12 w-12 rounded-full bg-background/80 backdrop-blur-md shadow-lg border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-transform hover:scale-110">
                <ChevronUp size={24} />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button className="h-14 w-14 md:h-16 md:w-16 rounded-full shadow-[0_10px_40px_rgba(234,179,8,0.4)] bg-yellow-500 hover:bg-yellow-600 text-black border border-yellow-400 hover:scale-110 transition-transform relative">
              <Filter size={24} className="md:w-7 md:h-7" />
              {isFilterActive && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
              )}
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg rounded-3xl bg-white dark:bg-[#0a0f1a] border border-slate-200 dark:border-white/10 shadow-2xl p-0 overflow-hidden">
            <DialogHeader className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
              <DialogTitle className="text-xl font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Bộ Lọc Phân Loại
              </DialogTitle>
            </DialogHeader>

            <div className="p-6 space-y-8 bg-background">
              {/* Loại Asset (Nền tảng) */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Nền Tảng
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant={tempPlatform === "all" ? "default" : "outline"} 
                    onClick={() => setTempPlatform("all")}
                    className={`rounded-full px-6 h-10 font-bold text-xs uppercase tracking-widest transition-all ${
                      tempPlatform === "all" ? 'bg-yellow-500 text-black border-none shadow-md' : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500'
                    }`}
                  >
                    Tất cả
                  </Button>
                  {['youtube', 'tiktok', 'facebook'].map(plat => (
                    <Button
                      key={plat}
                      variant={tempPlatform === plat ? "default" : "outline"}
                      onClick={() => setTempPlatform(plat)}
                      className={`rounded-full px-6 h-10 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                        tempPlatform === plat ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-none shadow-md scale-105' : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500'
                      }`}
                    >
                      {PLATFORM_ICONS[plat]} {plat}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Chủ Đề */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Chủ Đề
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={tempTag === "all" ? "default" : "outline"} 
                    onClick={() => setTempTag("all")}
                    className={`rounded-full px-6 h-10 font-bold text-xs uppercase tracking-widest transition-all ${
                      tempTag === "all" ? 'bg-yellow-500 text-black border-none shadow-md' : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500'
                    }`}
                  >
                    Tất cả
                  </Button>
                  {allAvailableTags.map(tag => (
                    <Button
                      key={tag}
                      variant={tempTag === tag ? "default" : "outline"}
                      onClick={() => setTempTag(tag)}
                      className={`rounded-full px-5 h-10 font-bold text-xs uppercase tracking-widest transition-all ${
                        tempTag === tag ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-none shadow-md' : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500'
                      }`}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0a0f1a] flex gap-4">
              <Button 
                variant="outline" 
                onClick={handleResetFilter}
                className="flex-1 rounded-2xl h-12 font-bold text-xs uppercase tracking-widest border-slate-200 dark:border-white/10 bg-white dark:bg-transparent text-slate-700 dark:text-slate-300"
              >
                Reset Bộ Lọc
              </Button>
              <Button 
                onClick={handleApplyFilter}
                className="flex-1 rounded-2xl h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs uppercase tracking-widest shadow-lg shadow-yellow-500/20"
              >
                Áp Dụng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ========================================== */}
      {/* POP-UP MODAL CHI TIẾT TÀI LIỆU             */}
      {/* ========================================== */}
      {selectedTut && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedTut(null)}>
          {/* Đã thu nhỏ xuống max-w-3xl và max-h-[85vh] để gọn gàng hơn */}
          <div className="bg-white dark:bg-[#0a0f1a] rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col ring-1 ring-slate-200 dark:ring-white/10" onClick={e => e.stopPropagation()}>
            
            <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <span className="bg-slate-900 dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-2 shadow-sm">
                {PLATFORM_ICONS[selectedTut.type]} {selectedTut.type === "text" ? "Tài liệu" : selectedTut.type}
              </span>
              <button onClick={() => setSelectedTut(null)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="overflow-y-auto flex-grow p-6 md:p-8 space-y-6">
              
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight mb-4">{selectedTut.title}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10">
                    <User className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
                    <span className="text-slate-900 dark:text-white font-bold">{selectedTut.author}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span>{selectedTut.date}</span>
                  </div>
                </div>
              </div>

              {selectedTut.description && (
                <div className="bg-yellow-50 dark:bg-yellow-500/5 p-5 rounded-2xl border border-yellow-200 dark:border-yellow-500/20 flex gap-4">
                  <AlignLeft className="w-6 h-6 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">{selectedTut.description}</p>
                </div>
              )}

              {selectedTut.videoUrl && (getYoutubeEmbedUrl(selectedTut.videoUrl) || getTiktokEmbedUrl(selectedTut.videoUrl)) && (
                <div className="space-y-3">
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
                    <Video className="w-5 h-5 text-red-500" /> Video Hướng dẫn
                  </h3>
                  <div className={`w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 bg-black ${getYoutubeEmbedUrl(selectedTut.videoUrl) ? 'aspect-video' : 'aspect-[9/16] max-w-xs mx-auto'}`}>
                    <iframe 
                      width="100%" height="100%" 
                      src={getYoutubeEmbedUrl(selectedTut.videoUrl) || getTiktokEmbedUrl(selectedTut.videoUrl)!} 
                      frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
                    </iframe>
                  </div>
                </div>
              )}

              {selectedTut.facebookUrl && (
                <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/30 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4 mt-6">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <SiFacebook className="w-10 h-10 text-[#0866FF] shrink-0" />
                    <div>
                      <h3 className="text-lg font-black text-slate-900 dark:text-white">Thảo luận trên Facebook</h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-medium">Bấm vào đây để xem chi tiết bài hướng dẫn, hình ảnh và bình luận.</p>
                    </div>
                  </div>
                  <Link 
                    href={selectedTut.facebookUrl} 
                    target="_blank"
                    className="shrink-0 bg-[#0866FF] hover:bg-[#0756D8] text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-transform hover:scale-105 shadow-md shadow-blue-500/20 text-sm"
                  >
                    Xem bài viết <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}