// @ts-nocheck
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getMapsData } from "../fetch-data"

import MapCover from "./map-cover"
import MapActions from "./map-actions"
import MapInfo from "./map-info"
import MapPatchNotes from "./map-patch-notes"
import Footer from "@/components/footer" // 🎯 IMPORT COMPONENT FOOTER

export default async function MapDetailPage(props: any) {
  const params = await props.params;
  const id = params?.id || "";
  const data = await getMapsData();
  const map = data.find((m: any) => m.id === id || m.shortCode === id);

  if (!map) notFound();

  const latestVersion = Array.isArray(map.patchNotes) && map.patchNotes.length > 0 ? String(map.patchNotes[0]?.ver || "v1.0") : "v1.0";

  return (
    // 🎯 THÊM flex flex-col VÀ min-h-screen ĐỂ ÉP FOOTER XUỐNG ĐÁY TRANG
    <div className="relative flex flex-col min-h-screen overflow-x-hidden text-slate-100">
      
      {/* 🎯 NỀN DARK MODE (ĐỒNG BỘ Y HỆT TRANG KHO MAP TỔNG) */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-yellow-500/5 via-[#0a0f1a] to-[#020617] -z-10" />

      {/* 🎯 GÓI NỘI DUNG VÀO flex-1 ĐỂ NÓ ĐẨY FOOTER XUỐNG */}
      <div className="flex-1 pb-24 pt-8 md:pt-10">
        <div className="container mx-auto px-4 max-w-275">
          
          <a href="/maps" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-yellow-500 transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> QUAY LẠI DANH SÁCH
          </a>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            <div className="w-full lg:w-[45%] flex flex-col gap-5">
              <MapCover map={map} />
              <MapActions map={map} />
            </div>
            <MapInfo map={map} latestVersion={latestVersion} />
          </div>

          <MapPatchNotes map={map} />

        </div>
      </div>

      {/* 🎯 GỌI COMPONENT FOOTER XUẤT HIỆN Ở CUỐI CÙNG */}
      <Footer />
    </div>
  )
}