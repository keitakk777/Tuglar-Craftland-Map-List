"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X, Code2, ExternalLink, Calendar, User, AlignLeft, Video, Filter, ChevronUp, FileText, Smartphone, Monitor } from "lucide-react";
import { SiYoutube, SiTiktok, SiFacebook } from "react-icons/si";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CodeTutorial } from "./fetch-code";
import Link from "next/link";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  youtube: <SiYoutube className="w-5 h-5 text-red-500" />,
  tiktok: <SiTiktok className="w-5 h-5 text-slate-900 dark:text-white" />,
  facebook: <SiFacebook className="w-5 h-5 text-blue-500" />,
  text: <FileText className="w-5 h-5 text-yellow-500" />,
};

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  pc: <Monitor className="w-4 h-4 text-black dark:text-white fill-current" />,
  mobile: <Smartphone className="w-4 h-4 text-black dark:text-white fill-current" />,
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
  
  const [activePlatform, setActivePlatform] = useState("all");
  const [activeDevice, setActiveDevice] = useState("all");
  const [activeTag, setActiveTag] = useState("all");

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tempPlatform, setTempPlatform] = useState("all");
  const [tempDevice, setTempDevice] = useState("all");
  const [tempTag, setTempTag] = useState("all");

  const [selectedTut, setSelectedTut] = useState<CodeTutorial | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const allAvailableTags = useMemo(() => {
    const tags = new Set<string>();
    initialData.forEach(tut => tut.tags.forEach(t => { if (t) tags.add(t); }));
    return Array.from(tags);
  }, [initialData]);

  const filteredData = initialData.filter((tut) => {
    const matchesSearch = tut.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tut.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlatform = activePlatform === "all" || tut.type === activePlatform;
    const matchesDevice = activeDevice === "all" || tut.device.toLowerCase() === activeDevice.toLowerCase();
    const matchesTag = activeTag === "all" || tut.tags.includes(activeTag);
    return matchesSearch && matchesPlatform && matchesDevice && matchesTag;
  });

  useEffect(() => {
    if (isFilterOpen) {
      setTempPlatform(activePlatform);
      setTempDevice(activeDevice);
      setTempTag(activeTag);
    }
  }, [isFilterOpen, activePlatform, activeDevice, activeTag]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleApplyFilter = () => {
    setActivePlatform(tempPlatform);
    setActiveDevice(tempDevice);
    setActiveTag(tempTag);
    setIsFilterOpen(false);
  };

  const handleResetFilter = () => {
    setTempPlatform("all");
    setTempDevice("all");
    setTempTag("all");
  };

  const isFilterActive = activePlatform !== "all" || activeDevice !== "all" || activeTag !== "all";

  return (
    <div className="relative pb-24">
      
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4 uppercase tracking-tight leading-normal py-1">
          Thư Viện Code Craftland
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
          Tổng hợp các tài liệu hướng dẫn code Craftland dành cho cộng đồng.
        </p>
      </div>

      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-4 sm:p-5 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-sm mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
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
        // ĐÃ SỬA THÀNH xl:grid-cols-4 ĐỂ HIỂN THỊ 4 CỘT TRÊN MÀN HÌNH LỚN
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredData.map((tut, index) => {
              const hasThumbnail = tut.thumbnail && !tut.thumbnail.includes("THIẾU ẢNH") && !tut.thumbnail.includes("ERROR");
              const deviceKey = tut.device?.toLowerCase() === "pc" ? "pc" : "mobile";

              return (
                <motion.div key={tut.id} layout initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: (index % 4) * 0.1 }} onClick={() => setSelectedTut(tut)} className="group cursor-pointer h-full">
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
                      
                      {/* Đã xóa khối absolute chứa icon nổi trên ảnh */}
                      
                    </div>
                    
                    {/* --- KHU VỰC BẠN TỰ CHỈNH KHOẢNG CÁCH & CỠ CHỮ --- */}
                    {/* Giữ nguyên pt-0 ở CardContent */}
                    <CardContent className="px-5 pb-5 pt-0 flex flex-col flex-1"> 
                      
                      {/* VŨ KHÍ Ở ĐÂY: Thêm -mt-2 hoặc -mt-3 để KÉO NGƯỢC hashtag lên sát ảnh */}
                      <div className="flex flex-wrap gap-2 mb-2.5 -mt-2">
                        {tut.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 px-2.5 py-1 rounded-md">#{tag}</span>
                        ))}
                      </div>

                      {/* Đã thêm icon nằm trực tiếp cạnh Tiêu đề */}
                      <h3 className="flex items-start gap-2 text-base font-bold text-slate-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-500 transition-colors">
                        <span className="shrink-0 mt-[3px] text-slate-700 dark:text-slate-300">
                           {DEVICE_ICONS[deviceKey]}
                        </span>
                        <span className="line-clamp-2">{tut.title}</span>
                      </h3>
                      
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

          <DialogContent className="sm:max-w-md rounded-3xl bg-white dark:bg-[#0a0f1a] border border-slate-200 dark:border-white/10 shadow-2xl p-0 overflow-hidden">
            <DialogHeader className="p-5 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5">
              <DialogTitle className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white">
                Bộ Lọc Phân Loại
              </DialogTitle>
            </DialogHeader>

            <div className="p-6 space-y-6 bg-background max-h-[60vh] overflow-y-auto scrollbar-hide">
              
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Nền Tảng Thiết Bị
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={tempDevice === "all" ? "default" : "outline"} 
                    onClick={() => setTempDevice("all")}
                    className={`rounded-full px-5 h-9 font-bold text-xs uppercase tracking-widest transition-all ${
                      tempDevice === "all" ? 'bg-yellow-500 text-black border-none shadow-md' : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500'
                    }`}
                  >
                    Tất cả
                  </Button>
                  {['mobile', 'pc'].map(dev => (
                    <Button
                      key={dev}
                      variant={tempDevice === dev ? "default" : "outline"}
                      onClick={() => setTempDevice(dev)}
                      className={`rounded-full px-5 h-9 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                        tempDevice === dev ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-none shadow-md scale-105' : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500'
                      }`}
                    >
                      {DEVICE_ICONS[dev]} {dev}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  Mạng Xã Hội
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={tempPlatform === "all" ? "default" : "outline"} 
                    onClick={() => setTempPlatform("all")}
                    className={`rounded-full px-5 h-9 font-bold text-xs uppercase tracking-widest transition-all ${
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
                      className={`rounded-full px-5 h-9 font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                        tempPlatform === plat ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-none shadow-md scale-105' : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500'
                      }`}
                    >
                      {PLATFORM_ICONS[plat]} {plat}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Chủ Đề
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={tempTag === "all" ? "default" : "outline"} 
                    onClick={() => setTempTag("all")}
                    className={`rounded-full px-5 h-9 font-bold text-xs uppercase tracking-widest transition-all ${
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
                      className={`rounded-full px-4 h-9 font-bold text-xs uppercase tracking-widest transition-all ${
                        tempTag === tag ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-none shadow-md' : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-500'
                      }`}
                    >
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0a0f1a] flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleResetFilter}
                className="flex-1 rounded-2xl h-11 font-bold text-xs uppercase tracking-widest border-slate-200 dark:border-white/10 bg-white dark:bg-transparent text-slate-700 dark:text-slate-300"
              >
                Reset Bộ Lọc
              </Button>
              <Button 
                onClick={handleApplyFilter}
                className="flex-1 rounded-2xl h-11 bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs uppercase tracking-widest shadow-lg shadow-yellow-500/20"
              >
                Áp Dụng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {selectedTut && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedTut(null)}>
          <div className="bg-white dark:bg-[#0a0f1a] rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col ring-1 ring-slate-200 dark:ring-white/10" onClick={e => e.stopPropagation()}>
            
            <div className="flex items-center justify-end p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              {/* Chỉ giữ lại nút Tắt X, dẹp hết các pill thiết bị/nền tảng */}
              <button onClick={() => setSelectedTut(null)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                <X className="w-6 h-6 text-slate-500" />
              </button>
            </div>

            <div className="overflow-y-auto flex-grow p-6 md:p-8 space-y-6">
              
              <div>
                {/* Đặt thẳng icon PC/Mobile cạnh tiêu đề to, bỏ cái khung bao quanh */}
                <h2 className="flex items-start md:items-center gap-3 text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                  <span className="shrink-0 text-slate-800 dark:text-slate-200 mt-1 md:mt-0">
                    {DEVICE_ICONS[selectedTut.device?.toLowerCase() === "pc" ? "pc" : "mobile"]}
                  </span>
                  <span>{selectedTut.title}</span>
                </h2>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">
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

              <div className="flex flex-col gap-3 w-full mt-4">
                  
                  {selectedTut.videoUrl && (selectedTut.videoUrl.toLowerCase().includes('youtube') || selectedTut.videoUrl.toLowerCase().includes('youtu.be')) && (
                    <a href={selectedTut.videoUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-2xl h-14 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 text-sm md:text-base transition-transform active:scale-95">
                        <SiYoutube className="w-6 h-6" /> Xem video trên YouTube
                      </Button>
                    </a>
                  )}

                  {selectedTut.tiktokUrl && (
                    <a href={selectedTut.tiktokUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full bg-black hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-black text-white font-bold rounded-2xl h-14 shadow-lg flex items-center justify-center gap-2 text-sm md:text-base transition-transform active:scale-95">
                        <SiTiktok className="w-5 h-5" /> Xem video trên TikTok
                      </Button>
                    </a>
                  )}

                  {selectedTut.facebookUrl && (
                    <a href={selectedTut.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full bg-[#0866FF] hover:bg-[#0756D8] text-white font-bold rounded-2xl h-14 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm md:text-base transition-transform active:scale-95">
                        <SiFacebook className="w-5 h-5" /> Xem bài viết trên Facebook
                      </Button>
                    </a>
                  )}

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}