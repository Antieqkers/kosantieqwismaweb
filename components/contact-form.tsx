"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createBooking } from "@/lib/actions"

interface ContactFormProps {
  rooms: any[]
}

export default function ContactForm({ rooms }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setMessage(null)

    try {
      const result = await createBooking(formData)
      setMessage({
        type: result.success ? "success" : "error",
        text: result.message,
      })

      if (result.success) {
        // Reset form
        const form = document.getElementById("contact-form") as HTMLFormElement
        form?.reset()
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Terjadi kesalahan. Silakan coba lagi.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle>Kirim Pesan</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <form id="contact-form" action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
              <Input name="name" placeholder="Masukkan nama Anda" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">No. WhatsApp</label>
              <Input name="phone" placeholder="08123456789" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <Input name="email" type="email" placeholder="email@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe Kamar</label>
            <select
              name="roomType"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Pilih tipe kamar</option>
              {rooms.map((room: any) => (
                <option key={room.id} value={room.name}>
                  {room.name} - {room.price}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pesan</label>
            <Textarea
              name="message"
              placeholder="Ceritakan kebutuhan Anda atau ajukan pertanyaan..."
              rows={4}
              required
            />
          </div>

          {message && (
            <div
              className={`p-4 rounded-md ${
                message.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </div>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">
            {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
