// @ts-nocheck
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation" 
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon, Search, Wrench, Hammer } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion" 

const REGISTER_LINK = "https://www.facebook.com/share/p/1CHwyRwAYp/"

const NAV_LINKS = [
  { id: "btx", label: "Bé Tập Xây", href: "/be-tap-xay" }, 
  { id: "all-maps", label: "Tìm map", href: "/maps" }, 
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState("")
  const isClickNavigating = useRef(false)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
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
            setActiveSection(link.id)
            found = true
            break 
          }
        }
      }
      
      if (window.scrollY < 100) {
        setActiveSection("")
      } else if (!found) {
        setActiveSection("")
      }
    }

    if (window.location.hash) {
      const hashId = window.location.hash.replace("#", "")
      if (NAV_LINKS.some(l => l.id === hashId)) {
        setActiveSection(hashId)
        
        setTimeout(() => {
          const section = document.getElementById(hashId)
          if (section) {
            const y = section.getBoundingClientRect().top + window.scrollY - 100
            window.scrollTo({ top: y, behavior: "smooth" })
          }
        }, 500)
      }
    } else {
      handleScroll() 
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname]) 

  // 🎯 ÉP BUỘC LUÔN DÙNG LOGO GỐC (Dành cho nền tối)
  const logoSrc = "/Logo Full Tuglar Craftland new.png"

  const handleNavClick = (id: string, isAnchor: boolean) => {
    if (isAnchor) {
      isClickNavigating.current = true 
      setActiveSection(id)
      
      if (pathname === "/") {
        const section = document.getElementById(id)
        if (section) {
          const y = section.getBoundingClientRect().top + window.scrollY - 100
          window.scrollTo({ top: y, behavior: "smooth" })
        }
      }
      
      setTimeout(() => {
        isClickNavigating.current = false
      }, 800)
    }
  }

  return (
    // 🎯 Ép cứng nền đen trong suốt và viền mờ cho Header
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#020617]/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo */}
        <Link href="/" className="flex items-center h-16">
          <img 
            src={logoSrc}
            alt="Tuglar Craftland Logo" 
            className="h-10 w-auto object-contain transition-all duration-300"
            draggable="false"
          />
        </Link>

        {/* CỤM BÊN PHẢI (Desktop) */}
        <div className="hidden md:flex h-full items-center gap-8">
          
          <nav className="flex h-full items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isAnchor = link.href.startsWith("/#")
              const isActive = isAnchor 
                ? (pathname === "/" && activeSection === link.id) 
                : (pathname === link.href)

              return (
                <Link 
                  key={link.id}
                  href={link.href} 
                  onClick={() => handleNavClick(link.id, isAnchor)}
                  // 🎯 Dùng text-slate-300 cho mục chưa chọn, text-yellow-500 cho mục đã chọn
                  className={`relative flex h-full items-center px-1 text-sm font-bold transition-colors hover:text-yellow-500
                    ${isActive ? "text-yellow-500" : "text-slate-300"}
                  `}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {link.id === "btx" && <Hammer className="h-4 w-4" />}
                    {link.id === "all-maps" && <Search className="h-4 w-4" />}
                    {link.label}
                  </span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="header-active-link" 
                      className="absolute bottom-0 left-0 right-0 h-[3px] rounded-t-md bg-yellow-500 shadow-[0_-2px_10px_rgba(234,179,8,0.5)]" 
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }} 
                    />
                  )}
                </Link>
              )
            })}

            <Link href={REGISTER_LINK} target="_blank" className="ml-2">
              <Button className="rounded-full bg-yellow-500 text-black font-black hover:bg-yellow-600 px-6 uppercase text-[11px] tracking-widest shadow-lg shadow-yellow-500/20 active:scale-95 transition-all border border-yellow-400">
                Tham gia KTS Tài Năng
              </Button>
            </Link>
          </nav>

          {/* Cụm Icon Công cụ */}
          <div className="flex items-center gap-1 pl-4 border-l border-white/10 h-8">
            <Link href="/tools" title="Hệ thống hỗ trợ nhập liệu">
              {/* 🎯 Ép nền icon tối màu */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full border border-white/10 bg-white/5 hover:bg-yellow-500/10 group transition-all"
              >
                <Wrench className="h-[1.2rem] w-[1.2rem] text-slate-400 group-hover:text-yellow-500 transition-all" />
              </Button>
            </Link>

            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative h-9 w-9 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition-all ml-1"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
              </Button>
            )}
          </div>
        </div>

        {/* CỤM BÊN PHẢI (Mobile) */}
        <div className="flex items-center gap-1 md:hidden">
          <Link href="/tools">
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full bg-white/5 border border-white/10">
              <Wrench className="h-5 w-5 text-slate-300" />
            </Button>
          </Link>
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
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#0a0f1a]/95 backdrop-blur-xl md:hidden shadow-2xl">
          <nav className="flex flex-col gap-3 p-6">
            {NAV_LINKS.map((link) => {
              const isAnchor = link.href.startsWith("/#")
              const isActive = isAnchor 
                ? (pathname === "/" && activeSection === link.id) 
                : (pathname === link.href)

              return (
                <Link 
                  key={link.id}
                  href={link.href} 
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleNavClick(link.id, isAnchor)
                  }} 
                  className={`flex items-center gap-3 rounded-xl px-5 py-4 text-sm font-bold transition-all
                    ${isActive ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" : "text-slate-300 border border-transparent hover:bg-white/10"}
                  `}
                >
                  {link.id === "btx" && <Hammer className="h-4 w-4" />}
                  {link.id === "all-maps" && <Search className="h-4 w-4" />}
                  {link.label}
                </Link>
              )
            })}
            
            <Link href={REGISTER_LINK} target="_blank" onClick={() => setIsMenuOpen(false)} className="mt-2">
              <Button className="w-full h-12 rounded-xl bg-yellow-500 text-black font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20 border border-yellow-400">
                Tham gia KTS Tài Năng
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}