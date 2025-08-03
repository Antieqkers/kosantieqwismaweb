"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Sparkles, Clock, Gift, Star } from "lucide-react"

const promoBanners = [
  {
    id: 1,
    title: "🎉 PROMO SPESIAL AKHIR TAHUN!",
    subtitle: "Dapatkan diskon 30% untuk booking kamar bulan ini",
    cta: "Klaim Sekarang",
    gradient: "from-emerald-500 via-emerald-600 to-emerald-700",
    textColor: "text-white",
    icon: Gift,
    badge: "HEMAT 30%",
    pattern: "opacity-10",
  },
  {
    id: 2,
    title: "⚡ FLASH SALE 24 JAM!",
    subtitle: "Booking sekarang dapat cashback Rp 500.000",
    cta: "Ambil Kesempatan",
    gradient: "from-orange-500 via-orange-600 to-red-600",
    textColor: "text-white",
    icon: Clock,
    badge: "TERBATAS",
    pattern: "opacity-10",
  },
  {
    id: 3,
    title: "🌟 KAMAR PREMIUM TERSEDIA!",
    subtitle: "Fasilitas lengkap dengan harga terjangkau mulai 1.5jt/bulan",
    cta: "Lihat Kamar",
    gradient: "from-purple-600 via-purple-700 to-indigo-700",
    textColor: "text-white",
    icon: Star,
    badge: "PREMIUM",
    pattern: "opacity-10",
  },
  {
    id: 4,
    title: "🔥 BOOKING TANPA DP!",
    subtitle: "Khusus mahasiswa baru, langsung masuk tanpa deposit",
    cta: "Daftar Gratis",
    gradient: "from-blue-600 via-blue-700 to-cyan-700",
    textColor: "text-white",
    icon: Sparkles,
    badge: "NO DP",
    pattern: "opacity-10",
  },
]

export default function PromoBanners() {
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % promoBanners.length)
    }, 5000) // Change banner every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (!isVisible) return null

  const banner = promoBanners[currentBanner]
  const IconComponent = banner.icon

  return (
    <section className="relative overflow-hidden">
      <div className={`relative bg-gradient-to-r ${banner.gradient} py-4 transition-all duration-1000 ease-in-out`}>
        {/* Background Pattern */}
        <div
          className={`absolute inset-0 ${banner.pattern}`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-white/10 rounded-full animate-pulse" />
          <div className="absolute top-8 right-8 w-16 h-16 bg-white/5 rounded-full animate-bounce" />
          <div className="absolute bottom-4 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              {/* Icon */}
              <div className="hidden sm:flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full">
                <IconComponent className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <h3 className={`text-lg sm:text-xl font-bold ${banner.textColor} drop-shadow-lg`}>{banner.title}</h3>
                  <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs font-bold px-2 py-1 animate-pulse">
                    {banner.badge}
                  </Badge>
                </div>
                <p className={`text-sm sm:text-base ${banner.textColor} opacity-90 drop-shadow-md`}>
                  {banner.subtitle}
                </p>
              </div>
            </div>

            {/* CTA and Close */}
            <div className="flex items-center space-x-3">
              <Button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 font-semibold px-4 py-2 text-sm transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                {banner.cta}
              </Button>

              <button
                onClick={() => setIsVisible(false)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all duration-200 backdrop-blur-sm"
                aria-label="Tutup banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-white/60 transition-all duration-5000 ease-linear"
            style={{
              width: `${((currentBanner + 1) / promoBanners.length) * 100}%`,
              animation: "progress 5s linear infinite",
            }}
          />
        </div>
      </div>

      {/* Banner Navigation Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {promoBanners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentBanner ? "bg-white shadow-lg" : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Banner ${index + 1}`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </section>
  )
}
