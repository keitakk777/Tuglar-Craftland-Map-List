// @ts-nocheck
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { getMapsData } from "../fetch-data"

import MapCover from "./map-cover"
import MapActions from "./map-actions"
import MapInfo from "./map-info"
import MapPatchNotes from "./map-patch-notes"

export default async function MapDetailPage(props: any) {
  const params = await props.params;
  const id = params?.id || "";
  const data = await getMapsData();
  const map = data.find((m: any) => m.id === id || m.shortCode === id);

  if (!map) notFound();

  const latestVersion = Array.isArray(map.patchNotes) && map.patchNotes.length > 0 ? String(map.patchNotes[0]?.ver || "v1.0") : "v1.0";

  return (
    <div className="pb-24 pt-8 md:pt-10 min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 max-w-275">
        
        <a href="/maps" className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors mb-8">
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
  )
}