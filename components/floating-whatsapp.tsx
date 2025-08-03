"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PhoneIcon as WhatsApp } from "lucide-react"

interface FloatingWhatsAppProps {
  contactInfo?: any
}

export default function FloatingWhatsApp({ contactInfo }: FloatingWhatsAppProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Hide button when scrolling near footer
      const scrollPosition = window.scrollY + window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const threshold = documentHeight - 200 // Hide 200px before footer

      setIsVisible(scrollPosition < threshold)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleWhatsAppClick = () => {
    const whatsappNumber = contactInfo?.whatsapp || "+62 812-3456-7890"
    const message = encodeURIComponent(
      "Halo, saya tertarik dengan ANTIEQ WISMA KOST. Bisa minta informasi lebih lanjut?",
    )
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${message}`, "_blank")
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-30 md:block hidden">
      <div className="relative">
        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute bottom-16 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
            Chat dengan kami!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}

        {/* WhatsApp Button */}
        <Button
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          aria-label="Chat WhatsApp"
        >
          <WhatsApp className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
