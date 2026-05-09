// @ts-nocheck
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getMapsData } from "../fetch-data"

import MapCover from "./map-cover"
import MapActions from "./map-actions"
import MapInfo from "./map-info"
import MapPatchNotes from "./map-patch-notes"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default async function MapDetailPage(props: any) {
  const params = await props.params;
  const rawId = params?.id || "";
  const data = await getMapsData();
  
  const map = data.find((m: any) => {
    const cleanParamId = rawId.replace("%23", "").replace("#", "").trim().toLowerCase();
    const cleanMapId = String(m.id || "").replace("#", "").trim().toLowerCase();
    const cleanShortCode = String(m.shortCode || "").replace("#", "").trim().toLowerCase();
    return cleanMapId === cleanParamId || cleanShortCode === cleanParamId;
  });

  if (!map) notFound();

  const latestVersion = Array.isArray(map.patchNotes) && map.patchNotes.length > 0 ? String(map.patchNotes[0]?.ver || "1.0") : "1.0";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden">
      <Header />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent dark:from-yellow-500/5 dark:via-[#0a0f1a] dark:to-[#020617] -z-10" />

      <main className="container mx-auto px-4 pt-32 pb-12 flex-1">
        <Link href="/maps" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-yellow-500 mb-8 transition-colors font-semibold uppercase tracking-wider">
            <ArrowLeft className="h-4 w-4" /> Quay lại danh sách Map
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 items-start mb-16">
          {/* CỘT TRÁI */}
          <div className="w-full lg:w-[480px] shrink-0">
            <MapCover map={map} />
            <MapActions map={map} />
          </div>

          {/* CỘT PHẢI */}
          <div className="flex-1 w-full">
            <MapInfo map={map} latestVersion={latestVersion} />
          </div>
        </div>

        {/* PATCH NOTES & PREVIEW */}
        <MapPatchNotes map={map} />
      </main>
      <Footer />
    </div>
  )
}