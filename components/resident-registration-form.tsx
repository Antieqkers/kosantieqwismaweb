"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Users, Home, FileText, CheckCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { createResidentRegistration } from "@/lib/actions"

const steps = [
  { id: 1, title: "Data Pribadi", icon: User },
  { id: 2, title: "Kontak Darurat", icon: Users },
  { id: 3, title: "Info Kamar", icon: Home },
  { id: 4, title: "Dokumen", icon: FileText },
  { id: 5, title: "Review", icon: CheckCircle },
]

export default function ResidentRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    idNumber: "",
    birthDate: "",
    gender: "",
    occupation: "",
    address: "",
    // Emergency Contact
    emergencyContactName: "",
    emergencyContactPhone: "",
    emergencyContactRelation: "",
    // Room Information
    roomType: "",
    moveInDate: "",
    contractDuration: "",
    monthlyRent: "",
    depositAmount: "",
    // Documents
    idCardUrl: "",
    photoUrl: "",
    // Additional
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.fullName &&
          formData.email &&
          formData.phone &&
          formData.idNumber &&
          formData.birthDate &&
          formData.gender &&
          formData.address
        )
      case 2:
        return formData.emergencyContactName && formData.emergencyContactPhone && formData.emergencyContactRelation
      case 3:
        return true // Optional fields
      case 4:
        return true // Optional fields
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5))
    } else {
      setMessage({ type: "error", text: "Mohon lengkapi semua field yang wajib diisi" })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setMessage(null)

    try {
      const formDataToSubmit = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSubmit.append(key, value)
      })

      const result = await createResidentRegistration(formDataToSubmit)

      if (result.success) {
        setMessage({ type: "success", text: result.message })
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          idNumber: "",
          birthDate: "",
          gender: "",
          occupation: "",
          address: "",
          emergencyContactName: "",
          emergencyContactPhone: "",
          emergencyContactRelation: "",
          roomType: "",
          moveInDate: "",
          contractDuration: "",
          monthlyRent: "",
          depositAmount: "",
          idCardUrl: "",
          photoUrl: "",
          notes: "",
        })
        setCurrentStep(1)
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan. Silakan coba lagi." })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="fullName">
                  Nama Lengkap <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="contoh@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="phone">
                  Nomor Telepon <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>
              <div>
                <Label htmlFor="idNumber">
                  Nomor KTP <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="idNumber"
                  value={formData.idNumber}
                  onChange={(e) => handleInputChange("idNumber", e.target.value)}
                  placeholder="16 digit nomor KTP"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="birthDate">
                  Tanggal Lahir <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange("birthDate", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Pilih jenis kelamin</option>
                  <option value="male">Laki-laki</option>
                  <option value="female">Perempuan</option>
                </select>
              </div>
              <div>
                <Label htmlFor="occupation">Pekerjaan</Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => handleInputChange("occupation", e.target.value)}
                  placeholder="Mahasiswa, Karyawan, dll"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="address">
                Alamat Lengkap <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Alamat lengkap sesuai KTP"
                rows={3}
                required
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="emergencyContactName">
                  Nama Kontak Darurat <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                  placeholder="Nama lengkap kontak darurat"
                  required
                />
              </div>
              <div>
                <Label htmlFor="emergencyContactPhone">
                  Nomor Telepon Kontak Darurat <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="emergencyContactRelation">
                Hubungan dengan Kontak Darurat <span className="text-red-500">*</span>
              </Label>
              <select
                id="emergencyContactRelation"
                value={formData.emergencyContactRelation}
                onChange={(e) => handleInputChange("emergencyContactRelation", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Pilih hubungan</option>
                <option value="Orang Tua">Orang Tua</option>
                <option value="Saudara">Saudara</option>
                <option value="Kerabat">Kerabat</option>
                <option value="Teman">Teman</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="roomType">Tipe Kamar yang Diinginkan</Label>
                <select
                  id="roomType"
                  value={formData.roomType}
                  onChange={(e) => handleInputChange("roomType", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Pilih tipe kamar</option>
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="VIP">VIP</option>
                </select>
              </div>
              <div>
                <Label htmlFor="moveInDate">Tanggal Masuk yang Diinginkan</Label>
                <Input
                  id="moveInDate"
                  type="date"
                  value={formData.moveInDate}
                  onChange={(e) => handleInputChange("moveInDate", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="contractDuration">Durasi Kontrak (bulan)</Label>
                <Input
                  id="contractDuration"
                  type="number"
                  value={formData.contractDuration}
                  onChange={(e) => handleInputChange("contractDuration", e.target.value)}
                  placeholder="6, 12, 24"
                />
              </div>
              <div>
                <Label htmlFor="monthlyRent">Budget Sewa Bulanan</Label>
                <Input
                  id="monthlyRent"
                  type="number"
                  value={formData.monthlyRent}
                  onChange={(e) => handleInputChange("monthlyRent", e.target.value)}
                  placeholder="1000000"
                />
              </div>
              <div>
                <Label htmlFor="depositAmount">Budget Deposit</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  value={formData.depositAmount}
                  onChange={(e) => handleInputChange("depositAmount", e.target.value)}
                  placeholder="2000000"
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="idCardUrl">URL Foto KTP</Label>
                <Input
                  id="idCardUrl"
                  value={formData.idCardUrl}
                  onChange={(e) => handleInputChange("idCardUrl", e.target.value)}
                  placeholder="https://example.com/ktp.jpg"
                />
                <p className="text-sm text-gray-600 mt-1">Upload foto KTP ke cloud storage dan masukkan URL-nya</p>
              </div>
              <div>
                <Label htmlFor="photoUrl">URL Foto Diri</Label>
                <Input
                  id="photoUrl"
                  value={formData.photoUrl}
                  onChange={(e) => handleInputChange("photoUrl", e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                />
                <p className="text-sm text-gray-600 mt-1">Upload foto diri dan masukkan URL-nya</p>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Catatan Tambahan</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Catatan atau permintaan khusus..."
                rows={4}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Review Data Pendaftaran</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Data Pribadi</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Nama:</strong> {formData.fullName}
                    </p>
                    <p>
                      <strong>Email:</strong> {formData.email}
                    </p>
                    <p>
                      <strong>Telepon:</strong> {formData.phone}
                    </p>
                    <p>
                      <strong>KTP:</strong> {formData.idNumber}
                    </p>
                    <p>
                      <strong>Tanggal Lahir:</strong> {formData.birthDate}
                    </p>
                    <p>
                      <strong>Jenis Kelamin:</strong> {formData.gender === "male" ? "Laki-laki" : "Perempuan"}
                    </p>
                    <p>
                      <strong>Pekerjaan:</strong> {formData.occupation || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Kontak Darurat</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Nama:</strong> {formData.emergencyContactName}
                    </p>
                    <p>
                      <strong>Telepon:</strong> {formData.emergencyContactPhone}
                    </p>
                    <p>
                      <strong>Hubungan:</strong> {formData.emergencyContactRelation}
                    </p>
                  </div>

                  <h4 className="font-medium mb-2 mt-4">Info Kamar</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Tipe Kamar:</strong> {formData.roomType || "N/A"}
                    </p>
                    <p>
                      <strong>Tanggal Masuk:</strong> {formData.moveInDate || "N/A"}
                    </p>
                    <p>
                      <strong>Durasi:</strong>{" "}
                      {formData.contractDuration ? `${formData.contractDuration} bulan` : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Catatan:</strong> Setelah submit, data Anda akan diverifikasi oleh admin dalam 1x24 jam. Anda
                akan dihubungi melalui email atau telepon untuk konfirmasi lebih lanjut.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">Pendaftaran Penghuni Baru</CardTitle>
            <p className="text-gray-600">ANTIEQ WISMA KOST</p>
          </CardHeader>

          <CardContent>
            {message && (
              <Alert
                className={`mb-6 ${message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}`}
              >
                <AlertDescription className={message.type === "error" ? "text-red-700" : "text-green-700"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id

                  return (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white"
                            : isActive
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "bg-gray-100 border-gray-300 text-gray-400"
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                      </div>
                      <div className="ml-3 hidden md:block">
                        <p
                          className={`text-sm font-medium ${
                            isActive ? "text-blue-600" : isCompleted ? "text-green-600" : "text-gray-400"
                          }`}
                        >
                          {step.title}
                        </p>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`hidden md:block w-16 h-0.5 ml-4 ${isCompleted ? "bg-green-500" : "bg-gray-300"}`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Step Content */}
            <div className="mb-8">{renderStepContent()}</div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                Sebelumnya
              </Button>

              {currentStep < 5 ? (
                <Button onClick={nextStep} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  Selanjutnya
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Submit Pendaftaran
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
