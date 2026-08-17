// app/code/code-client.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { CodeTutorial } from "./fetch-code";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Code2, Calendar, User, FileText, AlignLeft, X, Monitor, Smartphone, ZoomIn, Filter, ChevronUp } from "lucide-react";
import { SiYoutube, SiTiktok, SiFacebook } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";

// IMPORT SHEET TỪ KHO MAP THAY CHO DIALOG
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";

const PLATFORM_ICONS: Record<string, React.ReactNode> = {
  youtube: <SiYoutube className="w-5 h-5 text-red-500" />,
  tiktok: <SiTiktok className="w-5 h-5 text-slate-900 dark:text-white" />,
  facebook: <SiFacebook className="w-5 h-5 text-[#0866FF]" />,
  text: <FileText className="w-5 h-5 text-yellow-500" />
};

const DEVICE_ICONS: Record<string, React.ReactNode> = {
  pc: <Monitor className="w-4 h-4 text-slate-700 dark:text-slate-300" />,
  mobile: <Smartphone className="w-4 h-4 text-slate-700 dark:text-slate-300" />
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

export default function CodeClient({ initialData = [] }: { initialData: CodeTutorial[] }) {
  const [tutorials, setTutorials] = useState<CodeTutorial[]>(initialData);
  const [searchQuery, setSearchQuery] = useState("");
  
  // STATE CỦA BỘ LỌC
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("Tất cả");
  const [selectedDevice, setSelectedDevice] = useState<string>("Tất cả");
  
  // STATE CỦA SHEET BỘ LỌC (LƯU TẠM TRƯỚC KHI ÁP DỤNG)
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [tempPlatform, setTempPlatform] = useState<string>("Tất cả");
  const [tempDevice, setTempDevice] = useState<string>("Tất cả");

  const [selectedTut, setSelectedTut] = useState<CodeTutorial | null>(null);
  const [fullscreenImageIdx, setFullscreenImageIdx] = useState<number | null>(null);
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  const ignoreScroll = useRef(false);

  // Lấy ra tất cả các thẻ Tags từ dữ liệu
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    tutorials.forEach(tut => tut.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [tutorials]);

  // Bộ đếm số lượng bài viết cho từng Tag (Giống Kho Map)
  const tagCounts = useMemo(() => {
    return tutorials.flatMap(t => t.tags).reduce((acc: any, t) => {
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});
  }, [tutorials]);

  // Lọc dữ liệu chính
  const filteredTutorials = useMemo(() => {
    return tutorials.filter(tut => {
      const matchesSearch = tut.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tut.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => tut.tags.includes(tag));
      const matchesPlatform = selectedPlatform === "Tất cả" || tut.type === selectedPlatform;
      const matchesDevice = selectedDevice === "Tất cả" || (tut.device || "").toLowerCase() === selectedDevice.toLowerCase();
      
      return matchesSearch && matchesTags && matchesPlatform && matchesDevice;
    });
  }, [tutorials, searchQuery, selectedTags, selectedPlatform, selectedDevice]);

  // Đồng bộ Temp State khi mở Bộ lọc
  useEffect(() => {
    if (isFilterSheetOpen) {
      setTempTags(selectedTags);
      setTempPlatform(selectedPlatform);
      setTempDevice(selectedDevice);
    }
  }, [isFilterSheetOpen, selectedTags, selectedPlatform, selectedDevice]);

  // Lắng nghe thao tác cuộn (Scroll) để hiện nút Lên đầu trang
  useEffect(() => {
    const handleScroll = () => {
      if (!ignoreScroll.current) {
        setShowScrollTop(window.scrollY > 300);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApply = () => {
    setSelectedTags(tempTags);
    setSelectedPlatform(tempPlatform);
    setSelectedDevice(tempDevice);
    setIsFilterSheetOpen(false);
    
    ignoreScroll.current = true;
    setTimeout(() => {
      scrollToTop();
      ignoreScroll.current = false;
    }, 200);
  };

  const handleReset = () => {
    setTempTags([]);
    setTempPlatform("Tất cả");
    setTempDevice("Tất cả");
  };

  const toggleTempTag = (tag: string) => {
    setTempTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const isFilterActive = selectedTags.length > 0 || selectedPlatform !== "Tất cả" || selectedDevice !== "Tất cả";

  return (
    <div className="pb-24 min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-yellow-500/5 via-[#0a0f1a] to-[#020617] -z-10" />

      {/* THANH TÌM KIẾM VÀ PHÂN LOẠI */}
      <div className="mb-8 flex flex-col gap-6 text-center md:text-left">
        <div className="relative z-10 bg-background/95 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-border shadow-xl md:max-w-4xl md:mx-auto w-full">
          <div className="relative w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-yellow-500 transition-colors" />
            <Input 
              placeholder="Tìm kiếm theo tên bài viết hoặc thẻ tag..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-white dark:bg-card/50 border-slate-200 dark:border-white/10 rounded-2xl shadow-sm text-base focus-visible:ring-yellow-500 w-full"
            />
          </div>
        </div>
      </div>

      {/* DANH SÁCH BÀI VIẾT (GRID) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredTutorials.map((tut, index) => {
            const hasThumbnail = tut.thumbnail && !tut.thumbnail.includes("data:image/svg+xml");
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
                    </div>
                    
                    <CardContent className="px-5 pb-5 pt-0 flex flex-col flex-1"> 
                      <div className="flex flex-wrap gap-2 mb-2.5 -mt-2 relative z-10">
                        {tut.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 px-2.5 py-1 rounded-md shadow-sm">{tag}</span>
                        ))}
                      </div>

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

      {filteredTutorials.length === 0 && (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Không tìm thấy hướng dẫn nào</h3>
          <p className="text-slate-500 max-w-md">Thử điều chỉnh lại từ khóa hoặc bộ lọc để xem các bài viết khác nhé.</p>
        </div>
      )}

      {/* CỤM NÚT NỔI (FAB) GÓC DƯỚI PHẢI */}
      <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
        <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 flex flex-col items-center gap-3">
          <AnimatePresence>
            {showScrollTop && (
              <motion.div initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.8 }} transition={{ duration: 0.2 }}>
                <Button onClick={scrollToTop} variant="outline" size="icon" className="h-11 w-11 md:h-12 md:w-12 rounded-full bg-background/80 backdrop-blur-md shadow-lg border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-transform hover:scale-110">
                  <ChevronUp size={20} className="md:w-6 md:h-6" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <SheetTrigger asChild>
            <Button className="h-14 w-14 md:h-16 md:w-16 rounded-full shadow-[0_10px_40px_rgba(234,179,8,0.4)] bg-yellow-500 hover:bg-yellow-600 text-black border border-yellow-400 hover:scale-110 transition-transform relative">
              <Filter size={24} className="md:w-7 md:h-7" />
              {isFilterActive && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 md:w-4 md:h-4 bg-red-500 rounded-full border-2 border-background animate-pulse"></span>
              )}
            </Button>
          </SheetTrigger>
        </div>
        
        {/* SHEET BỘ LỌC ĐƯỢC CHỈNH CHUẨN DESIGN KHO ASSET/MAP */}
        <SheetContent side="bottom" className="rounded-t-3xl h-[85vh] md:h-[75vh] md:max-w-3xl md:mx-auto flex flex-col p-6 bg-background/95 backdrop-blur-xl border-t md:border-x border-border z-[60]">
          <SheetHeader className="pb-4 border-b border-border">
            <SheetTitle className="text-left font-black uppercase tracking-widest text-foreground text-xl">BỘ LỌC PHÂN LOẠI</SheetTitle>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto py-6 space-y-8 [&::-webkit-scrollbar]:hidden">
            
            {/* Nền tảng thiết bị */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                THIẾT BỊ
              </p>
              <div className="flex flex-wrap gap-2">
                 {['Tất cả', 'mobile', 'pc'].map(val => (
                    <Button
                      key={val}
                      variant={tempDevice === val ? "default" : "outline"}
                      onClick={() => setTempDevice(val)}
                      className={`rounded-full px-5 h-10 font-bold uppercase text-[10px] tracking-widest transition-all ${
                        tempDevice === val ? 'bg-yellow-500 text-black border-none shadow-md shadow-yellow-500/20' : 'border-border bg-background hover:border-yellow-500/50'
                      }`}
                    >
                      {val === 'Tất cả' ? 'TẤT CẢ' : val.toUpperCase()}
                    </Button>
                 ))}
              </div>
            </div>

            {/* Nguồn MXH */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                Mạng xã hội
              </p>
              <div className="flex flex-wrap gap-2">
                 {['Tất cả', 'youtube', 'tiktok', 'facebook'].map(plat => (
                    <Button
                      key={plat}
                      variant={tempPlatform === plat ? "default" : "outline"}
                      onClick={() => setTempPlatform(plat)}
                      className={`rounded-full px-5 h-10 font-bold uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 ${
                        tempPlatform === plat ? 'bg-yellow-500 text-black border-none shadow-md shadow-yellow-500/20' : 'border-border bg-background hover:border-yellow-500/50'
                      }`}
                    >
                      {plat !== 'Tất cả' && <span className={tempPlatform === plat ? 'text-black' : ''}>{PLATFORM_ICONS[plat]}</span>}
                      {plat.toUpperCase()}
                    </Button>
                 ))}
              </div>
            </div>

            {/* Chủ đề Tags */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                CHỦ ĐỀ HƯỚNG DẪN
              </p>
              <div className="flex flex-wrap gap-2">
                 <Button
                    variant={tempTags.length === 0 ? "default" : "outline"}
                    onClick={() => setTempTags([])}
                    className={`rounded-full px-5 h-10 font-bold uppercase text-[10px] tracking-widest transition-all ${
                      tempTags.length === 0 ? 'bg-yellow-500 text-black border-none shadow-md shadow-yellow-500/20' : 'border-border bg-background hover:border-yellow-500/50'
                    }`}
                  >
                    TẤT CẢ
                 </Button>
                 {allTags.map(tag => (
                    <Button
                      key={tag}
                      variant={tempTags.includes(tag) ? "default" : "outline"}
                      onClick={() => toggleTempTag(tag)}
                      className={`rounded-full px-5 h-10 font-bold uppercase text-[10px] tracking-widest transition-all ${
                        tempTags.includes(tag) ? 'bg-yellow-500 text-black border-none shadow-md shadow-yellow-500/20' : 'border-border bg-background hover:border-yellow-500/50'
                      }`}
                    >
                      {tag} <span className="ml-1.5 opacity-60 font-medium">({tagCounts[tag] || 0})</span>
                    </Button>
                 ))}
              </div>
            </div>

          </div>

          <SheetFooter className="flex flex-row gap-3 pt-4 border-t border-border mt-auto">
            <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold uppercase text-[10px] tracking-widest border-border hover:bg-slate-100 dark:hover:bg-slate-800" onClick={handleReset}>
              Reset bộ lọc
            </Button>
            <Button className="flex-1 rounded-xl h-12 bg-yellow-500 text-black hover:bg-yellow-600 font-bold uppercase text-[10px] tracking-widest shadow-lg" onClick={handleApply}>
              Áp dụng
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* POPUP CHI TIẾT BÀI HƯỚNG DẪN */}
      {selectedTut && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 pt-24 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedTut(null)}>
          <div className="relative bg-white dark:bg-[#0a0f1a] rounded-3xl w-full max-w-3xl h-[70vh] max-h-[85vh] overflow-hidden shadow-2xl flex flex-col ring-1 ring-slate-200 dark:ring-white/10" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedTut(null)} className="absolute top-4 right-4 md:top-5 md:right-5 z-50 p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 transition-colors shadow-sm">
              <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </button>
            <div className="overflow-y-auto flex-grow p-6 pt-16 md:p-8 md:pt-16 space-y-6">
              <div>
                <h2 className="flex items-start md:items-center gap-3 text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-tight mb-4 pr-12">
                  <span className="shrink-0 text-slate-800 dark:text-slate-200 mt-1 md:mt-0">{DEVICE_ICONS[selectedTut.device?.toLowerCase() === "pc" ? "pc" : "mobile"]}</span>
                  <span>{selectedTut.title}</span>
                </h2>
                <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10">
                    <User className="w-4 h-4 text-yellow-600 dark:text-yellow-500" /> <span className="text-slate-900 dark:text-white font-bold">{selectedTut.author}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10">
                    <Calendar className="w-4 h-4 text-blue-500" /> <span>{selectedTut.date}</span>
                  </div>
                </div>
              </div>
              {selectedTut.description && (
                <div className="bg-yellow-50 dark:bg-yellow-500/5 p-5 rounded-2xl border border-yellow-200 dark:border-yellow-500/20 flex gap-4">
                  <AlignLeft className="w-6 h-6 text-yellow-600 dark:text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed font-medium">{selectedTut.description}</p>
                </div>
              )}
              {selectedTut.images && selectedTut.images.length > 0 && (
                <div className="mt-6 w-full">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Hình ảnh chi tiết</h3>
                  <div className="flex w-full gap-3 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {selectedTut.images.map((img, idx) => (
                      <div key={idx} onClick={() => setFullscreenImageIdx(idx)} className="cursor-zoom-in shrink-0 w-72 md:w-96 aspect-video relative rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-white/10 snap-center group bg-black/5 dark:bg-white/5 block">
                        <img src={img} alt={`Chi tiết ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider flex items-center gap-1.5 shadow-lg group-hover:bg-yellow-500 group-hover:text-black transition-colors pointer-events-none">
                          <ZoomIn className="w-4 h-4" /> PHÓNG TO
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex flex-col gap-3 w-full mt-4">
                  {selectedTut.videoUrl && (selectedTut.videoUrl.toLowerCase().includes('youtube') || selectedTut.videoUrl.toLowerCase().includes('youtu.be')) && (
                    <a href={selectedTut.videoUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full bg-[#FF0000] hover:bg-[#CC0000] text-white font-bold rounded-2xl h-14 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 text-sm md:text-base transition-transform active:scale-95"><SiYoutube className="w-6 h-6" /> Xem video trên YouTube</Button>
                    </a>
                  )}
                  {selectedTut.tiktokUrl && (
                    <a href={selectedTut.tiktokUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full bg-black hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 dark:text-black text-white font-bold rounded-2xl h-14 shadow-lg flex items-center justify-center gap-2 text-sm md:text-base transition-transform active:scale-95"><SiTiktok className="w-5 h-5" /> Xem video trên TikTok</Button>
                    </a>
                  )}
                  {selectedTut.facebookUrl && (
                    <a href={selectedTut.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button className="w-full bg-[#0866FF] hover:bg-[#0756D8] text-white font-bold rounded-2xl h-14 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 text-sm md:text-base transition-transform active:scale-95"><SiFacebook className="w-5 h-5" /> Xem bài viết đầy đủ trên Facebook</Button>
                    </a>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX XEM ẢNH TOÀN MÀN HÌNH */}
      {selectedTut && fullscreenImageIdx !== null && selectedTut.images && (
        <div className="fixed inset-0 z-[10000] bg-black flex flex-col animate-in fade-in duration-200">
            <div className="absolute top-4 right-4 z-50">
               <button onClick={() => setFullscreenImageIdx(null)} className="p-3 bg-white/10 hover:bg-white/25 rounded-full text-white backdrop-blur-md transition-colors"><X className="w-6 h-6" /></button>
            </div>
            <div className="flex-1 w-full h-full p-4 md:p-12 flex items-center justify-center" onClick={() => setFullscreenImageIdx(null)}>
               <img src={selectedTut.images[fullscreenImageIdx]} className="max-w-full max-h-full object-contain drop-shadow-2xl" alt="Phóng to" onClick={e => e.stopPropagation()} />
            </div>
            {selectedTut.images.length > 1 && (
              <div className="w-full h-24 md:h-32 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-center gap-2 px-4 overflow-x-auto">
                 {selectedTut.images.map((img, idx) => (
                    <button key={idx} onClick={() => setFullscreenImageIdx(idx)} className={`relative h-16 md:h-20 aspect-video rounded-xl overflow-hidden shrink-0 transition-all ${idx === fullscreenImageIdx ? 'ring-2 ring-yellow-500 scale-105' : 'opacity-40 hover:opacity-100'}`}>
                      <img src={img} className="absolute inset-0 w-full h-full object-cover" alt={`Thumb ${idx}`} />
                    </button>
                 ))}
              </div>
            )}
        </div>
      )}
    </div>
  );
}