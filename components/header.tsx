"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gamepad2, Menu, X, Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  // FIX: Lấy thêm resolvedTheme để biết chính xác mode đang hiển thị là gì
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  /* --- LOGIC ĐỔI LOGO --- */
  // Mặc định là logo bản Sáng
  let logoSrc = "/Logo Full Tuglar Craftland new dark.png"

  // Nếu đã load xong trên trình duyệt và là mode Dark thì đổi sang logo bản Tối
  if (mounted && resolvedTheme === "dark") {
    logoSrc = "/Logo Full Tuglar Craftland new.png" 
  }
  /* ---------------------- */

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo đổi theo Mode */}
        <Link href="/" className="flex items-center h-16">
          <img 
            src={logoSrc}
            alt="Tuglar Craftland Logo" 
            className="h-10 w-auto object-contain transition-all duration-300"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#events" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Events
          </Link>
          <Link href="#maps" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Maps
          </Link>
          <Link href="#news" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            News
          </Link>
          <Link href="#community" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Community
          </Link>
        </nav>

        {/* Theme Toggle Button */}
        <div className="hidden items-center gap-3 md:flex">
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

        {/* Mobile Menu Toggle & Theme Toggle (Mobile) */}
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
        <div className="border-t border-border bg-background md:hidden">
          <nav className="flex flex-col gap-2 p-4">
            <Link href="#events" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
              Events
            </Link>
            <Link href="#maps" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
              Maps
            </Link>
            <Link href="#news" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
              News
            </Link>
            <Link href="#community" onClick={() => setIsMenuOpen(false)} className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
              Community
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}