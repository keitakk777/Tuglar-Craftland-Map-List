"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Copy, Check, Wand2, Lock } from "lucide-react"

// 🔑 MẬT KHẨU BÍ MẬT CỦA TEAM NÍ ĐẶT Ở ĐÂY NÈ
const SECRET_PASSWORD = "007"

export default function ToolGeneratorPage() {
  // --- STATE CHỨNG THỰC ---
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")

  // --- STATE MÁY TẠO CODE ---
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  
  const [mapData, setMapData] = useState({
    name: "", banner: "", shortCode: "", creator: "", team: "Tuglar Craftland", likes: "", plays: ""
  })

  // KIỂM TRA MẬT KHẨU LÚC LOAD TRANG
  useEffect(() => {
    if (sessionStorage.getItem("tuglar_tools_auth") === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  // XỬ LÝ NHẬP MẬT KHẨU
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === SECRET_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("tuglar_tools_auth", "true") // Lưu phiên đăng nhập
    } else {
      alert("Sai mật khẩu rồi ní ơi! Khai mau có phải gián điệp không? 🕵️‍♂️")
      setPasswordInput("")
    }
  }

  // --- HÀM GỌI API CÀO DATA ---
  const handleFetch = async () => {
    if (!url) return alert("Dán link vào đi ní ơi!")
    setLoading(true)
    try {
      const res = await fetch(`/api/get-map?url=${encodeURIComponent(url)}`)
      const data = await res.json()
      
      if (data.error) throw new Error(data.error)
      
      setMapData(prev => ({
        ...prev,
        name: data.name,
        banner: data.thumb,
        shortCode: data.mapCode
      }))
    } catch (error: any) {
      alert("Lỗi: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  // --- MẪU CODE SINH RA ---
  const generatedCode = `
export const map${mapData.name.replace(/[^a-zA-Z0-9]/g, '') || "NewMap"} = {
  // 🎯 1. THÔNG TIN CƠ BẢN
  name: "${mapData.name || "Đang cập nhật"}",
  creator: "${mapData.creator || "Đang cập nhật"}", 
  team: "${mapData.team || "Không có"}", 
  shortCode: "${mapData.shortCode || "Chưa có mã"}", 
  version: "1.0",
  updateDate: "${new Date().toLocaleDateString('en-GB')}",
  description: "Đang cập nhật thông tin...",
  
  // 🎯 2. ĐIỀU HƯỚNG TRANG CHỦ
  isTrending: false,    
  isTuglar: ${mapData.team === "Tuglar Craftland"},      
  isCommunity: false,  
  featured: false,      

  // 🎯 3. THỂ LOẠI & QUY MÔ
  mode: "Chưa phân loại",
  difficulty: 3,       
  teamType: "Chưa xác định",
  modeTags: [],
  teamTags: [],

  // 🎯 4. CHỈ SỐ & MEDIA
  likes: "${mapData.likes || "0"}",         
  plays: "${mapData.plays || "0"}",
  banner: "${mapData.banner || ""}", 
  videoUrl: "", 
  
  achievements: [],
  patchNotes: []
}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // 🔒 NẾU CHƯA NHẬP ĐÚNG PASS -> HIỂN THỊ MÀN HÌNH KHÓA
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pt-32 pb-10 px-4 flex items-center justify-center">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/10 via-[#0a0f1a] to-[#020617] -z-10" />
        <Card className="max-w-md w-full bg-card/40 backdrop-blur-xl border-border/50 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto bg-yellow-500/20 p-4 rounded-full w-fit mb-4 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
              <Lock className="h-8 w-8 text-yellow-500" />
            </div>
            <CardTitle className="text-2xl font-black uppercase tracking-tight text-foreground">Hệ thống hỗ trợ nhập liệu</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">Chỉ Admin mới cần dùng công cụ này.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="password"
                placeholder="Nhập mật khẩu..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="bg-background/50 border border-border/50 rounded-xl px-4 py-4 outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all font-bold text-center tracking-widest"
              />
              <Button type="submit" className="bg-yellow-500 text-black hover:bg-yellow-600 font-black uppercase h-12 rounded-xl transition-all active:scale-95">
                Mở Khóa
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 🔓 NẾU PASS ĐÚNG -> HIỂN THỊ GIAO DIỆN CHẾ TẠO CODE
  return (
    <div className="min-h-screen bg-background pt-24 pb-10 px-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-500/5 via-[#0a0f1a] to-[#020617] -z-10" />
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black uppercase text-yellow-500">Hệ thống hỗ trợ nhập liệu</h1>
            <Button variant="outline" onClick={() => {sessionStorage.removeItem("tuglar_tools_auth"); setIsAuthenticated(false)}} className="text-xs font-bold rounded-xl h-8 px-3">
              Đăng xuất
            </Button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* CỘT TRÁI: NHẬP LIỆU */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl">
            <CardHeader><CardTitle>1. Dán Link Garena vào đây</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" placeholder="https://c.freefiremobile.com/..." 
                  value={url} onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 bg-background border border-border rounded-xl px-3 outline-none"
                />
                <Button onClick={handleFetch} disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold">
                  {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Wand2 className="h-4 w-4 mr-2" />} Cào Data
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/30">
                <div><label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/70">Người tạo (Creator)</label>
                  <input type="text" value={mapData.creator} onChange={e => setMapData({...mapData, creator: e.target.value})} className="w-full bg-background border rounded-lg px-3 py-2 font-semibold" />
                </div>
                <div><label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/70">Team</label>
                  <input type="text" value={mapData.team} onChange={e => setMapData({...mapData, team: e.target.value})} className="w-full bg-background border rounded-lg px-3 py-2 font-semibold" />
                </div>
                <div><label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/70">Likes (Chữ K)</label>
                  <input type="text" value={mapData.likes} onChange={e => setMapData({...mapData, likes: e.target.value})} className="w-full bg-background border rounded-lg px-3 py-2 placeholder:text-muted-foreground/30 font-semibold" placeholder="VD: 15.1K" />
                </div>
                <div><label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground/70">Plays (Chữ K)</label>
                  <input type="text" value={mapData.plays} onChange={e => setMapData({...mapData, plays: e.target.value})} className="w-full bg-background border rounded-lg px-3 py-2 placeholder:text-muted-foreground/30 font-semibold" placeholder="VD: 100K" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CỘT PHẢI: XUẤT CODE */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border/50 bg-muted/20">
              <CardTitle>2. Code Tạo Sẵn</CardTitle>
              <Button onClick={copyToClipboard} size="sm" className={`${copied ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'} hover:opacity-80 font-bold rounded-lg`}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4 mr-2" />} {copied ? "Đã Copy" : "Copy Code"}
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <pre className="text-[11px] sm:text-xs text-green-400 bg-slate-950 p-6 overflow-x-auto max-h-[420px] custom-scrollbar rounded-b-xl">
                {generatedCode}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}