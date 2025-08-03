import {
  getRooms,
  getFacilities,
  getTestimonials,
  getContactInfo,
  getWebsiteSettings,
  getHeroContent,
  getAboutSection,
  getGallery,
  getLocationInfo,
} from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Phone,
  Mail,
  Wifi,
  Car,
  Shield,
  Zap,
  Droplets,
  Wind,
  Utensils,
  Star,
  PhoneIcon as WhatsApp,
  Instagram,
  Facebook,
  Clock,
  Users,
  Home,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import ContactForm from "@/components/contact-form"
import Navigation from "@/components/navigation"
import FloatingWhatsApp from "@/components/floating-whatsapp"
import PromoBanners from "@/components/promo-banners"

const iconMap: { [key: string]: any } = {
  Wifi,
  Car,
  Shield,
  Zap,
  Droplets,
  Wind,
  Utensils,
  Users,
}

export default async function HomePage() {
  const [rooms, facilities, testimonials, contactInfo, settings, heroContent, aboutSection, gallery, locationInfo] =
    await Promise.all([
      getRooms(),
      getFacilities(),
      getTestimonials(),
      getContactInfo(),
      getWebsiteSettings(),
      getHeroContent(),
      getAboutSection(),
      getGallery(),
      getLocationInfo(),
    ])

  const siteName = settings?.site_name || heroContent?.title || "ANTIEQ WISMA KOST"
  const tagline = settings?.tagline || "Kos Nyaman & Terjangkau"
  const description =
    settings?.description ||
    heroContent?.subtitle ||
    "Hunian nyaman dengan fasilitas lengkap di lokasi strategis Jakarta. Cocok untuk mahasiswa dan pekerja muda."

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation siteName={siteName} tagline={tagline} contactInfo={contactInfo} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-500/20 text-blue-100 border-blue-400">
                {heroContent?.badge_text || "⭐ Kos Terpercaya di Jakarta"}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">{heroContent?.title || siteName}</h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                {heroContent?.subtitle || description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4">
                  {heroContent?.cta_primary || "Lihat Kamar Tersedia"}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
                >
                  {heroContent?.cta_secondary || "Hubungi Kami"}
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={heroContent?.hero_image_url || "/placeholder.svg?height=500&width=600"}
                alt={siteName}
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold">{heroContent?.rating || 4.9}/5</span>
                  <span className="text-gray-600">({heroContent?.total_reviews || 127} ulasan)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {aboutSection?.total_rooms || rooms.reduce((sum: number, room: any) => sum + room.available, 0)}+
              </div>
              <div className="text-gray-600">Kamar Tersedia</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{aboutSection?.happy_residents || 200}+</div>
              <div className="text-gray-600">Penghuni Puas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{aboutSection?.years_experience || 5}</div>
              <div className="text-gray-600">Tahun Berpengalaman</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Layanan Keamanan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banners - New Section */}
      <PromoBanners />

      {/* About Section */}
      {aboutSection && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">{aboutSection.title}</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">{aboutSection.description}</p>
            </div>

            {(aboutSection.vision || aboutSection.mission) && (
              <div className="grid md:grid-cols-2 gap-12 mb-16">
                {aboutSection.vision && (
                  <Card className="p-8">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl text-blue-600">Visi Kami</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-center">{aboutSection.vision}</p>
                    </CardContent>
                  </Card>
                )}
                {aboutSection.mission && (
                  <Card className="p-8">
                    <CardHeader className="text-center">
                      <CardTitle className="text-2xl text-blue-600">Misi Kami</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-center">{aboutSection.mission}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Room Types */}
      <section id="rooms" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Pilihan Kamar</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Berbagai tipe kamar dengan fasilitas lengkap sesuai kebutuhan dan budget Anda
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room: any) => (
              <Card key={room.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="relative">
                  <img
                    src={room.image_url || "/placeholder.svg?height=300&width=400"}
                    alt={room.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                    {room.available} kamar tersisa
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-gray-900">{room.name}</CardTitle>
                      <p className="text-gray-600 mt-1">{room.size}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{room.price}</div>
                      <div className="text-gray-600">{room.period}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {room.features.map((feature: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700">Pesan Sekarang</Button>
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Lihat Detail
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section id="facilities" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Fasilitas Lengkap</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Nikmati berbagai fasilitas modern yang mendukung kenyamanan hidup Anda
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {facilities.map((facility: any) => {
              const IconComponent = iconMap[facility.icon] || Users
              return (
                <Card key={facility.id} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{facility.name}</h3>
                  <p className="text-gray-600 text-sm">{facility.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section id="gallery" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Gallery</h2>
              <p className="text-xl text-gray-600">Lihat suasana dan fasilitas ANTIEQ WISMA KOST</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gallery
                .filter((item: any) => item.is_featured)
                .slice(0, 6)
                .map((item: any) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4 bg-black/70 text-white">{item.category}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      {item.description && <p className="text-gray-600 text-sm">{item.description}</p>}
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </section>
      )}

      {/* Location */}
      <section id="location" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {locationInfo?.title || "Lokasi Strategis"}
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                {locationInfo?.description ||
                  "Terletak di jantung Jakarta dengan akses mudah ke berbagai tempat penting seperti kampus, pusat bisnis, dan fasilitas umum."}
              </p>
              <div className="space-y-4">
                {(
                  locationInfo?.nearby_places || [
                    "5 menit ke Stasiun KRL",
                    "10 menit ke Mall Central Park",
                    "15 menit ke Universitas Trisakti",
                    "20 menit ke Bundaran HI",
                  ]
                ).map((place: string, index: number) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>{place}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <MapPin className="w-4 h-4 mr-2" />
                  Lihat di Google Maps
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src={locationInfo?.image_url || "/placeholder.svg?height=400&width=600"}
                alt={`Lokasi ${siteName}`}
                className="rounded-lg shadow-lg"
              />
              <div className="absolute top-4 right-4 bg-white p-3 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-red-500" />
                  <span className="font-semibold">ANTIEQ WISMA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Kata Penghuni</h2>
            <p className="text-xl text-gray-600">Dengarkan pengalaman mereka yang sudah merasakan kenyamanan di sini</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial: any) => (
              <Card key={testimonial.id} className="p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image_url || "/placeholder.svg?height=60&width=60"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Hubungi Kami</h2>
              <p className="text-lg text-gray-600 mb-8">
                Ada pertanyaan atau ingin survey langsung? Jangan ragu untuk menghubungi kami. Tim kami siap membantu
                Anda 24/7.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Telepon</div>
                    <div className="text-gray-600">{contactInfo?.phone || "+62 812-3456-7890"}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <WhatsApp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">WhatsApp</div>
                    <div className="text-gray-600">{contactInfo?.whatsapp || "+62 812-3456-7890"}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Email</div>
                    <div className="text-gray-600">{contactInfo?.email || "info@antieqwisma.com"}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Alamat</div>
                    <div className="text-gray-600">
                      {contactInfo?.address || locationInfo?.address || "Jl. Kebon Jeruk Raya No. 123, Jakarta Barat"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ContactForm rooms={rooms} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Siap Pindah ke {siteName}?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Jangan sampai kehabisan! Kamar terbatas dan banyak yang sudah booking. Hubungi kami sekarang untuk survey
            dan booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
              <WhatsApp className="w-5 h-5 mr-2" />
              Chat WhatsApp
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 text-lg px-8 py-4 bg-transparent"
            >
              <Phone className="w-5 h-5 mr-2" />
              Telepon Sekarang
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{siteName}</h3>
                  <p className="text-sm text-gray-400">{tagline}</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">{description}</p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <Facebook className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors cursor-pointer">
                  <Instagram className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors cursor-pointer">
                  <WhatsApp className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kamar</h4>
              <ul className="space-y-2 text-gray-400">
                {rooms.slice(0, 4).map((room: any) => (
                  <li key={room.id}>
                    <Link href="#" className="hover:text-white transition-colors">
                      {room.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Informasi</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Fasilitas
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Lokasi
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Syarat & Ketentuan
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontak</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{contactInfo?.phone || "+62 812-3456-7890"}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{contactInfo?.email || "info@antieqwisma.com"}</span>
                </li>
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-1" />
                  <span>
                    {contactInfo?.address || locationInfo?.address || "Jl. Kebon Jeruk Raya No. 123, Jakarta Barat"}
                  </span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Buka 24 Jam</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 {siteName}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <FloatingWhatsApp contactInfo={contactInfo} />
    </div>
  )
}
