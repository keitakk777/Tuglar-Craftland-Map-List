"use client";

import { useState } from "react";
import { Play, FileText, User, Search, Filter } from "lucide-react";
// 🎯 Import type từ file fetch-data.ts cùng thư mục (chú ý đường dẫn ./ )
import { CodeTutorial } from "./fetch-code";
import Link from "next/link";

export default function CodeClient({ initialData }: { initialData: CodeTutorial[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredData = initialData.filter((tut) => {
    const matchesSearch = tut.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tut.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = activeFilter === "all" || tut.type === activeFilter;
    return matchesSearch && matchesFilter;
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

      {/* Thanh Tìm kiếm & Lọc */}
      <div className="flex flex-col md:flex-row gap-4 mb-10 items-center justify-between bg-white dark:bg-white/5 p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Tìm theo tên bài hoặc thẻ tag..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-100 dark:bg-[#0a0f1a] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:border-yellow-500 transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <Filter className="w-5 h-5 text-slate-400 my-auto mr-2 hidden md:block" />
          {['all', 'youtube', 'tiktok', 'text'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-all ${
                activeFilter === filter 
                  ? "bg-yellow-500 text-black shadow-md" 
                  : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
              }`}
            >
              {filter === 'all' ? 'Tất cả' : filter}
            </button>
          ))}
        </div>
      </div>

      {/* Lưới Grid hiển thị */}
      {filteredData.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          Không tìm thấy bài viết nào phù hợp.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((tut) => (
            <Link href={tut.url} target="_blank" key={tut.id}>
              <div className="group relative rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.15)] transition-all cursor-pointer h-full flex flex-col">
                
                {/* Thumbnail */}
                <div className="aspect-video w-full overflow-hidden relative bg-slate-100 dark:bg-slate-900">
                  <img src={tut.thumbnail} alt={tut.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  
                  {/* Huy hiệu Nền tảng */}
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/70 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-slate-200 dark:border-white/10 shadow-sm">
                    {tut.type === "youtube" && <Play className="w-3 h-3 text-red-500 fill-current" />}
                    {tut.type === "tiktok" && <Play className="w-3 h-3 text-cyan-500 dark:text-cyan-400 fill-current" />}
                    {tut.type === "text" && <FileText className="w-3 h-3 text-yellow-500 dark:text-yellow-400" />}
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase">{tut.type}</span>
                  </div>
                </div>

                {/* Nội dung chữ */}
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tut.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 line-clamp-2 flex-grow">{tut.title}</h3>
                  
                  {/* Tác giả */}
                  <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-white/10 mt-auto">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <User className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      Code by <span className="text-slate-900 dark:text-white">{tut.author}</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}