"use client";

import { useState, useMemo } from "react";
import { Play, FileText, User, Search, X, ExternalLink, Code2, RefreshCw } from "lucide-react";
import { CodeTutorial } from "./fetch-code";
import Link from "next/link";

// Biểu tượng cho từng MXH
const platformIcons: Record<string, React.ReactNode> = {
  youtube: <Play className="w-4 h-4 text-red-500 fill-current" />,
  tiktok: <Play className="w-4 h-4 text-cyan-500 fill-current" />,
  facebook: <Play className="w-4 h-4 text-blue-500 fill-current" />,
  text: <FileText className="w-4 h-4 text-yellow-500" />
};

// Hàm xử lý link YouTube
const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return null;
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v=|.*\/|.*embed\/))([^?&"'>]+)/);
  if (ytMatch && ytMatch[1]) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return null;
};

// Hàm kiểm tra link text
const isStandardLink = (url: string) => {
  return url && url !== "Link" && url !== "#" && url !== "undefined" && url !== "nan" && url.startsWith("http");
};

export default function CodeClient({ initialData }: { initialData: CodeTutorial[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activePlatform, setActivePlatform] = useState<string>("all");
  const [activeTag, setActiveTag] = useState<string>("all");
  const [selectedTut, setSelectedTut] = useState<CodeTutorial | null>(null);

  // Tự động gom tất cả các tags hiện có từ dữ liệu
  const allAvailableTags = useMemo(() => {
    const tags = new Set<string>();
    initialData.forEach(tut => {
      tut.tags.forEach(t => { if (t) tags.add(t); });
    });
    return Array.from(tags);
  }, [initialData]);

  // Bộ lọc kết hợp 3 lớp (Search + Platform + Tag)
  const filteredData = initialData.filter((tut) => {
    const matchesSearch = tut.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tut.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPlatform = activePlatform === "all" || tut.type === activePlatform;
    const matchesTag = activeTag === "all" || tut.tags.includes(activeTag);
    return matchesSearch && matchesPlatform && matchesTag;
  });

  return (
    <>
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-4">
          THƯ VIỆN CODE CRAFTLAND
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Tổng hợp các video hướng dẫn, logic If/Else và mẹo code xịn xò từ đội ngũ sáng tạo.
        </p>
      </div>

{/* ========================================== */}
      {/* TỔ HỢP BỘ LỌC CHUYÊN NGHIỆP               */}
      {/* ========================================== */}
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl mb-10 flex flex-col gap-6">
        
        {/* Hàng 1: Search & Nút Reset */}
        <div className="flex gap-4 items-center">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên bài viết hoặc thẻ tag..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#0a0f1a] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors font-medium shadow-inner"
            />
          </div>
          <button 
            onClick={() => { setSearchQuery(""); setActivePlatform("all"); setActiveTag("all"); }}
            className="flex-shrink-0 p-3.5 rounded-2xl bg-slate-100 dark:bg-[#0a0f1a] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 transition-colors shadow-sm"
            title="Làm mới bộ lọc"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Hàng 2: Lọc Nền tảng (MXH bằng Icon) & Lọc Tag/Chủ đề */}
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          
          {/* Cụm Nền tảng (Chỉ hiển thị icon MXH để gọn gàng) */}
          <div className="flex flex-col gap-2 w-full lg:w-auto">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              Nền tảng mạng xã hội
            </span>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setActivePlatform('all')} 
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activePlatform === 'all' 
                    ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/20' 
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                Tất cả
              </button>
              {['youtube', 'tiktok', 'facebook'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => setActivePlatform(plat)}
                  title={`Lọc theo ${plat}`}
                  className={`p-2.5 rounded-xl transition-all flex items-center justify-center w-11 h-11 ${
                    activePlatform === plat 
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md scale-105' 
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  {platformIcons[plat]} 
                </button>
              ))}
            </div>
          </div>

          {/* Cụm Chủ đề / Tag */}
          <div className="flex flex-col gap-2 w-full lg:w-auto overflow-hidden">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Chủ đề (Tags)
            </span>
            <div className="flex gap-2 overflow-x-auto w-full pb-2 scrollbar-hide">
              <button 
                onClick={() => setActiveTag('all')} 
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTag === 'all' 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-md' 
                    : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                }`}
              >
                Tất cả chủ đề
              </button>
              {allAvailableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    activeTag === tag 
                      ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-500/50 shadow-sm' 
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-transparent hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Lưới Grid hiển thị */}
      {filteredData.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          Không tìm thấy bài viết nào phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((tut) => {
            const hasRealImage = tut.thumbnail && !tut.thumbnail.includes("placeholder") && !tut.thumbnail.includes("ERROR");

            return (
              <div 
                key={tut.id}
                onClick={() => setSelectedTut(tut)}
                className="group relative rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] overflow-hidden hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] transition-all cursor-pointer h-full flex flex-col"
              >
                {/* Thumbnail */}
                <div className="aspect-video w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-2">
                  {hasRealImage ? (
                    <img src={tut.thumbnail} alt={tut.title} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden'); }} />
                  ) : null}

                  {/* Ảnh mặc định (Fallback) */}
                  <div className={`absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 ${hasRealImage ? 'hidden' : 'flex'}`}>
                    <Code2 className="w-12 h-12 text-slate-700 mb-2" />
                    <span className="text-slate-500 font-mono text-xs px-6 text-center">{tut.title}</span>
                  </div>
                  
                  {/* Huy hiệu Nền tảng */}
                  <div className="absolute top-4 left-4 bg-white/95 dark:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-slate-200 dark:border-white/10 shadow-sm z-10">
                    {platformIcons[tut.type] || platformIcons['text']}
                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{tut.type}</span>
                  </div>
                </div>

                {/* Nội dung chữ */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tut.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 flex-grow leading-tight">{tut.title}</h3>
                  
                  {/* Tác giả */}
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-4 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        <span className="text-slate-900 dark:text-white font-bold">{tut.author}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* POP-UP MODAL CHI TIẾT TÀI LIỆU */}
      {selectedTut && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedTut(null)}
        >
          <div 
            className="bg-white dark:bg-[#0a0f1a] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200 dark:border-white/10 ring-1 ring-white/10"
            onClick={e => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5">
              <div className="flex items-center gap-3">
                <span className="bg-yellow-500 text-black px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
                  {platformIcons[selectedTut.type]} {selectedTut.type}
                </span>
              </div>
              <button onClick={() => setSelectedTut(null)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                <X className="w-6 h-6 text-slate-500 dark:text-slate-400" />
              </button>
            </div>

            {/* Nội dung cuộn được */}
            <div className="overflow-y-auto flex-grow p-6 md:p-8 space-y-8">
              
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {selectedTut.title}
              </h2>

              {/* KHU VỰC VIDEO YOUTUBE (NẾU CÓ) */}
              {getYoutubeEmbedUrl(selectedTut.url) && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-white/10 bg-black">
                  <iframe width="100%" height="100%" src={getYoutubeEmbedUrl(selectedTut.url)!} title="YouTube video" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                </div>
              )}

              {/* KHU VỰC HƯỚNG DẪN CHI TIẾT (LẤY TỪ LINK TEXT/FACEBOOK/TIKTOK) */}
              <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-3 mb-4 border-b border-slate-200 dark:border-white/10 pb-4">
                  <FileText className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hướng dẫn chi tiết & Liên kết</h3>
                </div>
                
                {isStandardLink(selectedTut.url) ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Tài liệu này được liên kết tới một nền tảng bên ngoài. Vui lòng bấm vào nút bên dưới để truy cập trực tiếp.
                    </p>
                    <Link 
                      href={selectedTut.url} 
                      target="_blank"
                      className="bg-slate-900 dark:bg-white text-white dark:text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 w-max transition-transform hover:scale-105 shadow-md"
                    >
                      Truy cập Liên kết gốc <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="prose dark:prose-invert prose-slate max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap font-medium">
                    {/* Nếu data Link là dạng văn bản thường (không phải http) thì in thẳng ra đây */}
                    {selectedTut.url && selectedTut.url !== "Link" ? selectedTut.url : "Tác giả chưa cập nhật nội dung hướng dẫn chi tiết cho phần này."}
                  </div>
                )}
              </div>

            </div>

            {/* Footer Modal */}
            <div className="p-6 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0f1a] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-yellow-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Người hướng dẫn</p>
                  <p className="font-black text-lg text-slate-900 dark:text-white">{selectedTut.author}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}