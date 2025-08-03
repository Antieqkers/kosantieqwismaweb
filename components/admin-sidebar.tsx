"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Users,
  Camera,
  Star,
  MapPin,
  Phone,
  Search,
  Settings,
  BarChart3,
  Calendar,
  Shield,
  Database,
  LogOut,
  Menu,
  X,
  Eye,
  MessageSquare,
} from "lucide-react"

interface AdminSidebarProps {
  user: any
  onLogout: () => void
}

const menuItems = [
  { icon: BarChart3, label: "Dashboard", href: "/admin", value: "dashboard" },
  { icon: Home, label: "Hero Section", href: "/admin", value: "hero" },
  { icon: Users, label: "About Section", href: "/admin", value: "about" },
  { icon: Home, label: "Kamar", href: "/admin", value: "rooms" },
  { icon: Camera, label: "Gallery", href: "/admin", value: "gallery" },
  { icon: Star, label: "Testimoni", href: "/admin", value: "testimonials" },
  { icon: MapPin, label: "Lokasi", href: "/admin", value: "location" },
  { icon: Phone, label: "Kontak", href: "/admin", value: "contact" },
  { icon: MessageSquare, label: "Booking", href: "/admin", value: "bookings" },
  { icon: Search, label: "SEO", href: "/admin", value: "seo" },
  { icon: Calendar, label: "Scheduler", href: "/admin", value: "scheduler" },
  { icon: BarChart3, label: "Analytics", href: "/admin", value: "analytics" },
  { icon: Database, label: "Backup", href: "/admin", value: "backup" },
  { icon: Shield, label: "Admin Users", href: "/admin", value: "users" },
  { icon: Settings, label: "Settings", href: "/admin", value: "settings" },
]

export default function AdminSidebar({ user, onLogout }: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50 bg-transparent"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-40 h-full bg-white border-r border-gray-200 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-600">ANTIEQ WISMA</p>
              </div>
            </div>
          )}
          <Button variant="ghost" size="sm" onClick={() => setIsCollapsed(!isCollapsed)} className="hidden md:flex">
            <Menu className="w-4 h-4" />
          </Button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.username}</p>
                <p className="text-xs text-gray-600 truncate">{user.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.value}
              className={cn(
                "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                "hover:bg-gray-100 text-gray-700 hover:text-gray-900",
                isCollapsed && "justify-center",
              )}
              onClick={() => {
                // Handle navigation logic here
                setIsMobileOpen(false)
              }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
              className={cn("w-full", isCollapsed && "px-2")}
              onClick={() => setIsMobileOpen(false)}
            >
              <Eye className="w-4 h-4" />
              {!isCollapsed && <span className="ml-2">Lihat Website</span>}
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              onLogout()
              setIsMobileOpen(false)
            }}
            className={cn("w-full text-red-600 hover:text-red-700", isCollapsed && "px-2")}
          >
            <LogOut className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  )
}
