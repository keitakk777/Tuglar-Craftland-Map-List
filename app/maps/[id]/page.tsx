"use client"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react" 
import { mapDetails } from "./data" // File chứa dữ liệu gốc của Huỳnh
import { EmptyState } from "@/components/empty-state"
import { MapDetailView } from "@/components/map-detail-view"

export default function MapDetailPage() {
  const params = useParams()
  const mapId = params.id as string
  
  // 1. PHẢI KHAI BÁO BIẾN data TRƯỚC KHI KIỂM TRA
  const data = mapDetails[mapId as keyof typeof mapDetails]
  
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  // 🎯 LOGIC CHUNG: TRANG DỮ LIỆU TRỐNG / LỖI
  // Văn phong đã được "tổng quát hóa" theo yêu cầu
  if (!data) {
    return (
      <EmptyState 
        title="Dữ liệu đang được cập nhật..." 
        message="Nội dung này hiện chưa có sẵn hoặc đang trong quá trình hoàn thiện. Vui lòng quay lại sau hoặc khám phá các khu vực khác!"
        buttonText="Quay lại trang chủ"
        href="/"
      />
    )
  }

  // 🎯 LOGIC: HIỂN THỊ CHI TIẾT KHI CÓ DỮ LIỆU
  return <MapDetailView data={data} />
}