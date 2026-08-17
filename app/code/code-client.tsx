// app/code/code-client.tsx
"use client";

import { useState, useMemo } from "react";
import { CodeTutorial } from "./fetch-code";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

// BẠN CHỈ CẦN GIỮ LẠI ĐÚNG 1 DÒNG NÀY THÔI:
import { Search, Code2, Tag, Calendar, User, FileText, AlignLeft, X, ExternalLink, Monitor, Smartphone, Video, ZoomIn } from "lucide-react";

import { SiYoutube, SiTiktok, SiFacebook } from "react-icons/si";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedDevice, setSelectedDevice] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTut, setSelectedTut] = useState<CodeTutorial | null>(null);
  
  // STATE MỚI: Phục vụ tính năng phóng to ảnh (Lightbox)
  const [fullscreenImageIdx, setFullscreenImageIdx] = useState<number | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    tutorials.forEach(tut => tut.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [tutorials]);

  const filteredTutorials = useMemo(() => {
    return tutorials.filter(tut => {
      const matchesSearch = tut.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            tut.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => tut.tags.includes(tag));
      const matchesPlatform = selectedPlatform === "all" || tut.type === selectedPlatform;
      const matchesDevice = selectedDevice === "all" || (tut.device || "").toLowerCase() === selectedDevice.toLowerCase();
      
      return matchesSearch && matchesTags && matchesPlatform && matchesDevice;
    });
  }, [tutorials, searchQuery, selectedTags, selectedPlatform, selectedDevice]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6 md:space-y-10 relative">
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-yellow-500/10 to-transparent -z-10" />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-yellow-500 transition-colors" />
          </div>
          <Input 
            placeholder="Tìm kiếm theo tên bài viết hoặc thẻ tag..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-14 bg-white dark:bg-card/50 border-slate-200 dark:border-white/10 rounded-2xl shadow-sm text-base focus-visible:ring-yellow-500"
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(true)}
            className="h-14 px-6 bg-white dark:bg-card/50 border-slate-200 dark:border-white/10 rounded-2xl shadow-sm md:hidden"
          >
            <Tag className="w-5 h-5 mr-2" /> Lọc
          </Button>

          <div className="hidden md:flex bg-white dark:bg-card/50 border border-slate-200 dark:border-white/10 p-1.5 rounded-2xl shadow-sm">
            <Button
              variant={selectedPlatform === "all" ? "default" : "ghost"}
              onClick={() => setSelectedPlatform("all")}
              className={`rounded-xl px-4 ${selectedPlatform === "all" ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : ''}`}
            >
              Tất cả
            </Button>
            {['youtube', 'tiktok', 'facebook'].map((plat) => (
              <Button
                key={plat}
                variant={selectedPlatform === plat ? "default" : "ghost"}
                onClick={() => setSelectedPlatform(plat)}
                className={`rounded-xl w-12 px-0 ${selectedPlatform === plat ? 'bg-slate-100 dark:bg-white/10' : ''}`}
                title={plat.toUpperCase()}
              >
                {PLATFORM_ICONS[plat]}
              </Button>
            ))}
          </div>
        </div>
      </div>

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
                          <span key={tag} className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 px-2.5 py-1 rounded-md shadow-sm">#{tag}</span>
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

      {/* FILTER DIALOG CHO MOBILE */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl bg-white dark:bg-[#0a0f1a] border border-slate-200 dark:border-white/10 shadow-2xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Bộ Lọc</DialogTitle>
          <div className="p-6 bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-5 h-5 text-yellow-500" /> Bộ Lọc Hướng Dẫn
            </h3>
            <button onClick={() => setIsFilterOpen(false)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nền tảng thiết bị</h4>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger className="h-12 rounded-xl bg-slate-50 dark:bg-black/50 border-slate-200 dark:border-white/10">
                  <SelectValue placeholder="Chọn nền tảng" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900">
                  <SelectItem value="all">Tất cả thiết bị</SelectItem>
                  <SelectItem value="mobile">Chỉ dành cho Mobile</SelectItem>
                  <SelectItem value="pc">Chỉ dành cho PC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Nguồn hướng dẫn</h4>
              <div className="grid grid-cols-2 gap-3">
                <Button variant={selectedPlatform === "all" ? "default" : "outline"} onClick={() => setSelectedPlatform("all")} className={`h-12 rounded-xl justify-start ${selectedPlatform === "all" ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'bg-transparent border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300'}`}>Tất cả nền tảng</Button>
                {['youtube', 'tiktok', 'facebook'].map(plat => (
                  <Button key={plat} variant={selectedPlatform === plat ? "default" : "outline"} onClick={() => setSelectedPlatform(plat)} className={`h-12 rounded-xl justify-start gap-2 ${selectedPlatform === plat ? 'bg-slate-100 dark:bg-white/10 border-slate-300 dark:border-white/20' : 'bg-transparent border-slate-200 dark:border-white/10'}`}>
                    {PLATFORM_ICONS[plat]} <span className="capitalize">{plat}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Thẻ (Tags)</h4>
                {selectedTags.length > 0 && (
                  <button onClick={() => setSelectedTags([])} className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">Xóa lọc</button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                {allTags.map(tag => (
                  <Badge key={tag} variant={selectedTags.includes(tag) ? "default" : "outline"} onClick={() => toggleTag(tag)} className={`cursor-pointer px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedTags.includes(tag) ? 'bg-yellow-500 hover:bg-yellow-600 text-black border-transparent shadow-md' : 'bg-transparent border-slate-200 dark:border-white/10 hover:border-yellow-500/50 hover:bg-yellow-500/5 text-slate-700 dark:text-slate-300'}`}>
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
            <Button className="w-full h-14 bg-yellow-500 hover:bg-yellow-600 text-black font-black uppercase tracking-wider rounded-xl shadow-lg" onClick={() => setIsFilterOpen(false)}>
              Áp Dụng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* POPUP CHI TIẾT BÀI HƯỚNG DẪN */}
      {selectedTut && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedTut(null)}>
          <div className="bg-white dark:bg-[#0a0f1a] rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col ring-1 ring-slate-200 dark:ring-white/10" onClick={e => e.stopPropagation()}>
            
            <div className="flex items-center justify-end p-5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <button onClick={() => setSelectedTut(null)} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 transition-colors">
                <X className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              </button>
            </div>

            <div className="overflow-y-auto flex-grow p-6 md:p-8 space-y-6">
              
              <div>
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

              {/* ---------- THƯ VIỆN HÌNH ẢNH CÓ LIGHTBOX ---------- */}
              {selectedTut.images && selectedTut.images.length > 0 && (
                <div className="mt-6 w-full">
                  <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3">Hình ảnh chi tiết</h3>
                  <div className="flex w-full gap-3 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                    {selectedTut.images.map((img, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setFullscreenImageIdx(idx)}
                        className="cursor-zoom-in shrink-0 w-72 md:w-96 aspect-video relative rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-white/10 snap-center group bg-black/5 dark:bg-white/5 block"
                      >
                        {/* Ảnh chính với hiệu ứng zoom nhẹ khi đưa chuột vào */}
                        <img 
                          src={img} 
                          alt={`Chi tiết ${idx + 1}`} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        
                        {/* Lớp phủ gradient đen nhẹ dưới đáy để làm nổi bật chữ */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />

                        {/* Nút Hint: Báo hiệu bấm để phóng to */}
                        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider flex items-center gap-1.5 shadow-lg group-hover:bg-yellow-500 group-hover:text-black transition-colors pointer-events-none">
                          <ZoomIn className="w-4 h-4" />
                          PHÓNG TO
                        </div>
                      </div>
                    ))}
                  </div>
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
                        <SiFacebook className="w-5 h-5" /> Thảo luận trên Facebook
                      </Button>
                    </a>
                  )}

              </div>
            </div>
          </div>
        </div>
      )}

      {/* TÍNH NĂNG XEM ẢNH FULL MÀN HÌNH (LIGHTBOX) */}
      {selectedTut && fullscreenImageIdx !== null && selectedTut.images && (
        <div className="fixed inset-0 z-[10000] bg-black flex flex-col animate-in fade-in duration-200">
            {/* Nút Đóng */}
            <div className="absolute top-4 right-4 z-50">
               <button onClick={() => setFullscreenImageIdx(null)} className="p-3 bg-white/10 hover:bg-white/25 rounded-full text-white backdrop-blur-md transition-colors">
                  <X className="w-6 h-6" />
               </button>
            </div>

            {/* Ảnh chính to bự ở giữa */}
            <div className="flex-1 w-full h-full p-4 md:p-12 flex items-center justify-center" onClick={() => setFullscreenImageIdx(null)}>
               <img 
                 src={selectedTut.images[fullscreenImageIdx]} 
                 className="max-w-full max-h-full object-contain drop-shadow-2xl" 
                 alt="Phóng to"
                 onClick={e => e.stopPropagation()} 
               />
            </div>

            {/* Băng chuyền chọn ảnh bên dưới (chỉ hiện khi có >= 2 ảnh) */}
            {selectedTut.images.length > 1 && (
              <div className="w-full h-24 md:h-32 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-center gap-2 px-4 overflow-x-auto">
                 {selectedTut.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setFullscreenImageIdx(idx)}
                      className={`relative h-16 md:h-20 aspect-video rounded-xl overflow-hidden shrink-0 transition-all ${idx === fullscreenImageIdx ? 'ring-2 ring-yellow-500 scale-105' : 'opacity-40 hover:opacity-100'}`}
                    >
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