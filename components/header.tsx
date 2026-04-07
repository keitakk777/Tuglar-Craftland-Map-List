"use client"

import Link from "next/link"
import { usePathname } from "next/navigation" 
import { Button } from "@/components/ui/button"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion" 

const NAV_LINKS = [
  { id: "events", label: "Thông báo", href: "/#events" },
  { id: "popular-maps", label: "Map nổi bật", href: "/#popular-maps" }, 
  { id: "all-maps", label: "Kho map", href: "/maps" }, 
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState("events")
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
        setActiveSection("events")
      } else if (!found) {
        setActiveSection("")
      }
    }

    // 🎯 FIX LỖI CHUYỂN TRANG KHÔNG CUỘN: 
    if (window.location.hash) {
      const hashId = window.location.hash.replace("#", "")
      if (NAV_LINKS.some(l => l.id === hashId)) {
        setActiveSection(hashId)
        
        // Đợi 500ms cho trang render xong dàn giao diện rồi mới ra lệnh cuộn
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

  /* --- LOGIC ĐỔI LOGO --- */
  let logoSrc = "/Logo Full Tuglar Craftland new dark.png"

  if (mounted && resolvedTheme === "dark") {
    logoSrc = "/Logo Full Tuglar Craftland new.png" 
  }
  /* ---------------------- */

  // 🎯 NÂNG CẤP HÀM CLICK ĐỂ CHỦ ĐỘNG CUỘN TRANG
  const handleNavClick = (id: string, isAnchor: boolean) => {
    if (isAnchor) {
      isClickNavigating.current = true 
      setActiveSection(id)
      
      // Nếu đang ở ngay trang chủ thì tự bắt tọa độ rồi cuộn mượt luôn
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
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

        {/* CỤM BÊN PHẢI */}
        <div className="hidden md:flex h-full items-center gap-12">
          
          {/* Desktop Navigation */}
          <nav className="flex h-full items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isAnchor = link.href.startsWith("/#")
              const isActive = isAnchor 
                ? (pathname === "/" && activeSection === link.id) 
                : (pathname === link.href)

              return (
                <Link 
                  key={link.id}
                  href={link.href} 
                  onClick={() => handleNavClick(link.id, isAnchor)} // 🎯 Đã gắn hàm click mới
                  className={`relative flex h-full items-center px-1 text-sm font-bold transition-colors hover:text-yellow-500
                    ${isActive ? "text-yellow-500" : "text-muted-foreground"}
                  `}
                >
                  <span className="relative z-10">{link.label}</span>
                  
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
          </nav>

          {/* Theme Toggle Button */}
          <div className="flex items-center">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="relative h-9 w-9 rounded-lg border border-border/50 bg-secondary/50 hover:bg-secondary transition-all"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-yellow-500" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-400" />
                <span className="sr-only">Chuyển đổi giao diện</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle & Theme Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              {resolvedTheme === "dark" ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-blue-400" />}
            </Button>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background md:hidden shadow-lg">
          <nav className="flex flex-col gap-2 p-4">
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
                    handleNavClick(link.id, isAnchor) // 🎯 Gắn hàm click mới cho mobile
                  }} 
                  className={`rounded-lg px-4 py-3 text-sm font-bold transition-all hover:bg-yellow-500/10 hover:text-yellow-600
                    ${isActive ? "bg-yellow-500/10 text-yellow-500 border-l-4 border-yellow-500" : "text-muted-foreground border-l-4 border-transparent"}
                  `}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}