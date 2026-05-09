// @ts-nocheck
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation" 
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon, Search, Hammer, Code, Box } from "lucide-react" 
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion" 

const REGISTER_LINK = "https://www.facebook.com/share/p/1CHwyRwAYp/"

const NAV_LINKS = [
  { id: "custom-btx", label: "Custom BTX", href: "/custom-btx" }, 
  { id: "all-maps", label: "Kho Map", href: "/maps" }, 
  { id: "assets", label: "Kho Asset", href: "/assets" }, 
  { id: "be-tap-code", label: "Bé Tập Code", href: "/be-tap-code" }, 
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState("")
  
  // 🎯 FIX 1: Dùng useRef thay vì useState để không gây re-render vô hạn
  const lastScrollY = useRef(0)
  const isClickNavigating = useRef(false)

  // 🎯 FIX 2: Tách mounted ra chạy độc lập đúng 1 lần khi load web
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const isMobileView = window.innerWidth < 768;

      // Dùng lastScrollY.current để so sánh
      if (isMobileView && currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false) 
      } else {
        setIsVisible(true) 
      }
      
      // Cập nhật vị trí cuộn mới vào két sắt (không làm re-render)
      lastScrollY.current = currentScrollY

      if (window.location.pathname !== "/") return
      if (isClickNavigating.current) return 
      
      const scrollPosition = window.scrollY + 100 
      let found = false
      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const link = NAV_LINKS[i]
        if (link.href.startsWith("/#")) {
          const sectionId = link.href.replace("/#", "")
          const section = document.getElementById(sectionId)
          if (section && section.offsetTop <= scrollPosition) {
            setActiveSection(link.id); found = true; break 
          }
        }
      }
      if (window.scrollY < 100 || !found) setActiveSection("")
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname]) // 🎯 FIX 3: Đã đá "lastScrollY" ra khỏi mảng phụ thuộc

  const logoSrc = "/Logo Full Tuglar Craftland new.png"

  const handleNavClick = (id: string, isAnchor: boolean) => {
    if (isAnchor) {
      isClickNavigating.current = true; setActiveSection(id)
      if (pathname === "/") {
        const section = document.getElementById(id)
        if (section) {
          const y = section.getBoundingClientRect().top + window.scrollY - 100
          window.scrollTo({ top: y, behavior: "smooth" })
        }
      }
      setTimeout(() => { isClickNavigating.current = false }, 800)
    }
  }

  return (
    <motion.header 
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center h-16">
          <img src={logoSrc} alt="Logo" className="h-10 w-auto object-contain" draggable="false" />
        </Link>

        {/* CỘT PHẢI (Desktop) */}
        <div className="hidden md:flex h-full items-center gap-8">
          <nav className="flex h-full items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isAnchor = link.href.startsWith("/#")
              const isActive = isAnchor ? (pathname === "/" && activeSection === link.id) : (pathname === link.href)
              return (
                <Link key={link.id} href={link.href} onClick={() => handleNavClick(link.id, isAnchor)} className={`relative flex h-full items-center px-1 text-sm font-bold transition-colors hover:text-yellow-500 ${isActive ? "text-yellow-500" : "text-slate-300"}`}>
                  <span className="relative z-10 flex items-center gap-2">
                    {link.id === "custom-btx" && <Hammer className="h-4 w-4" />}
                    {link.id === "all-maps" && <Search className="h-4 w-4" />}
                    {link.id === "assets" && <Box className="h-4 w-4" />}
                    {link.id === "be-tap-code" && <Code className="h-4 w-4" />}
                    {link.label}
                  </span>
                  {isActive && <motion.div layoutId="header-active-link" className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-md bg-yellow-500 shadow-[0_-2px_10px_rgba(234,179,8,0.5)]" initial={false} transition={{ type: "spring", stiffness: 400, damping: 30 }} />}
                </Link>
              )
            })}
            <Link href={REGISTER_LINK} target="_blank" className="ml-2">
              <Button className="rounded-full bg-yellow-500 text-black font-black hover:bg-yellow-600 px-6 uppercase text-[11px] tracking-widest shadow-lg active:scale-95 transition-all border border-yellow-400">Tham gia KTS Tài Năng</Button>
            </Link>
          </nav>

          <div className="flex items-center gap-1 pl-4 border-l border-white/10 h-8">
            {mounted && (
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="relative h-9 w-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all ml-1">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
              </Button>
            )}
          </div>
        </div>

        {/* CỘT PHẢI (Mobile) */}
        <div className="flex items-center gap-1 md:hidden">
          {mounted && (
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="h-9 w-9 rounded-full bg-white/5 border border-white/10 ml-1">
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-400" />}
            </Button>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ml-1 text-slate-300">
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="border-t border-white/10 bg-[#0a0f1a]/95 backdrop-blur-xl md:hidden shadow-2xl overflow-hidden">
            <nav className="flex flex-col gap-3 p-6">
              {NAV_LINKS.map((link) => {
                const isAnchor = link.href.startsWith("/#")
                const isActive = isAnchor ? (pathname === "/" && activeSection === link.id) : (pathname === link.href)
                return (
                  <Link key={link.id} href={link.href} onClick={() => { setIsMenuOpen(false); handleNavClick(link.id, isAnchor) }} className={`flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-bold transition-all ${isActive ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" : "text-slate-300 border border-transparent hover:bg-white/10"}`}>
                    {link.id === "custom-btx" && <Hammer className="h-4 w-4" />}
                    {link.id === "all-maps" && <Search className="h-4 w-4" />}
                    {link.id === "assets" && <Box className="h-4 w-4" />}
                    {link.id === "be-tap-code" && <Code className="h-4 w-4" />}
                    {link.label}
                  </Link>
                )
              })}
              <Link href={REGISTER_LINK} target="_blank" onClick={() => setIsMenuOpen(false)} className="mt-2">
                <Button className="w-full h-12 rounded-xl bg-yellow-500 text-black font-black uppercase tracking-widest shadow-lg border border-yellow-400">Tham gia KTS Tài Năng</Button>
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}